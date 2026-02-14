'use client';

import { useCallback } from 'react';
import { api } from '@/lib/api-client';
import { useSignUp, useStripeCheckout } from '@/hooks/api';
import type { BusinessRegistrationInput } from '@/lib/validations';
import type { RegisterCustomerBody } from '@/types/api';
import { calculateSecurityDeposit } from '@/lib/stripe/plans';

/**
 * Business registration flow via API only: sign-up -> login (session) -> register customer -> upload doc -> checkout.
 */
export function useBusinessRegistration() {
  const checkoutMutation = useStripeCheckout();
  const signUpMutation = useSignUp();

  const submit = useCallback(
    async (params: {
      data: BusinessRegistrationInput;
      businessDoc: File;
    }): Promise<void> => {
      const { data, businessDoc } = params;
      const securityDeposit = calculateSecurityDeposit(data.purchase_value);

      // 1. Create auth user (API) then establish session (login API)
      const signUpRes = await api.auth.signUp({
        email: data.email,
        password: data.password,
        business_name: data.business_name,
        contact_name: data.business_contact_name,
      });
      if (signUpRes.error) throw new Error(signUpRes.error);

      const loginRes = await api.auth.login({
        email: data.email,
        password: data.password,
      });
      if (loginRes.error) throw new Error(loginRes.error ?? 'Failed to sign in');

      // 2. Create customer via API (server uses session)
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

      // 3. Upload document via API (server uploads to storage and creates record)
      const docRes = await api.me.uploadDocument(businessDoc, 'business_registration');
      if (docRes.error) throw new Error(docRes.error);

      // 4. Redirect to Stripe checkout
      const url = await checkoutMutation.mutateAsync({
        customerId: registerRes.data.customer.id,
        email: data.email,
        purchaseValue: data.purchase_value,
        subscriptionPlan: data.subscription_plan,
      });
      if (url) window.location.href = url;
    },
    [checkoutMutation]
  );

  return {
    submit,
    isCheckoutPending: checkoutMutation.isPending,
  };
}
