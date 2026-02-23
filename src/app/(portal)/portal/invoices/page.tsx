import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { getInvoicesByCustomerId } from '@/server/services/invoice.service';
import { formatCurrency, formatDate, capitalize } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { FileText, Download, ExternalLink } from 'lucide-react';

export default async function InvoicesPage() {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  const customer = await getCustomerByUserId(user.id);
  if (!customer) redirect('/register');

  const invoices = await getInvoicesByCustomerId(customer.id);

  return (
    <div className="space-y-8 lg:space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-victoria-gold-600 uppercase tracking-widest mb-2">
          Billing
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-victoria-navy-900 tracking-tight">
          Invoices
        </h1>
        <p className="text-victoria-slate-600 mt-1.5 max-w-lg">
          View and download your billing invoices.
        </p>
      </div>

      {/* Invoices Table */}
      <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-9 h-9 rounded-xl bg-victoria-navy-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-victoria-navy-700" />
            </div>
            All Invoices
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {invoices.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left">Invoice</th>
                    <th className="table-cell text-left">Date</th>
                    <th className="table-cell text-left">Period</th>
                    <th className="table-cell text-right">Amount</th>
                    <th className="table-cell text-center">Status</th>
                    <th className="table-cell text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.map((invoice) => (
                    <tr key={invoice.id} className="table-row">
                      <td className="table-cell">
                        <span className="font-mono text-sm font-medium text-victoria-navy-900">
                          #{invoice.stripe_invoice_id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell text-victoria-slate-600">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td className="table-cell text-victoria-slate-600">
                        {invoice.period_start && invoice.period_end ? (
                          <span>
                            {formatDate(invoice.period_start)} – {formatDate(invoice.period_end)}
                          </span>
                        ) : (
                          '-'
                        )}
                      </td>
                      <td className="table-cell text-right font-display font-semibold text-victoria-navy-900">
                        {formatCurrency(invoice.amount)}
                      </td>
                      <td className="table-cell text-center">
                        <Badge status={invoice.status}>
                          {capitalize(invoice.status)}
                        </Badge>
                      </td>
                      <td className="table-cell">
                        <div className="flex items-center justify-center gap-1">
                          {invoice.invoice_url && (
                            <a
                              href={invoice.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-victoria-slate-500 hover:text-victoria-navy-700 hover:bg-victoria-slate-100 rounded-lg transition-colors"
                              title="View Invoice"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          {invoice.invoice_pdf && (
                            <a
                              href={invoice.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-victoria-slate-500 hover:text-victoria-navy-700 hover:bg-victoria-slate-100 rounded-lg transition-colors"
                              title="Download PDF"
                            >
                              <Download className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-14">
              <FileText className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
              <p className="text-victoria-slate-600 font-medium">No invoices found</p>
              <p className="text-sm text-victoria-slate-500 mt-1">
                Your invoices will appear here after your first subscription payment.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
