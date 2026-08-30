"use client";

import React from 'react';
import Link from 'next/link';
import { UploadForm } from '@/components/upload-form';
import { PageHeader } from '@/components/PageHeader';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export function UploadPageClient({
  papers,
  initialPaperId,
}: {
  papers: any[];
  initialPaperId?: string;
}) {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <PageHeader
        title={language === 'bn' ? 'উত্তরপত্র জমা দিন' : 'Upload Answer Sheet'}
        description={
          language === 'bn'
            ? 'তোমার হাতে লেখা উত্তরপত্রের স্পষ্ট ছবি তোলো এবং ক্রম অনুযায়ী আপলোড করো।'
            : 'Take clear photos of your handwritten answer script in chronological order.'
        }
      >
        <Link
          href="/dashboard/practice/generate"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cta px-4 py-2.5 text-xs font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90"
        >
          <Sparkles size={14} />
          {language === 'bn' ? 'নতুন প্রশ্নপত্র তৈরি করো' : 'Generate Question Paper'}
        </Link>
      </PageHeader>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <UploadForm papers={papers} initialPaperId={initialPaperId} />
      </div>
    </div>
  );
}
