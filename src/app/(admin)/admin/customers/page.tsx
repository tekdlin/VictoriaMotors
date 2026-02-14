import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { listCustomers } from '@/server/services/customer.service';
import { formatCurrency, formatDate, capitalize } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge, Button } from '@/components/ui';
import { Users, Eye, Search, Filter } from 'lucide-react';

export default async function AdminCustomersPage() {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  const customers = await listCustomers({ orderBy: 'created_at', ascending: false });

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-victoria-navy-900">
            Customers
          </h1>
          <p className="text-victoria-slate-600 mt-1">
            Manage and view all customer accounts.
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card variant="bordered">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px] max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-victoria-slate-400" />
                <input
                  type="text"
                  placeholder="Search customers..."
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500"
                />
              </div>
            </div>
            <select className="px-4 py-2 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="payment_pending">Payment Pending</option>
              <option value="draft">Draft</option>
              <option value="closed">Closed</option>
            </select>
            <select className="px-4 py-2 rounded-lg border border-victoria-slate-300 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500">
              <option value="">All Types</option>
              <option value="individual">Individual</option>
              <option value="business">Business</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-victoria-navy-700" />
            All Customers ({customers.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {customers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left">Customer</th>
                    <th className="table-cell text-left">Type</th>
                    <th className="table-cell text-left">Status</th>
                    <th className="table-cell text-right">Purchase Value</th>
                    <th className="table-cell text-right">Deposit Paid</th>
                    <th className="table-cell text-left">Subscription</th>
                    <th className="table-cell text-left">Created</th>
                    <th className="table-cell text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer) => (
                    <tr key={customer.id} className="table-row">
                      <td className="table-cell">
                        <div>
                          <p className="font-medium text-victoria-navy-900">
                            {customer.account_type === 'business'
                              ? customer.business_name
                              : `${customer.first_name} ${customer.last_name}`}
                          </p>
                          <p className="text-sm text-victoria-slate-500">{customer.email}</p>
                        </div>
                      </td>
                      <td className="table-cell">
                        <Badge variant={customer.account_type === 'business' ? 'info' : 'default'}>
                          {capitalize(customer.account_type)}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <Badge status={customer.account_status}>
                          {capitalize(customer.account_status)}
                        </Badge>
                      </td>
                      <td className="table-cell text-right font-display font-semibold">
                        {formatCurrency(customer.purchase_value)}
                      </td>
                      <td className="table-cell text-right">
                        <span className="font-display font-semibold">
                          {formatCurrency(customer.security_deposit_paid)}
                        </span>
                        <span className="text-victoria-slate-500 text-sm">
                          {' '}/ {formatCurrency(customer.security_deposit_required)}
                        </span>
                      </td>
                      <td className="table-cell">
                        {customer.subscription_plan ? (
                          <div>
                            <p className="font-medium text-victoria-navy-900">
                              {capitalize(customer.subscription_plan)}
                            </p>
                            <Badge status={customer.subscription_status || 'pending'} className="mt-1">
                              {capitalize(customer.subscription_status || 'Pending')}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-victoria-slate-500">-</span>
                        )}
                      </td>
                      <td className="table-cell text-victoria-slate-600">
                        {formatDate(customer.created_at)}
                      </td>
                      <td className="table-cell text-center">
                        <Link href={`/admin/customers/${customer.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
              <p className="text-victoria-slate-600">No customers found</p>
              <p className="text-sm text-victoria-slate-500 mt-1">
                Customers will appear here once they register.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
