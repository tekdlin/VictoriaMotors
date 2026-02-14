import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

export default function EmailVerifiedPage() {
  return (
    <div>
      <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-lg ring-2 ring-emerald-500/20">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>

      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Email verified
      </h2>
      <p className="text-victoria-slate-600 mb-8">
        Your account is all set. Sign in with your email and password to access
        your Victoria Motors portal.
      </p>

      <div className="rounded-2xl bg-victoria-slate-50 p-4 text-sm text-victoria-slate-600 mb-8">
        <p className="font-medium text-victoria-navy-900 mb-1">
          What&apos;s next?
        </p>
        <p>
          Complete your profile, upload documents if needed, and manage your
          subscription from your dashboard.
        </p>
      </div>

      <Link
        href="/login"
        className="inline-flex w-full items-center justify-center rounded-xl bg-victoria-navy-900 px-7 py-3.5 text-base font-medium text-white shadow-victoria transition-all hover:bg-victoria-navy-800 hover:shadow-victoria-lg focus:outline-none focus:ring-2 focus:ring-victoria-navy-500 focus:ring-offset-2"
      >
        Sign in to your account
      </Link>

      <p className="mt-6 text-center text-xs text-victoria-slate-500">
        Use the email and temporary password from your registration, or reset
        your password from the sign-in page if needed.
      </p>
    </div>
  );
}
