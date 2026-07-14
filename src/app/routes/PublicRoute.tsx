import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/contexts/AuthContext';

interface PublicRouteProps {
  redirectTo?: string;
}

export const PublicRoute = ({ redirectTo = '/' }: PublicRouteProps) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
