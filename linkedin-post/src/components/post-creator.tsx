"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/components/auth-provider"
import { useToast } from "@/hooks/use-toast"
import { Send, Eye, Save, Loader2 } from "lucide-react"

const MAX_CHARACTERS = 3000

export function PostCreator() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [content, setContent] = useState("")
  const [isPublishing, setIsPublishing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const characterCount = content.length
  const isOverLimit = characterCount > MAX_CHARACTERS
  const charactersRemaining = MAX_CHARACTERS - characterCount

  const handlePublish = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content for your post.",
        variant: "destructive",
      })
      return
    }

    if (isOverLimit) {
      toast({
        title: "Error",
        description: "Your post exceeds the character limit.",
        variant: "destructive",
      })
      return
    }

    setIsPublishing(true)
    try {
      const response = await fetch("/api/posts/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to publish post")
      }

      toast({
        title: "Success!",
        description: "Your post has been published to LinkedIn.",
      })

      setContent("")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish post. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPublishing(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter some content to save as draft.",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch("/api/posts/draft", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) {
        throw new Error("Failed to save draft")
      }

      toast({
        title: "Draft Saved",
        description: "Your post has been saved as a draft.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Post</CardTitle>
          <CardDescription>Write and publish your professional content to LinkedIn</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Textarea
              placeholder="What's on your mind? Share your professional insights, achievements, or industry thoughts..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] resize-none"
            />
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Badge variant={isOverLimit ? "destructive" : charactersRemaining < 100 ? "secondary" : "outline"}>
                  {charactersRemaining} characters remaining
                </Badge>
              </div>
              <div className="text-muted-foreground">
                {characterCount}/{MAX_CHARACTERS}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button onClick={() => setShowPreview(!showPreview)} variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? "Hide Preview" : "Preview"}
            </Button>
            <Button onClick={handleSaveDraft} variant="outline" size="sm" disabled={isSaving || !content.trim()}>
              {isSaving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              Save Draft
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing || !content.trim() || isOverLimit}
              className="bg-secondary hover:bg-secondary/90"
            >
              {isPublishing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
              Publish to LinkedIn
            </Button>
          </div>
        </CardContent>
      </Card>

      {showPreview && content.trim() && (
        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How your post will appear on LinkedIn</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-card">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.picture || "/placeholder.svg"} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("") || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div>
                    <p className="font-semibold text-sm">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">Professional • Now</p>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{content}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
