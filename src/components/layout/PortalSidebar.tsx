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
  X,
} from 'lucide-react';
import { useSignOut } from '@/hooks/api';

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
  mobileOpen?: boolean;
  onClose?: () => void;
}

export function PortalSidebar({ customerName, mobileOpen = false, onClose }: PortalSidebarProps) {
  const pathname = usePathname();
  const signOutMutation = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
    onClose?.();
    router.push('/');
  };

  return (
    <>
      {/* Mobile backdrop */}
      <div
        role="button"
        tabIndex={0}
        onClick={onClose}
        onKeyDown={(e) => e.key === 'Escape' && onClose?.()}
        className={cn(
          'fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity lg:hidden',
          mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        aria-hidden
      />

      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-victoria-navy-950 border-r border-white/10 transition-transform duration-300 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="absolute inset-0 bg-victoria-gradient-hero" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-victoria-gold-400/50 to-transparent" aria-hidden />
        <div className="relative flex flex-col h-full">
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90" onClick={onClose}>
              <div className="w-10 h-10 bg-victoria-gold-500 rounded-xl flex items-center justify-center shadow-victoria">
                <Car className="w-5 h-5 text-victoria-navy-900" />
              </div>
              <span className="font-display text-lg font-bold text-white tracking-tight">
                Victoria Motors
              </span>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {customerName && (
            <div className="px-6 py-4 border-b border-white/10">
              <p className="text-victoria-gold-400/90 text-xs font-medium uppercase tracking-wider">Welcome back</p>
              <p className="text-white font-medium truncate mt-1">{customerName}</p>
            </div>
          )}

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            {navigation.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-victoria-gold-500 text-victoria-navy-900 shadow-victoria'
                      : 'text-white/85 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white/80 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
