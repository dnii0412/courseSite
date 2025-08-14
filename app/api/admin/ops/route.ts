import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Simple Ops feed. Replace with real source if available
const recentOperations = [
  {
    operation: 'Backup created',
    status: 'success',
    timestamp: '2024.01.15 14:30',
    duration: '2m 15s',
    size: '1.2 GB',
  },
  {
    operation: 'Index optimization',
    status: 'success',
    timestamp: '2024.01.15 12:00',
    duration: '45s',
    size: null,
  },
  {
    operation: 'Data migration',
    status: 'running',
    timestamp: '2024.01.15 10:15',
    duration: '15m 30s',
    size: '800 MB',
  },
  {
    operation: 'Backup verification',
    status: 'success',
    timestamp: '2024.01.15 08:45',
    duration: '1m 20s',
    size: null,
  },
  {
    operation: 'Security scan',
    status: 'warning',
    timestamp: '2024.01.15 06:30',
    duration: '5m 10s',
    size: null,
  },
]

export async function GET() {
  return NextResponse.json(recentOperations, { headers: { 'Cache-Control': 'no-store' } })
}


