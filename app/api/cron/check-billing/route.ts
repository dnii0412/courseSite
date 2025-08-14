import { NextRequest, NextResponse } from 'next/server'
import { checkBilling } from '@/scripts/cron/checkBilling'

export async function GET(request: NextRequest) {
  // Verify this is a legitimate cron request
  const authHeader = request.headers.get('authorization')
  const isVercelCron = request.headers.get('x-vercel-cron') === 'true'
  
  // Allow Vercel cron or requests with proper auth
  if (!isVercelCron && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await checkBilling()
    
    return NextResponse.json({
      ok: true,
      message: 'Billing check completed successfully'
    })
  } catch (error) {
    console.error('Error in cron billing check:', error)
    
    return NextResponse.json({
      ok: false,
      error: 'Billing check failed'
    }, { status: 500 })
  }
}
