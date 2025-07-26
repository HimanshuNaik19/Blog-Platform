"use client"

import type React from "react"
import { useState } from "react"
import { commentsAPI, type Comment } from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "./CommentSection.css"

interface CommentSectionProps {
  postId: string
  comments: Comment[]
  onCommentAdded: (comment: Comment) => void
}

export function CommentSection({ postId, comments, onCommentAdded }: CommentSectionProps) {
  const { user, isAuthenticated } = useAuth()
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setLoading(true)
    try {
      const comment = await commentsAPI.addComment(postId, newComment.trim())
      onCommentAdded(comment)
      setNewComment("")
    } catch (err) {
      console.error("Error adding comment:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <section className="comment-section">
      <h2 className="comments-title">💬 Comments ({comments.length})</h2>

      {isAuthenticated ? (
        <form onSubmit={handleSubmitComment} className="comment-form">
          <div className="form-group">
            <label htmlFor="comment">Add your comment</label>
            <textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              required
            />
          </div>
          <button type="submit" disabled={loading || !newComment.trim()} className="btn-primary">
            {loading ? "Posting..." : "Post Comment"}
          </button>
        </form>
      ) : (
        <div className="login-prompt">
          <p>
            Please <a href="/login">login</a> to join the discussion.
          </p>
        </div>
      )}

      <div className="comments-list">
        {comments.length === 0 ? (
          <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <div className="comment-header">
                <span className="comment-author">{comment.author}</span>
                <span className="comment-date">{formatDate(comment.createdAt)}</span>
              </div>
              <div className="comment-text">{comment.text}</div>

              {comment.replies && comment.replies.length > 0 && (
                <div className="comment-replies">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="comment reply">
                      <div className="comment-header">
                        <span className="comment-author">{reply.author}</span>
                        <span className="comment-date">{formatDate(reply.createdAt)}</span>
                      </div>
                      <div className="comment-text">{reply.text}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </section>
  )
}
