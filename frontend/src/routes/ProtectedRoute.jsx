import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Guards routes based on authentication and optional role requirements.
 * Usage: <ProtectedRoute roles={['admin']} />
 */
const ProtectedRoute = ({ roles }) => {
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-cream">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-teal/20 border-t-teal" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Redirect to the user's correct landing area
    return <Navigate to={user.role === 'admin' ? '/dashboard' : '/pos'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
