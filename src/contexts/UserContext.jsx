import React, { createContext, useState, useEffect, useContext } from "react";
import { db } from "../firebase/config";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useAuth } from "./AuthContext";
import { onSnapshot } from "firebase/firestore";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { currUser } = useAuth();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user data, blogs, and bookmarks when user logs in
  useEffect(() => {
    if (!currUser) {
      setUserData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const userDocRef = doc(db, "users", currUser.uid);
    const blogsRef = collection(db, "users", currUser.uid, "blogs");
    const bookmarksRef = collection(db, "users", currUser.uid, "bookmarks");

    const unsubscribeUser = onSnapshot(userDocRef, async (userDoc) => {
      if (!userDoc.exists()) {
        setError("User data not found in Firestore.");
        setIsLoading(false);
        return;
      }

      // Listen for real-time updates on blogs
      const unsubscribeBlogs = onSnapshot(blogsRef, (blogsSnapshot) => {
        const blogs = blogsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Listen for real-time updates on bookmarks
        const unsubscribeBookmarks = onSnapshot(
          bookmarksRef,
          (bookmarksSnapshot) => {
            const bookmarks = bookmarksSnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }));

            setUserData({
              id: userDoc.id,
              ...userDoc.data(),
              blogs,
              bookmarks,
            });
            setIsLoading(false);
          }
        );

        return () => unsubscribeBookmarks();
      });

      return () => unsubscribeBlogs();
    });

    return () => unsubscribeUser();
  }, [currUser]);

  // Add a New Blog
  const addBlog = async (title, content, image) => {
    if (!currUser) return;

    try {
      const blogsRef = collection(db, "users", currUser.uid, "blogs");
      const docRef = await addDoc(blogsRef, {
        title,
        content,
        image: image,
        createdAt: serverTimestamp(),
      });

      const updatedBlogsSnapshot = await getDocs(
        collection(db, "users", currUser.uid, "blogs")
      );
      const updatedBlogs = updatedBlogsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserData((prev) => ({
        ...prev,
        blogs: updatedBlogs,
      }));
    } catch (error) {
      console.error("Error adding blog:", error);
    }
  };

  // Delete Blog
  const deleteBlog = async (blogId) => {
    if (!currUser || !blogId) return;

    try {
      await deleteDoc(doc(db, "users", currUser.uid, "blogs", blogId));

      // Update state **after deletion**
      setUserData((prev) => ({
        ...prev,
        blogs: prev.blogs.filter((blog) => blog.id !== blogId),
      }));

      console.log("Blog deleted successfully!");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  // Update Blog
  const updateBlog = async (blogId, updatedData) => {
    if (!currUser || !blogId) return;

    try {
      const blogRef = doc(db, "users", currUser.uid, "blogs", blogId);
      await updateDoc(blogRef, {
        ...updatedData,
        updatedAt: serverTimestamp(),
      });

      console.log("Blog updated successfully!");
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  };

  // Add a News Bookmark
  const addBookmark = async (article) => {
    if (!currUser || !article?.url) return;

    try {
      const bookmarksRef = collection(db, "users", currUser.uid, "bookmarks");

      const docRef = await addDoc(bookmarksRef, {
        articleUrl: article.url,
        title: article.title,
        image: article.image,
        source: article.source?.name,
      });

      // Fetch latest bookmarks after addition
      const updatedBookmarksSnapshot = await getDocs(
        collection(db, "users", currUser.uid, "bookmarks")
      );
      const updatedBookmarks = updatedBookmarksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUserData((prev) => ({
        ...prev,
        bookmarks: updatedBookmarks, // Set new bookmarks list
      }));

      console.log("News bookmarked successfully!");
    } catch (error) {
      console.error("Error adding bookmark:", error);
    }
  };

  // Delete a News Bookmark
  const deleteBookmark = async (bookmarkId) => {
    if (!currUser) return;

    try {
      // Delete the bookmark from Firestore
      await deleteDoc(doc(db, "users", currUser.uid, "bookmarks", bookmarkId));

      // Fetch updated bookmarks **after** deletion
      const updatedBookmarksSnapshot = await getDocs(
        collection(db, "users", currUser.uid, "bookmarks")
      );
      const updatedBookmarks = updatedBookmarksSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Update user data state with the new bookmarks list
      setUserData((prev) => ({
        ...prev,
        bookmarks: updatedBookmarks,
      }));

      console.log("Bookmark deleted successfully!");
    } catch (error) {
      console.error("Error deleting bookmark:", error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userData,
        isLoading,
        error,
        addBlog,
        deleteBlog,
        updateBlog,
        addBookmark,
        deleteBookmark,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
};
