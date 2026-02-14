'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Lock, ArrowLeft, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button, Input, Alert } from '@/components/ui';
import { api } from '@/lib/api-client';
import { supabase } from '@/lib/supabase/client';
import { passwordSchema } from '@/lib/validations';

const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'ready' | 'success'>('ready');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    setError(null);
    setLoading(true);
    const res = await api.auth.resetPassword({ password: data.password });
    if (res.status === 401) {
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });
      setLoading(false);
      if (updateError) {
        setError(updateError.message);
        return;
      }
    } else if (res.error) {
      setLoading(false);
      setError(res.error);
      return;
    } else {
      setLoading(false);
    }
    setStatus('success');
    setTimeout(() => {
      router.push('/login?reset=success');
      router.refresh();
    }, 1500);
  };

  if (status === 'success') {
    return (
      <div>
        <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 shadow-lg ring-2 ring-emerald-500/20">
          <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
        </div>
        <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
          Password updated
        </h2>
        <p className="text-victoria-slate-600 mb-8">
          Your password has been changed. Redirecting you to sign in…
        </p>
        <Link
          href="/login"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg border-2 border-victoria-navy-900 px-5 py-2.5 text-sm font-medium text-victoria-navy-900 transition-colors hover:bg-victoria-navy-900 hover:text-white focus:outline-none focus:ring-2 focus:ring-victoria-navy-500 focus:ring-offset-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-victoria-navy-900 text-victoria-gold-400 shadow-lg">
        <Lock className="h-7 w-7" aria-hidden="true" />
      </div>

      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Set a new password
      </h2>
      <p className="text-victoria-slate-600 mb-8">
        Choose a strong password. You’ll use it to sign in to your Victoria Motors account.
      </p>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="relative">
          <Input
            label="New password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-victoria-slate-400 hover:text-victoria-slate-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <div className="relative">
          <Input
            label="Confirm password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-9 text-victoria-slate-400 hover:text-victoria-slate-600"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        <p className="text-xs text-victoria-slate-500">
          At least 8 characters with one uppercase letter, one lowercase letter, and one number.
        </p>

        <Button type="submit" className="w-full" size="lg" loading={loading}>
          Update password
        </Button>
      </form>

      <p className="mt-8 text-center text-victoria-slate-600">
        <Link href="/login" className="text-victoria-navy-700 hover:text-victoria-navy-900 font-medium">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
