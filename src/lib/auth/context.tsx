'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import { User, UserRole } from '../types';
import { loginApi, registerApi, getMeApi } from '../api/auth';
import { setTokens, clearTokens, getAccessToken } from './tokens';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    role: UserRole,
    profileData: Record<string, unknown>,
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      getMeApi()
        .then(setUser)
        .catch(() => {
          clearTokens();
          window.location.replace('/login');
        })
        .finally(() => setLoading(false));
    } else {
      clearTokens();
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await loginApi(email, password);
    setTokens(res.access_token, res.refresh_token);
    setUser(res.user);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      role: UserRole,
      profileData: Record<string, unknown>,
    ) => {
      const res = await registerApi(email, password, role, profileData);
      setTokens(res.access_token, res.refresh_token);
      setUser(res.user);
    },
    [],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
