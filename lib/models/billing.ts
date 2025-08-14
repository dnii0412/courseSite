import mongoose, { Schema, Document } from 'mongoose'

export interface IBillingSettings extends Document {
  monthlyBudgetUsd: number
  alert80SentAt: Date | null
  alert100SentAt: Date | null
  updatedAt: Date
}

export interface IBillingEvent extends Document {
  level: '80' | '100'
  message: string
  createdAt: Date
}

const billingSettingsSchema = new Schema<IBillingSettings>({
  monthlyBudgetUsd: {
    type: Number,
    default: 20,
    min: 1,
    max: 1000
  },
  alert80SentAt: {
    type: Date,
    default: null
  },
  alert100SentAt: {
    type: Date,
    default: null
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const billingEventSchema = new Schema<IBillingEvent>({
  level: {
    type: String,
    enum: ['80', '100'],
    required: true
  },
  message: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

// Ensure only one settings document exists
billingSettingsSchema.index({}, { unique: true })

export const BillingSettings = mongoose.models.BillingSettings || mongoose.model<IBillingSettings>('BillingSettings', billingSettingsSchema)
export const BillingEvent = mongoose.models.BillingEvent || mongoose.model<IBillingEvent>('BillingEvent', billingEventSchema)
