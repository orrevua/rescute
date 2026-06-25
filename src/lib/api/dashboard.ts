import api from './client';

export interface DashboardStats {
  cat_count: number;
  application_count: number;
  active_campaign_count: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/dashboard/stats');
  return data;
}
