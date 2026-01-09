/*
 * PROTECTED ROUTE COMPONENT - ProtectedRoute.jsx
 *
 * ROUTE PROTECTION FLOW EXPLANATION:
 * 1) Component checks if authentication system is initialized
 * 2) If not initialized → show loading spinner
 * 3) If user not authenticated → redirect to signin page
 * 4) If user authenticated but wrong role → redirect to appropriate dashboard
 * 5) If user authenticated and correct role → render protected content
 *
 * USAGE:
 * - Wrap any route that requires authentication
 * - Specify allowedRoles array to restrict by user role
 * - Automatically handles role-based redirects
 *
 * EXAMPLES:
 * <ProtectedRoute allowedRoles={["hr"]}> - Only HR users
 * <ProtectedRoute allowedRoles={["candidate"]}> - Only candidates
 * <ProtectedRoute> - Any authenticated user
 */

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const ProtectedRoute = ({
  children,
  allowedRoles = [],
  redirectTo = "/signin",
}) => {
  // Get authentication state from AuthContext
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // STEP 1: Show loading while checking authentication
  // Wait for auth system to initialize and check for existing session
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // STEP 2: Check if user is authenticated
  // If no user found, redirect to signin page
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // STEP 3: Check role-based access control
  // If allowedRoles specified, verify user has correct role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user's actual role to prevent unauthorized access
    if (user.role === "hr") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "candidate") {
      return <Navigate to="/dashboard/candidate" replace />;
    } else {
      return <Navigate to="/signin" replace />;
    }
  }

  // STEP 4: User is authenticated and has correct role
  // Render the protected content
  return children;
};

export default ProtectedRoute;
