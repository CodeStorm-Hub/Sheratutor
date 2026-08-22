import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import '@/styles.css';
import '@/pages.css';
import '@/layout-fixes.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { Toaster } from '@/components/ui/sonner';

export const metadata: Metadata = {
  title: 'SheraTutor — HSC & SSC AI Learning Workspace',
  description:
    'A modern dashboard and learning workspace for Bangladeshi HSC & SSC students.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
