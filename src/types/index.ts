// API request/response shapes (for client/server contract)
export * from './api';

// Database Types - matches Supabase schema

export type AccountType = 'individual' | 'business';

export type AccountStatus = 'draft' | 'payment_pending' | 'active' | 'closed';

export type SubscriptionStatus = 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing';

export type SubscriptionPlan = 'monthly' | 'yearly';

export type DocumentType = 'drivers_license_front' | 'drivers_license_back' | 'business_registration';

export type VehicleTitleStatus = 'pending' | 'mailed' | 'completed';

// Core Database Tables

export interface Customer {
  id: string;
  user_id: string;
  customer_number: string | null; // Assigned in Phase 2 via supplier API
  account_type: AccountType;
  account_status: AccountStatus;
  
  // Individual fields
  first_name: string | null;
  last_name: string | null;
  date_of_birth: string | null;
  
  // Business fields
  business_name: string | null;
  business_ein: string | null;
  business_contact_name: string | null;
  
  // Common fields
  email: string;
  phone: string | null;
  address_line1: string | null;
  address_line2: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  
  // Terms acceptance
  terms_accepted: boolean;
  terms_accepted_at: string | null;
  
  // Financial
  purchase_value: number;
  security_deposit_required: number;
  security_deposit_paid: number;
  account_balance: number;
  
  // Stripe
  stripe_customer_id: string | null;
  
  // Subscription
  subscription_plan: SubscriptionPlan | null;
  subscription_status: SubscriptionStatus | null;
  stripe_subscription_id: string | null;
  subscription_current_period_end: string | null;
  
  // Vehicle
  vehicle_title_status: VehicleTitleStatus;
  
  // Timestamps
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  customer_id: string;
  document_type: DocumentType;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string;
  uploaded_at: string;
}

export interface Payment {
  id: string;
  customer_id: string;
  stripe_payment_intent_id: string | null;
  stripe_invoice_id: string | null;
  amount: number;
  currency: string;
  payment_type: 'security_deposit' | 'subscription' | 'deposit_topup' | 'refund';
  status: 'pending' | 'succeeded' | 'failed' | 'refunded';
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Invoice {
  id: string;
  customer_id: string;
  stripe_invoice_id: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  invoice_url: string | null;
  invoice_pdf: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string;
}

export interface AuditLog {
  id: string;
  customer_id: string | null;
  user_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  created_at: string;
}

// Form Types

export interface IndividualRegistrationForm {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  purchase_value: number;
  subscription_plan: SubscriptionPlan;
  terms_accepted: boolean;
}

export interface BusinessRegistrationForm {
  business_name: string;
  business_ein: string;
  business_contact_name: string;
  email: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  zip_code: string;
  purchase_value: number;
  subscription_plan: SubscriptionPlan;
  terms_accepted: boolean;
}

// API Response Types

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CheckoutSession {
  sessionId: string;
  url: string;
}

// Dashboard Types

export interface DashboardStats {
  total_customers: number;
  active_customers: number;
  pending_customers: number;
  total_deposits: number;
  monthly_revenue: number;
}

export interface CustomerWithDocuments extends Customer {
  documents: Document[];
}

// Stripe Types

export interface StripeSubscriptionPlan {
  id: SubscriptionPlan;
  name: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  priceId: string;
}

// Session & Auth Types

export interface UserSession {
  user: {
    id: string;
    email: string;
    role: 'customer' | 'admin';
  };
  customer?: Customer;
}
