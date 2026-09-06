import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User trying to access admin
  if (role === "admin" && user.role !== "admin") {
    alert("Access Denied: Admin access required");
    return <Navigate to="/users" replace />;
  }

  // Admin trying to access user page
  if (role === "user" && user.role !== "user") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;