import { NextRequest, NextResponse } from 'next/server';
import { createCheckoutSession } from '@/server/services/stripe.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customerId, email, purchaseValue, subscriptionPlan } = body;

    if (!customerId || !email || !purchaseValue || !subscriptionPlan) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { url, error } = await createCheckoutSession({
      customerId,
      email,
      purchaseValue,
      subscriptionPlan,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    if (!url) {
      return NextResponse.json(
        { error: 'Failed to create checkout session' },
        { status: 500 }
      );
    }

    return NextResponse.json({ url });
  } catch (err) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
