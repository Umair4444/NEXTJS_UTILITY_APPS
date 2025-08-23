import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { deletePost } from "@/lib/database"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const cookieStore = await cookies()
    const userData = cookieStore.get("user_data")

    if (!userData) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { id } = params
    const user = JSON.parse(userData.value)

    const deletedPost = await deletePost(id, user.id)

    if (!deletedPost) {
      return NextResponse.json({ error: "Post not found or unauthorized" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    })
  } catch (error) {
    console.error("Delete post error:", error)
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 })
  }
}
