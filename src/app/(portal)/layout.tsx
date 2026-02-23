import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerProfileByUserId, getCustomerDisplayName } from '@/server/services/customer.service';
import { PortalLayoutClient } from '@/components/layout';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  const customer = await getCustomerProfileByUserId(user.id);
  const customerName = getCustomerDisplayName(customer, user.email ?? undefined);

  return (
    <PortalLayoutClient customerName={customerName || undefined}>
      {children}
    </PortalLayoutClient>
  );
}
