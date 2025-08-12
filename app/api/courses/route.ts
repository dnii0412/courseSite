import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import { Course } from '@/lib/models/course'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const page = Math.max(1, Number(searchParams.get('page') || '1'))
    const pageSize = Math.min(24, Math.max(1, Number(searchParams.get('pageSize') || '12')))
    const q = (searchParams.get('q') || '').trim()
    const sort = searchParams.get('sort') || 'new'
    const categoryCsv = (searchParams.get('category') || '').split(',').filter(Boolean)
    const level = searchParams.get('level') || ''
    const price = searchParams.get('price') || '' // free|paid
    const duration = searchParams.get('duration') || '' // lt1|1_3|3_10|10p
    const languageCsv = (searchParams.get('language') || '').split(',').filter(Boolean)

    const filter: any = { published: true }
    if (q) filter.title = { $regex: q, $options: 'i' }
    if (categoryCsv.length) filter.category = { $in: categoryCsv }
    if (level) filter.level = level
    if (price === 'free') filter.price = 0
    if (price === 'paid') filter.price = { $gt: 0 }
    if (duration === 'lt1') filter.duration = { $lt: 60 }
    if (duration === '1_3') filter.duration = { $gte: 60, $lte: 180 }
    if (duration === '3_10') filter.duration = { $gte: 180, $lte: 600 }
    if (duration === '10p') filter.duration = { $gt: 600 }
    if (languageCsv.length) filter.language = { $in: languageCsv }

    await connectDB()

    const total = await Course.countDocuments(filter)
    const sortBy: any =
      sort === 'views' ? { studentsCount: -1 } :
      sort === 'rating' ? { rating: -1 } :
      sort === 'price_asc' ? { price: 1 } :
      sort === 'price_desc' ? { price: -1 } : { createdAt: -1 }

    const data = await Course.find(filter)
      .sort(sortBy)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean()

    return NextResponse.json({ data, total, page, pageSize })
  } catch (e) {
    return NextResponse.json({ data: [], total: 0, page: 1, pageSize: 12 }, { status: 200 })
  }
}

