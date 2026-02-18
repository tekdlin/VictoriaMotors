import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { getInvoicesByCustomerId } from '@/server/services/invoice.service';

export async function GET(request: NextRequest) {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const customer = await getCustomerByUserId(user.id);
  if (!customer) {
    return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.min(Number(searchParams.get('limit')) || 50, 100);
  const invoices = await getInvoicesByCustomerId(customer.id, limit);
  return NextResponse.json({ invoices });
}
