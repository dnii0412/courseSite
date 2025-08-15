import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for the "Why us?" section data
let whyUsData = [
    {
        id: '1',
        icon: 'Video',
        title: 'Чанартай видео & аудио',
        description: 'HD чанартай видео, тод аудио, мөн интерактив элементүүдтэй хичээлүүд',
        color: 'from-blue-500 to-blue-600',
        bgColor: 'from-blue-50 to-blue-100',
        iconColor: 'text-blue-600',
        enabled: true
    },
    {
        id: '2',
        icon: 'DollarSign',
        title: 'Уян хатан & хямд үнэ',
        description: 'Өөр өөр төлөвлөгөөтэй, таны хэмжээнд тохирсон үнэтэй сургалтууд',
        color: 'from-green-500 to-green-600',
        bgColor: 'from-green-50 to-green-100',
        iconColor: 'text-green-600',
        enabled: true
    },
    {
        id: '3',
        icon: 'Users',
        title: 'Мэргэжлийн багш нар',
        description: 'Тус салбарын мэргэжлийн багш нартай, практик туршлагатай сургалтууд',
        color: 'from-purple-500 to-purple-600',
        bgColor: 'from-purple-50 to-purple-100',
        iconColor: 'text-purple-600',
        enabled: true
    },
    {
        id: '4',
        icon: 'Clock',
        title: 'Өөрийн хурдаар суралцах',
        description: 'Хугацаа, байршлаас үл хамааран, өөрийн хурдаар суралцаарай',
        color: 'from-orange-500 to-orange-600',
        bgColor: 'from-orange-50 to-orange-100',
        iconColor: 'text-orange-600',
        enabled: true
    }
]

export async function GET() {
    try {
        return NextResponse.json({
            success: true,
            data: whyUsData
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
        const body = await request.json()
        const { data } = body

        if (!data || !Array.isArray(data)) {
            return NextResponse.json(
                { success: false, error: 'Invalid data' },
                { status: 400 }
            )
        }

        // Update the data
        whyUsData = data

        return NextResponse.json({
            success: true,
            message: 'Why us section updated successfully',
            data: whyUsData
        })
    } catch (error) {
        console.error('Error updating why-us data:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update why-us data' },
            { status: 500 }
        )
    }
}
