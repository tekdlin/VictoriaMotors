import { createServerSupabaseClient, createAdminSupabaseClient } from '@/server/db/supabase';
import type { PaymentRow, CustomerRow } from '@/server/types';

export async function getPaymentsByCustomerId(
  customerId: string,
  limit = 50
): Promise<PaymentRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('payments')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as PaymentRow[];
}

export async function getSucceededPayments(): Promise<
  Pick<PaymentRow, 'amount' | 'status' | 'payment_type'>[]
> {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from('payments')
    .select('amount, status, payment_type')
    .eq('status', 'succeeded');
  return (data ?? []) as Pick<PaymentRow, 'amount' | 'status' | 'payment_type'>[];
}

export function computePaymentStats(
  payments: Pick<PaymentRow, 'amount' | 'payment_type'>[]
): { totalDeposits: number; totalRevenue: number } {
  const totalDeposits = payments
    .filter(
      (p) =>
        p.payment_type === 'security_deposit' || p.payment_type === 'deposit_topup'
    )
    .reduce((sum, p) => sum + p.amount, 0);
  const totalRevenue = payments
    .filter((p) => p.payment_type === 'subscription')
    .reduce((sum, p) => sum + p.amount, 0);
  return { totalDeposits, totalRevenue };
}

export type PaymentWithCustomer = PaymentRow & {
  customers: Pick<CustomerRow, 'first_name' | 'last_name' | 'business_name' | 'account_type'> | null;
};

export async function getRecentPaymentsWithCustomer(limit = 5): Promise<PaymentWithCustomer[]> {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase
    .from('payments')
    .select('*, customers(first_name, last_name, business_name, account_type)')
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as PaymentWithCustomer[];
}
