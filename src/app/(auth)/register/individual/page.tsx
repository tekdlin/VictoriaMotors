'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { individualRegistrationSchema, type IndividualRegistrationInput, type IndividualRegistrationFormValues } from '@/lib/validations';
import {
  SUBSCRIPTION_PLANS,
  type SubscriptionPlanItem,
  calculateSecurityDeposit,
  formatCurrency,
} from '@/lib/stripe/plans';
import { Button, Input, Select, Alert, Card, CardContent, Checkbox } from '@/components/ui';
import { FileUpload } from '@/components/ui/FileUpload';
import { TermsModal } from '@/components/forms/TermsModal';
import { ArrowLeft, ArrowRight, Shield, CreditCard, Eye, EyeOff } from 'lucide-react';
import { useIndividualRegistration } from '@/hooks';

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

export default function IndividualRegistrationPage() {
  const router = useRouter();
  const registration = useIndividualRegistration();
  const [step, setStep] = useState<Step>(1);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  const [licenseFront, setLicenseFront] = useState<File | null>(null);
  const [licenseBack, setLicenseBack] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<IndividualRegistrationFormValues>({
    resolver: zodResolver(individualRegistrationSchema),
    defaultValues: {
      subscription_plan: 'monthly',
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
        return await trigger(['first_name', 'last_name', 'email', 'password', 'date_of_birth', 'phone']);
      case 2:
        return await trigger(['address_line1', 'city', 'state', 'zip_code']);
      case 3:
        if (!licenseFront || !licenseBack) {
          setError('Please upload both front and back of your driver\'s license.');
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

  const onSubmit = async (formData: IndividualRegistrationFormValues) => {
    const data = individualRegistrationSchema.parse(formData) as IndividualRegistrationInput;
    if (!licenseFront || !licenseBack) {
      setError('Please upload your driver\'s license documents.');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await registration.submit({ data, licenseFront, licenseBack });
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
          <span>Personal</span>
          <span>Address</span>
          <span>Documents</span>
          <span>Payment</span>
        </div>
      </div>

      <h2 className="font-display text-2xl font-bold text-victoria-navy-900 mb-2">
        Individual Registration
      </h2>
      <p className="text-victoria-slate-600 mb-6">
        {step === 1 && 'Enter your personal information.'}
        {step === 2 && 'Enter your address details.'}
        {step === 3 && 'Upload your driver\'s license.'}
        {step === 4 && 'Select your plan and complete registration.'}
      </p>

      {error && (
        <Alert variant="error" className="mb-6" onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                error={errors.first_name?.message}
                {...register('first_name')}
              />
              <Input
                label="Last Name"
                placeholder="Doe"
                error={errors.last_name?.message}
                {...register('last_name')}
              />
            </div>
            <Input
              label="Email Address"
              type="email"
              placeholder="john@example.com"
              error={errors.email?.message}
              {...register('email')}
            />
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                className="pr-10"
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-4 top-10 text-victoria-slate-400 hover:text-victoria-navy-700 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            <Input
              label="Phone Number"
              type="tel"
              placeholder="(555) 123-4567"
              error={errors.phone?.message}
              {...register('phone')}
            />
            <Input
              label="Date of Birth"
              type="date"
              error={errors.date_of_birth?.message}
              {...register('date_of_birth')}
            />
          </div>
        )}

        {/* Step 2: Address */}
        {step === 2 && (
          <div className="space-y-4">
            <Input
              label="Street Address"
              placeholder="123 Main St"
              error={errors.address_line1?.message}
              {...register('address_line1')}
            />
            <Input
              label="Apartment, Suite, etc. (optional)"
              placeholder="Apt 4B"
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
              label="Driver's License (Front)"
              accept="image/*,.pdf"
              maxSize={10}
              onFileSelect={setLicenseFront}
              onFileRemove={() => setLicenseFront(null)}
              currentFile={licenseFront ? { name: licenseFront.name } : null}
            />
            <FileUpload
              label="Driver's License (Back)"
              accept="image/*,.pdf"
              maxSize={10}
              onFileSelect={setLicenseBack}
              onFileRemove={() => setLicenseBack(null)}
              currentFile={licenseBack ? { name: licenseBack.name } : null}
            />
            <div className="bg-victoria-slate-50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-victoria-navy-700 mt-0.5" />
                <div className="text-sm text-victoria-slate-600">
                  <p className="font-medium text-victoria-navy-900 mb-1">
                    Your documents are secure
                  </p>
                  <p>
                    All uploads are encrypted and stored securely. We only use them for identity verification.
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
              label="Intended Vehicle Purchase Value"
              type="number"
              placeholder="25000"
              defaultValue={0}
              hint="Enter the approximate value of the vehicle you plan to purchase"
              error={errors.purchase_value?.message}
              {...register('purchase_value', { valueAsNumber: true })}
            />

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
                        <span className="text-xs text-emerald-600 font-medium">Billed after 7 days free trial</span>
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
            <Button type="submit" loading={loading || registration.isCheckoutPending}>
              Complete Registration
              <ArrowRight className="w-4 h-4 ml-2" />
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
