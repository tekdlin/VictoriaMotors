import Link from 'next/link';
import { CheckCircle2, Mail, LogIn } from 'lucide-react';

export default function EmailConfirmationPage() {
  return (
    <div>
      {/* Payment success */}
      <div className="mb-8 flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white">
          <CheckCircle2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <div>
          <h3 className="font-display font-semibold text-emerald-900">
            Payment successful
          </h3>
          <p className="text-sm text-emerald-800">
            Your subscription and security deposit have been processed. You&apos;re almost in.
          </p>
        </div>
      </div>

      {/* Check your email */}
      <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-victoria-navy-900 text-victoria-gold-400 shadow-lg">
        <Mail className="h-7 w-7" aria-hidden="true" />
      </div>
      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Confirm your email
      </h2>
      <p className="text-victoria-slate-600 mb-6">
        We&apos;ve sent a secure confirmation link to your inbox. Click it to
        verify your email and activate your Victoria Motors account.
      </p>

      <div className="space-y-4 rounded-2xl bg-victoria-slate-50 p-4 text-sm text-victoria-slate-600">
        <div>
          <p className="font-medium text-victoria-navy-900 mb-1">Next steps</p>
          <ul className="list-disc list-inside space-y-0.5 text-victoria-slate-600">
            <li>Check your email and click the confirmation link.</li>
            <li>After confirming, return here and sign in to access your portal.</li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-victoria-navy-900 mb-1">
            Didn&apos;t get the email?
          </p>
          <ul className="list-disc list-inside space-y-0.5 text-victoria-slate-600">
            <li>Check your spam and promotions folders.</li>
            <li>Make sure you used the correct email address.</li>
          </ul>
        </div>
      </div>

      <p className="mt-6 text-xs text-victoria-slate-500">
        Confirmation links expire after a short time. If it doesn&apos;t work,
        try signing in—you may already be confirmed—or contact support.
      </p>

      <div className="mt-8 pt-6 border-t border-victoria-slate-200">
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-victoria-navy-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-victoria-navy-800 focus:outline-none focus:ring-2 focus:ring-victoria-navy-500 focus:ring-offset-2"
        >
          <LogIn className="h-4 w-4" />
          Sign in
        </Link>
      </div>
    </div>
  );
}
