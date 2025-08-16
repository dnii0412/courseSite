import mongoose from 'mongoose'

const whyUsItemSchema = new mongoose.Schema({
  icon: {
    type: String,
    required: true,
    enum: ['Video', 'DollarSign', 'Users', 'Clock']
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    required: true
  },
  iconColor: {
    type: String,
    required: true
  },
  enabled: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

const whyUsSchema = new mongoose.Schema({
  items: [whyUsItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const WhyUs = mongoose.models.WhyUs || mongoose.model('WhyUs', whyUsSchema)
