import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  // If there's no user, redirect to login page but save the location they were trying to access
  if (!user) {
    return <Navigate to={`/login?redirect=${location.pathname.replace('/', '')}`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
