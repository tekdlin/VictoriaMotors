'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Car, LogIn, UserPlus, Mail, CheckCircle2, KeyRound } from 'lucide-react';

const ROUTE_CONFIG: Record<
  string,
  {
    headline: string;
    description: string;
    showStats?: boolean;
    icon?: React.ReactNode;
  }
> = {
  '/login': {
    headline: 'Welcome Back',
    description:
      'Sign in to access your portal, manage your account, and track your application.',
    showStats: true,
    icon: <LogIn className="w-8 h-8 text-victoria-gold-400" />,
  },
  '/register': {
    headline: 'Create Your Account',
    description:
      'Join Victoria Motors and take the first step toward flexible vehicle financing.',
    showStats: true,
    icon: <UserPlus className="w-8 h-8 text-victoria-gold-400" />,
  },
  '/register/individual': {
    headline: 'Individual Registration',
    description:
      'Personal vehicle financing with a simple process. You’ll need your driver’s license and a few details.',
    showStats: true,
    icon: <UserPlus className="w-8 h-8 text-victoria-gold-400" />,
  },
  '/register/business': {
    headline: 'Business Registration',
    description:
      'Register your business for fleet or commercial financing. Have your EIN and business details ready.',
    showStats: true,
    icon: <UserPlus className="w-8 h-8 text-victoria-gold-400" />,
  },
  '/email-confirmation': {
    headline: 'Payment Complete',
    description:
      'Your payment was successful. Check your email to confirm your address, then sign in to access your portal.',
    showStats: true,
    icon: <Mail className="w-8 h-8 text-victoria-gold-400" />,
  },
  '/email-verified': {
    headline: "You're All Set",
    description:
      'Your email is verified. Sign in with your credentials to access your Victoria Motors portal.',
    showStats: true,
    icon: <CheckCircle2 className="w-8 h-8 text-emerald-400" />,
  },
  '/forgot-password': {
    headline: 'Reset Your Password',
    description:
      'Enter the email address for your account and we’ll send you a secure link to set a new password.',
    showStats: true,
    icon: <KeyRound className="w-8 h-8 text-victoria-gold-400" />,
  },
  '/reset-password': {
    headline: 'Set a New Password',
    description:
      'Choose a strong password for your account. You’ll use it to sign in from here on.',
    showStats: true,
    icon: <KeyRound className="w-8 h-8 text-victoria-gold-400" />,
  },
};

function getConfig(pathname: string) {
  if (ROUTE_CONFIG[pathname]) return ROUTE_CONFIG[pathname];
  if (pathname.startsWith('/register/'))
    return ROUTE_CONFIG['/register/individual'] ?? ROUTE_CONFIG['/register'];
  return {
    headline: 'Your Journey to Vehicle Ownership Starts Here',
    description:
      'Join thousands of customers who have made their automotive dreams a reality with our flexible financing solutions.',
    showStats: true,
    icon: <Car className="w-8 h-8 text-victoria-gold-400" />,
  };
}

export function AuthLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const config = getConfig(pathname ?? '');

  return (
    <div className="min-h-screen lg:flex">
      {/* Left side - Fixed branding (desktop only) */}
      <div className="hidden lg:flex fixed top-0 left-0 bottom-0 w-1/2 bg-victoria-navy-950 overflow-hidden">
        <div className="absolute inset-0 bg-victoria-gradient-hero" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.07]" />
        <div className="absolute top-20 right-10 w-80 h-80 bg-victoria-gold-500/15 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-victoria-gold-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-mesh-subtle" />

        <div className="relative z-10 flex flex-col justify-between p-14 w-full">
          <Link
            href="/"
            className="flex items-center gap-2.5 w-fit transition-opacity hover:opacity-90"
          >
            <div className="w-12 h-12 bg-victoria-gold-500 rounded-xl flex items-center justify-center shadow-victoria">
              <Car className="w-6 h-6 text-victoria-navy-900" />
            </div>
            <span className="font-display text-2xl font-bold text-white tracking-tight">
              Victoria Motors
            </span>
          </Link>

          <div className="space-y-6">
            <div className="flex items-center gap-3 text-white/95">
              {config.icon}
            </div>
            <h1 className="font-display text-4xl font-bold text-white leading-tight tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.2)]">
              {config.headline}
            </h1>
            <p className="text-white/90 text-lg max-w-md leading-relaxed">
              {config.description}
            </p>
          </div>

          {config.showStats !== false && (
            <div className="flex items-center gap-10">
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400 tracking-tight">
                  10K+
                </p>
                <p className="text-white/80 text-sm mt-0.5">
                  Happy Customers
                </p>
              </div>
              <div className="w-px h-12 bg-white/20 rounded-full" />
              <div>
                <p className="text-3xl font-display font-bold text-victoria-gold-400 tracking-tight">
                  4.9★
                </p>
                <p className="text-white/80 text-sm mt-0.5">
                  Customer Rating
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right side - Scrollable form / content */}
      <div className="flex-1 lg:ml-[50%] lg:h-screen lg:overflow-y-auto bg-white">
        <div className="min-h-full flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="lg:hidden mb-10 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
              >
                <div className="w-10 h-10 bg-victoria-gradient rounded-xl flex items-center justify-center shadow-victoria">
                  <Car className="w-5 h-5 text-victoria-gold-400" />
                </div>
                <span className="font-display text-xl font-bold text-victoria-navy-900 tracking-tight">
                  Victoria Motors
                </span>
              </Link>
            </div>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
