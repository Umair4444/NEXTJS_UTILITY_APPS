import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createPost } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userData = cookieStore.get("user_data")

    if (!userData) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const user = JSON.parse(userData.value)

    const post = await createPost(user.id, content, "draft")

    return NextResponse.json({
      success: true,
      post: {
        id: post.id,
        content: post.content,
        status: post.status,
        createdAt: post.created_at,
      },
      message: "Draft saved successfully",
    })
  } catch (error) {
    console.error("Save draft error:", error)
    return NextResponse.json({ error: "Failed to save draft" }, { status: 500 })
  }
}
