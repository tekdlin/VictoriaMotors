'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginInput } from '@/lib/validations';
import { useLogin } from '@/hooks/api';
import { Button, Input, Alert } from '@/components/ui';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const loginMutation = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setError(null);
    try {
      await loginMutation.mutateAsync(data);
      router.push('/portal');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Welcome Back
      </h2>
      <p className="text-victoria-slate-600 mb-8">
        Sign in to your account to access your portal.
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
          error={errors.email?.message}
          {...register('email')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-9 text-victoria-slate-400 hover:text-victoria-slate-600"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-victoria-slate-300 text-victoria-navy-900 focus:ring-victoria-navy-500"
            />
            <span className="text-sm text-victoria-slate-600">Remember me</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-sm text-victoria-navy-700 hover:text-victoria-navy-900 font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          className="w-full"
          size="lg"
          loading={loginMutation.isPending}
        >
          Sign In
        </Button>
      </form>

      <p className="mt-8 text-center text-victoria-slate-600">
        Don&apos;t have an account?{' '}
        <Link
          href="/register"
          className="text-victoria-navy-700 hover:text-victoria-navy-900 font-medium"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
}
