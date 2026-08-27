'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { Sun, Moon } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ThemeToggle({
  className,
  showLabel = false,
}: {
  className?: string;
  showLabel?: boolean;
}) {
  const { darkMode, toggleDarkMode } = useTheme();
  const { t } = useLanguage();

  const label = darkMode ? t('common.light_mode') : t('common.dark_mode');

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      className={cn('theme-toggle-btn', className)}
      title={label}
      aria-label={label}
    >
      <span className="theme-toggle-icon-wrap" aria-hidden="true">
        {darkMode ? (
          <Sun size={16} className="theme-icon-sun" />
        ) : (
          <Moon size={16} className="theme-icon-moon" />
        )}
      </span>
      {showLabel && <span className="theme-toggle-text">{label}</span>}
    </button>
  );
}
