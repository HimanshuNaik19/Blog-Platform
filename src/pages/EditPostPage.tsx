"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { postsAPI, type BlogPost } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "./PostEditor.css"

export function EditPostPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [post, setPost] = useState<BlogPost | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return

      try {
        const postData = await postsAPI.getPostById(id)

        // Check if user can edit this post
        if (user?.id !== postData.author._id && user?.role !== "admin") {
          navigate("/")
          return
        }

        setPost(postData)
        setTitle(postData.title)
        setContent(postData.content)
        setExcerpt(postData.excerpt)
        setTags(postData.tags.join(", "))
      } catch (err) {
        setError("Failed to load post")
        console.error("Error fetching post:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post) return

    setSaving(true)
    setError("")

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      await postsAPI.updatePost(post._id, {
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.substring(0, 150) + "...",
        tags: tagArray,
      })

      navigate(`/post/${post._id}`)
    } catch (err) {
      setError("Failed to update post. Please try again.")
      console.error("Error updating post:", err)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading post...</div>
  }

  if (error && !post) {
    return <div className="error">{error}</div>
  }

  return (
    <div className="post-editor">
      <div className="editor-header">
        <h1>Edit Post</h1>
        <p>Make changes to your post</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="editor-form">
        <div className="form-section">
          <h2>Post Details</h2>

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your post title"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Brief description of your post"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Enter tags separated by commas"
            />
          </div>
        </div>

        <div className="form-section">
          <div className="content-header">
            <h2>Content</h2>
            <div className="tab-buttons">
              <button
                type="button"
                className={`tab-button ${activeTab === "edit" ? "active" : ""}`}
                onClick={() => setActiveTab("edit")}
              >
                ✏️ Edit
              </button>
              <button
                type="button"
                className={`tab-button ${activeTab === "preview" ? "active" : ""}`}
                onClick={() => setActiveTab("preview")}
              >
                👁️ Preview
              </button>
            </div>
          </div>

          <div className="content-area">
            {activeTab === "edit" ? (
              <div className="edit-tab">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content in Markdown..."
                  rows={20}
                  className="content-editor"
                  required
                />
              </div>
            ) : (
              <div className="preview-tab">
                {content ? (
                  <div className="markdown-preview">
                    <ReactMarkdown>{content}</ReactMarkdown>
                  </div>
                ) : (
                  <p className="preview-placeholder">Start writing to see the preview...</p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(`/post/${post?._id}`)} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={saving || !title.trim() || !content.trim()} className="btn-primary">
            {saving ? "Updating..." : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  )
}
