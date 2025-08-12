import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { User } from '@/lib/models/user'
import { Course } from '@/lib/models/course'
import { Order } from '@/lib/models/order'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const [usersCount, coursesCount, enrollmentsCount, revenueAgg, ordersAgg] = await Promise.all([
      User.countDocuments({}),
      Course.countDocuments({}),
      // Derive total enrollments by summing user.enrolledCourses lengths
      User.aggregate([
        { $project: { count: { $size: { $ifNull: ['$enrolledCourses', []] } } } },
        { $group: { _id: null, total: { $sum: '$count' } } },
      ]).then((r: any[]) => r?.[0]?.total || 0),
      Order.aggregate([
        { $match: { status: 'completed' } },
        { $group: { _id: null, total: { $sum: '$amount' } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ])

    const revenue = revenueAgg?.[0]?.total || 0
    const ordersByStatus = ordersAgg.reduce((acc: any, cur: any) => {
      acc[cur._id || 'unknown'] = cur.count
      return acc
    }, {})

    return NextResponse.json({ usersCount, coursesCount, enrollmentsCount, revenue, ordersByStatus })
  } catch (error) {
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}
