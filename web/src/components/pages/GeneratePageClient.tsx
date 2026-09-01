"use client";

import React from 'react';
import { GeneratePaperForm } from '@/app/dashboard/practice/generate/generate-paper-form';
import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';

export function GeneratePageClient({
  subjects,
  chapters,
}: {
  subjects: { id: string; name_en: string; name_bn: string }[];
  chapters: { id: string; chapter_no: number; title_en: string; title_bn: string; subject_id: string }[];
}) {
  const { language } = useLanguage();

  return (
    <div className="max-w-3xl mx-auto w-full space-y-6">
      <PageHeader
        title={language === 'bn' ? 'প্রশ্নপত্র তৈরি করো' : 'Generate Question Paper'}
        description={
          language === 'bn'
            ? 'তোমার সিলেবাস ও অধ্যায় নির্বাচন করো — SheraTutor আসল NCTB বোর্ড স্ট্যান্ডার্ড মডেল প্রশ্নপত্র তৈরি করে দেবে।'
            : 'Choose a subject and chapter — SheraTutor will generate a board-standard mock exam paper tailored to your syllabus.'
        }
      />
      <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
        <GeneratePaperForm
          subjects={subjects ?? []}
          chapters={chapters ?? []}
        />
      </div>
    </div>
  );
}
