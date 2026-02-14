import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { getAdminDashboardStats } from '@/server/services/admin.service';

export async function GET() {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // TODO: enforce admin role when RBAC is added
  const stats = await getAdminDashboardStats();
  return NextResponse.json(stats);
}
