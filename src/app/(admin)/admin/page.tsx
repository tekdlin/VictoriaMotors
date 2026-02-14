import { getCurrentUser } from '@/server/services/auth.service';
import {
  getAdminDashboardStats,
  getRecentCustomers,
  getRecentPaymentsWithCustomer,
} from '@/server/services/admin.service';
import { formatCurrency, capitalize } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import {
  Users,
  DollarSign,
  CreditCard,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function AdminDashboardPage() {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  const [stats, recentCustomers, recentPayments] = await Promise.all([
    getAdminDashboardStats(),
    getRecentCustomers(5),
    getRecentPaymentsWithCustomer(5),
  ]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-victoria-navy-900">
          Admin Dashboard
        </h1>
        <p className="text-victoria-slate-600 mt-1">
          Overview of Victoria Motors operations.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-victoria-navy-700" />
              </div>
              <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-sm text-victoria-slate-600">Total Customers</p>
            <p className="text-3xl font-display font-bold text-victoria-navy-900 mt-1">
              {stats.totalCustomers}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-emerald-700" />
              </div>
            </div>
            <p className="text-sm text-victoria-slate-600">Active Customers</p>
            <p className="text-3xl font-display font-bold text-victoria-navy-900 mt-1">
              {stats.activeCustomers}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-victoria-gold-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-victoria-gold-700" />
              </div>
            </div>
            <p className="text-sm text-victoria-slate-600">Total Deposits</p>
            <p className="text-3xl font-display font-bold text-victoria-navy-900 mt-1">
              {formatCurrency(stats.totalDeposits)}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-blue-700" />
              </div>
            </div>
            <p className="text-sm text-victoria-slate-600">Subscription Revenue</p>
            <p className="text-3xl font-display font-bold text-victoria-navy-900 mt-1">
              {formatCurrency(stats.totalRevenue)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {stats.pendingCustomers > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800">Pending Registrations</p>
            <p className="text-sm text-amber-700">
              {stats.pendingCustomers} customer(s) are awaiting payment completion.
            </p>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Customers */}
        <Card variant="bordered">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-victoria-navy-700" />
              Recent Customers
            </CardTitle>
            <Link
              href="/admin/customers"
              className="text-sm text-victoria-navy-700 hover:text-victoria-navy-900"
            >
              View All →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentCustomers.length > 0 ? (
              <div className="divide-y divide-victoria-slate-100">
                {recentCustomers.map((customer) => (
                  <div key={customer.id} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-victoria-navy-900">
                        {customer.account_type === 'business'
                          ? customer.business_name
                          : `${customer.first_name} ${customer.last_name}`}
                      </p>
                      <p className="text-sm text-victoria-slate-500">{customer.email}</p>
                    </div>
                    <div className="text-right">
                      <Badge status={customer.account_status}>
                        {capitalize(customer.account_status)}
                      </Badge>
                      <p className="text-xs text-victoria-slate-500 mt-1">
                        {capitalize(customer.account_type)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
                <p className="text-victoria-slate-600">No customers yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Payments */}
        <Card variant="bordered">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-victoria-navy-700" />
              Recent Payments
            </CardTitle>
            <Link
              href="/admin/payments"
              className="text-sm text-victoria-navy-700 hover:text-victoria-navy-900"
            >
              View All →
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentPayments.length > 0 ? (
              <div className="divide-y divide-victoria-slate-100">
                {recentPayments.map((payment) => {
                  const customerData = payment.customers;
                  return (
                    <div key={payment.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-victoria-navy-900">
                          {customerData?.account_type === 'business'
                            ? customerData?.business_name
                            : `${customerData?.first_name || 'Unknown'} ${customerData?.last_name || ''}`}
                        </p>
                        <p className="text-sm text-victoria-slate-500">
                          {capitalize(payment.payment_type.replace('_', ' '))}
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
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
                <p className="text-victoria-slate-600">No payments yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
