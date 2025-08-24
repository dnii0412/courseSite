export interface AuthUser {
  id: string
  email: string
  name: string
  role: "student" | "admin"
}

export interface Course {
  _id?: string
  title: string
  description: string
  price: number
  originalPrice?: number
  category: string
  level: "beginner" | "intermediate" | "advanced"
  duration: number // in minutes
  videoUrl?: string
  thumbnailUrl?: string
  lessons: Lesson[]
  enrolledCount: number
  rating: number
  totalRatings: number
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Lesson {
  _id?: string
  title: string
  description: string
  videoUrl: string
  duration: number // in minutes
  order: number
  isPreview: boolean
  subCourseId?: string
}

export interface User {
  _id?: string
  name: string
  email: string
  password: string
  role: "student" | "admin"
  enrolledCourses: string[]
  phone?: string
  address?: string
  bio?: string
  createdAt: Date
  updatedAt: Date
}

export interface Enrollment {
  _id?: string
  userId: string
  courseId: string
  enrolledAt: Date
  isActive: boolean
}

export interface Payment {
  _id?: string
  userId: string
  courseId: string
  amount: number
  status: "pending" | "completed" | "failed"
  qpayTransactionId?: string
  createdAt: Date
  updatedAt: Date
}

export interface MediaItem {
  _id?: string
  name: string
  description: string
  type: string
  size: number
  originalName: string
  uploadedBy: string
  status: 'active' | 'inactive'
  cloudinaryPublicId?: string
  cloudinaryUrl?: string
  cloudinarySecureUrl?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface GridCell {
  x: number
  y: number
  mediaId?: string
  media?: MediaItem
}

export interface MediaGridLayout {
  _id?: string
  width: number
  height: number
  cells: GridCell[]
  isPublished: boolean
  isLive: boolean
  lastSaved?: Date
  createdAt?: Date
  updatedAt?: Date
}
