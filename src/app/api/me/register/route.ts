import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { createCustomer } from '@/server/services/customer.service';
import type { RegisterCustomerBody } from '@/types/api';

export async function POST(request: NextRequest) {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = (await request.json()) as RegisterCustomerBody;
    const { data: customer, error: createError } = await createCustomer({
      ...body,
      user_id: user.id,
    });

    if (createError) {
      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    if (!customer) {
      return NextResponse.json(
        { error: 'Failed to create customer' },
        { status: 500 }
      );
    }

    return NextResponse.json({ customer });
  } catch (err) {
    console.error('Register customer error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
