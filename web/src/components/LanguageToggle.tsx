'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className,
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const choose = (value: 'bn' | 'en') => {
    setLanguage(value);
    // Server components (e.g. the landing page) read the lang cookie — re-render them.
    router.refresh();
  };

  const opt = (value: 'bn' | 'en', label: string, title: string) => (
    <button
      type="button"
      onClick={() => choose(value)}
      aria-pressed={language === value}
      title={title}
      className={cn(
        'inline-flex items-center justify-center rounded-[0.84rem] px-2 py-1 font-heading text-[0.7rem] leading-none font-bold transition-colors sm:px-2.5 sm:text-xs',
        language === value
          ? 'bg-surface-1 text-coral shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
      )}
    >
      {label}
    </button>
  );

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={cn(
        'inline-flex items-center gap-1 rounded-[1.08rem] border border-border bg-background py-[3px] pr-1 pl-1.5 select-none sm:gap-1.5 sm:pl-2',
        className,
      )}
    >
      {showIcon && (
        <span aria-hidden className="hidden shrink-0 items-center text-muted-foreground sm:inline-flex">
          <Languages size={15} />
        </span>
      )}
      <div className="inline-flex items-center gap-0.5 rounded-[1.08rem] bg-foreground/5 p-0.5">
        {opt('bn', 'বাংলা', 'বাংলায় দেখুন')}
        {opt('en', 'ENG', 'Switch to English')}
      </div>
    </div>
  );
};
