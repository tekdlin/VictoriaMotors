'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Button, Input, Alert } from '@/components/ui';
import { supabase } from '@/lib/supabase/client';
import { emailSchema } from '@/lib/validations';

const forgotPasswordSchema = z.object({ email: emailSchema });
type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setError(null);
    setLoading(true);
    try {
      const redirectTo = `${typeof window !== 'undefined' ? window.location.origin : ''}/reset-password`;
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo,
      });
      if (error) {
        setError(error.message);
        return;
      }
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-lg ring-2 ring-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>

        <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
          Check your email
        </h2>
        <p className="text-victoria-slate-600 mb-8">
          We&apos;ve sent a password reset link to your inbox. Click it to set a
          new password. The link expires in one hour.
        </p>

        <div className="rounded-2xl bg-victoria-slate-50 p-4 text-sm text-victoria-slate-600 mb-8">
          <p className="font-medium text-victoria-navy-900 mb-1">
            Didn&apos;t get the email?
          </p>
          <ul className="list-disc list-inside space-y-0.5">
            <li>Check your spam or promotions folder.</li>
            <li>Make sure you entered the correct email address.</li>
          </ul>
        </div>

        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-victoria-navy-900 px-5 py-2.5 text-sm font-medium text-victoria-navy-900 transition-colors hover:bg-victoria-navy-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-500 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-victoria-navy-900 text-victoria-gold-400 shadow-lg">
        <Mail className="h-7 w-7" aria-hidden="true" />
      </div>

      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Forgot your password?
      </h2>
      <p className="text-victoria-slate-600 mb-8">
        Enter the email address for your account and we&apos;ll send you a
        secure link to set a new password.
      </p>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register('email')}
        />

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Send reset link
        </Button>
      </form>

      <p className="mt-8 text-center text-victoria-slate-600">
        Remember your password?{' '}
        <Link
          href="/login"
          className="text-victoria-navy-700 hover:text-victoria-navy-900 font-medium"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
