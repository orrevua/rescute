import api from './client';
import { AuthResponse, TokenResponse, User, UserRole } from '../types';

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/login', { email, password });
  return data;
}

export async function registerApi(
  email: string,
  password: string,
  role: UserRole,
  profileData: Record<string, unknown>,
): Promise<AuthResponse> {
  const { data } = await api.post<AuthResponse>('/auth/register', {
    email,
    password,
    role,
    ...profileData,
  });
  return data;
}

export async function refreshTokenApi(refreshToken: string): Promise<TokenResponse> {
  const { data } = await api.post<TokenResponse>('/auth/refresh', {
    refresh_token: refreshToken,
  });
  return data;
}

export async function getMeApi(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
