'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { Gamepad2, ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GuidebookLibraryView } from '@/components/playground/v2/GuidebookLibraryView';

export default function PlaygroundV2HubPage() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0D0F16] text-foreground p-4 sm:p-6 lg:p-10 transition-colors">
      <div className="mx-auto max-w-6xl space-y-10">
        {/* Top Breadcrumb & Version Switcher Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/40 pb-5">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link href="/dashboard/playground" className="hover:text-primary transition-colors">
              {isBn ? 'খেলার মাঠ' : 'Playground'}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-primary font-bold">{isBn ? 'সংস্করণ ২ (ভার্চুয়াল গাইডবুক)' : 'Version 2 (Guidebook)'}</span>
          </div>

          <Link
            href="/dashboard/playground"
            className="inline-flex items-center gap-2 rounded-xl border border-primary/20 bg-background/80 hover:bg-primary/5 px-4 py-2 text-xs font-bold text-foreground transition-all shadow-sm"
          >
            <Gamepad2 className="h-4 w-4 text-[#FF6B57]" />
            <span>{isBn ? '🎮 সংস্করণ ১ (কোয়েস্ট অ্যারেনা)-এ ফিরে যান' : '🎮 Switch to Version 1 (Quest Arena)'}</span>
          </Link>
        </div>

        <Suspense fallback={<div className="h-64 flex items-center justify-center text-sm text-muted-foreground">লোড হচ্ছে...</div>}>
          <GuidebookLibraryView />
        </Suspense>
      </div>
    </div>
  );
}
