import { Navigate } from "react-router-dom";
import { getToken, getRole } from "../utils/auth";

export default function ProtectedRoute({ children, role }) {
  const token = getToken();
  const userRole = getRole();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}