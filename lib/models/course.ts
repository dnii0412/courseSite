import mongoose from 'mongoose'
import { User } from './user'

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  duration: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technology', 'business', 'design', 'marketing', 'other']
  },
  level: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  instructor: {
    type: mongoose.Schema.Types.Mixed, // allow ObjectId or string
    required: true
  },
  lessons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lesson'
  }],
  requirements: [String],
  whatYouWillLearn: [String],
  published: {
    type: Boolean,
    default: false
  },
  studentsCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Course = mongoose.models.Course || mongoose.model('Course', courseSchema)
