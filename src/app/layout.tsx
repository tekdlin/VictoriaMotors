import type { Metadata } from 'next';
import { DM_Sans, Playfair_Display, JetBrains_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Victoria Motors | Automotive Financing Made Simple',
    template: '%s | Victoria Motors',
  },
  description:
    'Your trusted partner in automotive financing. Flexible payment plans, transparent pricing, and exceptional customer service.',
  keywords: ['automotive financing', 'car loans', 'vehicle financing', 'Victoria Motors'],
  authors: [{ name: 'Victoria Motors' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Victoria Motors',
    title: 'Victoria Motors | Automotive Financing Made Simple',
    description:
      'Your trusted partner in automotive financing. Flexible payment plans, transparent pricing, and exceptional customer service.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Victoria Motors | Automotive Financing Made Simple',
    description:
      'Your trusted partner in automotive financing. Flexible payment plans, transparent pricing, and exceptional customer service.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${playfair.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen bg-white font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
