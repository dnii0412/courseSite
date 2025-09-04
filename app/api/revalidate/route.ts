import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"

// POST /api/revalidate - Revalidate specific paths
export async function POST(request: NextRequest) {
    try {
        const { path } = await request.json()

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 })
        }

        // Revalidate the specified path
        revalidatePath(path)

        return NextResponse.json({
            success: true,
            message: `Path ${path} revalidated successfully`,
            revalidated: true,
            now: Date.now()
        })
    } catch (error) {
        console.error("Revalidation error:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}
