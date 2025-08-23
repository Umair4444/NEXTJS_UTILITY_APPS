import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createPost, updatePost } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("linkedin_token")
    const userData = cookieStore.get("user_data")

    if (!token || !userData) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const user = JSON.parse(userData.value)

    const post = await createPost(user.id, content, "draft")

    try {
      // Publish to LinkedIn
      const linkedinResponse = await fetch("https://api.linkedin.com/v2/ugcPosts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token.value}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          author: `urn:li:person:${user.linkedinId}`,
          lifecycleState: "PUBLISHED",
          specificContent: {
            "com.linkedin.ugc.ShareContent": {
              shareCommentary: {
                text: content,
              },
              shareMediaCategory: "NONE",
            },
          },
          visibility: {
            "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
          },
        }),
      })

      if (!linkedinResponse.ok) {
        const errorData = await linkedinResponse.json()
        console.error("LinkedIn API error:", errorData)

        await updatePost(post.id, {
          status: "failed",
          error_message: errorData.message || "Failed to publish to LinkedIn",
        })

        throw new Error("Failed to publish to LinkedIn")
      }

      const linkedinData = await linkedinResponse.json()

      const updatedPost = await updatePost(post.id, {
        status: "published",
        linkedin_post_id: linkedinData.id,
        linkedin_url: `https://www.linkedin.com/feed/update/${linkedinData.id}`,
      })

      return NextResponse.json({
        success: true,
        post: updatedPost,
        message: "Post published successfully",
      })
    } catch (error) {
      await updatePost(post.id, {
        status: "failed",
        error_message: error instanceof Error ? error.message : "Unknown error",
      })
      throw error
    }
  } catch (error) {
    console.error("Publish error:", error)
    return NextResponse.json({ error: "Failed to publish post" }, { status: 500 })
  }
}
