import api from './client';
import type { AdoptionApplication } from '../types';

export interface AdoptionSubmission {
  cat_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  message?: string;
  accepted_terms: boolean;
}

export async function submitAdoption(
  submission: AdoptionSubmission,
): Promise<AdoptionApplication> {
  const { data } = await api.post<AdoptionApplication>('/adoptions', submission);
  return data;
}
export async function getAdoptions(): Promise<AdoptionApplication[]> { const { data } = await api.get<AdoptionApplication[]>('/adoptions'); return data; }
export async function updateAdoptionStatus(id: string, status: string): Promise<AdoptionApplication> { const { data } = await api.patch<AdoptionApplication>(`/adoptions/${id}/status`, { status }); return data; }
