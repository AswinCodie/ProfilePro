import React from "react";
import { Navigate } from "react-router-dom";

const HomeRedirect = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  // No logged-in user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin
  if (user.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  // Normal user
  return <Navigate to="/users" replace />;
};

export default HomeRedirect;