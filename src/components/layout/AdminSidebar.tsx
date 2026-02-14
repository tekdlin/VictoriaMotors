'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  Car,
  AlertCircle,
} from 'lucide-react';
import { useSignOut } from '@/hooks/api';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Documents', href: '/admin/documents', icon: FileText },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3 },
  { name: 'Alerts', href: '/admin/alerts', icon: AlertCircle },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const signOutMutation = useSignOut();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
    window.location.href = '/';
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-victoria-navy-950">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-victoria-navy-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-victoria-gold-500 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-victoria-navy-900" />
            </div>
            <div>
              <span className="font-display text-lg font-bold text-white block">
                Victoria Motors
              </span>
              <span className="text-victoria-gold-400 text-xs font-medium">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map(item => {
            const isActive = pathname === item.href || 
              (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-victoria-gold-500 text-victoria-navy-900'
                    : 'text-victoria-slate-400 hover:bg-victoria-navy-800 hover:text-white'
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-victoria-navy-800">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-sm font-medium text-victoria-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
