import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: false,
    default: ''
  },
  videoUrl: {
    type: String,
    required: false
  },
  videoId: {
    type: String,
    required: false
  },
  videoStatus: {
    type: String,
    enum: ['pending', 'uploading', 'uploaded', 'failed'],
    default: 'pending'
  },
  videoFile: {
    type: String,
    required: false
  },
  duration: {
    type: Number,
    required: true
  },
  order: {
    type: Number,
    required: false,
    default: 0
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
