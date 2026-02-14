/**
 * Typed API client for frontend. Use in Client Components when fetching from our API.
 */

const getBaseUrl = () =>
  typeof window !== 'undefined' ? '' : process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null; status: number }> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    credentials: 'include',
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      data: null,
      error: (json as { error?: string }).error ?? res.statusText,
      status: res.status,
    };
  }

  return { data: json as T, error: null, status: res.status };
}

async function uploadRequest<T>(
  path: string,
  formData: FormData
): Promise<{ data: T | null; error: string | null; status: number }> {
  const url = `${getBaseUrl()}${path}`;
  const res = await fetch(url, {
    method: 'POST',
    body: formData,
    credentials: 'include',
    // Do not set Content-Type; browser sets multipart/form-data with boundary
  });
  const json = await res.json().catch(() => ({}));

  if (!res.ok) {
    return {
      data: null,
      error: (json as { error?: string }).error ?? res.statusText,
      status: res.status,
    };
  }

  return { data: json as T, error: null, status: res.status };
}

export const api = {
  auth: {
    getSession: () => request<{ user: { id: string; email?: string } | null }>('/api/auth/session'),
    login: (body: { email: string; password: string }) =>
      request<{ success: boolean }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    signUp: (body: {
      email: string;
      password: string;
      first_name?: string;
      last_name?: string;
      business_name?: string;
      contact_name?: string;
    }) =>
      request<{ success: boolean }>('/api/auth/sign-up', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    signOut: () =>
      request<void>('/api/auth/sign-out', { method: 'POST' }),
    forgotPassword: (body: { email: string }) =>
      request<{ success: boolean }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    resetPassword: (body: { password: string }) =>
      request<{ success: boolean }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
  },

  me: {
    get: () => request<{ customer: import('@/server/types').CustomerRow }>('/api/me'),
    register: (body: import('@/types/api').RegisterCustomerBody) =>
      request<{ customer: import('@/server/types').CustomerRow }>('/api/me/register', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    uploadDocument: (file: File, documentType: string) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('document_type', documentType);
      return uploadRequest<{ document: import('@/server/types').DocumentRow }>(
        '/api/me/documents/upload',
        formData
      );
    },
    createDocument: (body: {
      document_type: string;
      file_name: string;
      file_path: string;
      file_size: number;
      mime_type: string;
    }) =>
      request<{ document: import('@/server/types').DocumentRow }>('/api/me/documents', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    getPayments: () =>
      request<{ payments: import('@/server/types').PaymentRow[] }>('/api/me/payments'),
    getInvoices: () =>
      request<{ invoices: import('@/server/types').InvoiceRow[] }>('/api/me/invoices'),
    getDocuments: () =>
      request<{ documents: import('@/server/types').DocumentRow[] }>('/api/me/documents'),
  },

  admin: {
    getStats: () =>
      request<{
        totalCustomers: number;
        activeCustomers: number;
        pendingCustomers: number;
        totalDeposits: number;
        totalRevenue: number;
      }>('/api/admin/stats'),
    getCustomers: () =>
      request<{ customers: import('@/server/types').CustomerRow[] }>('/api/admin/customers'),
  },

  stripe: {
    checkout: (body: {
      customerId: string;
      email: string;
      purchaseValue: number;
      subscriptionPlan: string;
    }) =>
      request<{ url: string }>('/api/stripe/checkout', {
        method: 'POST',
        body: JSON.stringify(body),
      }),
    portal: () =>
      request<{ url: string }>('/api/stripe/portal', { method: 'POST' }),
    topup: (amount: number) =>
      request<{ url: string }>('/api/stripe/topup', {
        method: 'POST',
        body: JSON.stringify({ amount }),
      }),
  },
};
