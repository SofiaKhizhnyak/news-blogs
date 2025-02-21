import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Spinner from "./spinner/Spinner";

export function ProtectedRoute({ children }) {
  const { currUser, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="spinner">
        <Spinner size={90} thickness={180} color="#d0e7f8ca" />
      </div>
    );
  if (!currUser) return <Navigate to="/landing" />;

  return children;
}
