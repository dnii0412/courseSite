import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'
import { updateExpiredPayments } from '@/lib/utils/payment-utils'
// Ensure referenced models are registered for populate
import '@/lib/models/user'
import '@/lib/models/course'

// Initialize scheduled tasks on first API call
let isInitialized = false
function initializeIfNeeded() {
  if (!isInitialized) {
    // Import and initialize cron tasks
    import('@/lib/utils/cron').then(({ initializeScheduledTasks }) => {
      initializeScheduledTasks()
    }).catch(console.error)
    isInitialized = true
  }
}

export async function GET(request: NextRequest) {
  try {
    // Initialize scheduled tasks if needed
    initializeIfNeeded()
    
    await connectDB()
    
    // First, update any expired payments
    await updateExpiredPayments()
    
    // Then fetch all orders with populated user and course data
    const orders = await Order.find()
      .populate('user', 'name email phone')
      .populate('course', 'title')
      .sort({ createdAt: -1 })
      .lean()
    
    // Add additional information for better display
    const ordersWithInfo = orders.map(order => ({
      ...order,
      timeSinceCreated: getTimeSinceCreated(order.createdAt),
      isExpired: order.status === 'pending' && isExpired(order.createdAt),
      userDisplayName: order.user?.name || order.user?.email || 'Unknown User',
      courseDisplayName: order.course?.title || 'Unknown Course'
    }))
    
    return NextResponse.json(ordersWithInfo)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Серверийн алдаа' }, { status: 500 })
  }
}

function getTimeSinceCreated(createdAt: Date): string {
  const now = new Date()
  const diff = now.getTime() - new Date(createdAt).getTime()
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  
  if (days > 0) return `${days} хоног`
  if (hours > 0) return `${hours} цаг`
  if (minutes > 0) return `${minutes} минут`
  return 'Саяхан'
}

function isExpired(createdAt: Date): boolean {
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
  return new Date(createdAt) < fiveMinutesAgo
}
