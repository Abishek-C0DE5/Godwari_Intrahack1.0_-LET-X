import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && profile && !allowedRoles.includes(profile.role)) {
    // If the user's role is not allowed, redirect them to their respective dashboard
    if (profile.role === 'tourist') return <Navigate to="/tourist" replace />;
    if (profile.role === 'guide') return <Navigate to="/guide" replace />;
    if (profile.role === 'hotel') return <Navigate to="/hotel" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};
