interface WompiWidgetTransaction {
  id?: string
  status?: string
  status_message?: string
}

interface WompiWidgetResult {
  transaction?: WompiWidgetTransaction
  error?: {
    message?: string
  }
}

interface WompiCheckoutOptions {
  currency: string
  amountInCents: number
  reference: string
  publicKey: string
  acceptanceToken?: string
  signature?: {
    integrity: string
  }
  customerData?: {
    email?: string
  }
}

interface Window {
  WidgetCheckout?: new (options: WompiCheckoutOptions) => {
    open: (callback: (result: WompiWidgetResult) => void) => void
  }
}
