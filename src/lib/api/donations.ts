import api from './client';
import type { DonationPost, DonationType } from '../types';

export async function getDonations(type?: DonationType): Promise<DonationPost[]> {
  const { data } = await api.get<DonationPost[]>('/donations', { params: { type } });
  return data;
}
export async function createDonation(data: Record<string, unknown>): Promise<DonationPost> { const { data: response } = await api.post<DonationPost>('/donations', data); return response; }
