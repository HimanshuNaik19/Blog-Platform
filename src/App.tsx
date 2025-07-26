import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { Layout } from "./components/Layout"
import { HomePage } from "./pages/HomePage"
import { LoginPage } from "./pages/LoginPage"
import { RegisterPage } from "./pages/RegisterPage"
import { PostDetailPage } from "./pages/PostDetailPage"
import { CreatePostPage } from "./pages/CreatePostPage"
import { EditPostPage } from "./pages/EditPostPage"
import { ProtectedRoute } from "./components/ProtectedRoute"
import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route
              path="/create"
              element={
                <ProtectedRoute requiredRoles={["admin", "author"]}>
                  <CreatePostPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit/:id"
              element={
                <ProtectedRoute>
                  <EditPostPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  )
}

export default App
