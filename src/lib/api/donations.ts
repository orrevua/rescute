import api from './client';
import type { DonationIntent, DonationPost, DonationType } from '../types';

export async function getDonations(type?: DonationType): Promise<DonationPost[]> {
  const { data } = await api.get<DonationPost[]>('/donations', { params: { type } });
  return data;
}

export async function createDonation(data: Record<string, unknown>): Promise<DonationPost> {
  const { data: response } = await api.post<DonationPost>('/donations', data);
  return response;
}

export async function updateDonation(id: string, data: Record<string, unknown>): Promise<DonationPost> {
  const { data: response } = await api.patch<DonationPost>(`/donations/${id}`, data);
  return response;
}

export async function getDonation(id: string): Promise<DonationPost> {
  const { data } = await api.get<DonationPost[]>('/donations');
  const found = data.find((d) => d.id === id);
  if (!found) throw new Error('Not found');
  return found;
}

export interface ContributionData {
  donor_name: string;
  donor_email: string;
  amount: number;
  message?: string;
}

export interface ContributionResult {
  donation_id: string;
  donor_name: string;
  amount: number;
  new_total: number;
}

export async function contribute(
  donationId: string,
  data: ContributionData,
): Promise<ContributionResult> {
  const { data: response } = await api.post<ContributionResult>(
    `/donations/${donationId}/contribute`,
    data,
  );
  return response;
}

export interface IntentData {
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
  message?: string;
}

export async function submitIntent(
  donationId: string,
  data: IntentData,
): Promise<DonationIntent> {
  const { data: response } = await api.post<DonationIntent>(
    `/donations/${donationId}/intent`,
    data,
  );
  return response;
}

export async function getIntents(): Promise<DonationIntent[]> {
  const { data } = await api.get<DonationIntent[]>('/donations/intents');
  return data;
}
