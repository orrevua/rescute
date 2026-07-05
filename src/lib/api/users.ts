import api from './client';
import type { UserProfile } from '../types';

export type ProfileUpdateData = Partial<
  Pick<UserProfile, 'org_name' | 'full_name' | 'description' | 'phone' | 'city' | 'state'>
>;

export async function getMyProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>('/users/me/profile');
  return data;
}

export async function updateMyProfile(payload: ProfileUpdateData): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>('/users/me/profile', payload);
  return data;
}
