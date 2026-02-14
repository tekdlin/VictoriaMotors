import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const adminKeys = {
  all: ['admin'] as const,
  stats: () => [...adminKeys.all, 'stats'] as const,
  customers: () => [...adminKeys.all, 'customers'] as const,
};

export function useAdminStats(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.stats(),
    queryFn: async () => {
      const res = await api.admin.getStats();
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
    enabled: options?.enabled !== false,
  });
}

export function useAdminCustomers(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: adminKeys.customers(),
    queryFn: async () => {
      const res = await api.admin.getCustomers();
      if (res.error) throw new Error(res.error);
      return res.data!.customers;
    },
    enabled: options?.enabled !== false,
  });
}
