import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { BillingEvent } from '@/lib/models/billing'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const events = await BillingEvent.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({
      ok: true,
      data: events
    })
  } catch (error) {
    console.error('Error fetching billing events:', error)
    return NextResponse.json({
      ok: false,
      reason: 'Internal server error'
    }, { status: 500 })
  }
}
