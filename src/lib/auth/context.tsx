'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { getMeApi } from '../api/auth';
import { getAccessToken, setAccessToken, clearAccessToken } from './tokens';

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

async function refreshSession(): Promise<boolean> {
  const res = await fetch('/api/auth/refresh', { method: 'POST' });
  if (!res.ok) return false;
  const { access_token } = await res.json();
  setAccessToken(access_token);
  return true;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshSession()
      .then((ok) => (ok ? getMeApi() : null))
      .then((me) => setUser(me))
      .catch(() => clearAccessToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const { user: authUser, access_token } = await res.json();
    setAccessToken(access_token);
    setUser(authUser);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      role: UserRole,
      profileData: Record<string, unknown>,
    ) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role, ...profileData }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.detail ?? 'Error creating account.');
      }
      const { user: authUser, access_token } = await res.json();
      setAccessToken(access_token);
      setUser(authUser);
    },
    [],
  );

  const logout = useCallback(async () => {
    const token = getAccessToken();
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    }).catch(() => {});
    clearAccessToken();
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
