export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost';
export type PropertyType = 'single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land';
export type TransactionType = 'buy' | 'rent' | 'sell';
export type LeadSource = 'website_chat' | 'whatsapp' | 'phone' | 'email' | 'referral' | 'social_media';

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  company_name?: string;
  license_number?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  price?: number;
  property_type: PropertyType;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  lot_size?: number;
  year_built?: number;
  features?: string[];
  images?: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  preferred_contact_method?: string;
  budget_min?: number;
  budget_max?: number;
  preferred_locations?: string[];
  property_types?: PropertyType[];
  transaction_type: TransactionType;
  bedrooms_min?: number;
  bedrooms_max?: number;
  bathrooms_min?: number;
  bathrooms_max?: number;
  move_in_date?: string;
  notes?: string;
  status: LeadStatus;
  source: LeadSource;
  whatsapp_conversation_id?: string;
  website_session_id?: string;
  last_contacted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface LeadInteraction {
  id: string;
  lead_id: string;
  user_id: string;
  interaction_type: string;
  content: string;
  direction: 'inbound' | 'outbound';
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LeadFollowUp {
  id: string;
  lead_id: string;
  user_id: string;
  scheduled_at: string;
  follow_up_type: string;
  notes?: string;
  is_completed: boolean;
  completed_at?: string;
  created_at: string;
}

export interface LeadPropertyMatch {
  id: string;
  lead_id: string;
  property_id: string;
  match_score?: number;
  match_reasons?: string[];
  is_viewed: boolean;
  created_at: string;
}

export interface ChatbotConversation {
  id: string;
  lead_id?: string;
  session_id: string;
  platform: 'website' | 'whatsapp';
  messages: ChatMessage[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface ChatbotConfig {
  welcome_message: string;
  qualification_questions: QualificationQuestion[];
  property_suggestions_enabled: boolean;
  follow_up_enabled: boolean;
  ai_personality: string;
}

export interface QualificationQuestion {
  id: string;
  question: string;
  field: string;
  type: 'text' | 'number' | 'select' | 'multiselect' | 'date';
  options?: string[];
  required: boolean;
  order: number;
}

export interface LeadQualificationData {
  budget_min?: number;
  budget_max?: number;
  preferred_locations?: string[];
  property_types?: PropertyType[];
  transaction_type?: TransactionType;
  bedrooms_min?: number;
  bedrooms_max?: number;
  bathrooms_min?: number;
  bathrooms_max?: number;
  move_in_date?: string;
  contact_preference?: string;
}
