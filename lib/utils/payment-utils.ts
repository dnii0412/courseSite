import { connectDB } from '@/lib/mongodb'
import { Order } from '@/lib/models/order'

export async function updateExpiredPayments() {
  try {
    await connectDB()
    
    // Find all pending payments older than 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
    
    const expiredOrders = await Order.find({
      status: 'pending',
      createdAt: { $lt: fiveMinutesAgo }
    })

    if (expiredOrders.length > 0) {
      // Update all expired orders to failed status
      await Order.updateMany(
        {
          status: 'pending',
          createdAt: { $lt: fiveMinutesAgo }
        },
        {
          $set: { status: 'failed' }
        }
      )

      console.log(`Updated ${expiredOrders.length} expired payments to failed status`)
    }

    return expiredOrders.length
  } catch (error) {
    console.error('Error updating expired payments:', error)
    throw error
  }
}

export async function getPaymentStats() {
  try {
    await connectDB()
    
    const stats = await Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ])

    return stats
  } catch (error) {
    console.error('Error getting payment stats:', error)
    throw error
  }
}
