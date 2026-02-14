import { createServerSupabaseClient } from '@/server/db/supabase';
import type { DocumentRow, DocumentInsert } from '@/server/types';

export async function createDocument(
  insert: DocumentInsert
): Promise<{ data: DocumentRow | null; error: Error | null }> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await (supabase.from('documents') as any)
    .insert(insert)
    .select()
    .single();
  return { data: data as DocumentRow | null, error: error ? new Error(error.message) : null };
}

export async function getDocumentsByCustomerId(
  customerId: string
): Promise<DocumentRow[]> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('documents')
    .select('*')
    .eq('customer_id', customerId)
    .order('uploaded_at', { ascending: false });
  return (data ?? []) as DocumentRow[];
}

export async function getCustomerForDocuments(
  userId: string
): Promise<{ id: string; account_type: 'individual' | 'business' } | null> {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase
    .from('customers')
    .select('id, account_type')
    .eq('user_id', userId)
    .single();
  return data as { id: string; account_type: 'individual' | 'business' } | null;
}
