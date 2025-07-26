"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { postsAPI, type BlogPost } from "../services/api"
import { PostCard } from "../components/PostCard"
import "./HomePage.css"

export function HomePage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await postsAPI.getAllPosts()
        setPosts(fetchedPosts)
      } catch (err) {
        setError("Failed to load posts")
        console.error("Error fetching posts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <div className="home-page">
        <div className="hero">
          <h1>Welcome to BlogPlatform</h1>
          <p>Discover amazing stories and insights from our community</p>
        </div>
        <div className="loading">Loading posts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="home-page">
        <div className="hero">
          <h1>Welcome to BlogPlatform</h1>
          <p>Discover amazing stories and insights from our community</p>
        </div>
        <div className="error">{error}</div>
      </div>
    )
  }

  return (
    <div className="home-page">
      <div className="hero">
        <h1>Welcome to BlogPlatform</h1>
        <p>Discover amazing stories and insights from our community of writers</p>
      </div>

      <div className="posts-section">
        <h2>Latest Posts</h2>

        {posts.length === 0 ? (
          <div className="no-posts">
            <p>No posts available yet.</p>
            <Link to="/create" className="btn-primary">
              Write the first post
            </Link>
          </div>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
