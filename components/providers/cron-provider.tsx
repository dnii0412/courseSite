'use server'

import { initializeScheduledTasks } from '@/lib/utils/cron'

// This component runs on the server and initializes scheduled tasks
export async function CronProvider() {
  // Initialize scheduled tasks
  initializeScheduledTasks()
  
  // This component doesn't render anything
  return null
}
