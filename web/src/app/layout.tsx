import type { Metadata } from 'next';
import React from 'react';
import './globals.css';
import '@/styles.css';
import '@/pages.css';
import '@/layout-fixes.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { LanguageProvider } from '@/context/LanguageContext';
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
    <html lang="bn" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      {/* impeccable-live-start */}
<script src="http://localhost:8400/live.js?token=4de4d515-5d59-4714-8898-7a07e0418a32"></script>
{/* impeccable-live-end */}
</body>
    </html>
  );
}
