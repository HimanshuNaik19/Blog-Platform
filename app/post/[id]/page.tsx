"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import ReactMarkdown from "react-markdown"
import type { BlogPost, Comment } from "@/types/blog"
import { BlogService } from "@/services/blog-service"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, User, Edit, Trash2, MessageCircle } from "lucide-react"

export default function PostPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return

      try {
        const [fetchedPost, fetchedComments] = await Promise.all([
          BlogService.getPostById(params.id as string),
          BlogService.getComments(params.id as string),
        ])

        setPost(fetchedPost)
        setComments(fetchedComments)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleDeletePost = async () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return

    try {
      await BlogService.deletePost(post.id)
      router.push("/")
    } catch (error) {
      console.error("Error deleting post:", error)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user || !post) return

    setIsSubmittingComment(true)
    try {
      const comment = await BlogService.addComment({
        postId: post.id,
        author: user.username,
        text: newComment.trim(),
      })

      setComments([...comments, comment])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const canEditPost = user && post && (user.id === post.author.id || user.role === "admin")

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto">
        <Alert>
          <AlertDescription>Post not found.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <article>
        <header className="space-y-4 mb-8">
          <h1 className="text-4xl font-bold">{post.title}</h1>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-muted-foreground">
              <div className="flex items-center space-x-1">
                <User className="h-4 w-4" />
                <span>{post.author.username}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(post.createdAt)}</span>
              </div>
            </div>

            {canEditPost && (
              <div className="flex items-center space-x-2">
                <Link href={`/edit/${post.id}`}>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Button variant="destructive" size="sm" onClick={handleDeletePost}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </header>

        <div className="prose prose-lg max-w-none">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <section className="space-y-6">
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <h2 className="text-2xl font-bold">Comments ({comments.length})</h2>
        </div>

        {isAuthenticated ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add a Comment</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitComment} className="space-y-4">
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={4}
                />
                <Button type="submit" disabled={isSubmittingComment || !newComment.trim()}>
                  {isSubmittingComment ? "Posting..." : "Post Comment"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                <Link href="/login" className="text-primary hover:underline">
                  Login
                </Link>{" "}
                to join the discussion
              </p>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{comment.author}</span>
                  <span className="text-sm text-muted-foreground">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-muted-foreground">{comment.text}</p>

                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                    {comment.replies.map((reply) => (
                      <div key={reply.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-sm">{reply.author}</span>
                          <span className="text-xs text-muted-foreground">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {comments.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">No comments yet. Be the first to share your thoughts!</p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  )
}
