import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ahlwvrfnhkurnaahdzmu.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0Njk2NjAsImV4cCI6MjA3NTA0NTY2MH0.trk4vX0ponoLa7fM0z8fg4V2a_Z2rxLdIP6iPAxZmXI';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service role key for admin operations
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFobHd2cmZuaGt1cm5hYWhkem11Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTQ2OTY2MCwiZXhwIjoyMDc1MDQ1NjYwfQ.UunB0XChBIIKyLzOrUtgQ072mE3xKw22T2a1bKphbSU';

export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Database types (generated from Supabase)
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          phone: string | null;
          company_name: string | null;
          license_number: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          full_name: string;
          phone?: string | null;
          company_name?: string | null;
          license_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string;
          phone?: string | null;
          company_name?: string | null;
          license_number?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      properties: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          description: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          price: number | null;
          property_type: 'single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land';
          bedrooms: number | null;
          bathrooms: number | null;
          square_feet: number | null;
          lot_size: number | null;
          year_built: number | null;
          features: string[] | null;
          images: string[] | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          description?: string | null;
          address: string;
          city: string;
          state: string;
          zip_code: string;
          price?: number | null;
          property_type: 'single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land';
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          features?: string[] | null;
          images?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          description?: string | null;
          address?: string;
          city?: string;
          state?: string;
          zip_code?: string;
          price?: number | null;
          property_type?: 'single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land';
          bedrooms?: number | null;
          bathrooms?: number | null;
          square_feet?: number | null;
          lot_size?: number | null;
          year_built?: number | null;
          features?: string[] | null;
          images?: string[] | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email: string | null;
          phone: string;
          preferred_contact_method: string | null;
          budget_min: number | null;
          budget_max: number | null;
          preferred_locations: string[] | null;
          property_types: ('single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land')[] | null;
          transaction_type: 'buy' | 'rent' | 'sell';
          bedrooms_min: number | null;
          bedrooms_max: number | null;
          bathrooms_min: number | null;
          bathrooms_max: number | null;
          move_in_date: string | null;
          notes: string | null;
          status: 'new' | 'contacted' | 'qualified' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost';
          source: 'website_chat' | 'whatsapp' | 'phone' | 'email' | 'referral' | 'social_media';
          whatsapp_conversation_id: string | null;
          website_session_id: string | null;
          last_contacted_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          first_name: string;
          last_name: string;
          email?: string | null;
          phone: string;
          preferred_contact_method?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_locations?: string[] | null;
          property_types?: ('single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land')[] | null;
          transaction_type: 'buy' | 'rent' | 'sell';
          bedrooms_min?: number | null;
          bedrooms_max?: number | null;
          bathrooms_min?: number | null;
          bathrooms_max?: number | null;
          move_in_date?: string | null;
          notes?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost';
          source: 'website_chat' | 'whatsapp' | 'phone' | 'email' | 'referral' | 'social_media';
          whatsapp_conversation_id?: string | null;
          website_session_id?: string | null;
          last_contacted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          first_name?: string;
          last_name?: string;
          email?: string | null;
          phone?: string;
          preferred_contact_method?: string | null;
          budget_min?: number | null;
          budget_max?: number | null;
          preferred_locations?: string[] | null;
          property_types?: ('single_family' | 'condo' | 'townhouse' | 'apartment' | 'commercial' | 'land')[] | null;
          transaction_type?: 'buy' | 'rent' | 'sell';
          bedrooms_min?: number | null;
          bedrooms_max?: number | null;
          bathrooms_min?: number | null;
          bathrooms_max?: number | null;
          move_in_date?: string | null;
          notes?: string | null;
          status?: 'new' | 'contacted' | 'qualified' | 'site_visit' | 'negotiation' | 'closed_won' | 'closed_lost';
          source?: 'website_chat' | 'whatsapp' | 'phone' | 'email' | 'referral' | 'social_media';
          whatsapp_conversation_id?: string | null;
          website_session_id?: string | null;
          last_contacted_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      lead_interactions: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          interaction_type: string;
          content: string;
          direction: string;
          metadata: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id: string;
          interaction_type: string;
          content: string;
          direction: string;
          metadata?: any | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          user_id?: string;
          interaction_type?: string;
          content?: string;
          direction?: string;
          metadata?: any | null;
          created_at?: string;
        };
      };
      lead_follow_ups: {
        Row: {
          id: string;
          lead_id: string;
          user_id: string;
          scheduled_at: string;
          follow_up_type: string;
          notes: string | null;
          is_completed: boolean;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          user_id: string;
          scheduled_at: string;
          follow_up_type: string;
          notes?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          user_id?: string;
          scheduled_at?: string;
          follow_up_type?: string;
          notes?: string | null;
          is_completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
        };
      };
      lead_property_matches: {
        Row: {
          id: string;
          lead_id: string;
          property_id: string;
          match_score: number | null;
          match_reasons: string[] | null;
          is_viewed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          lead_id: string;
          property_id: string;
          match_score?: number | null;
          match_reasons?: string[] | null;
          is_viewed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string;
          property_id?: string;
          match_score?: number | null;
          match_reasons?: string[] | null;
          is_viewed?: boolean;
          created_at?: string;
        };
      };
      chatbot_conversations: {
        Row: {
          id: string;
          lead_id: string | null;
          session_id: string;
          platform: string;
          messages: any;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          lead_id?: string | null;
          session_id: string;
          platform: string;
          messages: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          lead_id?: string | null;
          session_id?: string;
          platform?: string;
          messages?: any;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
