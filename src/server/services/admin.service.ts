import {
  listCustomers,
  countCustomers,
} from '@/server/services/customer.service';
import {
  getSucceededPayments,
  computePaymentStats,
  getRecentPaymentsWithCustomer,
} from '@/server/services/payment.service';
import type { CustomerRow, PaymentRow } from '@/server/types';

export type AdminDashboardStats = {
  totalCustomers: number;
  activeCustomers: number;
  pendingCustomers: number;
  totalDeposits: number;
  totalRevenue: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [totalCustomers, activeCustomers, pendingCustomers, payments] =
    await Promise.all([
      countCustomers(),
      countCustomers('active'),
      countCustomers('payment_pending'),
      getSucceededPayments(),
    ]);

  const { totalDeposits, totalRevenue } = computePaymentStats(payments);

  return {
    totalCustomers,
    activeCustomers,
    pendingCustomers,
    totalDeposits,
    totalRevenue,
  };
}

export async function getRecentCustomers(
  limit = 5
): Promise<
  Pick<
    CustomerRow,
    'id' | 'first_name' | 'last_name' | 'business_name' | 'account_type' | 'account_status' | 'email' | 'created_at'
  >[]
> {
  const list = await listCustomers({ orderBy: 'created_at', ascending: false, limit });
  return list.map((c) => ({
    id: c.id,
    first_name: c.first_name,
    last_name: c.last_name,
    business_name: c.business_name,
    account_type: c.account_type,
    account_status: c.account_status,
    email: c.email,
    created_at: c.created_at,
  }));
}

export { getRecentPaymentsWithCustomer };
export type { PaymentRow };
