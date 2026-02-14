import { createServerSupabaseClient, createAdminSupabaseClient } from '@/server/db/supabase';
import type { CustomerRow, CustomerInsert } from '@/server/types';

export async function getCustomerByUserId(userId: string): Promise<CustomerRow | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('customers')
    .select('*')
    .eq('user_id', userId)
    .single();
  return data as CustomerRow | null;
}

export async function getCustomerById(id: string): Promise<CustomerRow | null> {
  const supabase = await createAdminSupabaseClient();
  const { data } = await supabase.from('customers').select('*').eq('id', id).single();
  return data as CustomerRow | null;
}

export async function getCustomerProfileByUserId(
  userId: string
): Promise<Pick<CustomerRow, 'first_name' | 'last_name' | 'business_name' | 'account_type'> | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('customers')
    .select('first_name, last_name, business_name, account_type')
    .eq('user_id', userId)
    .single();
  return data as Pick<CustomerRow, 'first_name' | 'last_name' | 'business_name' | 'account_type'> | null;
}

/** Display name for UI (business name or "First Last") */
export function getCustomerDisplayName(
  customer: Pick<CustomerRow, 'account_type' | 'business_name' | 'first_name' | 'last_name'> | null,
  fallback?: string
): string {
  if (!customer) return fallback ?? '';
  if (customer.account_type === 'business' && customer.business_name) return customer.business_name;
  if (customer.first_name && customer.last_name) {
    return `${customer.first_name} ${customer.last_name}`;
  }
  return fallback ?? '';
}

export async function createCustomer(
  insert: CustomerInsert
): Promise<{ data: CustomerRow | null; error: Error | null }> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await (supabase.from('customers') as any)
    .insert(insert)
    .select()
    .single();
  return { data: data as CustomerRow | null, error: error ? new Error(error.message) : null };
}

export async function updateCustomerStripeId(
  customerId: string,
  stripeCustomerId: string
): Promise<{ error: Error | null }> {
  const supabase = await createAdminSupabaseClient();
  const { error } = await (supabase.from('customers') as any)
    .update({ stripe_customer_id: stripeCustomerId })
    .eq('id', customerId);
  return { error: error ? new Error(error.message) : null };
}

/** Admin: list all customers */
export async function listCustomers(options?: {
  orderBy?: keyof CustomerRow;
  ascending?: boolean;
  limit?: number;
}): Promise<CustomerRow[]> {
  const supabase = await createAdminSupabaseClient();
  let q = supabase.from('customers').select('*');
  q = q.order(options?.orderBy ?? 'created_at', {
    ascending: options?.ascending ?? false,
  });
  if (options?.limit) q = q.limit(options.limit);
  const { data } = await q;
  return (data ?? []) as CustomerRow[];
}

/** Admin: count customers, optionally by status */
export async function countCustomers(accountStatus?: CustomerRow['account_status']): Promise<number> {
  const supabase = await createAdminSupabaseClient();
  let q = supabase.from('customers').select('*', { count: 'exact', head: true });
  if (accountStatus) q = q.eq('account_status', accountStatus);
  const { count } = await q;
  return count ?? 0;
}
