'use client';

import { useCallback } from 'react';
import { useLogin, useSignUp, useStripeCheckout } from '@/hooks/api';
import type { BusinessRegistrationInput } from '@/lib/validations';
import type { RegisterCustomerBody } from '@/types/api';
import { calculateSecurityDeposit } from '@/lib/stripe/plans';
import { api } from '@/lib/api-client';

/**
 * Business registration flow via API only: sign-up -> login (session) -> register customer -> upload doc -> checkout.
 */
export function useBusinessRegistration() {
  const checkoutMutation = useStripeCheckout();
  const signUpMutation = useSignUp();
  const loginMutation = useLogin();

  const submit = useCallback(
    async (params: {
      data: BusinessRegistrationInput;
      businessDoc: File;
    }): Promise<void> => {
      const { data, businessDoc } = params;
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
        account_type: 'business',
        account_status: 'payment_pending',
        business_name: data.business_name,
        business_ein: data.business_ein,
        business_contact_name: data.business_contact_name,
        email: data.email,
        phone: data.phone,
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

      // 4. Upload document via API (server uploads to storage and creates record)
      const docRes = await api.me.uploadDocument(businessDoc, 'business_registration');
      if (docRes.error) throw new Error(docRes.error);

      // 5. Redirect to Stripe checkout
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
