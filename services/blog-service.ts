import type { BlogPost, Comment } from "@/types/blog"

// Mock data
const mockPosts: BlogPost[] = [
  {
    id: "1",
    title: "Getting Started with React and TypeScript",
    content: `# Getting Started with React and TypeScript

React and TypeScript make a powerful combination for building robust web applications. In this post, we'll explore how to set up a new project and leverage TypeScript's type safety.

## Why TypeScript?

TypeScript provides several benefits:
- **Type Safety**: Catch errors at compile time
- **Better IDE Support**: Enhanced autocomplete and refactoring
- **Improved Documentation**: Types serve as documentation

## Setting Up Your Project

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

This creates a new React project with TypeScript configured out of the box.

## Conclusion

TypeScript and React work beautifully together to create maintainable, scalable applications.`,
    excerpt: "Learn how to combine React with TypeScript for better development experience and type safety.",
    author: {
      id: "2",
      username: "John Author",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["React", "TypeScript", "JavaScript"],
  },
  {
    id: "2",
    title: "Building RESTful APIs with Node.js and Express",
    content: `# Building RESTful APIs with Node.js and Express

Creating robust APIs is essential for modern web development. Let's explore how to build a RESTful API using Node.js and Express.

## What is REST?

REST (Representational State Transfer) is an architectural style for designing networked applications. It uses standard HTTP methods:

- **GET**: Retrieve data
- **POST**: Create new resources
- **PUT**: Update existing resources
- **DELETE**: Remove resources

## Setting Up Express

\`\`\`javascript
const express = require('express');
const app = express();

app.use(express.json());

app.get('/api/posts', (req, res) => {
  res.json({ posts: [] });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
\`\`\`

## Best Practices

1. Use proper HTTP status codes
2. Implement error handling
3. Add authentication and authorization
4. Document your API

Building good APIs takes practice, but following REST principles will help you create maintainable and scalable services.`,
    excerpt: "A comprehensive guide to building RESTful APIs using Node.js and Express framework.",
    author: {
      id: "1",
      username: "Admin User",
    },
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z",
    tags: ["Node.js", "Express", "API", "Backend"],
  },
]

const mockComments: Comment[] = [
  {
    id: "1",
    postId: "1",
    author: "Jane Developer",
    text: "Great introduction to TypeScript! I found the setup instructions very helpful.",
    createdAt: "2024-01-16T09:00:00Z",
    replies: [
      {
        id: "2",
        postId: "1",
        author: "John Author",
        text: "Thanks! I'm glad you found it useful. Let me know if you have any questions.",
        createdAt: "2024-01-16T10:00:00Z",
      },
    ],
  },
]

export class BlogService {
  static async getAllPosts(): Promise<BlogPost[]> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    const stored = localStorage.getItem("blog_posts")
    if (stored) {
      return JSON.parse(stored)
    }

    localStorage.setItem("blog_posts", JSON.stringify(mockPosts))
    return mockPosts
  }

  static async getPostById(id: string): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const posts = await this.getAllPosts()
    return posts.find((post) => post.id === id) || null
  }

  static async createPost(post: Omit<BlogPost, "id" | "createdAt" | "updatedAt">): Promise<BlogPost> {
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newPost: BlogPost = {
      ...post,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const posts = await this.getAllPosts()
    const updatedPosts = [newPost, ...posts]
    localStorage.setItem("blog_posts", JSON.stringify(updatedPosts))

    return newPost
  }

  static async updatePost(id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const posts = await this.getAllPosts()
    const postIndex = posts.findIndex((post) => post.id === id)

    if (postIndex === -1) return null

    posts[postIndex] = {
      ...posts[postIndex],
      ...updates,
      updatedAt: new Date().toISOString(),
    }

    localStorage.setItem("blog_posts", JSON.stringify(posts))
    return posts[postIndex]
  }

  static async deletePost(id: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400))

    const posts = await this.getAllPosts()
    const filteredPosts = posts.filter((post) => post.id !== id)

    localStorage.setItem("blog_posts", JSON.stringify(filteredPosts))
    return true
  }

  static async getComments(postId: string): Promise<Comment[]> {
    await new Promise((resolve) => setTimeout(resolve, 300))

    const stored = localStorage.getItem("blog_comments")
    const comments = stored ? JSON.parse(stored) : mockComments

    return comments.filter((comment: Comment) => comment.postId === postId)
  }

  static async addComment(comment: Omit<Comment, "id" | "createdAt">): Promise<Comment> {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    const stored = localStorage.getItem("blog_comments")
    const comments = stored ? JSON.parse(stored) : mockComments
    const updatedComments = [...comments, newComment]

    localStorage.setItem("blog_comments", JSON.stringify(updatedComments))
    return newComment
  }
}
