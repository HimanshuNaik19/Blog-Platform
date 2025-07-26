"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

interface User {
  id: string
  username: string
  email: string
  role: "admin" | "author" | "user"
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (username: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem("blog_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAuthenticated(true)
    }
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication - in real app, this would call your API
    if (email === "admin@blog.com" && password === "admin123") {
      const userData = {
        id: "1",
        username: "Admin User",
        email: "admin@blog.com",
        role: "admin" as const,
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("blog_user", JSON.stringify(userData))
      return true
    } else if (email === "author@blog.com" && password === "author123") {
      const userData = {
        id: "2",
        username: "John Author",
        email: "author@blog.com",
        role: "author" as const,
      }
      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem("blog_user", JSON.stringify(userData))
      return true
    }
    return false
  }

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const userData = {
      id: Date.now().toString(),
      username,
      email,
      role: "user" as const,
    }
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem("blog_user", JSON.stringify(userData))
    return true
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem("blog_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isAuthenticated }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
