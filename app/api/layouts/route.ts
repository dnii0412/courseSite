import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { Layout } from '@/lib/models/layout';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// GET - List all layouts (admin) or get published layout by slug (public)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const admin = searchParams.get('admin');
    
    if (slug) {
      // Get specific layout by slug
      const layout = await Layout.findOne({ slug });
      
      if (!layout) {
        return NextResponse.json(
          { success: false, error: 'Layout not found' },
          { status: 404 }
        );
      }
      
      // If not admin, only return published layouts
      if (admin !== 'true') {
        if (!layout.published) {
          return NextResponse.json(
            { success: false, error: 'Layout not published' },
            { status: 404 }
          );
        }
      }
      
      return NextResponse.json({ success: true, data: layout });
    }
    
    // List all layouts (admin only)
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const layouts = await Layout.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: layouts });
    
  } catch (error) {
    console.error('Error fetching layouts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch layouts' },
      { status: 500 }
    );
  }
}

// POST - Create new layout
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { slug, items, breakpoints, published } = body;

    // Validate required fields
    if (!slug || !items) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if layout already exists
    const existingLayout = await Layout.findOne({ slug });
    if (existingLayout) {
      return NextResponse.json(
        { success: false, error: 'Layout with this slug already exists' },
        { status: 409 }
      );
    }

    // Create new layout
    const layout = new Layout({
      slug,
      items,
      breakpoints,
      published: published || false
    });

    await layout.save();

    return NextResponse.json({ success: true, data: layout });
  } catch (error) {
    console.error('Error creating layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create layout' },
      { status: 500 }
    );
  }
}

// PATCH - Update layout
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();
    
    const body = await request.json();
    const { id, items, breakpoints, published } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Layout ID required' },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (items !== undefined) updateData.items = items;
    if (breakpoints !== undefined) updateData.breakpoints = breakpoints;
    if (published !== undefined) updateData.published = published;

    const layout = await Layout.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!layout) {
      return NextResponse.json(
        { success: false, error: 'Layout not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: layout });
  } catch (error) {
    console.error('Error updating layout:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update layout' },
      { status: 500 }
    );
  }
}
