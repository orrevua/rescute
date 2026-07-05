import api from './client';
import type { Cat, PaginatedResponse, Sex } from '../types';

export interface CatFilters {
  name?: string;
  city?: string;
  state?: string;
  sex?: Sex;
  age_min?: number;
  age_max?: number;
}

export async function listCats(filters: CatFilters = {}): Promise<PaginatedResponse<Cat>> {
  const { data } = await api.get<PaginatedResponse<Cat>>('/cats', { params: filters });
  return data;
}

export async function getCat(id: string): Promise<Cat> {
  const { data } = await api.get<Cat>(`/cats/${id}`);
  return data;
}

export async function getMyCats(): Promise<Cat[]> {
  const { data } = await api.get<Cat[]>('/cats/mine');
  return data;
}
export async function createCat(data: Record<string, unknown>): Promise<Cat> {
  const { data: response } = await api.post<Cat>('/cats', data);
  return response;
}
export async function updateCat(id: string, data: Record<string, unknown>): Promise<Cat> {
  const { data: response } = await api.patch<Cat>(`/cats/${id}`, data);
  return response;
}
export async function deleteCat(id: string): Promise<void> {
  await api.delete(`/cats/${id}`);
}

export async function uploadPhoto(file: File): Promise<string> {
  const form = new FormData();
  form.append('file', file);
  const { data } = await api.post<{ url: string }>('/uploads', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.url;
}
