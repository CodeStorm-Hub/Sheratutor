"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, ImagePlus, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

// Loosely typed on purpose: `Database` is a placeholder until
// `supabase gen types` runs against the real project (see
// src/lib/supabase/types.ts), so the exact join shape isn't known yet.
type Question = { id: string; question_number: number; question_text_en: string | null };
export type Paper = {
  id: string;
  title: string;
  subjects: { name_en: string } | { name_en: string }[] | null;
  questions: Question[] | null;
};
type PageEntry = { file: File; previewUrl: string; questionId: string | null };

function subjectName(subjects: Paper["subjects"]): string {
  if (!subjects) return "";
  return Array.isArray(subjects) ? (subjects[0]?.name_en ?? "") : subjects.name_en;
}

export function UploadForm({ papers, initialPaperId }: { papers: Paper[]; initialPaperId?: string }) {
  const router = useRouter();
  const { language } = useLanguage();
  const [pages, setPages] = useState<PageEntry[]>([]);
  // Use initialPaperId if it matches a paper, otherwise fallback to the first paper.
  const matchedPaperId = initialPaperId && papers.some((p) => p.id === initialPaperId) ? initialPaperId : papers[0]?.id ?? "";
  const [paperId, setPaperId] = useState<string>(matchedPaperId);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadProgress, setUploadProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const selectedPaper = papers.find((p) => p.id === paperId);
  const questions = (selectedPaper?.questions ?? []).slice().sort((a, b) => a.question_number - b.question_number);

  function addFiles(fileList: FileList | null) {
    const added = Array.from(fileList ?? []).map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      questionId: null,
    }));
    if (added.length) setPages((prev) => [...prev, ...added]);
  }

  function removePage(index: number) {
    setPages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function setPageQuestion(index: number, questionId: string | null) {
    setPages((prev) => prev.map((p, i) => (i === index ? { ...p, questionId } : p)));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paperId || pages.length === 0) {
      setError(language === 'bn' ? "একটি প্রশ্নপত্র নির্বাচন করো এবং অন্তত একটি পৃষ্ঠার ছবি তোলো।" : "Please select a question paper and upload at least one page photo.");
      return;
    }

    setStatus("uploading");
    setError(null);
    setUploadProgress({ done: 0, total: pages.length });

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error(language === 'bn' ? "তুমি সাইন ইন করা নেই।" : "You are not signed in.");

      const submissionFolder = crypto.randomUUID();
      const pageUrls: string[] = [];

      // Sequential, not parallel — each page compresses + uploads one at a
      // time so we can show real progress on metered mobile data instead of
      // a single opaque spinner (docs/review §8.5).
      for (let i = 0; i < pages.length; i++) {
        const compressed = await compressImage(pages[i].file);
        const path = `${user.id}/${submissionFolder}/${i + 1}.jpg`;
        const { error: uploadErr } = await supabase.storage
          .from("submission-pages")
          .upload(path, compressed, { contentType: "image/jpeg" });
        if (uploadErr) throw uploadErr;

        const {
          data: { publicUrl },
        } = supabase.storage.from("submission-pages").getPublicUrl(path);
        pageUrls.push(publicUrl);
        setUploadProgress({ done: i + 1, total: pages.length });
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paperId,
          pageUrls,
          questionAssignments: pages.map((p) => p.questionId),
        }),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? (language === 'bn' ? "জমা দেওয়া ব্যর্থ হয়েছে।" : "Submission failed."));
      }

      const { id } = (await res.json()) as { id: string };
      router.push(`/dashboard/submissions/${id}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : (language === 'bn' ? "আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করো।" : "Upload failed. Please try again."));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="questionPaperSelect">{language === 'bn' ? 'প্রশ্নপত্র' : 'Question Paper'}</Label>
        {papers.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-border p-3">
            {language === 'bn' ? 'এই মুহূর্তে কোনো মক পরীক্ষা পাওয়া যাচ্ছে না। শীঘ্রই আবার দেখো।' : 'No practice papers available right now. Check back soon.'}
          </p>
        ) : (
          <Select
            value={paperId}
            onValueChange={(v) => {
              setPaperId(v);
            }}
          >
            <SelectTrigger id="questionPaperSelect" aria-label={language === 'bn' ? 'প্রশ্নপত্র নির্বাচন করুন' : 'Select question paper'} className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {papers.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {subjectName(p.subjects) ? `${subjectName(p.subjects)} — ` : ""}
                  {p.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label>{language === 'bn' ? 'পৃষ্ঠার ছবি' : 'Page Photos'}</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-6 text-primary hover:bg-primary/10 transition-colors"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm font-medium">{language === 'bn' ? 'ক্যামেরায় তোলো' : 'Take with Camera'}</span>
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground hover:bg-muted transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm font-medium">{language === 'bn' ? 'গ্যালারি থেকে বেছে নাও' : 'Choose from Gallery'}</span>
          </button>
        </div>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          aria-label={language === 'bn' ? "ক্যামেরা থেকে ছবি তুলুন" : "Take photo with camera"}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*,.pdf,.heic"
          multiple
          aria-label={language === 'bn' ? "গ্যালারি থেকে ছবি বেছে নিন" : "Choose photos from gallery"}
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="text-xs text-muted-foreground">
          {language === 'bn' ? 'প্রতিটি পৃষ্ঠা স্পষ্টভাবে, ক্রম অনুযায়ী তোলো।' : 'Photograph every page clearly in chronological order.'}
        </p>
      </div>

      {pages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">
            {language === 'bn' ? `${pages.length}টি পৃষ্ঠা যোগ হয়েছে` : `${pages.length} page(s) added`}
          </p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
            {pages.map((p, i) => (
              <div key={p.previewUrl} className="relative shrink-0 w-20">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, no next/image benefit */}
                  <img src={p.previewUrl} alt={language === 'bn' ? `পৃষ্ঠা ${i + 1}` : `Page ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-xs font-tabular rounded px-1.5 py-0.5">
                    {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePage(i)}
                    aria-label={language === 'bn' ? "পৃষ্ঠা সরাও" : "Remove page"}
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {questions.length > 0 && (
                  <Select value={p.questionId ?? "unsure"} onValueChange={(v) => setPageQuestion(i, v === "unsure" ? null : v)}>
                    <SelectTrigger className="h-6 text-xs w-20 mt-1 px-1.5" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unsure">{language === 'bn' ? 'অনিশ্চিত' : 'Unsure'}</SelectItem>
                      {questions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {language === 'bn' ? `প্রশ্ন ${q.question_number}` : `Question ${q.question_number}`}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full gap-2" disabled={status === "uploading" || papers.length === 0}>
        {status === "uploading" ? (
          <>
            <Loader2 className={cn("w-4 h-4 animate-spin")} />
            {uploadProgress ? (language === 'bn' ? `আপলোড হচ্ছে (${uploadProgress.done}/${uploadProgress.total})…` : `Uploading (${uploadProgress.done}/${uploadProgress.total})…`) : (language === 'bn' ? "আপলোড হচ্ছে…" : "Uploading…")}
          </>
        ) : (
          language === 'bn' ? "মূল্যায়নের জন্য জমা দাও" : "Submit for Evaluation"
        )}
      </Button>
    </form>
  );
}

/**
 * Client-side downscale, contrast normalization, and WebP compression
 * to keep uploads ultra-fast on metered 3G/4G connections in Bangladesh.
 */
async function compressImage(file: File, maxDim = 1800, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return file;

    // Draw base resized image
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    // Apply slight contrast enhancement for faint pencil/ink on lined khata paper
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const d = imgData.data;
    const contrast = 1.15; // 15% contrast boost
    const intercept = 128 * (1 - contrast);
    for (let i = 0; i < d.length; i += 4) {
      d[i] = d[i] * contrast + intercept;     // R
      d[i + 1] = d[i + 1] * contrast + intercept; // G
      d[i + 2] = d[i + 2] * contrast + intercept; // B
    }
    ctx.putImageData(imgData, 0, 0);

    return new Promise((resolve) => {
      // Prefer WebP if supported, fallback to JPEG
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            canvas.toBlob((fallbackBlob) => resolve(fallbackBlob ?? file), "image/jpeg", quality);
          }
        },
        "image/webp",
        quality
      );
    });
  } catch {
    return file;
  }
}
