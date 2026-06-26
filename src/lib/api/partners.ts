import api from './client';
import type { Partner } from '../types';
export async function getPartners(): Promise<Partner[]> { const { data } = await api.get<Partner[]>('/partners'); return data; }
export async function createPartner(payload: Omit<Partner, 'id' | 'is_active'>): Promise<Partner> { const { data } = await api.post<Partner>('/partners', payload); return data; }
