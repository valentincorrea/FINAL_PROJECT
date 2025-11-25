// src/components/ProtectedRoute.jsx

import React from "react";
import { Navigate } from "react-router-dom";

/**
 * A component wrapper that protects routes from unauthenticated access.
 * If no 'userToken' is found in localStorage, the user is redirected to /login.
 * * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The protected component to render (e.g., <Dashboard />).
 */
function ProtectedRoute({ children }) {
  // 1. Check for the token stored during successful login
  const token = localStorage.getItem("userToken");

  if (!token) {
    // 2. If the token is null or undefined, redirect immediately to the login page.
    // The 'replace' prop prevents the user from navigating back to the protected route via the browser history.
    return <Navigate to="/login" replace />;
  }

  // 3. If the token exists, render the child component (the protected page)
  return children;
}

export default ProtectedRoute;
