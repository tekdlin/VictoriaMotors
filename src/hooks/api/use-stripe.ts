import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export function useStripeCheckout() {
  return useMutation({
    mutationFn: async (params: {
      customerId: string;
      email: string;
      purchaseValue: number;
      subscriptionPlan: string;
    }) => {
      const res = await api.stripe.checkout(params);
      if (res.error) throw new Error(res.error);
      if (!res.data?.url) throw new Error('No checkout URL returned');
      return res.data.url;
    },
  });
}

export function useStripePortal() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.stripe.portal();
      if (res.error) throw new Error(res.error);
      if (!res.data?.url) throw new Error('No portal URL returned');
      return res.data.url;
    },
  });
}

export function useStripeTopup() {
  return useMutation({
    mutationFn: async (amount: number) => {
      const res = await api.stripe.topup(amount);
      if (res.error) throw new Error(res.error);
      if (!res.data?.url) throw new Error('No checkout URL returned');
      return res.data.url;
    },
  });
}
