import { connectDB } from '@/lib/mongodb'
import { BillingSettings, BillingEvent } from '@/lib/models/billing'
import { getCurrentMonthEstimatedSpend } from '@/lib/atlasBilling'

export async function checkBilling() {
  try {
    console.log('Starting daily billing check...')
    
    await connectDB()
    
    // Get or create billing settings
    let settings = await BillingSettings.findOne()
    if (!settings) {
      settings = await BillingSettings.create({
        monthlyBudgetUsd: 20,
        alert80SentAt: null,
        alert100SentAt: null,
        updatedAt: new Date()
      })
      console.log('Created default billing settings with $20 budget')
    }

    // Get current month estimated spend
    const billingData = await getCurrentMonthEstimatedSpend()
    
    if (!billingData) {
      console.log('Atlas API not available, skipping billing check')
      return
    }

    const { amountUsd } = billingData
    const budget = settings.monthlyBudgetUsd
    const threshold80 = budget * 0.8
    const threshold100 = budget

    console.log(`Current spend: $${amountUsd}, Budget: $${budget}`)

    // Check 80% threshold
    if (amountUsd >= threshold80 && (!settings.alert80SentAt || isLastMonth(settings.alert80SentAt))) {
      const message = `⚠️ Budget Alert: Current month spend is $${amountUsd.toFixed(2)} (${((amountUsd / budget) * 100).toFixed(1)}% of $${budget} budget)`
      
      await BillingEvent.create({
        level: '80',
        message,
        createdAt: new Date()
      })

      await BillingSettings.updateOne(
        { _id: settings._id },
        { alert80SentAt: new Date() }
      )

      console.log('80% threshold alert created')
      
      // TODO: Send email notification if RESEND_API_KEY is configured
      // await sendEmailNotification(message)
    }

    // Check 100% threshold
    if (amountUsd >= threshold100 && (!settings.alert100SentAt || isLastMonth(settings.alert100SentAt))) {
      const message = `🚨 CRITICAL: Budget exceeded! Current month spend is $${amountUsd.toFixed(2)} (${((amountUsd / budget) * 100).toFixed(1)}% of $${budget} budget)`
      
      await BillingEvent.create({
        level: '100',
        message,
        createdAt: new Date()
      })

      await BillingSettings.updateOne(
        { _id: settings._id },
        { alert100SentAt: new Date() }
      )

      console.log('100% threshold alert created')
      
      // TODO: Send email notification if RESEND_API_KEY is configured
      // await sendEmailNotification(message)
    }

    console.log('Daily billing check completed')
  } catch (error) {
    console.error('Error in daily billing check:', error)
  }
}

function isLastMonth(date: Date): boolean {
  const now = new Date()
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  return date < lastMonth
}

// Optional: Email notification function
async function sendEmailNotification(message: string) {
  const resendApiKey = process.env.RESEND_API_KEY
  if (!resendApiKey) return

  try {
    // Implementation would depend on your email service
    // This is a placeholder for Resend integration
    console.log('Would send email:', message)
  } catch (error) {
    console.error('Failed to send email notification:', error)
  }
}

// Run if called directly (for testing)
if (require.main === module) {
  checkBilling().then(() => process.exit(0))
}
