import React from "react";
import "./NewsModal.css";
import "../Modal.css";

function NewsModal({ show, article, onClose }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark" />
        </span>
        <img src={article.image} alt={article.title} className="modal-image" />
        <h2 className="modal-title">{article.title}</h2>
        <p className="modal-source">Source: {article.source.name}</p>
        <p className="modal-date">
          {new Date(article.publishedAt).toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <p className="modal-content-text">{article.content}</p>
        <a
          className="read-more-link"
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Read More
        </a>
      </div>
    </div>
  );
}

export default NewsModal;
