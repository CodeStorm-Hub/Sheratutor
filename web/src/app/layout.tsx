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
  title: 'SheraTutor — HSC, SSC & University Admission Exam AI Learning Workspace',
  description:
    'A modern dashboard and learning workspace for Bangladeshi HSC, SSC & University Admission Exam students.',
  icons: {
    icon: '/logo-icon.svg',
    shortcut: '/logo-icon.svg',
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
      </body>
    </html>
  );
}
