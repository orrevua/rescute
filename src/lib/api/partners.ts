import api from './client';
import type { Host, Partner, PartnerNegotiation } from '../types';

export interface RegisterPartnerData {
  name: string;
  description?: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  coupon_code?: string;
  discount_pct?: number;
  host_id: string;
  proposed_amount: number;
  proposed_message?: string;
  contact_email: string;
  contact_phone: string;
}

export interface NegotiationActionData {
  action: 'accept' | 'reject' | 'counter';
  counter_amount?: number;
  counter_message?: string;
}

export type PartnerUpdateData = Partial<
  Pick<
    Partner,
    'name' | 'description' | 'address' | 'cep' | 'city' | 'state' | 'coupon_code' | 'discount_pct'
  >
>;

export async function getPartners(): Promise<Partner[]> {
  const { data } = await api.get<Partner[]>('/partners');
  return data;
}

export async function getHosts(): Promise<Host[]> {
  const { data } = await api.get<Host[]>('/partners/hosts');
  return data;
}

export async function registerPartner(payload: RegisterPartnerData): Promise<PartnerNegotiation> {
  const { data } = await api.post<PartnerNegotiation>('/partners/register', payload);
  return data;
}

export async function getNegotiations(): Promise<PartnerNegotiation[]> {
  const { data } = await api.get<PartnerNegotiation[]>('/partners/negotiations');
  return data;
}

export async function actOnNegotiation(
  id: string,
  payload: NegotiationActionData,
): Promise<PartnerNegotiation> {
  const { data } = await api.patch<PartnerNegotiation>(`/partners/negotiations/${id}`, payload);
  return data;
}

export async function updatePartner(id: string, payload: PartnerUpdateData): Promise<Partner> {
  const { data } = await api.patch<Partner>(`/partners/${id}`, payload);
  return data;
}

export async function deletePartner(id: string): Promise<void> {
  await api.delete(`/partners/${id}`);
}
