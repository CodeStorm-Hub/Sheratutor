'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations, Language, TranslationKey } from '@/data/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey, fallback?: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Always initialize with 'bn' on both server and initial client render to avoid SSR hydration mismatches
  const [language, setLanguageState] = useState<Language>('bn');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('sheratutor_lang') as Language | null;
      if (saved === 'en' || saved === 'bn') {
        setLanguageState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore in environments with restricted storage
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('sheratutor_lang', lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'bn' ? 'en' : 'bn';
    setLanguage(nextLang);
  };

  const t = (key: TranslationKey, fallback?: string): string => {
    const dict = translations[language] as Record<string, string>;
    if (dict && dict[key]) {
      return dict[key];
    }
    const enDict = translations.en as Record<string, string>;
    if (enDict && enDict[key]) {
      return enDict[key];
    }
    return fallback || key;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
