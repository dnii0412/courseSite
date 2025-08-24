import clientPromise from "./mongodb"
import type { User } from "./models/User"
import type { Course } from "./models/Course"
import type { Enrollment } from "./models/Enrollment"
import type { Payment } from "./models/Payment"
import { ObjectId } from "mongodb"

export async function connectDB() {
  const client = await clientPromise
  return client.db("new-era-platform")
}

export class Database {
  private static instance: Database
  private client: any

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database()
    }
    return Database.instance
  }

  private async getClient() {
    if (!this.client) {
      this.client = await clientPromise
    }
    return this.client
  }

  // User operations
  async createUser(user: Omit<User, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("users").insertOne({
      ...user,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result.insertedId
  }

  async getAllUsers(): Promise<User[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("users").find({}).toArray()
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("users").findOne({ email })
  }

  async getUserById(id: ObjectId): Promise<User | null> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("users").findOne({ _id: id })
  }

  async updateUser(id: ObjectId, updates: Partial<User>): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db
      .collection("users")
      .updateOne({ _id: id }, { $set: { ...updates, updatedAt: new Date() } })
    return result.modifiedCount > 0
  }

  async deleteUser(id: ObjectId): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("users").deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  // Course operations
  async createCourse(course: Omit<Course, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("courses").insertOne({
      ...course,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result.insertedId
  }

  async getAllCourses(): Promise<Course[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("courses").find({ isActive: true }).toArray()
  }

  async getCourseById(id: ObjectId): Promise<Course | null> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("courses").findOne({ _id: id })
  }

  async updateCourse(id: ObjectId, updates: Partial<Course>): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db
      .collection("courses")
      .updateOne({ _id: id }, { $set: { ...updates, updatedAt: new Date() } })
    return result.modifiedCount > 0
  }

  async deleteCourse(id: ObjectId): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("courses").deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  // Enrollment operations
  async createEnrollment(enrollment: Omit<Enrollment, "_id">): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("enrollments").insertOne(enrollment)
    return result.insertedId
  }

  async getUserEnrollments(userId: ObjectId): Promise<Enrollment[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("enrollments").find({ userId, isActive: true }).toArray()
  }

  // Payment operations
  async createPayment(payment: Omit<Payment, "_id" | "createdAt" | "updatedAt">): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("payments").insertOne({
      ...payment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result.insertedId
  }

  async getAllPaymentsWithDetails(): Promise<any[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    
    const payments = await db.collection("payments")
      .aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
          }
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseId",
            foreignField: "_id",
            as: "course"
          }
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $unwind: {
            path: "$course",
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            _id: 1,
            userId: 1,
            courseId: 1,
            amount: 1,
            currency: 1,
            status: 1,
            paymentMethod: 1,
            qpayInvoiceId: 1,
            qpayTransactionId: 1,
            createdAt: 1,
            user: {
              name: "$user.name",
              email: "$user.email"
            },
            course: {
              title: "$course.title"
            }
          }
        },
        {
          $sort: { createdAt: -1 }
        }
      ]).toArray()
    
    return payments
  }

  async updatePaymentStatus(id: ObjectId, status: Payment["status"], qpayTransactionId?: string): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const updates: any = { status, updatedAt: new Date() }
    if (qpayTransactionId) {
      updates.qpayTransactionId = qpayTransactionId
    }
    const result = await db.collection("payments").updateOne({ _id: id }, { $set: updates })
    return result.modifiedCount > 0
  }

  // Statistics
  async getStats() {
    const client = await this.getClient()
    const db = client.db("new-era-platform")

    const [userCount, courseCount, enrollmentCount, totalRevenue] = await Promise.all([
      db.collection("users").countDocuments({ role: "student" }),
      db.collection("courses").countDocuments({ isActive: true }),
      db.collection("enrollments").countDocuments({ isActive: true }),
      db
        .collection("payments")
        .aggregate([{ $match: { status: "completed" } }, { $group: { _id: null, total: { $sum: "$amount" } } }])
        .toArray(),
    ])

    return {
      userCount,
      courseCount,
      enrollmentCount,
      totalRevenue: totalRevenue[0]?.total || 0,
    }
  }

  // Platform Settings
  async getPlatformSettings() {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    
    const settings = await db.collection("platform_settings").findOne({})
    
    if (!settings) {
      // Return default settings if none exist
      return {
        siteName: "New Era Platform",
        siteDescription: "Online Learning Platform",
        siteUrl: "http://localhost:3000",
        contactEmail: "contact@newera.com",
        supportEmail: "support@newera.com",
        defaultCurrency: "MNT",
        timezone: "Asia/Ulaanbaatar",
        maintenanceMode: false,
        allowRegistration: true,
        requireEmailVerification: false,
        maxFileSize: 100,
        allowedFileTypes: ["mp4", "avi", "mov", "wmv", "flv", "webm"],
        googleAnalyticsId: "",
        facebookPixelId: "",
        stripePublicKey: "",
        stripeSecretKey: "",
        qpayMerchantId: "",
        qpayApiKey: "",
        bunnyApiKey: "",
        bunnyVideoLibraryId: ""
      }
    }
    
    return settings
  }

  async updatePlatformSettings(settings: any) {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    
    const result = await db.collection("platform_settings").updateOne(
      {}, // Update the first (and only) document
      { $set: { ...settings, updatedAt: new Date() } },
      { upsert: true } // Create if doesn't exist
    )
    
    return result.modifiedCount > 0 || result.upsertedCount > 0
  }

  // Sub-Course operations
  async createSubCourse(subCourse: any): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("sub_courses").insertOne({
      ...subCourse,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result.insertedId
  }

  async getAllSubCourses(): Promise<any[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("sub_courses").find({}).toArray()
  }

  async getSubCoursesByCourseId(courseId: ObjectId): Promise<any[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("sub_courses").find({ courseId: courseId.toString() }).toArray()
  }

  async getSubCourseById(id: ObjectId): Promise<any | null> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("sub_courses").findOne({ _id: id })
  }

  async updateSubCourse(id: ObjectId, updates: any): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db
      .collection("sub_courses")
      .updateOne({ _id: id }, { $set: { ...updates, updatedAt: new Date() } })
    return result.modifiedCount > 0
  }

  async deleteSubCourse(id: ObjectId): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("sub_courses").deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  // Lesson operations
  async createLesson(lesson: any): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("lessons").insertOne({
      ...lesson,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result.insertedId
  }

  async getAllLessons(): Promise<any[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("lessons").find({}).toArray()
  }

  async updateLesson(id: ObjectId, updates: any): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db
      .collection("lessons")
      .updateOne({ _id: id }, { $set: { ...updates, updatedAt: new Date() } })
    return result.modifiedCount > 0
  }

  async deleteLesson(id: ObjectId): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("lessons").deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  // Media Grid Layout operations
  async getMediaGridLayout(): Promise<any> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    
    const layout = await db.collection("media_grid_layouts").findOne({})
    
    if (!layout) {
      // Return default layout if none exists
      return {
        id: "default",
        name: "Main Grid",
        width: 6,
        height: 4,
        cells: [],
        isPublished: true,
        isLive: false,
        lastSaved: new Date().toISOString()
      }
    }
    
    return layout
  }

  async updateMediaGridLayout(layout: any): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    
    const result = await db.collection("media_grid_layouts").updateOne(
      {}, // Update the first (and only) document
      { $set: { ...layout, updatedAt: new Date() } },
      { upsert: true } // Create if doesn't exist
    )
    
    return result.modifiedCount > 0 || result.upsertedCount > 0
  }

  // Media operations
  async getAllMediaItems(): Promise<any[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("media_items").find({}).toArray()
  }

  async createMediaItem(mediaItem: any): Promise<ObjectId> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("media_items").insertOne({
      ...mediaItem,
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    return result.insertedId
  }

  async updateMediaItem(id: ObjectId, updates: any): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db
      .collection("media_items")
      .updateOne({ _id: id }, { $set: { ...updates, updatedAt: new Date() } })
    return result.modifiedCount > 0
  }

  async deleteMediaItem(id: ObjectId): Promise<boolean> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    const result = await db.collection("media_items").deleteOne({ _id: id })
    return result.deletedCount > 0
  }

  // Database Statistics
  async getDatabaseStats() {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    
    try {
      // Get database stats
      const dbStats = await db.stats()
      
      // Get collections info
      const collections = await db.listCollections().toArray()
      const collectionsInfo = await Promise.all(
        collections.map(async (collection: any) => {
          const coll = db.collection(collection.name)
          const stats = await coll.stats()
          const lastDoc = await coll.findOne({}, { sort: { _id: -1 } })
          
          return {
            name: collection.name,
            size: stats.size || 0,
            documents: stats.count || 0,
            lastUpdated: lastDoc?.updatedAt || lastDoc?.createdAt || new Date().toISOString(),
            status: "Active"
          }
        })
      )
      
      const stats = {
        collections: collections.length,
        totalSize: dbStats.dataSize || 0,
        totalDocuments: dbStats.objects || 0,
        storageUsed: dbStats.storageSize || 0,
        storageTotal: (dbStats.storageSize || 0) * 2 // Approximate total storage
      }
      
      return { stats, collections: collectionsInfo }
    } catch (error) {
      console.error("Failed to get database stats:", error)
      // Return default values if stats fail
      return {
        stats: {
          collections: 0,
          totalSize: 0,
          totalDocuments: 0,
          storageUsed: 0,
          storageTotal: 0
        },
        collections: []
      }
    }
  }

  // Video management methods
  async saveVideoMetadata(videoData: {
    uploadId: string
    bunnyVideoId: string
    videoUrl: string
    title: string
    description: string
    filename: string
    fileSize: number
    fileType: string
    uploadedBy: string
    uploadedAt: Date
    status: string
  }): Promise<string> {
    try {
      const client = await this.getClient()
      const db = client.db("new-era-platform")
      
      const result = await db.collection("videos").insertOne({
        ...videoData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      
      return result.insertedId.toString()
    } catch (error) {
      console.error("Failed to save video metadata:", error)
      throw error
    }
  }

  async getVideoById(videoId: string): Promise<any> {
    try {
      const client = await this.getClient()
      const db = client.db("new-era-platform")
      
      return await db.collection("videos").findOne({ _id: new ObjectId(videoId) })
    } catch (error) {
      console.error("Failed to get video:", error)
      throw error
    }
  }

  async updateVideoStatus(videoId: string, status: string, metadata?: any): Promise<boolean> {
    try {
      const client = await this.getClient()
      const db = client.db("new-era-platform")
      
      const updateData: any = { 
        status, 
        updatedAt: new Date() 
      }
      
      if (metadata) {
        updateData.metadata = metadata
      }
      
      const result = await db.collection("videos").updateOne(
        { _id: new ObjectId(videoId) },
        { $set: updateData }
      )
      
      return result.modifiedCount > 0
    } catch (error) {
      console.error("Failed to update video status:", error)
      throw error
    }
  }

  async getLessonsBySubCourseId(subCourseId: ObjectId): Promise<any[]> {
    const client = await this.getClient()
    const db = client.db("new-era-platform")
    return await db.collection("lessons").find({ subCourseId: subCourseId.toString() }).toArray()
  }
}

export const db = Database.getInstance()
