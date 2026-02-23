import { cache } from 'react';
import { createServerSupabaseClient, createAdminSupabaseClient } from '@/server/db/supabase';

/**
 * Cached per-request so layout and page (and multiple components) share one auth call.
 * Makes navigation between authenticated pages feel instant instead of double-fetching.
 */
export const getCurrentUser = cache(async () => {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error) return { user: null, error };
  return { user, error: null };
});

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { user: null, error };
  return { user: data.user, error: null };
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
}

export async function resetPasswordForEmail(email: string) {
  const supabase = await createServerSupabaseClient();
  const redirectTo = `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  });
  if (error) return { error };
  return { error: null };
}

export async function updatePassword(password: string) {
  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error };
  return { error: null };
}

export async function createUser(params: {
  email: string;
  password: string;
  user_metadata?: Record<string, unknown>;
}) {
  const supabase = await createAdminSupabaseClient();
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
  });
  if (error) return { user: null, error };
  return { user: data.user, error: null };
}
