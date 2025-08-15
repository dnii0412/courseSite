import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Layout } from '@/lib/models/layout';

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await connectDB();

        const { slug } = params;

        // Get layout by slug
        const layout = await Layout.findOne({ slug, published: true });

        if (!layout) {
            return NextResponse.json(
                { success: false, error: 'Layout not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            layout: layout
        });

    } catch (error) {
        console.error('Error fetching layout:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch layout' },
            { status: 500 }
        );
    }
}
