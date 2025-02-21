import React from "react";
import "../news/NewsModal.css";
import "./BlogsModal.css";

function BlogsModal({ show, onClose, blog }) {
  if (!show) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </span>
        {blog.image && (
          <img
            src={blog.image}
            alt={blog.title}
            className="blogs-modal-image"
          />
        )}
        <h2 className="blogs-modal-title">{blog.title}</h2>
        <p className="blog-post-content">{blog.content}</p>
      </div>
    </div>
  );
}

export default BlogsModal;
