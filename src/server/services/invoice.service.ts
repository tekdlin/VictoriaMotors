import { createServerSupabaseClient } from '@/server/db/supabase';
import type { InvoiceRow } from '@/server/types';

export async function getInvoicesByCustomerId(
  customerId: string,
  limit = 50
): Promise<InvoiceRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('invoices')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(limit);
  return (data ?? []) as InvoiceRow[];
}
