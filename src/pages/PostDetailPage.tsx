"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { postsAPI, commentsAPI, type BlogPost, type Comment } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import { CommentSection } from "../components/CommentSection"
import "./PostDetailPage.css"

export function PostDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return

      try {
        const [postData, commentsData] = await Promise.all([postsAPI.getPostById(id), commentsAPI.getComments(id)])

        setPost(postData)
        setComments(commentsData)
      } catch (err) {
        setError("Failed to load post")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleDeletePost = async () => {
    if (!post || !window.confirm("Are you sure you want to delete this post?")) return

    try {
      await postsAPI.deletePost(post._id)
      navigate("/")
    } catch (err) {
      console.error("Error deleting post:", err)
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

  const canEditPost = user && post && (user.id === post.author._id || user.role === "admin")

  if (loading) {
    return <div className="loading">Loading post...</div>
  }

  if (error || !post) {
    return <div className="error">{error || "Post not found"}</div>
  }

  return (
    <div className="post-detail">
      <article className="post-content">
        <header className="post-header">
          <h1 className="post-title">{post.title}</h1>

          <div className="post-meta">
            <div className="meta-info">
              <span className="author">By {post.author.username}</span>
              <span className="date">{formatDate(post.createdAt)}</span>
            </div>

            {canEditPost && (
              <div className="post-actions">
                <Link to={`/edit/${post._id}`} className="btn-secondary">
                  Edit Post
                </Link>
                <button onClick={handleDeletePost} className="btn-danger">
                  Delete Post
                </button>
              </div>
            )}
          </div>

          <div className="post-tags">
            {post.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </header>

        <div className="post-body">
          <ReactMarkdown>{post.content}</ReactMarkdown>
        </div>
      </article>

      <CommentSection
        postId={post._id}
        comments={comments}
        onCommentAdded={(newComment) => setComments([...comments, newComment])}
      />
    </div>
  )
}
