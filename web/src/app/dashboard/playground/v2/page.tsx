'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { ChevronRight, Sparkles, Home } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GuidebookLibraryView } from '@/components/playground/v2/GuidebookLibraryView';

export default function PlaygroundV2HubPage() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0D0F16] text-foreground p-4 sm:p-6 lg:p-10 transition-colors">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between border-b border-border/40 pb-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link href="/dashboard" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="h-3.5 w-3.5" />
              <span>{isBn ? 'ড্যাশবোর্ড' : 'Dashboard'}</span>
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground font-bold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#FF6B57]" />
              <span>{isBn ? 'খেলার মাঠ (ইন্টারেক্টিভ ল্যাব ও গাইডবুক)' : 'Playground (Interactive Labs & Guidebooks)'}</span>
            </span>
          </div>
        </div>

        <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-muted-foreground">লোড হচ্ছে...</div>}>
          <GuidebookLibraryView />
        </Suspense>
      </div>
    </div>
  );
}
