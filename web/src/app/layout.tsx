import type { Metadata } from 'next';
import React from 'react';
import { cookies } from 'next/headers';
import {
  Baloo_2,
  Baloo_Da_2,
  Inter,
  Space_Mono,
  Noto_Sans_Bengali,
} from 'next/font/google';
import './globals.css';
import '@/styles.css';
import '@/pages.css';
import '@/layout-fixes.css';
import 'katex/dist/katex.min.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from '@/components/ui/sonner';

const baloo2 = Baloo_2({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const balooDa2 = Baloo_Da_2({
  subsets: ['bengali', 'latin'],
  weight: ['600', '700'],
  variable: '--font-display-bn',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono-eyebrow',
  display: 'swap',
});

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '600', '700'],
  variable: '--font-body-bn',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'SheraTutor — HSC & SSC AI Learning Workspace',
  description:
    'A modern dashboard and learning workspace for Bangladeshi HSC & SSC students.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const lang = cookieStore.get('sheratutor_lang')?.value === 'en' ? 'en' : 'bn';

  return (
    <html
      lang={lang}
      suppressHydrationWarning
      className={`${baloo2.variable} ${balooDa2.variable} ${inter.variable} ${spaceMono.variable} ${notoSansBengali.variable}`}
    >
      <body suppressHydrationWarning>
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
