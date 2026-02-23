'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatCurrency, formatDate, capitalize } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import {
  CreditCard,
  FileText,
  TrendingUp,
  Calendar,
  PlusCircle,
  ExternalLink,
  Car,
  Shield,
  Clock,
  AlertCircle,
} from 'lucide-react';
import { ManageSubscriptionButton } from '@/components/features/ManageSubscriptionButton';
import { useMe, useMePayments, useMeInvoices } from '@/hooks/api';

export default function PortalDashboardPage() {
  const router = useRouter();
  const customerQuery = useMe();
  const paymentsQuery = useMePayments({ limit: 5, enabled: !!customerQuery.data });
  const invoicesQuery = useMeInvoices({ limit: 3, enabled: !!customerQuery.data });

  const customer = customerQuery.data;
  const recentPayments = paymentsQuery.data ?? [];
  const recentInvoices = invoicesQuery.data ?? [];

  useEffect(() => {
    if (!customerQuery.error) return;
    const msg = (customerQuery.error as Error).message ?? '';
    if (msg.includes('Unauthorized')) {
      router.replace('/login');
      return;
    }
    if (msg.includes('Customer not found')) {
      router.replace('/register');
    }
  }, [customerQuery.error, router]);

  const authErrorMsg = customerQuery.error ? (customerQuery.error as Error).message ?? '' : '';
  const isAuthRedirect =
    authErrorMsg.includes('Unauthorized') || authErrorMsg.includes('Customer not found');

  if (customerQuery.isLoading || (customerQuery.isError && isAuthRedirect)) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-victoria-navy-900 border-t-transparent" />
        <p className="mt-4 text-sm text-victoria-slate-600">
          {customerQuery.isError && isAuthRedirect ? 'Redirecting…' : 'Loading your dashboard…'}
        </p>
      </div>
    );
  }

  if (customerQuery.isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
        <p className="font-medium text-red-800">Could not load your dashboard</p>
        <p className="mt-1 text-sm text-red-700">
          {(customerQuery.error as Error).message}
        </p>
      </div>
    );
  }

  if (!customer) return null;

  const depositProgress =
    customer.security_deposit_required > 0
      ? (customer.security_deposit_paid / customer.security_deposit_required) * 100
      : 0;

  return (
    <div className="space-y-8 lg:space-y-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-victoria-gold-600 uppercase tracking-widest mb-2">
            Your account
          </p>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-victoria-navy-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-victoria-slate-600 mt-1.5 text-sm leading-relaxed max-w-lg">
            Welcome back! Here&apos;s an overview of your account and recent activity.
          </p>
        </div>
        <Link href="/portal/topup" className="shrink-0">
          <Button variant="secondary" size="lg">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add to Deposit
          </Button>
        </Link>
      </div>

      {/* Account Status Alert */}
      {customer.account_status !== 'active' && (
        <div
          className={`p-5 rounded-2xl flex items-start gap-4 border ${
            customer.account_status === 'payment_pending'
              ? 'bg-amber-50/95 border-amber-200/80'
              : 'bg-red-50/95 border-red-200/80'
          }`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            customer.account_status === 'payment_pending' ? 'bg-amber-100' : 'bg-red-100'
          }`}>
            <AlertCircle
              className={`w-5 h-5 ${
                customer.account_status === 'payment_pending'
                  ? 'text-amber-600'
                  : 'text-red-600'
              }`}
            />
          </div>
          <div>
            <p
              className={`font-semibold ${
                customer.account_status === 'payment_pending'
                  ? 'text-amber-800'
                  : 'text-red-800'
              }`}
            >
              {customer.account_status === 'payment_pending'
                ? 'Payment Required'
                : 'Account Closed'}
            </p>
            <p
              className={`text-sm mt-1 ${
                customer.account_status === 'payment_pending'
                  ? 'text-amber-700'
                  : 'text-red-700'
              }`}
            >
              {customer.account_status === 'payment_pending'
                ? 'Please complete your payment to activate your account.'
                : 'Your account has been closed. Please contact support for assistance.'}
            </p>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card variant="elevated" className="rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center border border-victoria-navy-200/50">
                <Car className="w-6 h-6 text-victoria-navy-700" />
              </div>
              <Badge status={customer.account_status}>
                {capitalize(customer.account_status)}
              </Badge>
            </div>
            <p className="text-sm font-medium text-victoria-slate-500 uppercase tracking-wide">Customer Number</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1 tracking-tight">
              {customer.customer_number || 'VM-098275'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated" className="rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-gold-100 rounded-xl flex items-center justify-center border border-victoria-gold-200/60">
                <TrendingUp className="w-6 h-6 text-victoria-gold-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-victoria-slate-500 uppercase tracking-wide">Purchase Value</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1 tracking-tight">
              {formatCurrency(customer.purchase_value)}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated" className="rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center border border-emerald-200/60">
                <Shield className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
            <p className="text-sm font-medium text-victoria-slate-500 uppercase tracking-wide">Security Deposit</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1 tracking-tight">
              {formatCurrency(customer.security_deposit_paid)}
              <span className="text-sm font-normal text-victoria-slate-500">
                {' '}/ {formatCurrency(customer.security_deposit_required)}
              </span>
            </p>
            <div className="mt-3 h-2 bg-victoria-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(depositProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center border border-victoria-navy-200/50">
                <Calendar className="w-6 h-6 text-victoria-navy-600" />
              </div>
              <Badge status={customer.subscription_status || 'pending'}>
                {capitalize(customer.subscription_status || 'Pending')}
              </Badge>
            </div>
            <p className="text-sm font-medium text-victoria-slate-500 uppercase tracking-wide">Subscription</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1 tracking-tight">
              {capitalize(customer.subscription_plan || 'None')} Plan
            </p>
            {customer.subscription_current_period_end && (
              <p className="text-xs text-victoria-slate-500 mt-1.5">
                Renews {formatDate(customer.subscription_current_period_end)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-9 h-9 rounded-xl bg-victoria-navy-50 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-victoria-navy-700" />
                </div>
                Recent Payments
              </CardTitle>
              <Link
                href="/portal/payments"
                className="text-sm font-medium text-victoria-gold-600 hover:text-victoria-gold-700 transition-colors"
              >
                View All →
              </Link>
            </CardHeader>
            <CardContent>
              {recentPayments.length > 0 ? (
                <div className="divide-y divide-victoria-slate-100">
                  {recentPayments.map((payment) => (
                    <div
                      key={payment.id}
                      className="py-4 flex items-center justify-between first:pt-0"
                    >
                      <div>
                        <p className="font-medium text-victoria-navy-900">
                          {capitalize(payment.payment_type.replace('_', ' '))}
                        </p>
                        <p className="text-sm text-victoria-slate-500 mt-0.5">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      <div className="text-right flex items-center gap-3">
                        <p className="font-display font-semibold text-victoria-navy-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <Badge status={payment.status}>
                          {capitalize(payment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <CreditCard className="w-10 h-10 text-victoria-slate-300 mx-auto mb-3" />
                  <p className="text-victoria-slate-600 font-medium">No payments yet</p>
                  <p className="text-sm text-victoria-slate-500 mt-1">Your recent payments will appear here.</p>
                  <Link href="/portal/topup" className="inline-block mt-4">
                    <Button variant="outline" size="sm">Add to deposit</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="w-9 h-9 rounded-xl bg-victoria-navy-50 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-victoria-navy-700" />
                </div>
                Recent Invoices
              </CardTitle>
              <Link
                href="/portal/invoices"
                className="text-sm font-medium text-victoria-gold-600 hover:text-victoria-gold-700 transition-colors"
              >
                View All →
              </Link>
            </CardHeader>
            <CardContent>
              {recentInvoices.length > 0 ? (
                <div className="divide-y divide-victoria-slate-100">
                  {recentInvoices.map((invoice) => (
                    <div
                      key={invoice.id}
                      className="py-4 flex items-center justify-between first:pt-0"
                    >
                      <div>
                        <p className="font-medium text-victoria-navy-900">
                          Invoice #{invoice.stripe_invoice_id.slice(-8)}
                        </p>
                        <p className="text-sm text-victoria-slate-500 mt-0.5">
                          {formatDate(invoice.created_at)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-display font-semibold text-victoria-navy-900">
                            {formatCurrency(invoice.amount)}
                          </p>
                          <Badge status={invoice.status} className="mt-1">
                            {capitalize(invoice.status)}
                          </Badge>
                        </div>
                        {invoice.invoice_url && (
                          <a
                            href={invoice.invoice_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-victoria-slate-400 hover:text-victoria-navy-700 rounded-lg hover:bg-victoria-slate-100 transition-colors"
                            aria-label="View invoice"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <FileText className="w-10 h-10 text-victoria-slate-300 mx-auto mb-3" />
                  <p className="text-victoria-slate-600 font-medium">No invoices yet</p>
                  <p className="text-sm text-victoria-slate-500 mt-1">Invoices will appear after subscription payments.</p>
                  <Link href="/portal/invoices" className="inline-block mt-4">
                    <Button variant="outline" size="sm">View invoices</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-xs font-medium text-victoria-slate-500 uppercase tracking-wide">Account Type</p>
                <p className="font-medium text-victoria-navy-900 mt-1">
                  {capitalize(customer.account_type)}
                </p>
              </div>
              <div>
                <p className="text-xs font-medium text-victoria-slate-500 uppercase tracking-wide">Email</p>
                <p className="font-medium text-victoria-navy-900 mt-1 break-all">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-xs font-medium text-victoria-slate-500 uppercase tracking-wide">Phone</p>
                  <p className="font-medium text-victoria-navy-900 mt-1">{customer.phone}</p>
                </div>
              )}
              <div>
                <p className="text-xs font-medium text-victoria-slate-500 uppercase tracking-wide">Vehicle Title Status</p>
                <Badge status={customer.vehicle_title_status} className="mt-1.5">
                  {capitalize(customer.vehicle_title_status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/portal/topup" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Top Up Deposit
                </Button>
              </Link>
              <ManageSubscriptionButton />
              <Link href="/portal/documents" className="block">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  View Documents
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="relative rounded-3xl bg-victoria-navy-900 text-white border-0 shadow-victoria overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-victoria-gold-500/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" aria-hidden />
            <CardContent className="p-6 relative">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-victoria-gold-400" />
                </div>
                <span className="text-sm font-medium text-white/80 uppercase tracking-wider">Member Since</span>
              </div>
              <p className="font-display text-2xl font-bold tracking-tight">
                {formatDate(customer.created_at)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
