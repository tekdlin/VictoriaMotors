export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          user_id: string
          customer_number: string | null
          account_type: 'individual' | 'business'
          account_status: 'draft' | 'payment_pending' | 'active' | 'closed'
          first_name: string | null
          last_name: string | null
          date_of_birth: string | null
          business_name: string | null
          business_ein: string | null
          business_contact_name: string | null
          email: string
          phone: string | null
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          terms_accepted: boolean
          terms_accepted_at: string | null
          purchase_value: number
          security_deposit_required: number
          security_deposit_paid: number
          account_balance: number
          stripe_customer_id: string | null
          subscription_plan: 'monthly' | 'yearly' | null
          subscription_status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | null
          stripe_subscription_id: string | null
          subscription_current_period_end: string | null
          vehicle_title_status: 'pending' | 'mailed' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          customer_number?: string | null
          account_type: 'individual' | 'business'
          account_status?: 'draft' | 'payment_pending' | 'active' | 'closed'
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          business_name?: string | null
          business_ein?: string | null
          business_contact_name?: string | null
          email: string
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          purchase_value?: number
          security_deposit_required?: number
          security_deposit_paid?: number
          account_balance?: number
          stripe_customer_id?: string | null
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          vehicle_title_status?: 'pending' | 'mailed' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          customer_number?: string | null
          account_type?: 'individual' | 'business'
          account_status?: 'draft' | 'payment_pending' | 'active' | 'closed'
          first_name?: string | null
          last_name?: string | null
          date_of_birth?: string | null
          business_name?: string | null
          business_ein?: string | null
          business_contact_name?: string | null
          email?: string
          phone?: string | null
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          terms_accepted?: boolean
          terms_accepted_at?: string | null
          purchase_value?: number
          security_deposit_required?: number
          security_deposit_paid?: number
          account_balance?: number
          stripe_customer_id?: string | null
          subscription_plan?: 'monthly' | 'yearly' | null
          subscription_status?: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing' | null
          stripe_subscription_id?: string | null
          subscription_current_period_end?: string | null
          vehicle_title_status?: 'pending' | 'mailed' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          customer_id: string
          document_type: 'drivers_license_front' | 'drivers_license_back' | 'business_registration'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          document_type: 'drivers_license_front' | 'drivers_license_back' | 'business_registration'
          file_name: string
          file_path: string
          file_size: number
          mime_type: string
          uploaded_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          document_type?: 'drivers_license_front' | 'drivers_license_back' | 'business_registration'
          file_name?: string
          file_path?: string
          file_size?: number
          mime_type?: string
          uploaded_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          customer_id: string
          stripe_payment_intent_id: string | null
          stripe_invoice_id: string | null
          amount: number
          currency: string
          payment_type: 'security_deposit' | 'subscription' | 'deposit_topup' | 'refund'
          status: 'pending' | 'succeeded' | 'failed' | 'refunded'
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          stripe_payment_intent_id?: string | null
          stripe_invoice_id?: string | null
          amount: number
          currency?: string
          payment_type: 'security_deposit' | 'subscription' | 'deposit_topup' | 'refund'
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          stripe_payment_intent_id?: string | null
          stripe_invoice_id?: string | null
          amount?: number
          currency?: string
          payment_type?: 'security_deposit' | 'subscription' | 'deposit_topup' | 'refund'
          status?: 'pending' | 'succeeded' | 'failed' | 'refunded'
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          customer_id: string
          stripe_invoice_id: string
          amount: number
          currency: string
          status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
          invoice_url: string | null
          invoice_pdf: string | null
          period_start: string | null
          period_end: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          stripe_invoice_id: string
          amount: number
          currency?: string
          status?: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
          invoice_url?: string | null
          invoice_pdf?: string | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          stripe_invoice_id?: string
          amount?: number
          currency?: string
          status?: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
          invoice_url?: string | null
          invoice_pdf?: string | null
          period_start?: string | null
          period_end?: string | null
          created_at?: string
        }
      }
      audit_logs: {
        Row: {
          id: string
          customer_id: string | null
          user_id: string | null
          action: string
          details: Json | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          customer_id?: string | null
          user_id?: string | null
          action: string
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          customer_id?: string | null
          user_id?: string | null
          action?: string
          details?: Json | null
          ip_address?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type: 'individual' | 'business'
      account_status: 'draft' | 'payment_pending' | 'active' | 'closed'
      subscription_status: 'active' | 'past_due' | 'canceled' | 'incomplete' | 'trialing'
      subscription_plan: 'monthly' | 'yearly'
      document_type: 'drivers_license_front' | 'drivers_license_back' | 'business_registration'
      payment_type: 'security_deposit' | 'subscription' | 'deposit_topup' | 'refund'
      payment_status: 'pending' | 'succeeded' | 'failed' | 'refunded'
      invoice_status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
      vehicle_title_status: 'pending' | 'mailed' | 'completed'
    }
  }
}
