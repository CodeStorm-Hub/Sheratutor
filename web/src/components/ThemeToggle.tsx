'use client';

import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

/**
 * Single-tap light/dark switch for the marketing header. The dashboard has its
 * own three-way (light/dark/system) menu in <Header>; this is the lightweight
 * version for pages that only need a toggle.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { mounted, darkMode, toggleDarkMode } = useTheme();
  const { language } = useLanguage();

  const label = darkMode
    ? language === 'bn'
      ? 'লাইট থিম'
      : 'Switch to light theme'
    : language === 'bn'
      ? 'ডার্ক থিম'
      : 'Switch to dark theme';

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label={label}
      title={label}
      suppressHydrationWarning
      className={cn(
        'inline-flex size-[34px] shrink-0 items-center justify-center rounded-[1.08rem] border border-border bg-background text-muted-foreground transition-colors hover:text-foreground',
        className,
      )}
    >
      {mounted && darkMode ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
