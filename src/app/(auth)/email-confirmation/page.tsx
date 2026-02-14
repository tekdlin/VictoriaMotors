import Link from 'next/link';
import { Mail, ArrowLeft } from 'lucide-react';

export default function EmailConfirmationPage() {
  return (
    <div>
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-victoria-navy-900 text-victoria-gold-400 shadow-lg">
        <Mail className="h-7 w-7" aria-hidden="true" />
      </div>

      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Check your email
      </h2>
      <p className="text-victoria-slate-600 mb-8">
        We&apos;ve sent a secure confirmation link to your inbox. Click it to
        activate your Victoria Motors account.
      </p>

      <div className="space-y-4 rounded-2xl bg-victoria-slate-50 p-4 text-sm text-victoria-slate-600">
        <div>
          <p className="font-medium text-victoria-navy-900 mb-1">
            Didn&apos;t get the email?
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-victoria-slate-600">
            <li>Check your spam and promotions folders.</li>
            <li>Make sure you used the correct email address.</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-victoria-navy-900 mb-1">Next steps</p>
          <ul className="list-disc list-inside space-y-0.5 text-victoria-slate-600">
            <li>Click the confirmation link in your email.</li>
            <li>You&apos;ll be redirected to your portal.</li>
          </ul>
        </div>
      </div>

      <p className="mt-6 text-xs text-victoria-slate-500">
        Confirmation links expire after a short time. If it doesn&apos;t work,
        try registering again or contact support.
      </p>

      <div className="mt-8 pt-6 border-t border-victoria-slate-200">
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-victoria-navy-900 px-5 py-2.5 text-sm font-medium text-victoria-navy-900 transition-colors hover:bg-victoria-navy-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-500 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
