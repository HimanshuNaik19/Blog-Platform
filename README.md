# Blog Platform

A modern, responsive React frontend for the MERN Stack Blog Platform. This application provides a clean, intuitive interface for reading, creating, and managing blog posts.

## 🚀 Features

### Core Functionality
- **User Authentication**: Login/Register with JWT tokens
- **Blog Management**: Create, read, update, and delete blog posts
- **Rich Text Editor**: Markdown editor with live preview
- **Comment System**: Interactive commenting with nested replies
- **Role-Based Access**: Different permissions for Admin/Author/User roles
- **Responsive Design**: Mobile-first, fully responsive layout

### User Experience
- **Clean UI**: Modern, minimalist design
- **Fast Navigation**: React Router for smooth page transitions
- **Loading States**: Proper loading indicators and error handling
- **Real-time Preview**: Live markdown preview while writing
- **Tag System**: Organize posts with tags

## 🛠 Tech Stack

- **React 18** - Modern React with hooks
- **React Router 6** - Client-side routing
- **TypeScript** - Type safety and better development experience
- **React Markdown** - Markdown rendering
- **CSS3** - Custom styling with modern CSS features
- **Fetch API** - HTTP client for API communication

## 📁 Project Structure

\`\`\`
src/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout with navigation
│   ├── PostCard.tsx    # Blog post preview cards
│   ├── CommentSection.tsx # Comment display and form
│   └── ProtectedRoute.tsx # Route protection
├── contexts/           # React contexts
│   └── AuthContext.tsx # Authentication state management
├── pages/              # Page components
│   ├── HomePage.tsx    # Blog post listing
│   ├── LoginPage.tsx   # User login
│   ├── RegisterPage.tsx # User registration
│   ├── PostDetailPage.tsx # Individual post view
│   ├── CreatePostPage.tsx # Post creation
│   └── EditPostPage.tsx # Post editing
├── services/           # API service layer
│   └── api.ts         # HTTP client and API calls
└── App.tsx            # Main application component
\`\`\`

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ and npm
- Running Express.js backend server

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd blog-platform-frontend
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Environment Setup**
   Create a \`.env\` file in the root directory:
   \`\`\`
   REACT_APP_API_URL=http://localhost:5000/api
   \`\`\`

4. **Start the development server**
   \`\`\`bash
   npm start
   \`\`\`

The application will open at \`http://localhost:3000\`

## 🔌 API Integration

The frontend communicates with the Express.js backend through a service layer (\`src/services/api.ts\`) that handles:

### Authentication Endpoints
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/register\` - User registration
- \`GET /api/auth/verify\` - Token verification

### Blog Post Endpoints
- \`GET /api/posts\` - Fetch all posts
- \`GET /api/posts/:id\` - Fetch single post
- \`POST /api/posts\` - Create new post
- \`PUT /api/posts/:id\` - Update post
- \`DELETE /api/posts/:id\` - Delete post

### Comment Endpoints
- \`GET /api/comments/:postId\` - Fetch post comments
- \`POST /api/comments/:postId\` - Add new comment

## 🎨 Styling

The application uses custom CSS with a modern design system:

- **Color Palette**: Professional blue and gray tones
- **Typography**: System fonts for optimal readability
- **Layout**: CSS Grid and Flexbox for responsive design
- **Components**: Modular CSS with component-specific stylesheets
- **Responsive**: Mobile-first approach with breakpoints

## 🔐 Authentication Flow

1. User logs in or registers
2. JWT token received and stored in localStorage
3. Token included in API request headers
4. Protected routes check authentication status
5. Role-based access control for admin/author features

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Adapted for tablets (768px+)
- **Desktop**: Full desktop experience (1024px+)

## 🚀 Deployment

### Build for Production
\`\`\`bash
npm run build
\`\`\`

### Deployment Options
- **Vercel**: Connect GitHub repo for automatic deployments
- **Netlify**: Drag and drop build folder or connect repo
- **AWS S3**: Static website hosting
- **GitHub Pages**: Free hosting for public repositories

## 🧪 Testing

Run the test suite:
\`\`\`bash
npm test
\`\`\`

## 📈 Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Service worker for offline functionality
- **Bundle Analysis**: Webpack bundle analyzer for optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit your changes (\`git commit -m 'Add amazing feature'\`)
4. Push to the branch (\`git push origin feature/amazing-feature\`)
5. Open a Pull Request

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the API endpoints in the backend documentation

---
\`\`\`
