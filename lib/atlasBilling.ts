import crypto from 'crypto'

interface AtlasBillingResponse {
  amountUsd: number
  periodStart: string
  periodEnd: string
}

interface AtlasError {
  error: string
  errorCode: string
}

export async function getCurrentMonthEstimatedSpend(): Promise<AtlasBillingResponse | null> {
  const publicKey = process.env.ATLAS_PUBLIC_KEY
  const privateKey = process.env.ATLAS_PRIVATE_KEY
  const projectId = process.env.ATLAS_PROJECT_ID
  const orgId = process.env.ATLAS_ORG_ID

  if (!publicKey || !privateKey || !projectId || !orgId) {
    console.log('Atlas API keys not configured')
    return null
  }

  try {
    // Get current month period
    const now = new Date()
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()

    // Atlas Billing API endpoint for estimated charges
    const url = `https://cloud.mongodb.com/api/atlas/v1.0/orgs/${orgId}/invoices`
    
    // Create HTTP Digest authentication
    const method = 'GET'
    const uri = `/api/atlas/v1.0/orgs/${orgId}/invoices`
    const realm = 'MongoDB Atlas'
    const nonce = crypto.randomBytes(16).toString('hex')
    const qop = 'auth'
    const nc = '00000001'
    const cnonce = crypto.randomBytes(16).toString('hex')

    // Calculate digest response
    const ha1 = crypto.createHash('md5').update(`${publicKey}:${realm}:${privateKey}`).digest('hex')
    const ha2 = crypto.createHash('md5').update(`${method}:${uri}`).digest('hex')
    const response = crypto.createHash('md5').update(`${ha1}:${nonce}:${nc}:${cnonce}:${qop}:${ha2}`).digest('hex')

    const authHeader = `Digest username="${publicKey}", realm="${realm}", nonce="${nonce}", uri="${uri}", algorithm=MD5, qop=${qop}, nc=${nc}, cnonce="${cnonce}", response="${response}"`

    const fetchResponse = await fetch(url, {
      method,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    })

    if (!fetchResponse.ok) {
      console.error('Atlas API request failed:', fetchResponse.status, fetchResponse.statusText)
      return null
    }

    const data = await fetchResponse.json()
    
    // Parse billing data - this is a simplified implementation
    // The actual Atlas API response structure may vary
    let totalAmount = 0
    
    if (data.results && Array.isArray(data.results)) {
      // Sum up estimated charges for current month
      data.results.forEach((invoice: any) => {
        if (invoice.status === 'ESTIMATED' && invoice.totalAmount) {
          totalAmount += parseFloat(invoice.totalAmount)
        }
      })
    }

    return {
      amountUsd: totalAmount,
      periodStart,
      periodEnd
    }

  } catch (error) {
    console.error('Error fetching Atlas billing data:', error)
    return null
  }
}

// Fallback function for when Atlas API is not available
export function getMockBillingData(): AtlasBillingResponse {
  const now = new Date()
  const periodStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
  const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
  
  return {
    amountUsd: 0,
    periodStart,
    periodEnd
  }
}
