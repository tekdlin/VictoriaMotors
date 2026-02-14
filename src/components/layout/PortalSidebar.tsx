'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  FileText,
  Settings,
  HelpCircle,
  LogOut,
  Car,
  Receipt,
  PlusCircle,
} from 'lucide-react';
import { useLogin, useSignOut } from '@/hooks/api';

const navigation = [
  { name: 'Dashboard', href: '/portal', icon: LayoutDashboard },
  { name: 'Payments', href: '/portal/payments', icon: CreditCard },
  { name: 'Invoices', href: '/portal/invoices', icon: Receipt },
  { name: 'Documents', href: '/portal/documents', icon: FileText },
  { name: 'Top Up Deposit', href: '/portal/topup', icon: PlusCircle },
  { name: 'Settings', href: '/portal/settings', icon: Settings },
  { name: 'Help', href: '/portal/help', icon: HelpCircle },
];

interface PortalSidebarProps {
  customerName?: string;
}

export function PortalSidebar({ customerName }: PortalSidebarProps) {
  const pathname = usePathname();
  const signOutMutation = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
    router.push('/');
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-victoria-navy-950">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-victoria-navy-800">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-victoria-gold-500 rounded-lg flex items-center justify-center">
              <Car className="w-6 h-6 text-victoria-navy-900" />
            </div>
            <span className="font-display text-lg font-bold text-white">
              Victoria Motors
            </span>
          </Link>
        </div>

        {customerName && (
          <div className="px-6 py-4 border-b border-victoria-navy-800">
            <p className="text-victoria-slate-400 text-xs uppercase tracking-wider">Welcome back</p>
            <p className="text-white font-medium truncate">{customerName}</p>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map(item => {
            const isActive = pathname === item.href;
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
