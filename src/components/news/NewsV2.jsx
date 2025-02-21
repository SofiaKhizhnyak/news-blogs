import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useUser } from "../../contexts/UserContext";
import Weather from "../weather/Weather";
import Calendar from "../calendar/Calendar";
import "./News.css";
import noImg from "../../assets/images/no-img.png";
import axios from "axios";
import NewsModal from "./NewsModal";
import Bookmarks from "../bookmarks/Bookmarks";
import { BsBookmarksFill } from "react-icons/bs";
import BlogsModal from "../blogs/BlogsModal";
import { MdLogout } from "react-icons/md";
import { PiCopyrightLight } from "react-icons/pi";
import { PiSmileySadThin } from "react-icons/pi";
import { Navigate } from "react-router-dom";
import Spinner from "../spinner/Spinner";

const categories = [
  "general",
  "world",
  "business",
  "technology",
  "entertainment",
  "sports",
  "science",
  "health",
  "nation",
];

function News({ onShowBlogs, blogs, onEditBlog, onDeleteBlog }) {
  const API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
  const { logout, isLoading } = useAuth();
  const {
    userData,
    isLoading: userIsLoading,
    addBookmark,
    deleteBookmark,
  } = useUser();
  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("general");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogsModal, setShowBlogsModal] = useState(false);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    if (userData) {
      setUserName(
        userData.name.charAt(0).toUpperCase() + userData.name.slice(1)
      );
    }
  }, [userData]);

  useEffect(() => {
    const fetchNews = async () => {
      let url = `https://gnews.io/api/v4/top-headlines?category=${selectedCategory}&lang=en&apikey=${API_KEY}`;

      if (searchQuery) {
        url = `https://gnews.io/api/v4/search?q=${searchQuery}&lang=en&apikey=${API_KEY}`;
      }
      try {
        const response = await axios.get(url);
        const fetchedNews = response.data.articles;

        fetchedNews.forEach((article) => {
          if (!article.image) {
            article.image = noImg;
          }
        });

        setHeadline(fetchedNews[0]);
        setNews(fetchedNews.slice(1, 7));
      } catch (error) {
        if (error.response && error.response.status === 403) {
          setHeadline(null);
          setNews([]);
          setError(
            <p>
              <PiSmileySadThin size="4rem" />
              <br />
              We have reached our API usage limit.
              <br />
              Please try again tomorrow. <br />
              Thank you for your patience!
            </p>
          );
        } else {
          setError("Failed to fetch news");
        }
      }
    };
    fetchNews();
  }, [selectedCategory, searchQuery, API_KEY, userData]);

  const handleSelectCategory = (e, category) => {
    e.preventDefault();
    setSelectedCategory(category);
    setSearchQuery("");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSearchInput("");
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  // handle saving and deleting an article from bookmarks
  const handleBookmarkClick = async (article) => {
    if (!userData || !userData.id) return;

    const isBookmarked = userData?.bookmarks?.some(
      (b) => b.articleUrl === article.url
    );

    if (isBookmarked) {
      // Find and remove the bookmark
      const bookmarkToRemove = userData.bookmarks.find(
        (b) => b.articleUrl === article.url
      );
      if (bookmarkToRemove) {
        await deleteBookmark(bookmarkToRemove.id);
      }
    } else {
      await addBookmark(article);
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setShowBlogsModal(true);
  };

  const closeBlogsModal = () => {
    setShowBlogsModal(false);
    setSelectedBlog(null);
  };

  const handleLogout = async () => {
    await logout();
    <Navigate to="/landing" />;
  };

  if (isLoading || userIsLoading)
    return (
      <div className="spinner">
        <Spinner size={90} thickness={180} color="#d0e7f8ca" />
      </div>
    );

  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search News..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass" />
            </button>
          </form>
        </div>
      </header>
      <div className="news-content">
        <div className="navbar">
          <div
            className="user"
            onClick={onShowBlogs}
            title="Click to create new post"
          >
            {userData.image && userData.image.startsWith("data:image") ? (
              <img
                src={userData.image || noImg}
                alt="User Image"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = noImg;
                }}
              />
            ) : (
              <div className="user-icon">{userData.image}</div>
            )}
            <p> {userName}&#39;s Blog</p>
            <div className="user-button">
              <button
                title="Logout"
                className="logout"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLogout();
                }}
              >
                <MdLogout />
              </button>
            </div>
          </div>
          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              {categories.map((category) => (
                <a
                  href="#"
                  key={category}
                  className="nav-link"
                  onClick={(e) => handleSelectCategory(e, category)}
                >
                  {category}
                </a>
              ))}
              <a
                href="#"
                className="nav-link"
                onClick={() => setShowBookmarksModal(true)}
              >
                Bookmarks <BsBookmarksFill className="bookmarks-icon" />
              </a>
            </div>
          </nav>
        </div>
        {news.length > 1 ? (
          <div className="news-section">
            {headline && (
              <div
                className="headline"
                onClick={() => handleArticleClick(headline)}
              >
                <img src={headline.image || noImg} alt={headline.title} />
                <h2 className="headline-title">
                  {headline.title}
                  <i
                    className={`${
                      userData?.bookmarks?.some(
                        (bookmark) => bookmark.articleUrl === headline.url
                      )
                        ? "fa-solid"
                        : "fa-regular"
                    } fa-bookmark bookmark`}
                    title={
                      userData?.bookmarks?.some(
                        (bookmark) => bookmark.articleUrl === headline.url
                      )
                        ? "Remove from bookmarks"
                        : "Add to bookmarks"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkClick(headline);
                    }}
                  />
                </h2>
              </div>
            )}

            <div className="news-grid">
              {news.map((article, index) => (
                <div
                  className="news-grid-item"
                  key={index}
                  onClick={() => handleArticleClick(article)}
                >
                  <img src={article.image || noImg} alt={article.title} />
                  <h3>
                    {article.title}
                    <i
                      className={`${
                        userData?.bookmarks?.some(
                          (bookmark) => bookmark.articleUrl === article.url
                        )
                          ? "fa-solid"
                          : "fa-regular"
                      } fa-bookmark bookmark`}
                      title={
                        userData?.bookmarks?.some(
                          (bookmark) => bookmark.articleUrl === article.url
                        )
                          ? "Remove from bookmarks"
                          : "Add to bookmarks"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkClick(article);
                      }}
                    />
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="error-message">{error}</div>
        )}
        <NewsModal
          show={showModal}
          article={selectedArticle}
          onClose={() => setShowModal(false)}
        />
        <Bookmarks
          show={showBookmarksModal}
          onClose={() => setShowBookmarksModal(false)}
          onSelectArticle={handleArticleClick}
        />
        <div className="my-blogs">
          <h1 className="my-blogs-heading">My Blogs</h1>
          <div className="blog-posts">
            {blogs.map((blog, index) => (
              <div
                key={index}
                className="blog-post"
                onClick={() => handleBlogClick(blog)}
              >
                <img src={blog.image || noImg} alt={blog.title} />
                <h3>{blog.title}</h3>

                <div className="post-buttons">
                  <button
                    title="Edit post"
                    className="edit-post"
                    onClick={() => onEditBlog(blog)}
                  >
                    <i className="bx bxs-edit" />
                  </button>
                  <button
                    title="Delete post"
                    className="delete-post"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteBlog(blog);
                    }}
                  >
                    <i className="bx bxs-trash" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          {selectedBlog && showBlogsModal && (
            <BlogsModal
              show={showBlogsModal}
              onClose={closeBlogsModal}
              blog={selectedBlog}
            />
          )}
        </div>
        <div className="weather-calendar">
          <Weather />
          <Calendar />
        </div>
      </div>
      <footer className="news-footer">
        <p>
          <span>News & Blogs</span>
        </p>
        <p
          style={{
            display: "flex",
          }}
        >
          <span>
            <PiCopyrightLight />
          </span>
          All rights reserved. Created by Sofia Khizhnyak
        </p>
      </footer>
    </div>
  );
}

export default News;
