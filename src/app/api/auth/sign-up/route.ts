import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/server/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, first_name, last_name, business_name, contact_name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user_metadata: Record<string, unknown> = {};
    if (first_name != null) user_metadata.first_name = first_name;
    if (last_name != null) user_metadata.last_name = last_name;
    if (business_name != null) user_metadata.business_name = business_name;
    if (contact_name != null) user_metadata.contact_name = contact_name;

    const { user, error } = await createUser({
      email,
      password,
      user_metadata: Object.keys(user_metadata).length ? user_metadata : undefined,
    });

    if (error) {
      const message =
        error.message === 'fetch failed'
          ? 'Cannot reach Supabase. Check SUPABASE_SERVICE_ROLE_KEY and NEXT_PUBLIC_SUPABASE_URL in .env.local, and that your Supabase project is not paused.'
          : error.message;
      return NextResponse.json({ error: message }, { status: 400 });
    }

    if (!user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred';
    console.error('Sign-up error:', err);
    return NextResponse.json(
      {
        error:
          message === 'fetch failed'
            ? 'Cannot reach Supabase. Check env vars and project status.'
            : message,
      },
      { status: 500 }
    );
  }
}
