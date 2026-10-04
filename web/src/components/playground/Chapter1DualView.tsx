'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { Gamepad2, BookOpen, ChevronRight } from 'lucide-react';
import { RealNumbersPlayground } from '@/components/playground/RealNumbersPlayground';
import { RealNumbersGuidebook } from '@/components/playground/v2/RealNumbersGuidebook';
import { PLAYGROUND_CONFIG } from '@/lib/playground-config';
import { useSearchParams } from 'next/navigation';

function Chapter1DualViewInner() {
  const searchParams = useSearchParams();
  const initialVersion = searchParams?.get('v') === '2' ? 'v2' : 'v1';
  const [activeVersion, setActiveVersion] = useState<'v1' | 'v2'>(
    PLAYGROUND_CONFIG.mode === 'v2-only' ? 'v2' : initialVersion
  );

  if (PLAYGROUND_CONFIG.mode === 'v1-only') {
    return <RealNumbersPlayground />;
  }

  if (PLAYGROUND_CONFIG.mode === 'v2-only') {
    return <RealNumbersGuidebook />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Universal Version Switcher Tab Bar */}
      <div className="sticky top-0 z-40 border-b border-border/70 bg-card/95 backdrop-blur-md px-4 py-2.5 shadow-xs">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Link href="/dashboard/playground" className="hover:text-primary transition-colors">
              খেলার মাঠ
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-bold text-foreground">অধ্যায় ১: বাস্তব সংখ্যা</span>
          </div>

          <div className="flex items-center gap-1.5 rounded-2xl bg-muted/60 p-1 border border-border/50">
            <button
              onClick={() => setActiveVersion('v1')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeVersion === 'v1'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Gamepad2 className="h-3.5 w-3.5" />
              <span>সংস্করণ ১ (কোয়েস্ট অ্যারেনা)</span>
            </button>

            <button
              onClick={() => setActiveVersion('v2')}
              className={`flex items-center gap-2 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all ${
                activeVersion === 'v2'
                  ? 'bg-[#FF6B57] text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>সংস্করণ ২ (ভার্চুয়াল গাইডবুক)</span>
              <span className="rounded-full bg-amber-400 px-1.5 py-0.2 text-[9px] font-black text-black">
                NEW
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1">
        {activeVersion === 'v1' ? <RealNumbersPlayground /> : <RealNumbersGuidebook />}
      </div>
    </div>
  );
}

export function Chapter1DualView() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center p-8 text-sm text-muted-foreground">লোড হচ্ছে...</div>}>
      <Chapter1DualViewInner />
    </Suspense>
  );
}
