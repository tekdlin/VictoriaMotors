import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/server/services/auth.service';
import { AdminSidebar } from '@/components/layout';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, error } = await getCurrentUser();
  if (error || !user) redirect('/login');

  // In a real app, check if user has admin role
  // For MVP, we'll allow any authenticated user to access admin
  // You should implement proper role-based access control

  return (
    <div className="min-h-screen bg-victoria-slate-50">
      <AdminSidebar />
      
      <main className="ml-64 min-h-screen">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
