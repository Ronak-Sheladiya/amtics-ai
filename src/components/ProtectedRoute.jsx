import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Loading component
const LoadingSpinner = () => (
  <div className="loading-container">
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>Loading...</p>
    </div>
  </div>
);

// Protected route for authenticated users
export const ProtectedRoute = ({ children, requireAdmin = false, requireModerator = false }) => {
  const { user, isAuthenticated, loading, isAdmin, isModerator } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (requireModerator && !isModerator) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Admin-only route component
export const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requireAdmin={true}>
      {children}
    </ProtectedRoute>
  );
};

// Moderator and Admin route component
export const ModeratorRoute = ({ children }) => {
  return (
    <ProtectedRoute requireModerator={true}>
      {children}
    </ProtectedRoute>
  );
};

// Redirect authenticated users away from auth pages
export const GuestRoute = ({ children }) => {
  const { isAuthenticated, loading, isAdmin } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    // Redirect based on user role
    const redirectPath = isAdmin ? '/admin/dashboard' : '/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

// Role-based redirect component
export const RoleRedirect = () => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on user role
  if (user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  } else {
    return <Navigate to="/dashboard" replace />;
  }
};
