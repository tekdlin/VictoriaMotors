import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { getDocumentsByCustomerId } from '@/server/services/document.service';
import { formatDate, capitalize, cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui';
import { FileText, Download, Image, File, CheckCircle } from 'lucide-react';

export default async function DocumentsPage() {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  const customer = await getCustomerByUserId(user.id);
  if (!customer) redirect('/register');

  const documents = await getDocumentsByCustomerId(customer.id);

  const getDocumentIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return Image;
    return File;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const requiredDocs = customer.account_type === 'business'
    ? ['business_registration']
    : ['drivers_license_front', 'drivers_license_back'];

  const uploadedDocTypes = documents.map(d => d.document_type);
  const missingDocs = requiredDocs.filter(doc => !uploadedDocTypes.includes(doc as any));

  return (
    <div className="space-y-8 lg:space-y-10 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-victoria-gold-600 uppercase tracking-widest mb-2">
          Verification
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-victoria-navy-900 tracking-tight">
          Documents
        </h1>
        <p className="text-victoria-slate-600 mt-1.5 max-w-lg">
          View your uploaded verification documents and status.
        </p>
      </div>

      {/* Document Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card
          variant="bordered"
          className={cn(
            'rounded-3xl shadow-sm',
            missingDocs.length === 0
              ? 'bg-emerald-50/90 border-emerald-200/80'
              : 'bg-amber-50/90 border-amber-200/80'
          )}
        >
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                missingDocs.length === 0 ? 'bg-emerald-100 border border-emerald-200/50' : 'bg-amber-100 border border-amber-200/50'
              }`}>
                {missingDocs.length === 0 ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <FileText className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <h3 className={`font-display text-lg font-semibold tracking-tight ${
                  missingDocs.length === 0 ? 'text-emerald-800' : 'text-amber-800'
                }`}>
                  {missingDocs.length === 0 ? 'All Documents Uploaded' : 'Documents Required'}
                </h3>
                <p className={`text-sm mt-1.5 ${
                  missingDocs.length === 0 ? 'text-emerald-700' : 'text-amber-700'
                }`}>
                  {missingDocs.length === 0
                    ? 'Your verification documents are complete.'
                    : `Missing: ${missingDocs.map(d => capitalize(d.replace('_', ' '))).join(', ')}`
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-display text-lg font-semibold text-victoria-navy-900 tracking-tight mb-4">
              Required Documents
            </h3>
            <ul className="space-y-3">
              {requiredDocs.map(doc => {
                const isUploaded = uploadedDocTypes.includes(doc as any);
                return (
                  <li key={doc} className="flex items-center gap-3 text-sm">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                      isUploaded ? 'bg-emerald-100 text-emerald-700' : 'bg-victoria-slate-100 text-victoria-slate-400'
                    }`}>
                      {isUploaded ? '✓' : '○'}
                    </div>
                    <span className={isUploaded ? 'text-victoria-navy-900 font-medium' : 'text-victoria-slate-500'}>
                      {capitalize(doc.replace(/_/g, ' '))}
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Documents Table */}
      <Card variant="bordered" className="rounded-3xl border-victoria-slate-200/80 shadow-sm overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-9 h-9 rounded-xl bg-victoria-navy-50 flex items-center justify-center">
              <FileText className="w-4 h-4 text-victoria-navy-700" />
            </div>
            Uploaded Documents
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {documents && documents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="table-header">
                  <tr>
                    <th className="table-cell text-left">Document</th>
                    <th className="table-cell text-left">Type</th>
                    <th className="table-cell text-left">File Name</th>
                    <th className="table-cell text-right">Size</th>
                    <th className="table-cell text-left">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  {documents.map((doc) => {
                    const Icon = getDocumentIcon(doc.mime_type);
                    return (
                      <tr key={doc.id} className="table-row">
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-victoria-slate-100 rounded-xl flex items-center justify-center">
                              <Icon className="w-5 h-5 text-victoria-slate-500" />
                            </div>
                            <span className="font-medium text-victoria-navy-900">
                              {capitalize(doc.document_type.replace(/_/g, ' '))}
                            </span>
                          </div>
                        </td>
                        <td className="table-cell">
                          <Badge variant="default">
                            {doc.mime_type.split('/')[1]?.toUpperCase() || 'FILE'}
                          </Badge>
                        </td>
                        <td className="table-cell text-victoria-slate-600 truncate max-w-[200px]">
                          {doc.file_name}
                        </td>
                        <td className="table-cell text-right text-victoria-slate-600">
                          {formatFileSize(doc.file_size)}
                        </td>
                        <td className="table-cell text-victoria-slate-600">
                          {formatDate(doc.uploaded_at)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-14">
              <FileText className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
              <p className="text-victoria-slate-600 font-medium">No documents uploaded</p>
              <p className="text-sm text-victoria-slate-500 mt-1">
                Documents uploaded during registration will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
