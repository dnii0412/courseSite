import { updateExpiredPayments } from './payment-utils'

// Simple cron-like scheduler
class CronScheduler {
  private intervals: Map<string, NodeJS.Timeout> = new Map()

  // Schedule a task to run every X minutes
  scheduleEvery(minutes: number, taskName: string, task: () => Promise<void>) {
    // Clear existing interval if it exists
    this.clearTask(taskName)
    
    const interval = setInterval(async () => {
      try {
        console.log(`Running scheduled task: ${taskName}`)
        await task()
      } catch (error) {
        console.error(`Error in scheduled task ${taskName}:`, error)
      }
    }, minutes * 60 * 1000)
    
    this.intervals.set(taskName, interval)
    
    // Run immediately on first schedule
    task().catch(error => {
      console.error(`Error in initial run of task ${taskName}:`, error)
    })
  }

  clearTask(taskName: string) {
    const interval = this.intervals.get(taskName)
    if (interval) {
      clearInterval(interval)
      this.intervals.delete(taskName)
    }
  }

  clearAll() {
    this.intervals.forEach((interval) => {
      clearInterval(interval)
    })
    this.intervals.clear()
  }
}

// Global scheduler instance
export const cronScheduler = new CronScheduler()

// Initialize scheduled tasks
export function initializeScheduledTasks() {
  // Update expired payments every 2 minutes
  cronScheduler.scheduleEvery(2, 'updateExpiredPayments', updateExpiredPayments)
  
  console.log('Scheduled tasks initialized')
}

// Cleanup on app shutdown
export function cleanupScheduledTasks() {
  cronScheduler.clearAll()
  console.log('Scheduled tasks cleaned up')
}
