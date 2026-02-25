import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role key (full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

// Types
export type LeadStatus = 'New' | 'Contacted' | 'Consultation Scheduled' | 'Proposal Sent' | 'Won' | 'Lost';
export type LeadPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type ConsultationStatus = 'Scheduled' | 'Completed' | 'No-Show' | 'Cancelled';

export interface Lead {
  id: string;
  business_name: string;
  industry: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  current_tools: string | null;
  time_waster: string | null;
  status: LeadStatus;
  priority: LeadPriority;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Consultation {
  id: string;
  lead_id: string;
  scheduled_at: string;
  duration_min: number;
  notes: string | null;
  status: ConsultationStatus;
  created_at: string;
  updated_at: string;
  leads?: Lead;
}

export interface ActivityLog {
  id: string;
  lead_id: string;
  action: string;
  details: string | null;
  created_at: string;
}
