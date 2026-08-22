'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageToggle: React.FC<LanguageToggleProps> = ({
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`lang-switch-container ${className}`}
      role="group"
      aria-label="Language selection"
    >
      {showIcon && (
        <span className="lang-globe-icon" aria-hidden="true">
          <Languages size={15} />
        </span>
      )}
      <div className="lang-switch-pill">
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          className={`lang-opt-btn ${language === 'bn' ? 'active' : ''}`}
          aria-pressed={language === 'bn'}
          title="বাংলায় দেখুন"
        >
          বাংলা
        </button>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`lang-opt-btn ${language === 'en' ? 'active' : ''}`}
          aria-pressed={language === 'en'}
          title="Switch to English"
        >
          ENG
        </button>
      </div>
    </div>
  );
};
