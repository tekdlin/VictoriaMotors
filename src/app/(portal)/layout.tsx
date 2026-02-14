import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { getCustomerProfileByUserId, getCustomerDisplayName } from '@/server/services/customer.service';
import { PortalSidebar } from '@/components/layout';

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
    <div className="min-h-screen bg-victoria-slate-50">
      <PortalSidebar customerName={customerName || undefined} />
      
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
