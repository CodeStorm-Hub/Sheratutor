import { Check, Triangle, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type MasteryLevel = "mastered" | "review" | "gap";

/**
 * The examiner's tick mark, applied to mastery/weakness scores throughout
 * the dashboard. Color alone never carries the meaning here — every use
 * pairs a hue with one of these three glyphs (✓ / △ / ✗) so the state
 * reads correctly without color vision.
 */
export function levelFromScore(score: number): MasteryLevel {
  if (score < 0.34) return "mastered";
  if (score < 0.67) return "review";
  return "gap";
}

const LEVEL_STYLE: Record<MasteryLevel, { className: string; icon: typeof Check; label: string }> = {
  mastered: { className: "bg-green-soft text-green border-green/30", icon: Check, label: "রপ্ত" },
  review: { className: "bg-ochre-soft text-ochre border-ochre/40", icon: Triangle, label: "ঝালাই দরকার" },
  gap: { className: "bg-red-soft text-red border-red/30", icon: X, label: "দুর্বলতা" },
};

export function MarkGlyph({ level, className }: { level: MasteryLevel; className?: string }) {
  const { className: levelClassName, icon: Icon } = LEVEL_STYLE[level];
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center w-5 h-5 rounded-full border shrink-0",
        levelClassName,
        className
      )}
    >
      <Icon className="w-3 h-3" strokeWidth={3} />
    </span>
  );
}

export function markGlyphClasses(level: MasteryLevel) {
  return LEVEL_STYLE[level].className;
}

export function markGlyphLabel(level: MasteryLevel) {
  return LEVEL_STYLE[level].label;
}
