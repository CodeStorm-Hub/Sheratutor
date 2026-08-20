import { cn } from "@/lib/utils";

/**
 * Wordmark per docs/research-idea/03-design-system.md: "Shera" in
 * ink-navy/white (theme-dependent), "Tutor" in coral, Baloo 2 ExtraBold.
 * Recreated as styled text — no image asset needed.
 */
export function Logo({
  className,
  tagline = false,
  compact = false,
}: {
  className?: string;
  tagline?: boolean;
  compact?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-heading font-extrabold tracking-tight",
          compact ? "text-lg" : "text-2xl"
        )}
      >
        <span className="text-foreground">Shera</span>
        <span className="text-primary">Tutor</span>
      </span>
      {tagline && (
        <span className="font-heading text-xs mt-0.5">
          <span className="text-muted-foreground">for </span>
          <span className="text-foreground">Shera</span>
          <span className="text-primary">Students</span>
        </span>
      )}
    </span>
  );
}
