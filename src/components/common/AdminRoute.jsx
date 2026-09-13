import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingSkeleton from './LoadingSkeleton';

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900 text-white">
        <div className="max-w-md w-full">
          <LoadingSkeleton count={3} />
        </div>
      </div>
    );
  }

  // If not authenticated or not the authorized admin email (irfan@gmail.com), redirect to dedicated admin login
  const isStrictAdmin = isAuthenticated && isAdmin && user?.email?.toLowerCase() === 'irfan@gmail.com';
  if (!isStrictAdmin) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
