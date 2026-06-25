import api from './client';
import type { DonationPost, DonationType } from '../types';

export async function getDonations(type?: DonationType): Promise<DonationPost[]> {
  const { data } = await api.get<DonationPost[]>('/donations', { params: { type } });
  return data;
}

export async function createDonation(data: Record<string, unknown>): Promise<DonationPost> {
  const { data: response } = await api.post<DonationPost>('/donations', data);
  return response;
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
