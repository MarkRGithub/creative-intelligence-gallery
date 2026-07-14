import type { ReactNode } from 'react';
import { AuthContext } from './AuthContext';
import { useAuth } from '../hooks/useAuth';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const auth = useAuth();
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};
