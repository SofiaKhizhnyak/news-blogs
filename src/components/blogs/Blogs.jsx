import React, { useEffect, useState } from "react";
import "./Blogs.css";
import { useUser } from "../../contexts/UserContext";
import noImg from "../../assets/images/no-img.png";
import { toast } from "react-hot-toast";

function Blogs({ onBack, onCreateBlog, editBlog, isEditing }) {
  const { userData } = useUser();
  const [showForm, setShowForm] = useState(isEditing);
  const [image, setImage] = useState(
    isEditing && editBlog ? editBlog.image || noImg : null
  );
  const [title, setTitle] = useState(
    isEditing && editBlog ? editBlog.title || "" : ""
  );
  const [content, setContent] = useState(
    isEditing && editBlog ? editBlog.content || "" : ""
  );
  const [submitted, setSubmitted] = useState("");
  const [titleValid, setTitleValid] = useState(true);
  const [contentValid, setContentValid] = useState(true);

  useEffect(() => {
    if (isEditing && editBlog) {
      setImage(editBlog.image || noImg);
      setTitle(editBlog.title || "");
      setContent(editBlog.content || "");
      setShowForm(true);
    } else {
      setImage(null);
      setTitle("");
      setContent("");
      setShowForm(false);
    }
  }, [isEditing, editBlog]);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const maxSize = 1024 * 1024 * 0.7; // 0.7MB

      if (file.size > maxSize) {
        toast.error("File size exceeds 0.7MB.", {
          duration: 3000,
          icon: "⚠️",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = reader.result;

        setImage(newImage);
        toast.success(
          newImage && newImage !== noImg
            ? "Image updated successfully!"
            : "Image uploaded successfully!",
          {
            duration: 2000,
            icon: "📸",
          }
        );
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setTitleValid(true);
  };
  const handleContentChange = (e) => {
    setContent(e.target.value);
    setContentValid(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !content) {
      if (!title) {
        setTitleValid(false);
      }
      if (!content) {
        setContentValid(false);
      }
      return;
    }

    const newBlog = { image: image || noImg, title, content };
    onCreateBlog(newBlog, isEditing);
    setShowForm(false);
    setImage(null);
    setTitle("");
    setContent("");
    setSubmitted(isEditing ? "updated" : "posted");
    setTimeout(() => {
      setSubmitted("");
      onBack();
    }, 3000);
  };

  return (
    <div className="blogs">
      <div className="blogs-left">
        {userData.image && userData.image.startsWith("data:image") ? (
          <img
            className="userImg"
            src={userData.image || noImg}
            alt="User Image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = noImg;
            }}
          />
        ) : (
          <div className="userIcon user-icon">{userData.image}</div>
        )}

        {image && image !== noImg && (
          <div className="image-preview-wrapper">
            <div className="image-preview-overlay"></div>

            <img
              title="Blog image preview"
              className="blog-image-preview"
              src={image}
              alt="Blog image preview"
            />
          </div>
        )}
      </div>
      <div className="blogs-right">
        {!showForm && !submitted && (
          <button className="post-btn" onClick={() => setShowForm(true)}>
            Create New Post
          </button>
        )}

        {submitted && (
          <p className="submission-message">
            {submitted === "updated" ? "Updated!" : "Posted!"}
          </p>
        )}
        <div className={`blogs-right-form ${showForm ? "visible" : "hidden"}`}>
          <h1>{isEditing ? "Edit Post" : "New Post"}</h1>
          <form onSubmit={handleSubmit}>
            <div title="maximum image size: 0.7MB">
              <label htmlFor="file-upload" className="file-upload">
                <i className="bx bx-upload" />
                {image && image !== noImg ? "Update Image" : "Upload Image"}
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleImageChange}
              />
            </div>
            <input
              type="text"
              placeholder="Add Title (Max 60 characters)"
              className={`title-input ${!titleValid ? "invalid" : ""}`}
              value={title}
              onChange={handleTitleChange}
              maxLength={60}
            />
            <textarea
              placeholder="Write your post here..."
              className={`text-input ${!contentValid ? "invalid" : ""}`}
              value={content}
              onChange={handleContentChange}
            />
            <button type="submit" className="submit-btn">
              {isEditing ? "Update Post" : "Submit Post"}
            </button>
          </form>
        </div>

        <button className="blogs-close-btn" onClick={onBack}>
          Back <i className="bx bx-chevron-right" />
        </button>
      </div>
    </div>
  );
}

export default Blogs;
