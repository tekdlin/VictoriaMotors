'use client';

import { useCallback } from 'react';
import { useSignUp, useLogin, useStripeCheckout } from '@/hooks/api';
import type { IndividualRegistrationInput } from '@/lib/validations';
import type { RegisterCustomerBody } from '@/types/api';
import { calculateSecurityDeposit } from '@/lib/stripe/plans';
import { api } from '@/lib/api-client';

/**
 * Individual registration: sign-up -> login (establish session) -> register customer -> upload docs -> checkout.
 * Login is required after sign-up because sign-up does not set session cookies; /api/me/register needs an authenticated request.
 */
export function useIndividualRegistration() {
  const checkoutMutation = useStripeCheckout();
  const signUpMutation = useSignUp();
  const loginMutation = useLogin();

  const submit = useCallback(
    async (params: {
      data: IndividualRegistrationInput;
      licenseFront: File;
      licenseBack: File;
    }): Promise<void> => {
      const { data, licenseFront, licenseBack } = params;
      const securityDeposit = calculateSecurityDeposit(data.purchase_value);

      // 1. Create auth user (API) – does not set session
      const signUpRes = await signUpMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });
      if (!signUpRes?.success) throw new Error('Failed to sign up');

      // 2. Log in to establish session cookies (required for api.me.register)
      await loginMutation.mutateAsync({
        email: data.email,
        password: data.password,
      });

      // 3. Create customer via API (server reads session from cookies)
      const registerBody: RegisterCustomerBody = {
        account_type: 'individual',
        account_status: 'payment_pending',
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        phone: data.phone,
        date_of_birth: data.date_of_birth,
        address_line1: data.address_line1,
        address_line2: data.address_line2 || null,
        city: data.city,
        state: data.state,
        zip_code: data.zip_code,
        purchase_value: data.purchase_value,
        security_deposit_required: securityDeposit,
        subscription_plan: data.subscription_plan,
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
      };

      const registerRes = await api.me.register(registerBody);
      if (registerRes.error || !registerRes.data?.customer) {
        throw new Error(registerRes.error ?? 'Failed to create customer');
      }

      // 4. Upload documents via API (server uploads to storage and creates records)
      const licenseFrontRes = await api.me.uploadDocument(licenseFront, 'drivers_license_front');
      if (licenseFrontRes.error) throw new Error(licenseFrontRes.error);

      const licenseBackRes = await api.me.uploadDocument(licenseBack, 'drivers_license_back');
      if (licenseBackRes.error) throw new Error(licenseBackRes.error);

      // 5. Stripe checkout
      const url = await checkoutMutation.mutateAsync({
        customerId: registerRes.data.customer.id,
        email: data.email,
        purchaseValue: data.purchase_value,
        subscriptionPlan: data.subscription_plan,
      });
      if (url) window.location.href = url;
    },
    [checkoutMutation, signUpMutation, loginMutation]
  );

  return {
    submit,
    isCheckoutPending: checkoutMutation.isPending,
  };
}
