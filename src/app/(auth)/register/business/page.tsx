'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { businessRegistrationSchema, type BusinessRegistrationInput, type BusinessRegistrationFormValues } from '@/lib/validations';
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanItem,
  calculateSecurityDeposit,
  formatCurrency,
} from '@/lib/stripe/plans';
import { Button, Input, Select, Alert, Card, CardContent, Checkbox } from '@/components/ui';
import { FileUpload } from '@/components/ui/FileUpload';
import { TermsModal } from '@/components/forms/TermsModal';
import { ArrowLeft, ArrowRight, Shield, CreditCard, Building2, Loader2 } from 'lucide-react';
import { useBusinessRegistration } from '@/hooks';

const US_STATES = [
  { value: 'AL', label: 'Alabama' }, { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' }, { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' }, { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' }, { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' }, { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' }, { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' }, { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' }, { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' }, { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' }, { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' }, { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' }, { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' }, { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' }, { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' }, { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' }, { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' }, { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' }, { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' }, { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' }, { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' }, { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' }, { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' }, { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' }, { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' }, { value: 'WY', label: 'Wyoming' },
];

type Step = 1 | 2 | 3 | 4;

export default function BusinessRegistrationPage() {
  const registration = useBusinessRegistration();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [businessDoc, setBusinessDoc] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<BusinessRegistrationFormValues>({
    resolver: zodResolver(businessRegistrationSchema),
    defaultValues: {
      subscription_plan: 'yearly',
      terms_accepted: false,
    },
  });

  const purchaseValue = watch('purchase_value') || 0;
  const securityDeposit = calculateSecurityDeposit(purchaseValue);
  const selectedPlan = watch('subscription_plan');
  const termsAccepted = watch('terms_accepted');

  const validateStep = async (currentStep: Step): Promise<boolean> => {
    switch (currentStep) {
      case 1:
        return await trigger(['business_name', 'business_ein', 'business_contact_name', 'email', 'password', 'phone']);
      case 2:
        return await trigger(['address_line1', 'city', 'state', 'zip_code']);
      case 3:
        if (!businessDoc) {
          setError('Please upload your business registration document.');
          return false;
        }
        return true;
      case 4:
        return await trigger(['purchase_value', 'subscription_plan', 'terms_accepted']);
      default:
        return true;
    }
  };

  const nextStep = async () => {
    setError(null);
    const isValid = await validateStep(step);
    if (isValid && step < 4) {
      setStep((step + 1) as Step);
    }
  };

  const prevStep = () => {
    setError(null);
    if (step > 1) {
      setStep((step - 1) as Step);
    }
  };

  const handleTermsAccept = () => {
    setValue('terms_accepted', true);
    setShowTerms(false);
  };

  const onSubmit = async (formData: BusinessRegistrationFormValues) => {
    const data = businessRegistrationSchema.parse(formData) as BusinessRegistrationInput;
    if (!businessDoc) {
      setError('Please upload your business registration document.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await registration.submit({ data, businessDoc });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                s === step
                  ? 'bg-victoria-navy-900 text-white'
                  : s < step
                  ? 'bg-victoria-gold-500 text-victoria-navy-900'
                  : 'bg-victoria-slate-200 text-victoria-slate-500'
              }`}
            >
              {s}
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-victoria-slate-500">
          <span>Business</span>
          <span>Address</span>
          <span>Documents</span>
          <span>Payment</span>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-victoria-gold-100 rounded-lg flex items-center justify-center">
          <Building2 className="w-5 h-5 text-victoria-gold-700" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-victoria-navy-900">
            Business Registration
          </h2>
          <p className="text-victoria-slate-600 text-sm">
            {step === 1 && 'Enter your business information.'}
            {step === 2 && 'Enter your business address.'}
            {step === 3 && 'Upload your business documents.'}
            {step === 4 && 'Select your plan and complete registration.'}
          </p>
        </div>
      </div>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Business Info */}
        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Business Name"
              placeholder="Acme Corporation"
              error={errors.business_name?.message}
              {...register('business_name')}
            />
            <Input
              label="EIN (Employer Identification Number)"
              placeholder="XX-XXXXXXX"
              hint="9-digit federal tax ID"
              error={errors.business_ein?.message}
              {...register('business_ein')}
            />
            <Input
              label="Primary Contact Name"
              placeholder="John Doe"
              error={errors.business_contact_name?.message}
              {...register('business_contact_name')}
            />
            <Input
              label="Business Email"
              type="email"
              placeholder="contact@acme.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              autoComplete="new-password"
              error={errors.password?.message}
              {...register('password')}
            />
            <Input
              label="Business Phone"
              type="tel"
              placeholder="(555) 123-4567"
              error={errors.phone?.message}
              {...register('phone')}
            />
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="Business Street Address"
              placeholder="123 Business Ave"
              error={errors.address_line1?.message}
              {...register('address_line1')}
            />
            <Input
              label="Suite, Floor, etc. (optional)"
              placeholder="Suite 500"
              error={errors.address_line2?.message}
              {...register('address_line2')}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                placeholder="Dallas"
                error={errors.city?.message}
                {...register('city')}
              />
              <Select
                label="State"
                options={US_STATES}
                placeholder="Select state"
                error={errors.state?.message}
                {...register('state')}
              />
            </div>
            <Input
              label="ZIP Code"
              placeholder="75201"
              error={errors.zip_code?.message}
              {...register('zip_code')}
            />
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="space-y-6">
            <FileUpload
              label="Business Registration Document"
              accept="image/*,.pdf"
              maxSize={10}
              onFileSelect={setBusinessDoc}
              onFileRemove={() => setBusinessDoc(null)}
              currentFile={businessDoc ? { name: businessDoc.name } : null}
            />
            <div className="bg-victoria-slate-50 rounded-lg p-4">
              <p className="text-sm text-victoria-slate-600 mb-3">
                Acceptable documents include:
              </p>
              <ul className="text-sm text-victoria-slate-600 space-y-1 list-disc list-inside">
                <li>Articles of Incorporation</li>
                <li>Certificate of Formation</li>
                <li>Business License</li>
                <li>IRS EIN Confirmation Letter</li>
              </ul>
            </div>
            <div className="bg-victoria-slate-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-victoria-navy-700 mt-0.5" />
                <div className="text-sm text-victoria-slate-600">
                  <p className="font-medium text-victoria-navy-900 mb-1">
                    Your documents are secure
                  </p>
                  <p>
                    All uploads are encrypted and stored securely. We only use them for business verification.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Plan & Payment */}
        {step === 4 && (
          <div className="space-y-6">
            <Input
              label="Intended Fleet/Vehicle Purchase Value"
              type="number"
              placeholder="100000"
              hint="Total value of vehicles you plan to finance"
              error={errors.purchase_value?.message}
              {...register('purchase_value', { valueAsNumber: true })}
            />

            {purchaseValue > 0 && (
              <Card variant="bordered" className="bg-victoria-gold-50 border-victoria-gold-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-victoria-gold-700" />
                      <span className="font-medium text-victoria-navy-900">Security Deposit (10%)</span>
                    </div>
                    <span className="text-lg font-display font-bold text-victoria-navy-900">
                      {formatCurrency(securityDeposit)}
                    </span>
                  </div>
                  <p className="text-sm text-victoria-slate-600 mt-2">
                    This deposit is fully refundable upon completion of your agreement.
                  </p>
                </CardContent>
              </Card>
            )}

            <div>
              <label className="block text-sm font-medium text-victoria-navy-800 mb-3">
                Select Subscription Plan
              </label>
              <div className="space-y-3">
                {(Object.values(SUBSCRIPTION_PLANS) as SubscriptionPlanItem[]).map((plan) => (
                  <label
                    key={plan.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPlan === plan.id
                        ? 'border-victoria-navy-900 bg-victoria-navy-50'
                        : 'border-victoria-slate-200 hover:border-victoria-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        value={plan.id}
                        className="w-4 h-4 text-victoria-navy-900 focus:ring-victoria-navy-500"
                        {...register('subscription_plan')}
                      />
                      <div>
                        <p className="font-medium text-victoria-navy-900">{plan.name}</p>
                        {plan.id === 'yearly' && (
                          <span className="text-xs text-victoria-gold-700 font-medium">Recommended for businesses</span>
                        )}
                      </div>
                    </div>
                    <span className="font-display font-bold text-victoria-navy-900">
                      {formatCurrency(plan.price)}/{plan.interval === 'month' ? 'mo' : 'yr'}
                    </span>
                  </label>
                ))}
              </div>
              {errors.subscription_plan && (
                <p className="mt-1.5 text-sm text-red-600">{errors.subscription_plan.message}</p>
              )}
            </div>

            <div>
              <Checkbox
                label={
                  <span>
                    I accept the{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-victoria-navy-700 hover:text-victoria-navy-900 underline"
                    >
                      Terms and Conditions
                    </button>
                    {' '}on behalf of my business
                  </span>
                }
                checked={termsAccepted}
                onChange={(e) => setValue('terms_accepted', e.target.checked as true)}
                error={errors.terms_accepted?.message}
              />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={prevStep}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          ) : (
            <Link href="/register">
              <Button type="button" variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
          )}

          {step < 4 ? (
            <Button type="button" onClick={nextStep}>
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={loading || registration.isCheckoutPending}>
              {loading || registration.isCheckoutPending ? 'Completing Registration...' : 'Complete Registration'}
              {loading || registration.isCheckoutPending ? <Loader2 className="w-4 h-4 ml-2" /> : <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>
          )}
        </div>
      </form>

      <TermsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={handleTermsAccept}
      />
    </div>
  );
}
