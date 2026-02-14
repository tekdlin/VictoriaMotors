import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerByUserId } from '@/server/services/customer.service';
import { getDocumentsByCustomerId } from '@/server/services/document.service';
import { formatDate, capitalize } from '@/lib/utils';
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl font-bold text-victoria-navy-900">
          Documents
        </h1>
        <p className="text-victoria-slate-600 mt-1">
          View your uploaded verification documents.
        </p>
      </div>

      {/* Document Status */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="bordered" className={missingDocs.length === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                missingDocs.length === 0 ? 'bg-emerald-100' : 'bg-amber-100'
              }`}>
                {missingDocs.length === 0 ? (
                  <CheckCircle className="w-6 h-6 text-emerald-600" />
                ) : (
                  <FileText className="w-6 h-6 text-amber-600" />
                )}
              </div>
              <div>
                <h3 className={`font-display font-semibold ${
                  missingDocs.length === 0 ? 'text-emerald-800' : 'text-amber-800'
                }`}>
                  {missingDocs.length === 0 ? 'All Documents Uploaded' : 'Documents Required'}
                </h3>
                <p className={`text-sm mt-1 ${
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

        <Card variant="bordered">
          <CardContent className="p-6">
            <h3 className="font-display font-semibold text-victoria-navy-900 mb-2">
              Required Documents
            </h3>
            <ul className="space-y-2">
              {requiredDocs.map(doc => {
                const isUploaded = uploadedDocTypes.includes(doc as any);
                return (
                  <li key={doc} className="flex items-center gap-2 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      isUploaded ? 'bg-emerald-100 text-emerald-600' : 'bg-victoria-slate-100 text-victoria-slate-400'
                    }`}>
                      {isUploaded ? '✓' : '○'}
                    </div>
                    <span className={isUploaded ? 'text-victoria-navy-900' : 'text-victoria-slate-500'}>
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
      <Card variant="bordered">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-victoria-navy-700" />
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
                            <div className="w-10 h-10 bg-victoria-slate-100 rounded-lg flex items-center justify-center">
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
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-victoria-slate-300 mx-auto mb-4" />
              <p className="text-victoria-slate-600">No documents uploaded</p>
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
