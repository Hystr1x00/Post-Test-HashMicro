import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';

export const metadata: Metadata = {
  title: 'PT. Ultra Jaya Milk Industry - FEFO & Multi-Warehouse ERP',
  description: 'Enterprise resource planning, FEFO batch expiry management, and multi-warehouse operations for PT. Ultra Jaya Milk Industry, Tbk.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" data-theme="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22%2300529b%22/><text y=%22.7em%22 x=%2250%%22 text-anchor=%22middle%22 font-size=%2255%22 fill=%22white%22 font-weight=%22bold%22>U</text></svg>" />
      </head>
      <body>
        <ThemeProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
