import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Route to user's proper home dashboard if accessing unauthorized path
    if (user?.role === 'STUDENT') return <Navigate to="/student/dashboard" replace />;
    if (user?.role === 'RECRUITER') return <Navigate to="/recruiter/dashboard" replace />;
    if (user?.role === 'PLACEMENT_OFFICER') return <Navigate to="/officer/dashboard" replace />;
    if (user?.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
