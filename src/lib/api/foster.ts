import api from './client';
import type { FosterApplication } from '../types';

export interface FosterSubmission {
  existing_pets: string;
  compatibility: string;
  prior_experience: string;
  city: string;
  cost_aware: boolean;
}

export async function submitFosterApplication(data: FosterSubmission): Promise<FosterApplication> {
  const { data: response } = await api.post<FosterApplication>('/foster/applications', data);
  return response;
}

export async function getFosterApplications(): Promise<FosterApplication[]> {
  const { data } = await api.get<FosterApplication[]>('/foster/applications');
  return data;
}
