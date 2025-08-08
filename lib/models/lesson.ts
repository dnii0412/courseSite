import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  videoUrl: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  preview: {
    type: Boolean,
    default: false
  },
  quiz: {
    questions: [{
      question: String,
      options: [String],
      correctAnswer: Number
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export const Lesson = mongoose.models.Lesson || mongoose.model('Lesson', lessonSchema)
