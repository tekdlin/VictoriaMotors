import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { getPaymentsByCustomerId } from '@/server/services/payment.service';
import { computePaymentStats } from '@/server/services/payment.service';
import { formatCurrency, formatDateTime, capitalize } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { CreditCard, ArrowDownRight, ArrowUpRight, RefreshCw } from 'lucide-react';

export default async function PaymentsPage() {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  const customer = await getCustomerByUserId(user.id);
  if (!customer) redirect('/register');

  const payments = await getPaymentsByCustomerId(customer.id);
  const { totalDeposits, totalRevenue } = computePaymentStats(
    payments.filter((p) => p.status === 'succeeded')
  );
  const totalSubscription = totalRevenue;
  const totalRefunds = payments
    .filter((p) => p.payment_type === 'refund')
    .reduce((sum, p) => sum + p.amount, 0);

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'security_deposit':
      case 'deposit_topup':
        return ArrowDownRight;
      case 'subscription':
        return RefreshCw;
      case 'refund':
        return ArrowUpRight;
      default:
        return CreditCard;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-victoria-navy-900">
          Payment History
        </h1>
        <p className="text-victoria-slate-600 mt-1">
          View all your payments and transactions.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <ArrowDownRight className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-sm text-victoria-slate-600">Total Deposits</span>
            </div>
            <p className="text-2xl font-display font-bold text-victoria-navy-900">
              {formatCurrency(totalDeposits)}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-sm text-victoria-slate-600">Subscription Payments</span>
            </div>
            <p className="text-2xl font-display font-bold text-victoria-navy-900">
              {formatCurrency(totalSubscription)}
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <ArrowUpRight className="w-5 h-5 text-amber-600" />
              </div>
              <span className="text-sm text-victoria-slate-600">Total Refunds</span>
            </div>
            <p className="text-2xl font-display font-bold text-victoria-navy-900">
              {formatCurrency(totalRefunds)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payments Table */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-victoria-navy-700" />
            All Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {payments && payments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left">Date</th>
                    <th className="table-cell text-left">Type</th>
                    <th className="table-cell text-left">Description</th>
                    <th className="table-cell text-right">Amount</th>
                    <th className="table-cell text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const Icon = getPaymentIcon(payment.payment_type);
                    return (
                      <tr key={payment.id} className="table-row">
                        <td className="table-cell">
                          <span className="text-victoria-slate-600">
                            {formatDateTime(payment.created_at)}
                          </span>
                        </td>
                        <td className="table-cell">
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-victoria-slate-400" />
                            <span className="font-medium text-victoria-navy-900">
                              {capitalize(payment.payment_type.replace('_', ' '))}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <span className="text-victoria-slate-600">
                            {payment.description || '-'}
                          </span>
                        </td>
                        <td className="table-cell text-right">
                          <span className={`font-display font-semibold ${
                            payment.payment_type === 'refund'
                              ? 'text-emerald-600'
                              : 'text-victoria-navy-900'
                          }`}>
                            {payment.payment_type === 'refund' ? '+' : ''}
                            {formatCurrency(payment.amount)}
                          </span>
                        </td>
                        <td className="table-cell text-center">
                          <Badge status={payment.status}>
                            {capitalize(payment.status)}
                          </Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <CreditCard className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
              <p className="text-victoria-slate-600">No payments found</p>
              <p className="text-sm text-victoria-slate-500 mt-1">
                Your payment history will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
