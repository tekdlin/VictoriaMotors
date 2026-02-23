import { stripe, SUBSCRIPTION_PLANS, calculateSecurityDeposit } from '@/lib/stripe/config';
import { createAdminSupabaseClient } from '@/server/db/supabase';
import type { CustomerRow } from '@/server/types';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export type CreateCheckoutParams = {
  customerId: string;
  email: string;
  purchaseValue: number;
  subscriptionPlan: 'monthly' | 'yearly';
};

export async function createCheckoutSession(
  params: CreateCheckoutParams
): Promise<{ url: string | null; error: Error | null }> {
  const { customerId, email, purchaseValue, subscriptionPlan } = params;
  const plan = SUBSCRIPTION_PLANS[subscriptionPlan];
  if (!plan) return { url: null, error: new Error('Invalid subscription plan') };

  const securityDeposit = calculateSecurityDeposit(purchaseValue);
  const supabase = await createAdminSupabaseClient();
  const { data: customerData } = await supabase
    .from('customers')
    .select('stripe_customer_id')
    .eq('id', customerId)
    .single();

  const customer = customerData as Pick<CustomerRow, 'stripe_customer_id'> | null;
  let stripeCustomerId = customer?.stripe_customer_id ?? null;

  if (!stripeCustomerId) {
    const stripeCustomer = await stripe.customers.create({
      email,
      metadata: { supabase_customer_id: customerId },
    });
    stripeCustomerId = stripeCustomer.id;
    await (supabase.from('customers') as any)
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', customerId);
  }

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Security Deposit (Refundable)',
            description: `10% security deposit for vehicle purchase value of $${purchaseValue.toLocaleString()}`,
          },
          unit_amount: Math.round(securityDeposit * 100),
        },
        quantity: 1,
      },
      { price: plan.priceId, quantity: 1 },
    ],
    subscription_data: {
      trial_period_days: 7,
      metadata: {
        supabase_customer_id: customerId,
        plan: subscriptionPlan,
        security_deposit: securityDeposit.toString(),
        purchase_value: purchaseValue.toString(),
      },
    },
    metadata: {
      supabase_customer_id: customerId,
      security_deposit: securityDeposit.toString(),
      purchase_value: purchaseValue.toString(),
    },
    success_url: `${APP_URL}/portal`,
    cancel_url: `${APP_URL}/register?canceled=true`,
    allow_promotion_codes: true,
  });

  return { url: session.url, error: null };
}

export async function createPortalSession(
  stripeCustomerId: string
): Promise<{ url: string | null; error: Error | null }> {
  const session = await stripe.billingPortal.sessions.create({
    customer: stripeCustomerId,
    return_url: `${APP_URL}/portal`,
  });
  return { url: session.url ?? null, error: null };
}

export async function createTopUpSession(
  params: { amount: number; stripeCustomerId: string | null; customerEmail: string }
): Promise<{ url: string | null; error: Error | null }> {
  const session = await stripe.checkout.sessions.create({
    customer: params.stripeCustomerId || undefined,
    customer_email: params.stripeCustomerId ? undefined : params.customerEmail,
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Security Deposit Top-Up',
            description: `Add $${(params.amount / 100).toFixed(2)} to your security deposit`,
          },
          unit_amount: params.amount,
        },
        quantity: 1,
      },
    ],
    success_url: `${APP_URL}/portal?topup=success`,
    cancel_url: `${APP_URL}/portal/topup`,
  });
  return { url: session.url ?? null, error: null };
}

export async function getStripeCustomerId(
  by: 'customerId' | 'userId',
  id: string
): Promise<string | null> {
  const supabase = await createAdminSupabaseClient();
  const col = by === 'customerId' ? 'id' : 'user_id';
  const { data } = await supabase
    .from('customers')
    .select('stripe_customer_id, email')
    .eq(col, id)
    .single();
  const row = data as { stripe_customer_id: string | null; email: string } | null;
  return row?.stripe_customer_id ?? null;
}
