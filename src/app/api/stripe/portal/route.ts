import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/server/services/auth.service';
import { getStripeCustomerId, createPortalSession } from '@/server/services/stripe.service';

export async function POST() {
  const { user, error } = await getCurrentUser();
  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const stripeCustomerId = await getStripeCustomerId('userId', user.id);
  if (!stripeCustomerId) {
    return NextResponse.json(
      { error: 'Customer not found' },
      { status: 404 }
    );
  }

  const { url, error: sessionError } = await createPortalSession(stripeCustomerId);
  if (sessionError || !url) {
    return NextResponse.json(
      { error: 'Failed to create portal session' },
      { status: 500 }
    );
  }

  return NextResponse.json({ url });
}
