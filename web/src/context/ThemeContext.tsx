'use client';

/**
 * Compatibility shim over `next-themes` (`ThemeProvider` in
 * `@/components/theme-provider`, wired in the root layout, which injects a
 * pre-paint script that removes the FOUC).
 *
 * Keeps the old `{ darkMode, setDarkMode, toggleDarkMode }` surface so existing
 * call sites keep working, and also passes through `theme` / `setTheme` for the
 * three-way (light / dark / system) switcher. `mounted` is required by anything
 * that renders theme-dependent markup, or it will hydration-mismatch.
 */
import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme, systemTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const darkMode = mounted && (resolvedTheme ?? theme) === 'dark';

  return {
    mounted,
    theme,
    systemTheme,
    resolvedTheme,
    setTheme,
    darkMode,
    setDarkMode: (dark: boolean) => setTheme(dark ? 'dark' : 'light'),
    toggleDarkMode: () => setTheme(darkMode ? 'light' : 'dark'),
  };
};
