import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  role: "student" | "admin"
  enrolledCourses: ObjectId[]
  googleId?: string
  profilePicture?: string
  createdAt: Date
  updatedAt: Date
}

export interface UserSession {
  _id?: ObjectId
  userId: ObjectId
  token: string
  expiresAt: Date
  createdAt: Date
}
