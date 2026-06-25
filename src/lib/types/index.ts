// Enums
export type UserRole = 'protector' | 'foster';
export type ApplicationStatus = 'pending' | 'under_review' | 'approved' | 'rejected';
export type DonationType = 'financial' | 'item';
export type Sex = 'male' | 'female';

// Entities
export interface User {
  id: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface ProtectorProfile {
  id: string;
  user_id: string;
  org_name: string;
  description?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export interface FosterProfile {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  city: string;
  state: string;
}

export interface Cat {
  id: string;
  protector_id: string;
  name: string;
  age_months: number;
  sex: Sex;
  city: string;
  state: string;
  fiv_status: boolean;
  felv_status: boolean;
  castrated: boolean;
  vaccinated: boolean;
  dewormed: boolean;
  health_needs?: string;
  sociability: number;
  energy: number;
  playfulness: number;
  personality?: string;
  backstory?: string;
  photos: string[];
  ready_for_adoption: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

export interface AdoptionApplication {
  id: string;
  cat_id: string;
  applicant_name: string;
  applicant_email: string;
  applicant_phone: string;
  message?: string;
  accepted_terms: boolean;
  status: ApplicationStatus;
  created_at: string;
}

export interface FosterApplication {
  id: string;
  user_id: string;
  existing_pets: string;
  compatibility: string;
  prior_experience: string;
  city: string;
  cost_aware: boolean;
  status: ApplicationStatus;
  created_at: string;
}

export interface DonationPost {
  id: string;
  protector_id: string;
  title: string;
  description: string;
  type: DonationType;
  target_amount?: number;
  current_amount: number;
  is_active: boolean;
  created_at: string;
}

export interface Partner {
  id: string;
  name: string;
  description?: string;
  address: string;
  cep: string;
  city: string;
  state: string;
  lat?: number;
  lng?: number;
  coupon_code?: string;
  discount_pct?: number;
  is_active: boolean;
}

// Auth types
export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  token_type: string;
}

// API response types
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface AIChatMessage {
  answer: string;
  session_id: string;
}
