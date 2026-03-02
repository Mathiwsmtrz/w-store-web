import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, ArrowRight, CheckCircle2, ClipboardList, CreditCard, UserRound } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  COUNTRY_OPTIONS,
  getCitiesByCountryAndState,
  getStatesByCountry,
  type SupportedCountry,
} from '@/lib/constants/location.constants'
import { paymentMethodOptions } from '@/lib/constants/payment.constants'
import { formatPrice } from '@/lib/utils'
import { WOMPI_PUBLIC_KEY, WOMPI_WIDGET_URL } from '@/config/env'
import { createOrder, createWompiTransaction } from '@/services/orders.service'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import {
  clearWompiCheckoutState,
  markOrderCompleted,
  resetCheckout,
  selectCheckoutState,
  setCurrentStep,
  setCustomerInfo,
  setPaymentInfo,
  setWompiCheckoutError,
  setWompiCheckoutSession,
  setWompiCheckoutStatus,
} from '@/store/slices/checkout.slice'
import {
  clearCart,
  selectCartGrandTotal,
  selectCartItems,
  selectCartShippingTotal,
  selectCartSubtotal,
  selectCartTaxesTotal,
  selectCartTotalItems,
} from '@/store/slices/cart.slice'

const customerInfoSchema = z.object({
  fullname: z
    .string()
    .trim()
    .min(3, 'Full name must have at least 3 characters.'),
  email: z.email('Please enter a valid email address.'),
  address: z
    .string()
    .trim()
    .min(5, 'Address must have at least 5 characters.'),
  country: z
    .string()
    .trim()
    .min(2, 'Country must have at least 2 characters.')
    .refine(
      (value) => COUNTRY_OPTIONS.includes(value as SupportedCountry),
      'Please select a valid country.',
    ),
  state: z
    .string()
    .trim()
    .min(2, 'State must have at least 2 characters.'),
  city: z
    .string()
    .trim()
    .min(2, 'City must have at least 2 characters.'),
}).superRefine((values, ctx) => {
  const availableStates = getStatesByCountry(values.country)
  if (!availableStates.includes(values.state)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['state'],
      message: 'Please select a valid state for the selected country.',
    })
  }

  const availableCities = getCitiesByCountryAndState(values.country, values.state)
  if (!availableCities.includes(values.city)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['city'],
      message: 'Please select a valid city for the selected state.',
    })
  }
})

const paymentInfoSchema = z.object({
  method: z.enum(['WOMPI', 'COD']),
})

type CustomerInfoFormValues = z.infer<typeof customerInfoSchema>
type PaymentInfoFormValues = z.infer<typeof paymentInfoSchema>

function loadWompiWidgetScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.WidgetCheckout) {
      resolve()
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>('script[data-wompi-widget="true"]')
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(), { once: true })
      existingScript.addEventListener('error', () => reject(new Error('Could not load Wompi widget script.')), {
        once: true,
      })
      return
    }

    const script = document.createElement('script')
    script.src = WOMPI_WIDGET_URL
    script.async = true
    script.defer = true
    script.dataset.wompiWidget = 'true'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Could not load Wompi widget script.'))
    document.body.appendChild(script)
  })
}

async function openWompiWidget(config: {
  amountInCents: number
  currency: string
  reference: string
  acceptanceToken: string | null
  integritySignature: string | null
  customerEmail: string
  publicKey: string
}): Promise<WompiWidgetResult> {
  await loadWompiWidgetScript()

  if (!window.WidgetCheckout) {
    throw new Error('Wompi widget is not available in this browser.')
  }

  const widget = new window.WidgetCheckout({
    currency: config.currency,
    amountInCents: config.amountInCents,
    reference: config.reference,
    publicKey: config.publicKey,
    ...(config.acceptanceToken ? { acceptanceToken: config.acceptanceToken } : {}),
    ...(config.integritySignature
      ? {
          signature: {
            integrity: config.integritySignature,
          },
        }
      : {}),
    customerData: {
      email: config.customerEmail,
    },
  })

  return new Promise((resolve) => {
    widget.open((result) => resolve(result))
  })
}

export function CheckoutPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false)

  const { currentStep, customerInfo, paymentInfo, wompi, isOrderCompleted, orderCode } =
    useAppSelector(selectCheckoutState)
  const cartItems = useAppSelector(selectCartItems)
  const totalItems = useAppSelector(selectCartTotalItems)
  const subtotal = useAppSelector(selectCartSubtotal)
  const taxesTotal = useAppSelector(selectCartTaxesTotal)
  const shippingTotal = useAppSelector(selectCartShippingTotal)
  const grandTotal = useAppSelector(selectCartGrandTotal)

  const customerForm = useForm<CustomerInfoFormValues>({
    resolver: zodResolver(customerInfoSchema),
    mode: 'onBlur',
    defaultValues: customerInfo,
  })

  const paymentForm = useForm<PaymentInfoFormValues>({
    resolver: zodResolver(paymentInfoSchema),
    mode: 'onBlur',
    defaultValues: paymentInfo,
  })

  const selectedCountry = useWatch({
    control: customerForm.control,
    name: 'country',
  })

  const selectedState = useWatch({
    control: customerForm.control,
    name: 'state',
  })

  const availableStates = useMemo(() => {
    if (!selectedCountry) {
      return []
    }

    return getStatesByCountry(selectedCountry)
  }, [selectedCountry])

  const availableCities = useMemo(() => {
    if (!selectedCountry || !selectedState) {
      return []
    }

    return getCitiesByCountryAndState(selectedCountry, selectedState)
  }, [selectedCountry, selectedState])

  const selectedPaymentMethodLabel = useMemo(() => {
    return (
      paymentMethodOptions.find((option) => option.value === paymentInfo.method)?.label ??
      paymentInfo.method
    )
  }, [paymentInfo.method])

  const isCartEmpty = cartItems.length === 0

  const stepIndex = useMemo(() => {
    const steps = ['customer', 'payment', 'summary']
    return steps.indexOf(currentStep)
  }, [currentStep])

  const goBackStep = () => {
    if (stepIndex <= 0) {
      return
    }

    const previousStep = ['customer', 'payment', 'summary'][stepIndex - 1] as 'customer' | 'payment' | 'summary'
    dispatch(setCurrentStep(previousStep))
  }

  const handleCustomerContinue = customerForm.handleSubmit((values) => {
    dispatch(setCustomerInfo(values))
    dispatch(setCurrentStep('payment'))
  })

  const handlePaymentContinue = paymentForm.handleSubmit((values) => {
    dispatch(
      setPaymentInfo({
        method: values.method,
      }),
    )
    dispatch(setCurrentStep('summary'))
  })

  const handlePlaceOrder = async () => {
    setSubmitError(null)

    if (isCartEmpty) {
      setSubmitError('Your cart is empty. Add products before checkout.')
      return
    }

    setIsSubmittingOrder(true)
    try {
      const response = await createOrder({
        customer: {
          fullname: customerInfo.fullname,
          email: customerInfo.email,
          address: {
            address: customerInfo.address,
            city: customerInfo.city,
            state: customerInfo.state,
            country: customerInfo.country,
          },
        },
        method: paymentInfo.method,
        items: cartItems.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      })

      if (paymentInfo.method === 'WOMPI') {
        dispatch(markOrderCompleted({ orderCode: response.code }))
        dispatch(clearCart())
        dispatch(setWompiCheckoutStatus('PROCESSING'))

        try {
          const transaction = await createWompiTransaction({
            orderCode: response.code,
          })

          const publicKey = WOMPI_PUBLIC_KEY || transaction.publicKey
          if (!publicKey) {
            throw new Error('Missing Wompi public key. Define VITE_WOMPI_PUBLIC_KEY in .env.')
          }

          const widgetResult = await openWompiWidget({
            amountInCents: transaction.amountInCents,
            currency: transaction.currency,
            reference: transaction.reference,
            acceptanceToken: transaction.acceptanceToken,
            integritySignature: transaction.integritySignature,
            customerEmail: transaction.customerEmail,
            publicKey,
          })

          dispatch(
            setWompiCheckoutSession({
              reference: transaction.reference,
              transactionId: widgetResult.transaction?.id ?? null,
            }),
          )

          if (widgetResult.error?.message) {
            dispatch(setWompiCheckoutError(widgetResult.error.message))
          } else {
            dispatch(setWompiCheckoutError(null))
          }
        } catch (wompiError) {
          dispatch(
            setWompiCheckoutError(
              wompiError instanceof Error
                ? wompiError.message
                : 'Could not open Wompi checkout. Please use order tracking to retry payment.',
            ),
          )
        }

        return
      }

      dispatch(markOrderCompleted({ orderCode: response.code }))
      dispatch(clearCart())
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not place the order. Please try again.')
    } finally {
      setIsSubmittingOrder(false)
    }
  }

  const handleContinueShopping = () => {
    dispatch(clearWompiCheckoutState())
    dispatch(resetCheckout())
    navigate('/')
  }

  if (isOrderCompleted) {
    return (
      <section className="rounded-xl border bg-card p-6 md:p-10">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <CheckCircle2 className="size-16 text-green-600" />
          <h1 className="mt-4 text-2xl font-semibold">
            {paymentInfo.method === 'WOMPI' ? 'Order created successfully' : 'Purchase completed successfully'}
          </h1>
          {paymentInfo.method === 'WOMPI' ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Your order was created. Complete payment with Wompi and wait for webhook confirmation.
            </p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">
              Your order has been created and it is now pending payment confirmation.
            </p>
          )}
          {orderCode ? (
            <p className="mt-4 text-sm">
              Order code: <span className="font-semibold">{orderCode}</span>
            </p>
          ) : null}
          {paymentInfo.method === 'WOMPI' ? (
            <p className="mt-2 text-xs text-muted-foreground">Wompi status: {wompi?.status}</p>
          ) : null}
          {paymentInfo.method === 'WOMPI' && wompi?.error ? (
            <p className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              {wompi.error}
            </p>
          ) : null}
          <Button className="mt-3" variant="outline" asChild>
            <Link to="/tracking">Track order</Link>
          </Button>
          <Button className="mt-6" onClick={handleContinueShopping}>
            Continue shopping
          </Button>
        </div>
      </section>
    )
  }

  if (isCartEmpty) {
    return (
      <section className="rounded-xl border bg-card p-6 md:p-10">
        <div className="mx-auto flex max-w-xl flex-col items-center text-center">
          <h1 className="text-2xl font-semibold">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add at least one product to your cart before continuing with checkout.
          </p>
          <Button className="mt-6" asChild>
            <Link to="/">Go to products</Link>
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
      <div className="rounded-xl border bg-card p-4 md:p-6">
        <Tabs value={currentStep}>
          <TabsList className="pointer-events-none grid h-auto grid-cols-3 gap-1 p-1">
            <TabsTrigger value="customer" className="h-11">
              <UserRound />
              Customer info
            </TabsTrigger>
            <TabsTrigger value="payment" className="h-11">
              <CreditCard />
              Payment info
            </TabsTrigger>
            <TabsTrigger value="summary" className="h-11">
              <ClipboardList />
              Summary
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="mt-4">
            <form onSubmit={handleCustomerContinue} className="flex min-h-[430px] flex-col">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label htmlFor="customer-fullname" className="mb-1 block text-sm font-medium">
                    Full name
                  </label>
                  <Input
                    id="customer-fullname"
                    autoComplete="name"
                    placeholder="John Appleseed"
                    aria-invalid={!!customerForm.formState.errors.fullname}
                    {...customerForm.register('fullname')}
                  />
                  {customerForm.formState.errors.fullname ? (
                    <p className="mt-1 text-xs text-destructive">
                      {customerForm.formState.errors.fullname.message}
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="customer-email" className="mb-1 block text-sm font-medium">
                    Email
                  </label>
                  <Input
                    id="customer-email"
                    type="email"
                    autoComplete="email"
                    placeholder="john.appleseed@example.com"
                    aria-invalid={!!customerForm.formState.errors.email}
                    {...customerForm.register('email')}
                  />
                  {customerForm.formState.errors.email ? (
                    <p className="mt-1 text-xs text-destructive">
                      {customerForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="customer-address" className="mb-1 block text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="customer-address"
                    autoComplete="street-address"
                    placeholder="1 Apple Park Way"
                    aria-invalid={!!customerForm.formState.errors.address}
                    {...customerForm.register('address')}
                  />
                  {customerForm.formState.errors.address ? (
                    <p className="mt-1 text-xs text-destructive">
                      {customerForm.formState.errors.address.message}
                    </p>
                  ) : null}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="customer-country" className="mb-1 block text-sm font-medium">
                    Country
                  </label>
                  <Controller
                    name="country"
                    control={customerForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            customerForm.setValue('state', '', {
                              shouldValidate: false,
                              shouldDirty: true,
                            })
                            customerForm.setValue('city', '', {
                              shouldValidate: false,
                              shouldDirty: true,
                            })
                            customerForm.clearErrors(['state', 'city'])
                          }}
                        >
                          <SelectTrigger id="customer-country" aria-invalid={fieldState.invalid}>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                          <SelectContent>
                            {COUNTRY_OPTIONS.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error ? (
                          <p className="mt-1 text-xs text-destructive">{fieldState.error.message}</p>
                        ) : null}
                      </>
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="customer-state" className="mb-1 block text-sm font-medium">
                    State
                  </label>
                  <Controller
                    name="state"
                    control={customerForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value)
                            customerForm.setValue('city', '', {
                              shouldValidate: false,
                              shouldDirty: true,
                            })
                            customerForm.clearErrors('city')
                          }}
                          disabled={!selectedCountry}
                        >
                          <SelectTrigger id="customer-state" aria-invalid={fieldState.invalid}>
                            <SelectValue
                              placeholder={
                                selectedCountry ? 'Select state' : 'Select country first'
                              }
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableStates.map((state) => (
                              <SelectItem key={state} value={state}>
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error ? (
                          <p className="mt-1 text-xs text-destructive">{fieldState.error.message}</p>
                        ) : null}
                      </>
                    )}
                  />
                </div>

                <div>
                  <label htmlFor="customer-city" className="mb-1 block text-sm font-medium">
                    City
                  </label>
                  <Controller
                    name="city"
                    control={customerForm.control}
                    render={({ field, fieldState }) => (
                      <>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!selectedState}
                        >
                          <SelectTrigger id="customer-city" aria-invalid={fieldState.invalid}>
                            <SelectValue
                              placeholder={selectedState ? 'Select city' : 'Select state first'}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCities.map((city) => (
                              <SelectItem key={city} value={city}>
                                {city}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {fieldState.error ? (
                          <p className="mt-1 text-xs text-destructive">{fieldState.error.message}</p>
                        ) : null}
                      </>
                    )}
                  />
                </div>
              </div>

              <div className="mt-auto flex items-center justify-end pt-6">
                <Button type="submit">
                  Continue
                  <ArrowRight />
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="payment" className="mt-4">
            <form onSubmit={handlePaymentContinue} className="flex min-h-[430px] flex-col">
              <div className="grid gap-3">
                {paymentMethodOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border p-4"
                  >
                    <input
                      type="radio"
                      value={option.value}
                      className="mt-1"
                      {...paymentForm.register('method')}
                    />
                    <div>
                      <p className="text-sm font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-auto flex items-center justify-between pt-6">
                <Button type="button" variant="outline" onClick={goBackStep}>
                  <ArrowLeft />
                  Back
                </Button>
                <Button type="submit">
                  Continue
                  <ArrowRight />
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="summary" className="mt-4">
            <div className="flex min-h-[430px] flex-col">
              <div className="space-y-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Customer info
                  </p>
                  <p className="mt-2 text-sm font-medium">{customerInfo.fullname}</p>
                  <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {customerInfo.address}, {customerInfo.city}, {customerInfo.state},{' '}
                    {customerInfo.country}
                  </p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">
                    Payment method
                  </p>
                  <p className="mt-2 text-sm font-medium">{selectedPaymentMethodLabel}</p>
                </div>

                {submitError ? (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                    {submitError}
                  </p>
                ) : null}
              </div>

              <div className="mt-auto flex items-center justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBackStep}
                  disabled={isSubmittingOrder}
                >
                  <ArrowLeft />
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handlePlaceOrder}
                  disabled={isCartEmpty || isSubmittingOrder}
                >
                  {isSubmittingOrder ? 'Processing...' : 'Buy now'}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <aside className="rounded-xl border bg-card p-4 md:p-6">
        <h2 className="text-lg font-semibold">Cart</h2>
        <p className="text-sm text-muted-foreground">
          {totalItems} item{totalItems === 1 ? '' : 's'} in this order.
        </p>

        <div className="mt-4 space-y-3">
          {cartItems.length === 0 ? (
            <p className="text-sm text-muted-foreground">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.productId} className="rounded-lg border p-3">
                <div className="flex gap-3">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-black/5 p-1">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium">{item.title}</p>
                    <Link
                      to={`/product/${item.slug}`}
                      className="mt-1 inline-block text-xs text-primary hover:underline"
                    >
                      View product detail
                    </Link>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Qty {item.quantity} x {formatPrice(item.price)}
                    </p>
                    <p className="mt-2 text-sm font-semibold">
                      {formatPrice(String(Number(item.price) * item.quantity))}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 space-y-2 border-t pt-4 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatPrice(String(subtotal))}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Taxes</span>
            <span>{formatPrice(String(taxesTotal))}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Shipping cost</span>
            <span>{formatPrice(String(shippingTotal))}</span>
          </div>
          <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(String(grandTotal))}</span>
          </div>
        </div>
      </aside>
    </section>
  )
}
