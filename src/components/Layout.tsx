"use client"

import type { ReactNode } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Layout.css"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <div className="app">
      <header className="header">
        <nav className="nav">
          <Link to="/" className="logo">
            <span className="logo-icon">📝</span>
            BlogPlatform
          </Link>

          <div className="nav-links">
            <Link to="/" className="nav-link">
              Home
            </Link>

            {isAuthenticated ? (
              <>
                {(user?.role === "admin" || user?.role === "author") && (
                  <Link to="/create" className="nav-link btn-primary">
                    Write Post
                  </Link>
                )}

                <div className="user-menu">
                  <span className="user-name">Welcome, {user?.username}</span>
                  <button onClick={handleLogout} className="btn-secondary">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="auth-links">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="main">{children}</main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 BlogPlatform. Built with React and Express.js</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
