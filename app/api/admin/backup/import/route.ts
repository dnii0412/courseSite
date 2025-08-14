export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { EJSON } from 'mongodb'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const db = mongoose.connection.db
    const bodyText = await req.text()
    const payload = JSON.parse(bodyText)

    if (!payload?.collections || typeof payload.collections !== 'object') {
      return NextResponse.json({ error: 'Invalid backup format' }, { status: 400 })
    }

    for (const [name, arr] of Object.entries<any>(payload.collections)) {
      const col = db.collection(name)
      // naive restore: drop and insert
      try { await col.drop() } catch {}
      const docs = EJSON.deserialize(arr)
      if (Array.isArray(docs) && docs.length) {
        await col.insertMany(docs as any[])
      }
    }

    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: 'Import failed', details: String(e?.message || e) }, { status: 500 })
  }
}


