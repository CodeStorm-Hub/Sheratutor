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

// Loosely typed on purpose: `Database` is a placeholder until
// `supabase gen types` runs against the real project (see
// src/lib/supabase/types.ts), so the exact join shape isn't known yet.
type Question = { id: string; question_number: number; question_text_en: string | null };
type Paper = {
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
      setError("একটি প্রশ্নপত্র নির্বাচন করো এবং অন্তত একটি পৃষ্ঠার ছবি তোলো।");
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
      if (!user) throw new Error("তুমি সাইন ইন করা নেই।");

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

        const { data: signed } = await supabase.storage
          .from("submission-pages")
          .createSignedUrl(path, 60 * 60 * 24 * 7);
        if (signed?.signedUrl) pageUrls.push(signed.signedUrl);
        setUploadProgress({ done: i + 1, total: pages.length });
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionPaperId: paperId,
          pageUrls,
          pageQuestionIds: pages.map((p) => p.questionId),
          submissionType: "WEB_UPLOAD",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "আপলোড ব্যর্থ হয়েছে।");

      router.push(`/dashboard/submissions/${json.submissionId}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "কিছু একটা সমস্যা হয়েছে।");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="paper">প্রশ্নপত্র</Label>
        {papers.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-border p-3">
            এই মুহূর্তে কোনো মক পরীক্ষা পাওয়া যাচ্ছে না। শীঘ্রই আবার দেখো।
          </p>
        ) : (
          <Select
            value={paperId}
            onValueChange={(v) => {
              setPaperId(v);
            }}
          >
            <SelectTrigger id="paper" className="w-full">
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
        <Label>পৃষ্ঠার ছবি</Label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => cameraInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-primary/40 bg-primary/5 py-6 text-primary hover:bg-primary/10 transition-colors"
          >
            <Camera className="w-6 h-6" />
            <span className="text-sm font-medium">ক্যামেরায় তোলো</span>
          </button>
          <button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            className="flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border py-6 text-muted-foreground hover:bg-muted transition-colors"
          >
            <ImagePlus className="w-6 h-6" />
            <span className="text-sm font-medium">গ্যালারি থেকে বেছে নাও</span>
          </button>
        </div>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
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
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.target.value = "";
          }}
        />
        <p className="text-xs text-muted-foreground">প্রতিটি পৃষ্ঠা স্পষ্টভাবে, ক্রম অনুযায়ী তোলো।</p>
      </div>

      {pages.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-muted-foreground">{pages.length}টি পৃষ্ঠা যোগ হয়েছে</p>
          <div className="flex gap-2.5 overflow-x-auto pb-1 -mx-1 px-1">
            {pages.map((p, i) => (
              <div key={p.previewUrl} className="relative shrink-0 w-20">
                <div className="relative w-20 h-24 rounded-lg overflow-hidden border border-border bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview, no next/image benefit */}
                  <img src={p.previewUrl} alt={`পৃষ্ঠা ${i + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] font-tabular rounded px-1.5 py-0.5">
                    {i + 1}
                  </span>
                  <button
                    type="button"
                    onClick={() => removePage(i)}
                    aria-label="পৃষ্ঠা সরাও"
                    className="absolute top-1 right-1 bg-black/60 hover:bg-red text-white rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                {questions.length > 0 && (
                  <Select value={p.questionId ?? "unsure"} onValueChange={(v) => setPageQuestion(i, v === "unsure" ? null : v)}>
                    <SelectTrigger className="h-6 text-[10px] w-20 mt-1 px-1.5" size="sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="unsure">অনিশ্চিত</SelectItem>
                      {questions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          প্রশ্ন {q.question_number}
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
            {uploadProgress ? `আপলোড হচ্ছে (${uploadProgress.done}/${uploadProgress.total})…` : "আপলোড হচ্ছে…"}
          </>
        ) : (
          "মূল্যায়নের জন্য জমা দাও"
        )}
      </Button>
    </form>
  );
}

/** Client-side downscale to keep uploads usable on metered 3G/4G (docs/review §8.5). */
async function compressImage(file: File, maxDim = 1800, quality = 0.82): Promise<Blob> {
  if (!file.type.startsWith("image/")) return file; // PDFs/HEIC pass through untouched for now

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob ?? file), "image/jpeg", quality);
  });
}
