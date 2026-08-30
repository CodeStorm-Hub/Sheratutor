'use client';

/**
 * Compatibility shim. The app now themes through `next-themes`
 * (`ThemeProvider` in `@/components/theme-provider`, wired in the root layout,
 * with a pre-paint script in the layout `<head>` that removes the FOUC).
 *
 * This hook keeps the old `{ darkMode, setDarkMode, toggleDarkMode }` surface
 * so existing call sites (`ClientShell`, `SettingsPageClient`) keep working.
 * New code should use `useTheme` from `next-themes` directly.
 */
import { useTheme as useNextTheme } from 'next-themes';

export const useTheme = () => {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const darkMode = (resolvedTheme ?? theme) === 'dark';

  return {
    darkMode,
    setDarkMode: (dark: boolean) => setTheme(dark ? 'dark' : 'light'),
    toggleDarkMode: () => setTheme(darkMode ? 'light' : 'dark'),
  };
};
