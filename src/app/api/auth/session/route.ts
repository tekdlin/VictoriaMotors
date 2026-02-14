import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';

export async function GET() {
  const { user, error } = await getCurrentUser();
  if (error) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    user: user ? { id: user.id, email: user.email ?? undefined } : null,
  });
}
