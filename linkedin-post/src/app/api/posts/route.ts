import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getPostsByUserId } from "@/lib/database"

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const userData = cookieStore.get("user_data")

    if (!userData) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const user = JSON.parse(userData.value)

    const posts = await getPostsByUserId(user.id)

    const transformedPosts = posts.map((post) => ({
      id: post.id,
      content: post.content,
      status: post.status,
      createdAt: post.created_at,
      publishedAt: post.status === "published" ? post.updated_at : undefined,
      linkedinUrl: post.linkedin_url,
      errorMessage: post.error_message,
    }))

    return NextResponse.json(transformedPosts)
  } catch (error) {
    console.error("Fetch posts error:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
