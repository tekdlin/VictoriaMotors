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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-victoria-navy-900">
            Dashboard
          </h1>
          <p className="text-victoria-slate-600 mt-1">
            Welcome back! Here&apos;s an overview of your account.
          </p>
        </div>
        <Link href="/portal/topup">
          <Button variant="secondary">
            <PlusCircle className="w-4 h-4 mr-2" />
            Add to Deposit
          </Button>
        </Link>
      </div>

      {/* Account Status Alert */}
      {customer.account_status !== 'active' && (
        <div
          className={`p-4 rounded-xl flex items-start gap-3 ${
            customer.account_status === 'payment_pending'
              ? 'bg-amber-50 border border-amber-200'
              : 'bg-red-50 border border-red-200'
          }`}
        >
          <AlertCircle
            className={`w-5 h-5 mt-0.5 ${
              customer.account_status === 'payment_pending'
                ? 'text-amber-600'
                : 'text-red-600'
            }`}
          />
          <div>
            <p
              className={`font-medium ${
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
              className={`text-sm ${
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
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center">
                <Car className="w-6 h-6 text-victoria-navy-700" />
              </div>
              <Badge status={customer.account_status}>
                {capitalize(customer.account_status)}
              </Badge>
            </div>
            <p className="text-sm text-victoria-slate-600">Customer Number</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1">
              {customer.customer_number || 'Pending'}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-gold-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-victoria-gold-700" />
              </div>
            </div>
            <p className="text-sm text-victoria-slate-600">Purchase Value</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1">
              {formatCurrency(customer.purchase_value)}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
            <p className="text-sm text-victoria-slate-600">Security Deposit</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1">
              {formatCurrency(customer.security_deposit_paid)}
              <span className="text-sm font-normal text-victoria-slate-500">
                {' '}/ {formatCurrency(customer.security_deposit_required)}
              </span>
            </p>
            <div className="mt-2 h-2 bg-victoria-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all"
                style={{ width: `${Math.min(depositProgress, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-700" />
              </div>
              <Badge status={customer.subscription_status || 'pending'}>
                {capitalize(customer.subscription_status || 'Pending')}
              </Badge>
            </div>
            <p className="text-sm text-victoria-slate-600">Subscription</p>
            <p className="text-xl font-display font-bold text-victoria-navy-900 mt-1">
              {capitalize(customer.subscription_plan || 'None')} Plan
            </p>
            {customer.subscription_current_period_end && (
              <p className="text-xs text-victoria-slate-500 mt-1">
                Renews {formatDate(customer.subscription_current_period_end)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="bordered">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-victoria-navy-700" />
                Recent Payments
              </CardTitle>
              <Link
                href="/portal/payments"
                className="text-sm text-victoria-navy-700 hover:text-victoria-navy-900"
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
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-victoria-navy-900">
                          {capitalize(payment.payment_type.replace('_', ' '))}
                        </p>
                        <p className="text-sm text-victoria-slate-500">
                          {formatDate(payment.created_at)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-semibold text-victoria-navy-900">
                          {formatCurrency(payment.amount)}
                        </p>
                        <Badge status={payment.status} className="mt-1">
                          {capitalize(payment.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-victoria-slate-500 text-center py-8">
                  No payments yet
                </p>
              )}
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-victoria-navy-700" />
                Recent Invoices
              </CardTitle>
              <Link
                href="/portal/invoices"
                className="text-sm text-victoria-navy-700 hover:text-victoria-navy-900"
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
                      className="py-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-victoria-navy-900">
                          Invoice #{invoice.stripe_invoice_id.slice(-8)}
                        </p>
                        <p className="text-sm text-victoria-slate-500">
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
                            className="text-victoria-slate-400 hover:text-victoria-navy-700"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-victoria-slate-500 text-center py-8">
                  No invoices yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Account Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-victoria-slate-500">Account Type</p>
                <p className="font-medium text-victoria-navy-900">
                  {capitalize(customer.account_type)}
                </p>
              </div>
              <div>
                <p className="text-sm text-victoria-slate-500">Email</p>
                <p className="font-medium text-victoria-navy-900">{customer.email}</p>
              </div>
              {customer.phone && (
                <div>
                  <p className="text-sm text-victoria-slate-500">Phone</p>
                  <p className="font-medium text-victoria-navy-900">{customer.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-victoria-slate-500">Vehicle Title Status</p>
                <Badge status={customer.vehicle_title_status} className="mt-1">
                  {capitalize(customer.vehicle_title_status)}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="bordered">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
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

          <Card variant="bordered" className="bg-victoria-navy-900 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="w-5 h-5 text-victoria-gold-400" />
                <span className="text-victoria-slate-300">Member Since</span>
              </div>
              <p className="font-display text-2xl font-bold">
                {formatDate(customer.created_at)}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
