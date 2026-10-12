import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { Providers } from '@/components/providers';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: { default: 'ServicePro — Dispatch-managed field service', template: '%s | ServicePro' },
  description: 'Request a repair, get a verified technician scheduled, and pay securely online. ServicePro manages the whole field-service workflow.',
  openGraph: {
    type: 'website',
    siteName: 'ServicePro',
    title: 'ServicePro — Dispatch-managed field service',
    description: 'Verified technicians, scheduled visits, transparent payments.',
  },
};

// Inter, self-hosted (no network request to Google at runtime)
const inter = localFont({ src: './fonts/Inter-Variable.woff2', variable: '--font-inter', weight: '100 900', display: 'swap' });

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} min-h-screen font-sans antialiased`}>
        <noscript><style>{`[style*="opacity: 0"]{opacity:1!important;transform:none!important}`}</style></noscript>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
