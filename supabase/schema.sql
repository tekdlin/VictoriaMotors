-- Victoria Motors Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE account_type AS ENUM ('individual', 'business');
CREATE TYPE account_status AS ENUM ('draft', 'payment_pending', 'active', 'closed');
CREATE TYPE subscription_status AS ENUM ('active', 'past_due', 'canceled', 'incomplete', 'trialing');
CREATE TYPE subscription_plan AS ENUM ('monthly', 'yearly');
CREATE TYPE document_type AS ENUM ('drivers_license_front', 'drivers_license_back', 'business_registration');
CREATE TYPE payment_type AS ENUM ('security_deposit', 'subscription', 'deposit_topup', 'refund');
CREATE TYPE payment_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');
CREATE TYPE invoice_status AS ENUM ('draft', 'open', 'paid', 'void', 'uncollectible');
CREATE TYPE vehicle_title_status AS ENUM ('pending', 'mailed', 'completed');

-- Customers table
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    customer_number VARCHAR(50) UNIQUE,
    account_type account_type NOT NULL,
    account_status account_status NOT NULL DEFAULT 'draft',
    
    -- Individual fields
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    
    -- Business fields
    business_name VARCHAR(255),
    business_ein VARCHAR(20),
    business_contact_name VARCHAR(200),
    
    -- Common fields
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    
    -- Terms acceptance
    terms_accepted BOOLEAN DEFAULT FALSE,
    terms_accepted_at TIMESTAMPTZ,
    
    -- Financial
    purchase_value DECIMAL(12, 2) DEFAULT 0,
    security_deposit_required DECIMAL(12, 2) DEFAULT 0,
    security_deposit_paid DECIMAL(12, 2) DEFAULT 0,
    account_balance DECIMAL(12, 2) DEFAULT 0,
    
    -- Stripe
    stripe_customer_id VARCHAR(255) UNIQUE,
    
    -- Subscription
    subscription_plan subscription_plan,
    subscription_status subscription_status,
    stripe_subscription_id VARCHAR(255) UNIQUE,
    subscription_current_period_end TIMESTAMPTZ,
    
    -- Vehicle
    vehicle_title_status vehicle_title_status DEFAULT 'pending',
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_individual CHECK (
        account_type != 'individual' OR (first_name IS NOT NULL AND last_name IS NOT NULL)
    ),
    CONSTRAINT valid_business CHECK (
        account_type != 'business' OR (business_name IS NOT NULL)
    )
);

-- Documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    stripe_payment_intent_id VARCHAR(255),
    stripe_invoice_id VARCHAR(255),
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    payment_type payment_type NOT NULL,
    status payment_status DEFAULT 'pending',
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255) NOT NULL UNIQUE,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'usd',
    status invoice_status DEFAULT 'draft',
    invoice_url TEXT,
    invoice_pdf TEXT,
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    details JSONB,
    ip_address INET,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_customers_user_id ON customers(user_id);
CREATE INDEX idx_customers_account_status ON customers(account_status);
CREATE INDEX idx_customers_stripe_customer_id ON customers(stripe_customer_id);
CREATE INDEX idx_documents_customer_id ON documents(customer_id);
CREATE INDEX idx_payments_customer_id ON payments(customer_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_invoices_customer_id ON invoices(customer_id);
CREATE INDEX idx_audit_logs_customer_id ON audit_logs(customer_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_customers_updated_at
    BEFORE UPDATE ON customers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Customers policies
CREATE POLICY "Users can view own customer record"
    ON customers FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own customer record"
    ON customers FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own customer record"
    ON customers FOR UPDATE
    USING (auth.uid() = user_id);

-- Documents policies
CREATE POLICY "Users can view own documents"
    ON documents FOR SELECT
    USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

CREATE POLICY "Users can insert own documents"
    ON documents FOR INSERT
    WITH CHECK (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Payments policies
CREATE POLICY "Users can view own payments"
    ON payments FOR SELECT
    USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Invoices policies
CREATE POLICY "Users can view own invoices"
    ON invoices FOR SELECT
    USING (customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid()));

-- Audit logs policies (users can only view their own logs)
CREATE POLICY "Users can view own audit logs"
    ON audit_logs FOR SELECT
    USING (
        customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
        OR user_id = auth.uid()
    );

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own documents"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM customers WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own documents"
    ON storage.objects FOR SELECT
    USING (
        bucket_id = 'documents' AND
        (storage.foldername(name))[1] IN (
            SELECT id::text FROM customers WHERE user_id = auth.uid()
        )
    );

-- Service role bypass (for webhooks and admin operations)
-- Note: The service role automatically bypasses RLS

-- Function to handle subscription status changes
CREATE OR REPLACE FUNCTION handle_subscription_past_due()
RETURNS TRIGGER AS $$
BEGIN
    -- If subscription becomes past_due, close the account
    IF NEW.subscription_status = 'past_due' AND OLD.subscription_status != 'past_due' THEN
        NEW.account_status = 'closed';
        
        -- Log the event
        INSERT INTO audit_logs (customer_id, action, details)
        VALUES (NEW.id, 'account_closed_past_due', jsonb_build_object(
            'previous_status', OLD.account_status,
            'subscription_status', NEW.subscription_status
        ));
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER subscription_status_change
    BEFORE UPDATE ON customers
    FOR EACH ROW
    WHEN (OLD.subscription_status IS DISTINCT FROM NEW.subscription_status)
    EXECUTE FUNCTION handle_subscription_past_due();

-- Grant permissions to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
