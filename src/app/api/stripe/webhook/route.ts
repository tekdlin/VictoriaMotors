import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/config';
import { createAdminSupabaseClient } from '@/lib/supabase/server';
import type { Database } from '@/types/supabase';

type CustomerRow = Database['public']['Tables']['customers']['Row'];

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headersList = await headers();
  const signature = headersList.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const supabase = await createAdminSupabaseClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        let customerId = session.metadata?.supabase_customer_id ?? null;
        let securityDeposit = parseFloat(session.metadata?.security_deposit || '0');

        // In subscription mode, session metadata can be empty; get from subscription if needed
        if ((!customerId || securityDeposit === 0) && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string);
          const meta = sub.metadata ?? {};
          customerId = customerId ?? meta.supabase_customer_id ?? null;
          if (securityDeposit === 0 && meta.security_deposit) {
            securityDeposit = parseFloat(meta.security_deposit);
          }
        }

        if (customerId) {
          const { error: updateError } = await (supabase.from('customers') as any)
            .update({
              account_status: 'active',
              security_deposit_paid: securityDeposit,
              stripe_subscription_id: session.subscription as string,
              subscription_status: 'active',
            })
            .eq('id', customerId);

          if (updateError) {
            console.error('checkout.session.completed: customer update failed', updateError);
          }

          // Record the payment
          await (supabase.from('payments') as any).insert({
            customer_id: customerId,
            stripe_payment_intent_id: session.payment_intent as string,
            amount: securityDeposit,
            currency: 'usd',
            payment_type: 'security_deposit',
            status: 'succeeded',
            description: 'Initial security deposit',
          });

          // Log the event
          await (supabase.from('audit_logs') as any).insert({
            customer_id: customerId,
            action: 'account_activated',
            details: {
              session_id: session.id,
              security_deposit: securityDeposit,
            },
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          // Find customer by subscription ID
          const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          const customer = customerData as Pick<CustomerRow, 'id'> | null;
          if (customer) {
            // Record invoice
            await (supabase.from('invoices') as any).insert({
              customer_id: customer.id,
              stripe_invoice_id: invoice.id,
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency,
              status: 'paid',
              invoice_url: invoice.hosted_invoice_url,
              invoice_pdf: invoice.invoice_pdf,
              period_start: invoice.period_start
                ? new Date(invoice.period_start * 1000).toISOString()
                : null,
              period_end: invoice.period_end
                ? new Date(invoice.period_end * 1000).toISOString()
                : null,
            });

            // Record subscription payment
            await (supabase.from('payments') as any).insert({
              customer_id: customer.id,
              stripe_invoice_id: invoice.id,
              amount: (invoice.amount_paid || 0) / 100,
              currency: invoice.currency,
              payment_type: 'subscription',
              status: 'succeeded',
              description: 'Subscription payment',
            });
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          const customer = customerData as Pick<CustomerRow, 'id'> | null;
          if (customer) {
            await (supabase.from('audit_logs') as any).insert({
              customer_id: customer.id,
              action: 'payment_failed',
              details: {
                invoice_id: invoice.id,
                amount: (invoice.amount_due || 0) / 100,
              },
            });
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.metadata?.supabase_customer_id;

        if (customerId) {
          const updates: Record<string, unknown> = {
            subscription_status: subscription.status as string,
            subscription_current_period_end: new Date(
              subscription.current_period_end * 1000
            ).toISOString(),
          };
          const securityDepositFromMeta = subscription.metadata?.security_deposit
            ? parseFloat(subscription.metadata.security_deposit)
            : 0;
          if (securityDepositFromMeta > 0) {
            const { data: existing } = await supabase
              .from('customers')
              .select('security_deposit_paid')
              .eq('id', customerId)
              .single();
            const current = (existing as { security_deposit_paid?: number } | null)?.security_deposit_paid ?? 0;
            if (current === 0) {
              updates.security_deposit_paid = securityDepositFromMeta;
            }
          }
          await (supabase.from('customers') as any)
            .update(updates)
            .eq('id', customerId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.metadata?.supabase_customer_id;

        if (customerId) {
          await (supabase.from('customers') as any)
            .update({
              subscription_status: 'canceled',
              account_status: 'closed',
            })
            .eq('id', customerId);

          await (supabase.from('audit_logs') as any).insert({
            customer_id: customerId,
            action: 'subscription_canceled',
            details: { subscription_id: subscription.id },
          });
        }
        break;
      }

      case 'invoice.upcoming': {
        // Handle upcoming invoice notification (for renewal reminders)
        const invoice = event.data.object as Stripe.Invoice;
        const subscriptionId = invoice.subscription as string;

        if (subscriptionId) {
          const { data: customerData } = await supabase
            .from('customers')
            .select('id, email')
            .eq('stripe_subscription_id', subscriptionId)
            .single();

          const customer = customerData as Pick<CustomerRow, 'id' | 'email'> | null;
          if (customer) {
            // Log for potential email notification
            await (supabase.from('audit_logs') as any).insert({
              customer_id: customer.id,
              action: 'renewal_reminder',
              details: {
                amount: (invoice.amount_due || 0) / 100,
                due_date: invoice.due_date
                  ? new Date(invoice.due_date * 1000).toISOString()
                  : null,
              },
            });
          }
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
