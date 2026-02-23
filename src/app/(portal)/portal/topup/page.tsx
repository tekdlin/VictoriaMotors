'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, Button, Input, Alert } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, DollarSign, Shield, CheckCircle } from 'lucide-react';
import { useStripeTopup } from '@/hooks/api';

const QUICK_AMOUNTS = [500, 1000, 2500, 5000];

export default function TopUpPage() {
  const searchParams = useSearchParams();
  const canceled = searchParams.get('canceled') === 'true';
  const topupMutation = useStripeTopup();

  const [amount, setAmount] = useState<number>(1000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleQuickSelect = (value: number) => {
    setAmount(value);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    const parsed = parseFloat(value);
    if (!isNaN(parsed) && parsed >= 100) {
      setAmount(parsed);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (amount < 100) {
      setError('Minimum top-up amount is $100');
      return;
    }

    setError(null);
    try {
      const url = await topupMutation.mutateAsync(amount);
      if (url) window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process top-up');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-victoria-gold-600 uppercase tracking-widest mb-2">
          Security deposit
        </p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold text-victoria-navy-900 tracking-tight">
          Top Up Deposit
        </h1>
        <p className="text-victoria-slate-600 mt-1.5 max-w-lg">
          Add funds to your security deposit. Fully refundable when your agreement ends.
        </p>
      </div>

      {canceled && (
        <Alert variant="warning" onClose={() => {}}>
          Your top-up was canceled. No charges were made.
        </Alert>
      )}

      {error && (
        <Alert variant="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Card variant="elevated" className="rounded-3xl border-victoria-slate-200/80 shadow-victoria">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="w-9 h-9 rounded-xl bg-victoria-gold-100 flex items-center justify-center">
              <PlusCircle className="w-4 h-4 text-victoria-gold-700" />
            </div>
            Select Amount
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick Select */}
            <div>
              <label className="block text-sm font-medium text-victoria-navy-800 mb-3">
                Quick Select
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {QUICK_AMOUNTS.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickSelect(value)}
                    className={`p-4 rounded-xl border-2 font-display font-semibold text-lg transition-all ${
                      amount === value && !customAmount
                        ? 'border-victoria-gold-500 bg-victoria-gold-50 text-victoria-navy-900 shadow-sm'
                        : 'border-victoria-slate-200 text-victoria-slate-700 hover:border-victoria-slate-300 hover:bg-victoria-slate-50/50'
                    }`}
                  >
                    {formatCurrency(value)}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Amount */}
            <div>
              <label className="block text-sm font-medium text-victoria-navy-800 mb-3">
                Or Enter Custom Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-victoria-slate-400" />
                <input
                  type="number"
                  min="100"
                  max="100000"
                  step="0.01"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-victoria-slate-200 text-lg font-display focus:outline-none focus:border-victoria-navy-500"
                />
              </div>
              <p className="text-sm text-victoria-slate-500 mt-2">
                Minimum: $100 • Maximum: $100,000
              </p>
            </div>

            {/* Summary */}
            <div className="bg-victoria-navy-50/80 rounded-2xl p-6 border border-victoria-navy-100/80">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-victoria-slate-600">Top-up Amount</span>
                <span className="text-2xl font-display font-bold text-victoria-navy-900 tracking-tight">
                  {formatCurrency(amount)}
                </span>
              </div>
              <div className="flex items-start gap-3 text-sm text-victoria-slate-600 p-3 rounded-xl bg-white/60">
                <Shield className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <p>
                  Your deposit is fully refundable upon completion of your agreement in good standing.
                </p>
              </div>
            </div>

            <Button
              type="submit"
              size="lg"
              className="w-full"
              loading={topupMutation.isPending}
              disabled={amount < 100}
            >
              Continue to Payment
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Info */}
      <Card variant="bordered" className="rounded-3xl bg-victoria-navy-50/60 border-victoria-navy-200/50">
        <CardContent className="p-6">
          <h3 className="font-display text-lg font-semibold text-victoria-navy-900 tracking-tight mb-4">
            Why Top Up Your Deposit?
          </h3>
          <ul className="space-y-3">
            {[
              'Increase your purchasing power for higher-value vehicles',
              'Build a safety buffer in your account',
              'Fully refundable when your agreement ends',
              'Secure payment processing via Stripe',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-victoria-slate-700">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
