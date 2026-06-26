'use client';

import { useAuth } from './context';
import { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return null;
  if (requiredRole && user.role !== requiredRole) return null;

  return <>{children}</>;
}
