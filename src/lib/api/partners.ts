import api from './client';
import type { Partner } from '../types';
export async function getPartners(): Promise<Partner[]> { const { data } = await api.get<Partner[]>('/partners'); return data; }
