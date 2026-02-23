import Link from 'next/link';
import { Car, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-victoria-navy-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-victoria-gold-500 rounded-lg flex items-center justify-center">
                <Car className="w-6 h-6 text-victoria-navy-900" />
              </div>
              <span className="font-display text-xl font-bold">
                Victoria Motors
              </span>
            </Link>
            <p className="text-victoria-slate-400 max-w-md">
              Your trusted partner in automotive financing. We make vehicle ownership 
              accessible with flexible payment plans and exceptional customer service.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/#how-it-works" className="text-victoria-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-victoria-slate-400 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-victoria-slate-400 hover:text-white transition-colors">
                  Get Started
                </Link>
              </li>
              <li>
                <Link href="/login" className="text-victoria-slate-400 hover:text-white transition-colors">
                  Customer Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-victoria-slate-400">
                <Mail className="w-4 h-4 text-victoria-gold-500" />
                <a href="mailto:contact@victoriamotorsinc.com" className="hover:text-white transition-colors">
                  contact@victoriamotorsinc.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-victoria-slate-400">
                <Phone className="w-4 h-4 text-victoria-gold-500" />
                {/* <a href="tel:+15551234567" className="hover:text-white transition-colors">
                  (555) 123-4567
                </a> */}
              </li>
              <li className="flex items-start gap-2 text-victoria-slate-400">
                <MapPin className="w-4 h-4 text-victoria-gold-500 mt-1" />
                <span>
                  123 Auto Drive<br />
                  Dallas, TX 75201
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-victoria-navy-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-victoria-slate-500 text-sm">
              © {currentYear} Victoria Motors. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link href="/privacy" className="text-victoria-slate-500 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-victoria-slate-500 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
