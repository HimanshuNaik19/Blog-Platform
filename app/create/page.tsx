"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { BlogService } from "@/services/blog-service"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReactMarkdown from "react-markdown"
import { Loader2, Eye, Edit } from "lucide-react"

export default function CreatePostPage() {
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    if (user?.role !== "admin" && user?.role !== "author") {
      router.push("/")
      return
    }
  }, [isAuthenticated, user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError("")

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      await BlogService.createPost({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.substring(0, 150) + "...",
        author: {
          id: user.id,
          username: user.username,
        },
        tags: tagArray,
      })

      router.push("/")
    } catch (err) {
      setError("Failed to create post. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!isAuthenticated || (user?.role !== "admin" && user?.role !== "author")) {
    return null
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground">Share your thoughts and insights with the community</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="excerpt">Excerpt (Optional)</Label>
              <Textarea
                id="excerpt"
                placeholder="Brief description of your post"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="Enter tags separated by commas (e.g., React, JavaScript, Web Development)"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="edit" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="edit" className="flex items-center space-x-2">
                  <Edit className="h-4 w-4" />
                  <span>Edit</span>
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center space-x-2">
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="edit" className="mt-4">
                <Textarea
                  placeholder="Write your post content in Markdown..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={20}
                  className="font-mono"
                  required
                />
                <p className="text-sm text-muted-foreground mt-2">
                  You can use Markdown syntax for formatting. Use # for headings, **bold**, *italic*, etc.
                </p>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="border rounded-md p-4 min-h-[500px]">
                  {content ? (
                    <div className="prose max-w-none">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Start writing to see the preview...</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>

          <Button type="submit" disabled={isLoading || !title.trim() || !content.trim()}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish Post
          </Button>
        </div>
      </form>
    </div>
  )
}
