import { Link } from "react-router-dom";
import "./LandingPage.css";
import landingImg from "../../assets/landing.svg";

function LandingPage() {
  return (
    <div className="landing">
      <div className="landing-header">
        <h1>News & Blogs</h1>
        <p>Your personal space for news and blogging.</p>
        <p>Get the latest updates and share your thoughts with the world.</p>
      </div>
      <div className="landing-buttons">
        <Link className="landing-btn signin" to="/signin">
          Sign In
        </Link>
        <Link className="landing-btn signup" to="/signup">
          Sign Up
        </Link>
      </div>
    </div>
  );
}

export default LandingPage;
