import React from "react";
import "./Bookmarks.css";
import "../Modal.css";
import { GoBookmarkSlash } from "react-icons/go";
import noImg from "../../assets/images/no-img.png";
import { useUser } from "../../contexts/UserContext";

function Bookmarks({ show, onClose, onSelectArticle }) {
  const { userData, deleteBookmark } = useUser();

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button">
          <i className="fa-solid fa-xmark" onClick={onClose} />
        </span>
        <h2 className="bookmarks-heading">Bookmarked News</h2>
        <div className="bookmarks-list">
          {userData?.bookmarks?.length > 0 ? (
            userData.bookmarks.map((bookmark, index) => (
              <div
                className="bookmark-item"
                key={index}
                onClick={() => {
                  onClose();
                  onSelectArticle(bookmark);
                }}
              >
                <img src={bookmark.image || noImg} alt={bookmark.title} />
                <h3 className="bookmark-title">{bookmark.title}</h3>
                <span
                  title="Remove bookmark"
                  className="delete-button"
                  onClick={async (e) => {
                    e.stopPropagation();
                    await deleteBookmark(bookmark.id);
                  }}
                >
                  <GoBookmarkSlash />
                </span>
              </div>
            ))
          ) : (
            <p>Looks empty here! Save some favorites.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Bookmarks;
