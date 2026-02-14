import Link from 'next/link';
import { Card, CardContent, Button } from '@/components/ui';
import { User, Building2, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Create Your Account
      </h2>
      <p className="text-victoria-slate-600 mb-8">
        Choose your account type to get started.
      </p>

      <div className="space-y-4">
        <Link href="/register/individual" className="block">
          <Card variant="bordered" className="hover:border-victoria-navy-300 hover:shadow-victoria transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-victoria-navy-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-victoria-navy-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-victoria-navy-900 mb-1">
                    Individual Account
                  </h3>
                  <p className="text-victoria-slate-600 text-sm mb-3">
                    Perfect for personal vehicle financing. Quick setup with your driver's license.
                  </p>
                  <div className="flex items-center text-victoria-navy-700 text-sm font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/register/business" className="block">
          <Card variant="bordered" className="hover:border-victoria-navy-300 hover:shadow-victoria transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-victoria-gold-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-6 h-6 text-victoria-gold-700" />
                </div>
                <div className="flex-1">
                  <h3 className="font-display text-lg font-semibold text-victoria-navy-900 mb-1">
                    Business Account
                  </h3>
                  <p className="text-victoria-slate-600 text-sm mb-3">
                    For companies and fleet management. Higher purchase limits available.
                  </p>
                  <div className="flex items-center text-victoria-navy-700 text-sm font-medium">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <p className="mt-8 text-center text-victoria-slate-600">
        Already have an account?{' '}
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
