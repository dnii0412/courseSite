import mongoose from 'mongoose'

const statCardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    required: true,
    enum: ['Users', 'Star', 'Trophy', 'Target', 'TrendingUp', 'Award']
  },
  color: {
    type: String,
    required: true
  },
  bgColor: {
    type: String,
    required: true
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

const statsSchema = new mongoose.Schema({
  stats: [statCardSchema],
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

export const Stats = mongoose.models.Stats || mongoose.model('Stats', statsSchema)
