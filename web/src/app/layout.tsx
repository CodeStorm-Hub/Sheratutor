import type { Metadata } from 'next';
import React from 'react';
import {
  Outfit,
  Plus_Jakarta_Sans,
  Hind_Siliguri,
  Baloo_Da_2,
  JetBrains_Mono,
} from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { LanguageProvider } from '@/context/LanguageContext';
import { Toaster } from '@/components/ui/sonner';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-body',
  display: 'swap',
});

const hindSiliguri = Hind_Siliguri({
  subsets: ['bengali'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body-bn',
  display: 'swap',
});

const balooDa2 = Baloo_Da_2({
  subsets: ['bengali'],
  weight: ['600', '700', '800'],
  variable: '--font-display-bn',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono-eyebrow',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sheratutor.tech';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'SheraTutor — HSC & SSC AI Diagnostic Learning Workspace',
    template: '%s | SheraTutor',
  },
  description:
    'A private AI tutor that evaluates handwritten Bangla and English exam scripts just like an authentic NCTB Board Examiner. Free forever for every HSC & SSC student across Bangladesh.',
  keywords: [
    'SheraTutor',
    'HSC preparation',
    'SSC preparation',
    'NCTB rubric',
    'Bangla AI OCR',
    'Handwritten exam evaluation',
    'Education Board Bangladesh',
    'Dhaka Board HSC',
    'Creative Question grading',
    'সেরাটিউটর',
  ],
  authors: [{ name: 'SheraTutor Team' }],
  creator: 'SheraTutor',
  publisher: 'SheraTutor',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SheraTutor — HSC & SSC AI Diagnostic Learning Workspace',
    description:
      'Photograph your handwritten exam scripts. SheraTutor evaluates against official NCTB rubrics and pinpoints mark recoveries instantly.',
    url: siteUrl,
    siteName: 'SheraTutor',
    locale: 'bn_BD',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SheraTutor — Authentic NCTB AI Examiner',
    description:
      'Evaluates handwritten SSC & HSC exam scripts with official NCTB board rubrics. 100% free for students.',
  },
  icons: {
    icon: '/icon.svg',
  },
  other: {
    'darkreader-lock': '',
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
      suppressHydrationWarning
      className={`${outfit.variable} ${balooDa2.variable} ${plusJakartaSans.variable} ${jetbrainsMono.variable} ${hindSiliguri.variable}`}
    >
      <head>
        <meta name="darkreader-lock" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            {children}
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
