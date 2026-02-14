/**
 * Server-only Stripe config. Do not import this from Client Components.
 * Use @/lib/stripe/plans in client code (SUBSCRIPTION_PLANS, formatCurrency, calculateSecurityDeposit).
 */
import Stripe from 'stripe';

export {
  SUBSCRIPTION_PLANS,
  calculateSecurityDeposit,
  formatCurrency,
} from './plans';

if (!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set');
}

export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
  apiVersion: '2024-04-10',
  typescript: true,
});

