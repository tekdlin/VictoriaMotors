/**
 * API request/response shapes for type-safe client/server contract.
 */
import type { CustomerRow, CustomerInsert, PaymentRow, InvoiceRow, DocumentRow } from '@/server/types';

export type ApiError = { error: string };

/** Body for POST /api/me/register (server adds user_id from session) */
export type RegisterCustomerBody = Omit<CustomerInsert, 'user_id'>;

// ---- Auth ----
export type GetSessionResponse = { user: { id: string; email?: string } | null } | ApiError;

// ---- Me (current customer) ----
export type GetMeResponse = { customer: CustomerRow } | ApiError;
export type GetMePaymentsResponse = { payments: PaymentRow[] } | ApiError;
export type GetMeInvoicesResponse = { invoices: InvoiceRow[] } | ApiError;
export type GetMeDocumentsResponse = { documents: DocumentRow[] } | ApiError;

// ---- Admin ----
export type AdminStatsResponse = {
  totalCustomers: number;
  activeCustomers: number;
  pendingCustomers: number;
  totalDeposits: number;
  totalRevenue: number;
} | ApiError;

export type AdminCustomersResponse = { customers: CustomerRow[] } | ApiError;
