export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import mongoose from 'mongoose'
import { EJSON } from 'bson'

export async function GET(_req: NextRequest) {
  try {
    await connectDB()
    const db = mongoose.connection.db
    const cols = await db.listCollections().toArray()
    const data: Record<string, unknown[]> = {}

    for (const c of cols) {
      const col = db.collection(c.name)
      // Avoid exporting extremely large collections inadvertently
      const docs = await col.find({}).toArray()
      data[c.name] = EJSON.serialize(docs) as unknown[]
    }

    const payload = {
      meta: {
        createdAt: new Date().toISOString(),
        db: db.databaseName,
        collections: cols.map(c => c.name),
        tool: 'admin-backup-export',
        version: 1,
      },
      collections: data,
    }

    const json = JSON.stringify(payload)
    const filename = `backup-${db.databaseName}-${Date.now()}.json`
    return new NextResponse(json, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-store',
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: 'Export failed', details: String(e?.message || e) }, { status: 500 })
  }
}


