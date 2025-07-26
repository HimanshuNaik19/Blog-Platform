"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import { postsAPI } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "./PostEditor.css"

export function CreatePostPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError("")

    try {
      const tagArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag)

      await postsAPI.createPost({
        title: title.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || content.substring(0, 150) + "...",
        tags: tagArray,
      })

      navigate("/")
    } catch (err) {
      setError("Failed to create post. Please try again.")
      console.error("Error creating post:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="post-editor">
      <div className="editor-header">
        <h1>Create New Post</h1>
        <p>Share your thoughts and insights with the community</p>
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
              placeholder="Brief description of your post (optional)"
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
              placeholder="Enter tags separated by commas (e.g., React, JavaScript, Web Development)"
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
                <p className="editor-help">
                  💡 You can use Markdown syntax: **bold**, *italic*, # headings, ```code blocks```, etc.
                </p>
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
          <button type="button" onClick={() => navigate("/")} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading || !title.trim() || !content.trim()} className="btn-primary">
            {loading ? "Publishing..." : "Publish Post"}
          </button>
        </div>
      </form>
    </div>
  )
}
