import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ProtectedRoute } from "../components/ProtectedRoute";
import SignIn from "../components/signin/SignIn";
import SignUp from "../components/signup/SignUp";
import News from "../components/news/News";
import Blogs from "../components/blogs/Blogs";
import LandingPage from "../components/landing/LandingPage";
import { Toaster, toast } from "react-hot-toast";
import { useUser } from "../contexts/UserContext";

function App() {
  const { currUser } = useAuth();
  const { userData, addBlog, deleteBlog, updateBlog } = useUser();
  const [showNews, setShowNews] = useState(true);
  const [showBlogs, setShowBlogs] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleBackToNews = () => {
    setShowNews(true);
    setShowBlogs(false);
    setIsEditing(false);
    setSelectedBlog(null);
  };

  const handleShowBlogs = () => {
    setShowNews(false);
    setShowBlogs(true);
  };

  const handleCreateBlog = async (newBlog, isEdit) => {
    if (isEdit && selectedBlog) {
      await updateBlog(selectedBlog.id, newBlog);
    } else {
      await addBlog(newBlog.title, newBlog.content, newBlog.image);
    }

    setIsEditing(false);
    setSelectedBlog(null);
  };

  const handleEditingBlog = (blog) => {
    setSelectedBlog(blog);
    setIsEditing(true);
    setShowNews(false);
    setShowBlogs(true);
  };

  const handleDeleteBlog = async (blogToDelete) => {
    if (!blogToDelete?.id) return;

    toast(
      (t) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <p style={{ fontSize: "1.3rem", fontWeight: "semibold" }}>
            Are you sure you want to delete this post?
          </p>
          <div>
            <button
              className="confirm-btn"
              style={{ marginRight: "1rem" }}
              onClick={async () => {
                toast.dismiss(t.id);
                await deleteBlog(blogToDelete.id);
                toast.success("Blog post deleted successfully!");
              }}
            >
              Yes
            </button>
            <button className="confirm-btn" onClick={() => toast.dismiss(t.id)}>
              No
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  return (
    <BrowserRouter>
      <div className="container">
        <Toaster
          containerStyle={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          toastOptions={{
            style: {
              fontSize: "1.2rem",
            },
            success: { style: { color: "#1f7a2b" } },
            error: { style: { color: "#b81d12" } },
          }}
        />

        <Routes>
          <Route
            path="/signin"
            element={!currUser ? <SignIn /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!currUser ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/landing"
            element={!currUser ? <LandingPage /> : <Navigate to="/" />}
          />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <div className="news-blogs-app">
                  {showNews && (
                    <News
                      onShowBlogs={handleShowBlogs}
                      blogs={userData?.blogs || []}
                      onEditBlog={handleEditingBlog}
                      onDeleteBlog={handleDeleteBlog}
                    />
                  )}
                  {showBlogs && (
                    <Blogs
                      onBack={handleBackToNews}
                      onCreateBlog={handleCreateBlog}
                      editBlog={selectedBlog}
                      isEditing={isEditing}
                    />
                  )}
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
