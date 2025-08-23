import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Post {
  id: string
  user_id: string
  content: string
  status: "draft" | "published" | "failed"
  linkedin_post_id?: string
  linkedin_url?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export async function createPost(userId: string, content: string, status: "draft" | "published" = "draft") {
  const result = await sql`
    INSERT INTO posts (user_id, content, status)
    VALUES (${userId}, ${content}, ${status})
    RETURNING *
  `
  return result[0] as Post
}

export async function updatePost(
  id: string,
  updates: Partial<Omit<Post, "id" | "user_id" | "created_at" | "updated_at">>,
) {
  const setClause = Object.keys(updates)
    .map((key, index) => `${key} = $${index + 2}`)
    .join(", ")

  const values = [id, ...Object.values(updates)]

  const result = await sql`
    UPDATE posts 
    SET ${sql.unsafe(setClause)}
    WHERE id = ${id}
    RETURNING *
  `
  return result[0] as Post
}

export async function getPostsByUserId(userId: string) {
  const result = await sql`
    SELECT * FROM posts 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
  `
  return result as Post[]
}

export async function getPostById(id: string) {
  const result = await sql`
    SELECT * FROM posts 
    WHERE id = ${id}
    LIMIT 1
  `
  return result[0] as Post | undefined
}

export async function deletePost(id: string, userId: string) {
  const result = await sql`
    DELETE FROM posts 
    WHERE id = ${id} AND user_id = ${userId}
    RETURNING *
  `
  return result[0] as Post | undefined
}
