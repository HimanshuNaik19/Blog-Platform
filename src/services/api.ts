const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Types
export interface BlogPost {
  _id: string
  title: string
  content: string
  excerpt: string
  author: {
    _id: string
    username: string
  }
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface Comment {
  _id: string
  postId: string
  author: string
  text: string
  createdAt: string
  replies?: Comment[]
}

export interface User {
  id: string
  username: string
  email: string
  role: "admin" | "author" | "user"
}

// API Client
class APIClient {
  private getAuthHeaders() {
    const token = localStorage.getItem("token")
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Network error" }))
      throw new Error(error.message || "Request failed")
    }

    return response.json()
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
  }

  async register(username: string, email: string, password: string) {
    return this.request<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password }),
    })
  }

  async verifyToken() {
    return this.request<User>("/auth/verify")
  }

  // Posts endpoints
  async getAllPosts() {
    return this.request<BlogPost[]>("/posts")
  }

  async getPostById(id: string) {
    return this.request<BlogPost>(`/posts/${id}`)
  }

  async createPost(postData: Omit<BlogPost, "_id" | "author" | "createdAt" | "updatedAt">) {
    return this.request<BlogPost>("/posts", {
      method: "POST",
      body: JSON.stringify(postData),
    })
  }

  async updatePost(id: string, postData: Partial<BlogPost>) {
    return this.request<BlogPost>(`/posts/${id}`, {
      method: "PUT",
      body: JSON.stringify(postData),
    })
  }

  async deletePost(id: string) {
    return this.request<{ message: string }>(`/posts/${id}`, {
      method: "DELETE",
    })
  }

  // Comments endpoints
  async getComments(postId: string) {
    return this.request<Comment[]>(`/comments/${postId}`)
  }

  async addComment(postId: string, text: string) {
    return this.request<Comment>(`/comments/${postId}`, {
      method: "POST",
      body: JSON.stringify({ text }),
    })
  }
}

export const authAPI = new APIClient()
export const postsAPI = new APIClient()
export const commentsAPI = new APIClient()
