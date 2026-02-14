import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const meKeys = {
  all: ['me'] as const,
  profile: () => [...meKeys.all, 'profile'] as const,
  payments: () => [...meKeys.all, 'payments'] as const,
  invoices: () => [...meKeys.all, 'invoices'] as const,
  documents: () => [...meKeys.all, 'documents'] as const,
};

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: meKeys.profile(),
    queryFn: async () => {
      const res = await api.me.get();
      if (res.error) throw new Error(res.error);
      return res.data!.customer;
    },
    enabled: options?.enabled !== false,
  });
}

export function useMePayments(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: meKeys.payments(),
    queryFn: async () => {
      const res = await api.me.getPayments();
      if (res.error) throw new Error(res.error);
      return res.data!.payments;
    },
    enabled: options?.enabled !== false,
  });
}

export function useMeInvoices(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: meKeys.invoices(),
    queryFn: async () => {
      const res = await api.me.getInvoices();
      if (res.error) throw new Error(res.error);
      return res.data!.invoices;
    },
    enabled: options?.enabled !== false,
  });
}

export function useMeDocuments(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: meKeys.documents(),
    queryFn: async () => {
      const res = await api.me.getDocuments();
      if (res.error) throw new Error(res.error);
      return res.data!.documents;
    },
    enabled: options?.enabled !== false,
  });
}
