import { Link } from "react-router-dom"
import type { BlogPost } from "../services/api"
import "./PostCard.css"

interface PostCardProps {
  post: BlogPost
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Link to={`/post/${post._id}`} className="post-card">
      <div className="post-card-content">
        <h3 className="post-title">{post.title}</h3>
        <p className="post-excerpt">{post.excerpt}</p>

        <div className="post-tags">
          {post.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="post-meta">
          <span className="author">By {post.author.username}</span>
          <span className="date">{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </Link>
  )
}
