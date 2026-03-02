import { SearchIcon } from 'lucide-react'
import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { paymentMethodOptions } from '@/lib/constants/payment.constants'
import { formatPrice } from '@/lib/utils'
import { getOrderByCode, type TrackedOrder } from '@/services/orders.service'

function getPaymentMethodLabel(method: TrackedOrder['method']): string {
  return paymentMethodOptions.find((item) => item.value === method)?.label ?? method
}

function getOrderStatusLabel(status: TrackedOrder['status']): string {
  const labels: Record<TrackedOrder['status'], string> = {
    PENDING_PAID: 'Pending payment confirmation',
    PAID: 'Paid',
    DELIVERED: 'Delivered',
    CANCEL: 'Cancelled',
  }

  return labels[status] ?? status
}

function getPaymentStatusLabel(status: TrackedOrder['payments'][number]['status']): string {
  const labels: Record<TrackedOrder['payments'][number]['status'], string> = {
    PENDING: 'Pending',
    COMPLETED: 'Approved',
    CANCEL: 'Rejected or cancelled',
  }

  return labels[status] ?? status
}

function getFriendlyTrackingError(error: unknown): string {
  if (!(error instanceof Error)) {
    return 'We could not check your order right now. Please try again.'
  }

  const message = error.message.toLowerCase()
  const isNotFoundError =
    message.includes('(404)') || message.includes('not found') || message.includes('order with code')

  if (isNotFoundError) {
    return 'We could not find an order with that code. Please check it and try again.'
  }

  return 'We could not check your order right now. Please try again.'
}

export function TrackingPage() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [order, setOrder] = useState<TrackedOrder | null>(null)

  const handleSearchOrder = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const normalizedCode = code.trim()
    if (!normalizedCode) {
      setError('Please enter an order code.')
      setOrder(null)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await getOrderByCode(normalizedCode)
      setOrder(response)
    } catch (requestError) {
      setOrder(null)
      setError(getFriendlyTrackingError(requestError))
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewSearch = () => {
    setCode('')
    setError(null)
    setOrder(null)
  }

  const mainAddress = order?.customer.addresses[0]

  return (
    <section className="rounded-xl border bg-card p-4 md:p-6">
      <header>
        <h1 className="text-xl font-semibold">Order tracking</h1>
        <p className="text-sm text-muted-foreground">
          Enter your order code to check status and details.
        </p>
      </header>

      <form onSubmit={handleSearchOrder} className="mt-4 flex flex-col gap-3 sm:flex-row">
        <Input
          value={code}
          onChange={(event) => setCode(event.target.value)}
          placeholder="Example: 123456"
          aria-label="Order code"
          disabled={isLoading || !!order}
        />
        <Button type="submit" disabled={isLoading || !!order}>
          <SearchIcon />
          {isLoading ? 'Searching...' : 'Search order'}
        </Button>
        {order ? (
          <Button type="button" variant="outline" onClick={handleNewSearch}>
            New search
          </Button>
        ) : null}
      </form>

      {error ? (
        <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      ) : null}

      {order ? (
        <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
          <div className="space-y-4">
            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Order</p>
              <p className="mt-2 text-sm font-medium">Code: {order.code}</p>
              <p className="text-sm text-muted-foreground">Status: {getOrderStatusLabel(order.status)}</p>
              <p className="text-sm text-muted-foreground">
                Date: {new Date(order.date).toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">
                Method: {getPaymentMethodLabel(order.method)}
              </p>
              {order.method === 'WOMPI' && order.status === 'PENDING_PAID' ? (
                <p className="mt-2 text-xs text-muted-foreground">
                  Payment is pending. If your widget flow was interrupted, you can request a new attempt from checkout.
                </p>
              ) : null}
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p>
              <p className="mt-2 text-sm font-medium">{order.customer.fullname}</p>
              <p className="text-sm text-muted-foreground">{order.customer.email}</p>
              {mainAddress ? (
                <p className="mt-2 text-sm text-muted-foreground">
                  {mainAddress.address}, {mainAddress.city}, {mainAddress.state},{' '}
                  {mainAddress.country}
                </p>
              ) : null}
            </div>

            <div className="rounded-lg border p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Products</p>
              <div className="mt-3 space-y-3">
                {order.details.map((detail) => (
                  <div key={detail.id} className="flex gap-3 rounded-md border p-3">
                    <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-black/5 p-1">
                      {detail.product.image ? (
                        <img
                          src={detail.product.image}
                          alt={detail.product.name}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[10px] text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-2 text-sm font-medium">{detail.product.name}</p>
                      <Link
                        to={`/product/${detail.product.slug}`}
                        className="mt-1 inline-block text-xs text-primary hover:underline"
                      >
                        View product detail
                      </Link>
                      <p className="mt-2 text-xs text-muted-foreground">
                        Net: {formatPrice(detail.price)} | Fees: {formatPrice(detail.fee)} |
                        Shipping: {formatPrice(detail.deliveryFee)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-lg border p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Totals</p>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(order.net)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Taxes</span>
                <span>{formatPrice(order.fees)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Shipping cost</span>
                <span>{formatPrice(order.deliveryCost)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2 text-base font-semibold">
                <span>Total</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-md border p-3">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Payments</p>
              {order.payments.length === 0 ? (
                <p className="mt-2 text-sm text-muted-foreground">No payments registered yet.</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {order.payments.map((payment) => (
                    <li key={payment.id} className="text-sm">
                      <span className="font-medium">{payment.paymentRefCode}</span>{' '}
                      <span className="text-muted-foreground">
                        ({payment.provider} - {getPaymentStatusLabel(payment.status)})
                      </span>
                      {payment.transactionId ? (
                        <p className="text-xs text-muted-foreground">Transaction: {payment.transactionId}</p>
                      ) : null}
                      {payment.amountInCents !== null && payment.currency ? (
                        <p className="text-xs text-muted-foreground">
                          Amount: {payment.amountInCents / 100} {payment.currency}
                        </p>
                      ) : null}
                      {payment.statusReason ? (
                        <p className="text-xs text-muted-foreground">Reason: {payment.statusReason}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      ) : null}
    </section>
  )
}
