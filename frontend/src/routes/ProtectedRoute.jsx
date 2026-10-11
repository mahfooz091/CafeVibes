import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

export const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  // Demo viewers are granted read-only exploration access across all modules
  const isAllowed = !roles || roles.includes(user.role) || user.role === 'demo_viewer';
  if (!isAllowed) {
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/pos'} replace />;
  }

  return children;
};

export const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (user) {
    return <Navigate to={user.role === 'admin' || user.role === 'demo_viewer' ? '/dashboard' : '/pos'} replace />;
  }

  return children;
};
