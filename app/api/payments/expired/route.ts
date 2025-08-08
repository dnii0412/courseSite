import { NextRequest, NextResponse } from 'next/server'
import { updateExpiredPayments } from '@/lib/utils/payment-utils'

export async function POST(request: NextRequest) {
  try {
    const updatedCount = await updateExpiredPayments()
    
    return NextResponse.json({
      message: `${updatedCount} expired payments updated to failed status`,
      updatedCount
    })
  } catch (error) {
    console.error('Error updating expired payments:', error)
    return NextResponse.json(
      { error: 'Failed to update expired payments' },
      { status: 500 }
    )
  }
}
