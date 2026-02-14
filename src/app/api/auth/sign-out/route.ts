import { NextResponse } from 'next/server';
import { signOut } from '@/server/services/auth.service';

export async function POST() {
  try {
    await signOut();
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Sign-out error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
