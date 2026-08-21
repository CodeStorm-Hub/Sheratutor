import { cn } from "@/lib/utils";

/**
 * Wordmark for the "খাতা" identity: "Shera" in ink/paper (theme-dependent),
 * "Tutor" in bottle green, Anek Latin ExtraBold. Recreated as styled text —
 * no image asset needed.
 */
export function Logo({ className, tagline = false }: { className?: string; tagline?: boolean }) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span className="font-heading font-extrabold text-2xl tracking-tight">
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
