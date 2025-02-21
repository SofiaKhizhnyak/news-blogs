import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./SignUp.css";
import Spinner from "../spinner/Spinner";
import EmojiPicker from "emoji-picker-react";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState("");
  const [imgError, setImgError] = useState(null);
  const [icon, setIcon] = useState(null);
  const [iconError, setIconError] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const { signup, isLoading, error: authError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setImgError(null);
    setIconError(null);

    if (!image && !icon) {
      setImgError("Please upload an image or select an icon.");
      return;
    } else {
      try {
        await signup(name, email, password, image || icon);
      } catch (err) {
        setLocalError(err.message);
      } finally {
        setImage("");
        setIcon("");
      }
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const maxSize = 1024 * 1024 * 0.6; // 0.6MB

    if (file.size > maxSize) {
      setImgError("File size exceeds 0.6MB. Please choose smaller image");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setImgError(null);
    };
    reader.onerror = () => {
      setImgError("Failed to read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleEmojiSelect = (emoji) => {
    setIcon(emoji.emoji);
    setImage("");
    setShowEmojiPicker(false);
  };

  return (
    <div className="signup">
      <div className="signup-form">
        <h2 className="signup-heading">Sign Up</h2>
        {(localError || authError) && (
          <p className="formError">{localError || authError}</p>
        )}
        {imgError && <p className="formError">{imgError}</p>}
        {iconError && <p className="formError">{iconError}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {!icon && !showEmojiPicker && (
              <div className="signUpUserImg" title="maximum image size: 0.6MB">
                <label htmlFor="file-upload" className="userImgUpload">
                  <i className="bx bx-upload" /> Upload Image
                </label>
                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </div>
            )}
            {image && (
              <div className="image-preview">
                <img src={image} alt="user image preview" />
              </div>
            )}
            {!image && (
              <div className="signUpUserImg">
                {showEmojiPicker && (
                  <div>
                    <EmojiPicker onEmojiClick={handleEmojiSelect} />
                  </div>
                )}
                <label htmlFor="icon-upload" className="signUpUserImg">
                  <p
                    onClick={() => setShowEmojiPicker((prev) => !prev)}
                    className="userImgUpload"
                  >
                    {showEmojiPicker ? (
                      <>
                        <i
                          title="Close Emoji Picker"
                          className="bx bx-x-circle"
                          style={{
                            color: "#ddd",
                            fontSize: "2.5rem",
                            marginLeft: "0.5rem",
                          }}
                        />
                      </>
                    ) : (
                      <>
                        <i className="bx bx-plus" /> Or choose an icon
                      </>
                    )}
                  </p>
                </label>
              </div>
            )}
            {icon && (
              <div className="icon-preview">
                <span style={{ fontSize: "2rem" }}>{icon}</span>
              </div>
            )}
          </div>
          <button type="submit" className="signup-btn" disabled={isLoading}>
            {isLoading ? (
              <Spinner size={50} thickness={60} color="#8cbde297" />
            ) : (
              "Join Now"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUp;
