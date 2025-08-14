import { NextRequest, NextResponse } from 'next/server'
import { getCurrentMonthEstimatedSpend } from '@/lib/atlasBilling'

export async function GET(request: NextRequest) {
  try {
    const billingData = await getCurrentMonthEstimatedSpend()
    
    if (!billingData) {
      return NextResponse.json({
        ok: false,
        reason: 'Atlas API not configured or request failed'
      })
    }

    return NextResponse.json({
      ok: true,
      data: {
        ...billingData,
        fetchedAt: new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error in atlas-summary API:', error)
    return NextResponse.json({
      ok: false,
      reason: 'Internal server error'
    }, { status: 500 })
  }
}
