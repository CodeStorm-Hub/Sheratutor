"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Monitor } from "lucide-react";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light", label: "খাতা", icon: Sun },
  { value: "dark", label: "ব্ল্যাকবোর্ড", icon: Moon },
  { value: "system", label: "সিস্টেম", icon: Monitor },
] as const;

const noopSubscribe = () => () => {};

/**
 * True only after hydration. Server and the pre-hydration client both must
 * render "not mounted" — the stored theme preference isn't knowable until
 * then — so this reads a snapshot instead of setState-in-effect, avoiding a
 * cascading render for what's really just "has hydration happened yet."
 */
function useMounted() {
  return useSyncExternalStore(noopSubscribe, () => true, () => false);
}

/** Light/dark/system switcher for the "খাতা" (paper) vs blackboard theme. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  if (!mounted) return <div className={cn("h-8", className)} />;

  return (
    <div className={cn("flex items-center gap-1 rounded-lg bg-muted p-1", className)} role="radiogroup" aria-label="থিম">
      {OPTIONS.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          onClick={() => setTheme(value)}
          className={cn(
            "flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors",
            theme === value ? "bg-card text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Icon className="w-3.5 h-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
}
