import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import "./SignIn.css";
import Spinner from "../spinner/Spinner";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, error, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.log("Failed to sign in:", err);
    }
  };

  return (
    <div className="signin">
      <div className="signin-form">
        <h2 className="signin-heading">Sign In</h2>
        {error && <p className="formError">{error}</p>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="signin-btn" disabled={isLoading}>
            {isLoading ? (
              <Spinner size={50} thickness={60} color="#8cbde2" />
            ) : (
              "Continue"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
