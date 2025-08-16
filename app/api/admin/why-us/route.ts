import { NextRequest, NextResponse } from 'next/server'
import { verify } from 'jsonwebtoken'
import { connectDB } from '@/lib/mongodb'
import { WhyUs } from '@/lib/models/whyUs'
import { User } from '@/lib/models/user'

export async function GET() {
    try {
        await connectDB()
        
        // Get why-us data from database
        let whyUsDoc = await WhyUs.findOne()
        
        // If no data exists, create default ones
        if (!whyUsDoc) {
            const defaultItems = [
                {
                    icon: 'Video',
                    title: 'Чанартай видео & аудио',
                    description: 'HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээлүүд',
                    color: 'from-blue-500 to-blue-600',
                    bgColor: 'from-blue-50 to-blue-100',
                    iconColor: 'text-blue-600',
                    enabled: true,
                    order: 0
                },
                {
                    icon: 'DollarSign',
                    title: 'Уян хатан & хямд үнэ',
                    description: 'Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд',
                    color: 'from-green-500 to-green-600',
                    bgColor: 'from-green-50 to-green-100',
                    iconColor: 'text-green-600',
                    enabled: true,
                    order: 1
                },
                {
                    icon: 'Users',
                    title: 'Мэргэжлийн багш нар',
                    description: 'Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд',
                    color: 'from-purple-500 to-purple-600',
                    bgColor: 'from-purple-50 to-purple-100',
                    iconColor: 'text-purple-600',
                    enabled: true,
                    order: 2
                },
                {
                    icon: 'Clock',
                    title: 'Өөрийн хурдаар суралцах',
                    description: 'Хугацаа, байршлаас үл хамааран, өөрийн хурдаар суралцаарай',
                    color: 'from-orange-500 to-orange-600',
                    bgColor: 'from-orange-50 to-orange-100',
                    iconColor: 'text-orange-600',
                    enabled: true,
                    order: 3
                }
            ]
            
            whyUsDoc = new WhyUs({ items: defaultItems })
            await whyUsDoc.save()
            console.log('✅ Created default why-us data in database')
        }

        return NextResponse.json({
            success: true,
            data: whyUsDoc.items
        })
    } catch (error) {
        console.error('Error fetching why-us data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch why-us data' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        await connectDB()
        
        // Check admin session
        const adminSession = request.cookies.get('admin-session')?.value
        if (!adminSession) {
            return NextResponse.json(
                { success: false, error: 'No admin session found' },
                { status: 401 }
            )
        }

        // Verify the JWT token
        const decoded = verify(adminSession, process.env.NEXTAUTH_SECRET || 'fallback-secret') as any
        if (!decoded || !decoded.isAdmin) {
            return NextResponse.json(
                { success: false, error: 'Invalid admin session' },
                { status: 401 }
            )
        }

        // Verify user still exists and has admin role
        const user = await User.findById(decoded.userId).select('role')
        if (!user || user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Admin access required' },
                { status: 403 }
            )
        }
        
        const body = await request.json()
        const { data } = body

        if (!data || !Array.isArray(data)) {
            return NextResponse.json(
                { success: false, error: 'Invalid data' },
                { status: 400 }
            )
        }

        // Add order field to each item if missing
        const itemsWithOrder = data.map((item, index) => ({
            ...item,
            order: item.order || index
        }))

        // Update or create why-us document
        const result = await WhyUs.findOneAndUpdate(
            {}, // Find any existing document
            { 
                items: itemsWithOrder,
                updatedAt: new Date()
            },
            { 
                new: true, 
                upsert: true // Create if doesn't exist
            }
        )

        console.log('✅ Why-us data saved to database:', result.items.length, 'items')

        return NextResponse.json({
            success: true,
            message: 'Why us section updated successfully',
            data: result.items
        })
    } catch (error) {
        console.error('Error updating why-us data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update why-us data' },
            { status: 500 }
        )
    }
}
