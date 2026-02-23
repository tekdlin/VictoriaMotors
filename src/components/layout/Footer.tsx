import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';
import { SmoothScrollLink } from '@/components/ui/SmoothScrollLink';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-victoria-navy-950 text-white relative">
      <div className="absolute inset-0 bg-victoria-gradient-hero" />
      {/* Top accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-victoria-gold-400/50 to-transparent" aria-hidden />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 transition-opacity hover:opacity-90">
              <div className="w-12 h-12 bg-victoria-gold-500 rounded-xl flex items-center justify-center shadow-victoria">
                <Car className="w-6 h-6 text-victoria-navy-900" />
              </div>
              <span className="font-display text-2xl font-bold tracking-tight">
                Victoria Motors
              </span>
            </Link>
            <p className="text-white/90 max-w-sm text-sm leading-relaxed">
              Your trusted partner in automotive financing. We make vehicle ownership
              accessible with flexible payment plans and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-base mb-5 tracking-tight text-white uppercase tracking-wider text-white/95">
              Quick Links
            </h3>
            <ul className="space-y-4">
              <li>
                <SmoothScrollLink href="/#how-it-works" className="text-white/85 hover:text-victoria-gold-400 transition-colors text-sm">
                  How It Works
                </SmoothScrollLink>
              </li>
              <li>
                <SmoothScrollLink href="/#pricing" className="text-white/85 hover:text-victoria-gold-400 transition-colors text-sm">
                  Pricing
                </SmoothScrollLink>
              </li>
              <li>
                <Link href="/register" className="text-white/85 hover:text-victoria-gold-400 transition-colors text-sm">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-white/85 hover:text-victoria-gold-400 transition-colors text-sm">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-base mb-5 tracking-tight uppercase tracking-wider text-white/95">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:contact@victoriamotorsinc.com"
                  className="flex items-center gap-3 text-white/85 hover:text-victoria-gold-400 transition-colors text-sm group"
                >
                  <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-victoria-gold-500/20 transition-colors">
                    <Mail className="w-4 h-4 text-victoria-gold-400" />
                  </span>
                  contact@victoriamotorsinc.com
                </a>
              </li>
              <li className="flex items-center gap-3 text-white/85 text-sm">
                <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-victoria-gold-400" />
                </span>
                <span>Mon–Fri, 9am–5pm CT</span>
              </li>
              <li className="flex items-start gap-3 text-white/85 text-sm">
                <span className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-victoria-gold-400" />
                </span>
                <span>
                  123 Auto Drive<br />
                  Dallas, TX 75201
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/60 text-sm">
              © {currentYear} Victoria Motors. All rights reserved.
            </p>
            <div className="flex items-center gap-8">
              <Link href="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
