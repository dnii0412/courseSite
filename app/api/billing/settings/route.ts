import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { BillingSettings } from '@/lib/models/billing'

export async function GET() {
  try {
    await connectDB()
    
    let settings = await BillingSettings.findOne()
    
    if (!settings) {
      // Create default settings
      settings = await BillingSettings.create({
        monthlyBudgetUsd: 20,
        alert80SentAt: null,
        alert100SentAt: null,
        updatedAt: new Date()
      })
    }

    return NextResponse.json({
      ok: true,
      data: {
        monthlyBudgetUsd: settings.monthlyBudgetUsd,
        alert80SentAt: settings.alert80SentAt,
        alert100SentAt: settings.alert100SentAt,
        updatedAt: settings.updatedAt
      }
    })
  } catch (error) {
    console.error('Error fetching billing settings:', error)
    return NextResponse.json({
      ok: false,
      reason: 'Internal server error'
    }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { monthlyBudgetUsd } = await request.json()
    
    if (typeof monthlyBudgetUsd !== 'number' || monthlyBudgetUsd < 1 || monthlyBudgetUsd > 1000) {
      return NextResponse.json({
        ok: false,
        reason: 'Invalid budget amount'
      }, { status: 400 })
    }

    await connectDB()
    
    const settings = await BillingSettings.findOneAndUpdate(
      {},
      {
        monthlyBudgetUsd,
        updatedAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    )

    return NextResponse.json({
      ok: true,
      data: {
        monthlyBudgetUsd: settings.monthlyBudgetUsd,
        alert80SentAt: settings.alert80SentAt,
        alert100SentAt: settings.alert100SentAt,
        updatedAt: settings.updatedAt
      }
    })
  } catch (error) {
    console.error('Error updating billing settings:', error)
    return NextResponse.json({
      ok: false,
      reason: 'Internal server error'
    }, { status: 500 })
  }
}
