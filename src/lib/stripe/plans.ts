/**
 * Client-safe Stripe plan config and helpers.
 * Use this in Client Components. For server-only Stripe API, use @/lib/stripe/config.
 */

export type SubscriptionPlanItem = {
  id: 'monthly' | 'fiscal';
  name: string;
  price: number;
  interval: 'month' | 'year';
  priceId: string;
  trialDays: number;
  features: string[];
};

export const SUBSCRIPTION_PLANS: Record<string, SubscriptionPlanItem> = {
  monthly: {
    id: 'monthly',
    name: 'Monthly Plan',
    price: 49.99,
    interval: 'month',
    priceId: typeof process !== 'undefined' ? process.env.STRIPE_MONTHLY_PRICE_ID || '' : '',
    trialDays: 7,
    features: [
      '7-day free trial',
      'Full portal access',
      'Real-time account tracking',
      'Document management',
      'Payment history',
      'Email support',
    ],
  },
  fiscal: {
    id: 'fiscal',
    name: 'Fiscal Subscription',
    price: 249.99,
    interval: 'year',
    priceId: typeof process !== 'undefined' ? process.env.STRIPE_FISCAL_PRICE_ID || process.env.STRIPE_YEARLY_PRICE_ID || '' : '',
    trialDays: 7,
    features: [
      '7-day free trial',
      'Everything in Monthly',
      '2 months free',
      'Priority support',
      'Early access to new features',
      'Dedicated account manager',
    ],
  },
};

const MIN_SECURITY_DEPOSIT = 650;

export function calculateSecurityDeposit(purchaseValue: number): number {
  const tenPercent = Math.round(purchaseValue * 0.1 * 100) / 100;
  return Math.max(MIN_SECURITY_DEPOSIT, tenPercent);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}
