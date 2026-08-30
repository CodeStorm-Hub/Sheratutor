'use client';

/**
 * Compatibility shim. The app themes through `next-themes` (`ThemeProvider` in
 * `@/components/theme-provider`, wired in the root layout, which injects a
 * pre-paint script that removes the FOUC).
 *
 * This hook keeps the old `{ darkMode, setDarkMode, toggleDarkMode }` surface
 * so existing call sites keep working, and adds `mounted`: the resolved theme
 * is only knowable on the client, so anything that renders theme-dependent
 * markup (icon, label, class) MUST gate on `mounted` or it will hydration-
 * mismatch. New code should use `useTheme` from `next-themes` directly.
 */
import { useEffect, useState } from 'react';
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const darkMode = mounted && (resolvedTheme ?? theme) === 'dark';

  return {
    mounted,
    darkMode,
    setDarkMode: (dark: boolean) => setTheme(dark ? 'dark' : 'light'),
    toggleDarkMode: () => setTheme(darkMode ? 'light' : 'dark'),
  };
};
