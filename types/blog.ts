export interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    username: string
  }
  createdAt: string
  updatedAt: string
  tags: string[]
}

export interface Comment {
  id: string
  postId: string
  author: string
  text: string
  createdAt: string
  replies?: Comment[]
}
