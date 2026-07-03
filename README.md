# 🌟 LuminaBlog

LuminaBlog is a modern full-stack blogging platform built with **React + Vite** and powered by **Appwrite** as the backend service.
It provides a smooth and responsive blogging experience with authentication, rich text editing, post management, and interactive engagement features like likes.

Designed with a clean UI and responsive layout, LuminaBlog works seamlessly across desktop, tablet, and mobile devices.

---

# 🚀 Features

## 🔐 Authentication

- User Signup & Login
- Secure Authentication using Appwrite
- Protected Routes
- Session Management

## 📝 Blog Management

- Create Blog Posts
- Edit Existing Posts
- Delete Posts
- View Individual Posts
- View All Posts
- Manage Personal Posts

## ❤️ Engagement Features

- Like Button Functionality
- Interactive UI Components
- Smooth User Experience

## ✨ Rich Text Editing

- TinyMCE Rich Text Editor Integration
- Styled Blog Content
- HTML Parsing for Post Rendering

## 🎨 UI & UX

- Fully Responsive Design
- Modern and Clean Interface
- Reusable UI Components
- Toast Notifications
- Animated Buttons & Interactive Elements

## ⚡ Performance

- Built with Vite for blazing-fast development
- Optimized React Component Structure
- Redux Toolkit for state management

---

# 🛠️ Tech Stack

## Frontend

- React 19
- Vite
- Tailwind CSS
- React Router DOM
- Redux Toolkit
- React Redux

## Backend

- Appwrite

## UI Libraries

- Material UI
- Radix UI
- Lucide React Icons

## Forms & Editor

- React Hook Form
- TinyMCE Rich Text Editor

## Utilities

- React Toastify
- HTML React Parser

---

# 📂 Folder Structure

```bash
📁 LuminaBlog
├── 📁 public
│   ├── favicon.svg
│   └── icons.svg
│
├── 📁 src
│   ├── 📁 appwrite
│   │   ├── auth.js
│   │   └── config.js
│   │
│   ├── 📁 components
│   │   ├── 📁 container
│   │   ├── 📁 Editor
│   │   ├── 📁 Footer
│   │   ├── 📁 Header
│   │   ├── 📁 Layout
│   │   ├── 📁 postCard
│   │   ├── 📁 postForm
│   │   └── 📁 ui
│   │
│   ├── 📁 conf
│   │   └── conf.js
│   │
│   ├── 📁 features
│   │   └── 📁 auth
│   │
│   ├── 📁 pages
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── MakePost.jsx
│   │   ├── EditPost.jsx
│   │   ├── ViewPost.jsx
│   │   ├── ViewAllPost.jsx
│   │   └── MyPosts.jsx
│   │
│   ├── 📁 store
│   │   └── store.js
│   │
│   ├── 📁 utils
│   │   ├── notify.js
│   │   └── index.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── package.json
├── vite.config.js
└── README.md
```

---

# 📦 Installation

## 1️⃣ Clone the Repository

```bash
git clone https://github.com/am-aayush/LuminaBlog.git
```

## 2️⃣ Navigate to Project Directory

```bash
cd LuminaBlog
```

## 3️⃣ Install Dependencies

```bash
npm install
```

## 4️⃣ Configure Environment Variables

Create a `.env` file in the root directory and add:

```env
VITE_APPWRITE_URL=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_COLLECTION_ID=your_collection_id
VITE_APPWRITE_BUCKET_ID=your_bucket_id
VITE_TINY_API_KEY=your_tinymc_id
VITE_APPWRITE_DEV_KEY=your_appwrite_developement_key
```

---

# ▶️ Running the Project

## Development Server

```bash
npm run dev
```

The app will run on:

```bash
http://localhost:5173
```

---

# 🧩 Dependencies

```json
{
  "@mui/material": "7.3.5",
  "@radix-ui/react-accordion": "1.2.3",
  "@radix-ui/react-alert-dialog": "1.1.6",
  "@reduxjs/toolkit": "^2.12.0",
  "@tailwindcss/vite": "^4.3.2",
  "@tinymce/tinymce-react": "^6.3.0",
  "appwrite": "^26.1.0",
  "html-react-parser": "^6.1.3",
  "lucide-react": "0.487.0",
  "react": "^19.2.7",
  "react-dom": "^19.2.7",
  "react-hook-form": "^7.80.0",
  "react-redux": "^9.3.0",
  "react-router-dom": "^7.18.1",
  "react-toastify": "^11.1.0",
  "tailwindcss": "^4.3.2"
}
```

---

# 🔥 Core Functionalities

## 👤 Authentication

- Signup
- Login
- Logout
- Persistent Authentication State

## 📰 Blog Features

- Create Post
- Edit Post
- Delete Post
- Read Post
- View All Posts
- User Specific Posts

## ❤️ Like System

- Interactive Like Button
- Better User Engagement

## 📱 Responsive Design

- Mobile Friendly
- Tablet Optimized
- Desktop Ready

---

# 🧠 State Management

Redux Toolkit is used for:

- Authentication State
- Global App State Handling
- Cleaner and Scalable Architecture

---

# 🎨 UI Components

Reusable UI components include:

- Buttons
- Inputs
- Select Menus
- Avatar
- Category Badges
- Glow Buttons

---

# 🚀 Future Improvements

- Comment System
- Dark Mode
- Bookmark Posts
- User Profiles
- Search Functionality
- Tags & Categories
- Markdown Support
- Real-time Notifications

---

# 🤝 Contributing

Contributions are welcome!

## Steps:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---

# 📄 License

This project is licensed under the MIT License.

---

# 👨‍💻 Author

Developed with ❤️ by **Aayush**

---

# ⭐ Support

If you like this project, give it a ⭐ on GitHub and share it with others.
