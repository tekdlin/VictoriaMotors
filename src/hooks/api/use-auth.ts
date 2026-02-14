import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api-client';

export const authKeys = {
  all: ['auth'] as const,
  session: () => [...authKeys.all, 'session'] as const,
};

export function useAuthSession() {
  return useQuery({
    queryKey: authKeys.session(),
    queryFn: async () => {
      const res = await api.auth.getSession();
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
  });
}

export function useLogin() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.auth.login(credentials);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
  });
}


export function useSignUp() {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const res = await api.auth.signUp(credentials);
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const res = await api.auth.signOut();
      if (res.error) throw new Error(res.error);
      return res.data!;
    },
  });
}