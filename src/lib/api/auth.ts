import api from './client';
import { User } from '../types';

export async function getMeApi(): Promise<User> {
  const { data } = await api.get<User>('/auth/me');
  return data;
}
