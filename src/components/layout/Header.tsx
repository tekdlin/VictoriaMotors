'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn, scrollToHash } from '@/lib/utils';
import { Button } from '@/components/ui';
import { Menu, X, Car, User, LogOut } from 'lucide-react';
import { useSignOut } from '@/hooks/api';

interface HeaderProps {
  user?: { email: string } | null;
}

const SECTION_IDS = ['how-it-works', 'pricing', 'contact'] as const;
const ACTIVE_ZONE_TOP = 120;

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const signOutMutation = useSignOut();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOutMutation.mutateAsync();
    router.push('/');
  };

  // Update active nav based on scroll position (home page only)
  useEffect(() => {
    if (pathname !== '/') {
      setActiveSection('');
      return;
    }

    let ticking = false;
    const updateActiveSection = () => {
      let current = '';
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i]);
        if (el) {
          const top = el.getBoundingClientRect().top;
          if (top <= ACTIVE_ZONE_TOP) {
            current = SECTION_IDS[i];
            break;
          }
        }
      }
      setActiveSection((prev) => (prev !== current ? current : prev));
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateActiveSection);
        ticking = true;
      }
    };

    updateActiveSection();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [pathname]);

  const navigation = [
    { name: 'Home', href: '/', sectionId: '' },
    { name: 'How It Works', href: '/#how-it-works', sectionId: 'how-it-works' },
    { name: 'Pricing', href: '/#pricing', sectionId: 'pricing' },
    { name: 'Contact', href: '/#contact', sectionId: 'contact' },
  ];

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-victoria-slate-200/60 shadow-victoria',
        mobileMenuOpen && 'h-dvh md:h-auto'
      )}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full md:h-auto flex flex-col">
        <div className="flex items-center justify-between h-16 shrink-0">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <div className="w-10 h-10 bg-victoria-gradient rounded-xl flex items-center justify-center shadow-victoria">
              <Car className="w-5 h-5 text-victoria-gold-400" />
            </div>
            <span className="font-display text-xl font-bold text-victoria-navy-900 tracking-tight">
              Victoria Motors
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const isActive =
                pathname === '/' ? activeSection === item.sectionId : pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={(e) => {
                    if (pathname === '/' && item.sectionId) {
                      e.preventDefault();
                      scrollToHash(item.href);
                    }
                  }}
                  className={cn(
                    'px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'text-victoria-navy-900 bg-victoria-navy-100 ring-1 ring-victoria-navy-200 font-semibold'
                      : 'text-victoria-slate-600 hover:text-victoria-navy-900 hover:bg-victoria-slate-50'
                  )}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Link href="/portal">
                  <Button variant="ghost" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Portal
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={handleSignOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/register">
                  <Button variant="primary" size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-victoria-slate-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden flex-1 min-h-0 flex flex-col py-4 border-t border-victoria-slate-200/60 animate-slide-down overflow-y-auto">
            <div className="flex flex-col gap-1">
              {navigation.map((item) => {
                const isActive =
                  pathname === '/' ? activeSection === item.sectionId : pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={(e) => {
                      if (pathname === '/' && item.sectionId) {
                        e.preventDefault();
                        scrollToHash(item.href);
                      }
                      setMobileMenuOpen(false);
                    }}
                    className={cn(
                      'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-victoria-navy-100 text-victoria-navy-900 ring-1 ring-victoria-navy-200 font-semibold'
                        : 'text-victoria-slate-600 hover:bg-victoria-slate-50'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
              <hr className="my-2 border-victoria-slate-100" />
              {user ? (
                <>
                  <Link
                    href="/portal"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-victoria-slate-600 hover:bg-victoria-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Portal
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 text-left"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-lg text-sm font-medium text-victoria-slate-600 hover:bg-victoria-slate-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg text-sm font-medium bg-victoria-navy-900 text-white hover:bg-victoria-navy-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
