'use client';

import { useState } from 'react';
import { PortalSidebar } from './PortalSidebar';
import Link from 'next/link';
import { Menu, Car } from 'lucide-react';

export function PortalLayoutClient({
  children,
  customerName,
}: {
  children: React.ReactNode;
  customerName?: string;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-victoria-slate-50/80">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(234,179,8,0.08),transparent)] pointer-events-none" aria-hidden />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%231e2a3d\' fill-opacity=\'0.02\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] pointer-events-none" aria-hidden />

      <PortalSidebar
        customerName={customerName}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 flex items-center justify-between px-4 bg-white/95 backdrop-blur-md border-b border-victoria-slate-200/60 shadow-sm">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="p-2 -ml-2 text-victoria-slate-600 hover:text-victoria-navy-900 hover:bg-victoria-slate-100 rounded-xl transition-colors"
          aria-label="Open menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <Link href="/portal" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-victoria-gradient rounded-lg flex items-center justify-center">
            <Car className="w-4 h-4 text-victoria-gold-400" />
          </div>
          <span className="font-display text-lg font-bold text-victoria-navy-900 tracking-tight">
            Victoria Motors
          </span>
        </Link>
        <div className="w-10" />
      </div>

      <main className="relative pt-14 lg:pt-0 lg:ml-64 min-h-screen">
        <div className="p-5 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
