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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-victoria-navy-900">
          Invoices
        </h1>
        <p className="text-victoria-slate-600 mt-1">
          View and download your billing invoices.
        </p>
      </div>

      {/* Invoices Table */}
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-victoria-navy-700" />
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
                        <span className="font-mono text-sm text-victoria-navy-900">
                          #{invoice.stripe_invoice_id.slice(-8).toUpperCase()}
                        </span>
                      </td>
                      <td className="table-cell text-victoria-slate-600">
                        {formatDate(invoice.created_at)}
                      </td>
                      <td className="table-cell text-victoria-slate-600">
                        {invoice.period_start && invoice.period_end ? (
                          <span>
                            {formatDate(invoice.period_start)} - {formatDate(invoice.period_end)}
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
                        <div className="flex items-center justify-center gap-2">
                          {invoice.invoice_url && (
                            <a
                              href={invoice.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-victoria-slate-500 hover:text-victoria-navy-700 transition-colors"
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
                              className="p-2 text-victoria-slate-500 hover:text-victoria-navy-700 transition-colors"
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
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
              <p className="text-victoria-slate-600">No invoices found</p>
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
