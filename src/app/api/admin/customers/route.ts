import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { listCustomers } from '@/server/services/customer.service';

export async function GET() {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // TODO: enforce admin role when RBAC is added
  const customers = await listCustomers({ orderBy: 'created_at', ascending: false });
  return NextResponse.json({ customers });
}
