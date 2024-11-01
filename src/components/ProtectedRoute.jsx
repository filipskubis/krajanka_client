/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import { useAuth } from "../misc/AuthContext.jsx";
import Spinner from "../components/Spinner";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <Spinner />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
