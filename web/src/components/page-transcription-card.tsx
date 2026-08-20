"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Flag, Loader2 } from "lucide-react";

type Page = {
  id: string;
  page_number: number;
  original_image_url: string;
  ocr_raw_text: string | null;
  transcription_confidence: number | null;
  student_flagged_mismatch: boolean;
};

function confidenceBadgeClass(confidence: number | null): string {
  if (confidence == null) return "bg-muted text-muted-foreground border-border";
  if (confidence < 0.6) return "bg-coral/20 text-coral-deep border-coral/30";
  if (confidence < 0.85) return "bg-sunshine/20 text-ink-navy dark:text-sunshine border-sunshine/40";
  return "bg-mint/20 text-mint-deep border-mint/30";
}

/**
 * Student-facing transcription review — docs/review §3 mitigation #4: show
 * the student what the OCR read, with a one-tap "this isn't what I wrote"
 * flag. This is a trust/compliance feature and the highest-signal free
 * labelling channel for catching VLM over-correction, not just a nicety.
 */
export function PageTranscriptionCard({ submissionId, page }: { submissionId: string; page: Page }) {
  const [flagged, setFlagged] = useState(page.student_flagged_mismatch);
  const [pending, setPending] = useState(false);

  async function handleFlag() {
    if (flagged || pending) return;
    setPending(true);
    try {
      const res = await fetch(`/api/submissions/${submissionId}/pages/${page.id}/flag`, { method: "POST" });
      if (res.ok) setFlagged(true);
    } finally {
      setPending(false);
    }
  }

  const lowConfidence = page.transcription_confidence != null && page.transcription_confidence < 0.75;

  return (
    <div className="flex gap-3 border border-border rounded-lg p-3">
      <div className="relative w-16 h-20 shrink-0 rounded overflow-hidden border border-border/60 bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element -- signed Supabase Storage
            URLs rotate per-request; a plain <img> avoids next/image remote-pattern config
            coupling for a 64x80 thumbnail where optimization has no real benefit. */}
        <img src={page.original_image_url} alt={`Page ${page.page_number}`} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">Page {page.page_number}</span>
          <Badge variant="outline" className={confidenceBadgeClass(page.transcription_confidence)}>
            {page.transcription_confidence != null ? `${Math.round(page.transcription_confidence * 100)}% confidence` : "—"}
          </Badge>
          {lowConfidence && (
            <span className="text-[11px] text-coral-deep dark:text-coral">Low confidence — please check</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
          {page.ocr_raw_text || "Transcription pending…"}
        </p>
        <Button
          type="button"
          variant={flagged ? "secondary" : "outline"}
          size="sm"
          disabled={flagged || pending}
          onClick={handleFlag}
          className="h-11 sm:h-9 whitespace-normal text-left text-xs gap-1.5"
        >
          {pending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Flag className="w-3 h-3" />}
          {flagged ? "এটা আমার লেখা নয় বলে জানানো হয়েছে" : "এই লেখাটি আমি লিখিনি"}
        </Button>
      </div>
    </div>
  );
}
