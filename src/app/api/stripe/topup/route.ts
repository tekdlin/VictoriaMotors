import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { createTopUpSession } from '@/server/services/stripe.service';

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getCurrentUser();
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const amount = body.amount as number;

    if (!amount || amount < 100) {
      return NextResponse.json(
        { error: 'Minimum top-up amount is $100' },
        { status: 400 }
      );
    }

    const customer = await getCustomerByUserId(user.id);
    if (!customer) {
      return NextResponse.json(
        { error: 'Customer not found' },
        { status: 404 }
      );
    }

    const { url, error: sessionError } = await createTopUpSession({
      amount: Math.round(amount * 100),
      stripeCustomerId: customer.stripe_customer_id,
      customerEmail: customer.email,
    });

    if (sessionError || !url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Top-up checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
