import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/signin' }) => {
  const { user, loading, initialized } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading || !initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // If role-based access is specified, check if user has allowed role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect based on user's actual role
    if (user.role === 'hr') {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === 'candidate') {
      return <Navigate to="/dashboard/candidate" replace />;
    } else {
      return <Navigate to="/signin" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;