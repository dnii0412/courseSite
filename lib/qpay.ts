interface QPayInvoiceRequest {
  invoice_code: string
  sender_invoice_no: string
  invoice_receiver_code: string
  invoice_description: string
  amount: number
  callback_url?: string
}

interface QPayInvoiceResponse {
  invoice_id: string
  qr_text: string
  qr_image: string
  urls: Array<{
    name: string
    description: string
    logo: string
    link: string
  }>
}

interface QPayPaymentCheck {
  payment_id: string
  payment_status: string
  payment_amount: number
  payment_currency: string
  payment_wallet: string
}

export class QPayService {
  private baseUrl: string
  private username: string
  private password: string
  private invoiceCode: string

  constructor() {
    this.baseUrl = process.env.QPAY_API_URL || "https://merchant.qpay.mn"
    this.username = process.env.QPAY_MERCHANT_CODE || "demo_user"
    this.password = process.env.QPAY_MCC_CODE || "demo_pass"
    this.invoiceCode = process.env.QPAY_PROJECT_ID || "DEMO-001"
  }

  private async getAccessToken(): Promise<string> {
    // Check if required environment variables are set
    if (!this.username || !this.password) {
      throw new Error("QPay credentials not configured. Please set QPAY_MERCHANT_CODE and QPAY_MCC_CODE environment variables.")
    }

    // Ensure baseUrl doesn't end with a slash
    const cleanBaseUrl = this.baseUrl.replace(/\/$/, '')
    const authUrl = `${cleanBaseUrl}/v2/auth/token`
    
    console.log(`QPay Auth URL: ${authUrl}`)
    console.log(`QPay Username: ${this.username}`)
    console.log(`QPay Password: ${this.password}`)

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password,
      }),
    })

    console.log(`QPay Auth Response Status: ${response.status}`)
    console.log(`QPay Auth Response Headers:`, Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.log(`QPay Auth Error Response:`, errorText)
      throw new Error(`Failed to get QPay access token: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const responseText = await response.text()
    console.log(`QPay Auth Response Body:`, responseText)
    
    try {
      const data = JSON.parse(responseText)
      return data.access_token
    } catch (parseError) {
      console.error(`QPay Auth JSON Parse Error:`, parseError)
      console.error(`QPay Auth Raw Response:`, responseText)
      throw new Error(`Invalid JSON response from QPay: ${responseText.substring(0, 200)}...`)
    }
  }

  async createInvoice(
    amount: number,
    description: string,
    senderInvoiceNo: string,
    callbackUrl?: string,
  ): Promise<QPayInvoiceResponse> {
    // Check if required environment variables are set
    if (!this.invoiceCode) {
      throw new Error("QPay invoice code not configured. Please set QPAY_PROJECT_ID environment variable.")
    }

    const token = await this.getAccessToken()

    const invoiceData: QPayInvoiceRequest = {
      invoice_code: this.invoiceCode,
      sender_invoice_no: senderInvoiceNo,
      invoice_receiver_code: "terminal",
      invoice_description: description,
      amount: amount,
      callback_url: callbackUrl,
    }

    // Ensure baseUrl doesn't end with a slash
    const cleanBaseUrl = this.baseUrl.replace(/\/$/, '')
    const invoiceUrl = `${cleanBaseUrl}/v2/invoice`

    const response = await fetch(invoiceUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoiceData),
    })

    if (!response.ok) {
      throw new Error("Failed to create QPay invoice")
    }

    return await response.json()
  }

  async checkPayment(invoiceId: string): Promise<QPayPaymentCheck> {
    const token = await this.getAccessToken()

    const response = await fetch(`${this.baseUrl}/v2/payment/check`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        object_type: "INVOICE",
        object_id: invoiceId,
      }),
    })

    if (!response.ok) {
      throw new Error("Failed to check QPay payment")
    }

    return await response.json()
  }
}

export const qpayService = new QPayService()
