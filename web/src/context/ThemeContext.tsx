'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkModeState] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    const saved = localStorage.getItem('shera-theme');
    return saved === 'dark' || (!saved && window.matchMedia?.('(prefers-color-scheme: dark)').matches);
  });

  const setDarkMode = (dark: boolean) => {
    setDarkModeState(dark);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shera-theme', dark ? 'dark' : 'light');
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
