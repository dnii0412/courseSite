import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'

export const dynamic = 'force-dynamic'

async function getMongoStats() {
  await connectDB()
  const conn = mongoose.connection
  const db = conn.db
  const out: any = { ok: true }
  try {
    const t0 = Date.now()
    const stats = await db.stats()
    const t1 = Date.now()
    let serverStatus: any = null
    try {
      // May fail on some hosted plans; ignore errors
      // @ts-ignore
      serverStatus = await (db as any).admin().serverStatus()
    } catch (_) {}
    out.stats = {
      db: stats.db,
      collections: stats.collections,
      objects: stats.objects,
      dataSize: stats.dataSize,
      storageSize: stats.storageSize,
      indexes: stats.indexes,
      ms: t1 - t0,
    }
    if (serverStatus?.connections) out.connections = serverStatus.connections
  } catch (e) {
    out.ok = false
    out.error = 'db.stats failed'
  }

  try {
    const t2 = Date.now()
    const cols = await db.listCollections().toArray()
    const details: any[] = []
    // Limit to 20 collections to avoid heavy calls
    for (const c of cols.slice(0, 20)) {
      try {
        const col = db.collection(c.name)
        const s = await col.stats()
        details.push({
          name: c.name,
          count: s.count,
          storageSize: s.storageSize,
          avgObjSize: s.avgObjSize,
          capped: s.capped,
          wiredTiger: undefined,
        })
      } catch (_) {
        details.push({ name: c.name, count: null })
      }
    }
    out.collections = details
    out.listCollectionsMs = Date.now() - t2
  } catch (e) {
    out.ok = false
    out.error = 'listCollections failed'
  }
  return out
}

async function getBunnyStats() {
  const LIBRARY_ID = process.env.BUNNY_LIBRARY_ID || process.env.NEXT_PUBLIC_BUNNY_LIBRARY_ID
  const API_KEY = process.env.BUNNY_STREAM_API_KEY
  const out: any = { ok: false, libraryId: LIBRARY_ID || null }
  if (!LIBRARY_ID || !API_KEY) {
    out.error = 'Missing BUNNY env'
    return out
  }
  try {
    const url = `https://video.bunnycdn.com/library/${Number(LIBRARY_ID)}/videos?itemsPerPage=100&page=1`
    const res = await fetch(url, {
      headers: { Accept: 'application/json', AccessKey: API_KEY } as any,
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      out.error = data?.message || data?.error || 'Bunny list failed'
      return out
    }
    const items = (data.items || data.videos || []) as any[]
    const videosCount = Number(data.totalItems ?? data.total ?? items.length) || items.length
    let totalSizeBytes: number | null = null
    const sizeKey = items.length ? (['storageSize','size','length'].find(k => items[0][k] != null) as string | undefined) : undefined
    if (sizeKey) {
      totalSizeBytes = items.reduce((sum, v) => sum + (Number(v[sizeKey]) || 0), 0)
    }
    out.ok = true
    out.videosCount = videosCount
    if (totalSizeBytes != null) out.totalSizeBytes = totalSizeBytes
    return out
  } catch (e) {
    out.error = 'Bunny fetch failed'
    return out
  }
}

export async function GET(_req: NextRequest) {
  const [mongo, bunny] = await Promise.all([getMongoStats(), getBunnyStats()])
  return NextResponse.json(
    { mongo, bunny, lastUpdated: new Date().toISOString() },
    { headers: { 'Cache-Control': 'no-store' } }
  )
}


