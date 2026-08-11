"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Loosely typed on purpose: `Database` is a placeholder until
// `supabase gen types` runs against the real project (see
// src/lib/supabase/types.ts), so the exact join shape isn't known yet.
type Paper = { id: string; title: string; subjects: { name_en: string } | { name_en: string }[] | null };

function subjectName(subjects: Paper["subjects"]): string {
  if (!subjects) return "";
  return Array.isArray(subjects) ? (subjects[0]?.name_en ?? "") : subjects.name_en;
}

export function UploadForm({ papers }: { papers: Paper[] }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [paperId, setPaperId] = useState<string>(papers[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!paperId || files.length === 0) {
      setError("Select a paper and at least one page image.");
      return;
    }

    setStatus("uploading");
    setError(null);

    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Not signed in.");

      // Downscale/re-encode before upload — required on Bangladeshi metered
      // mobile data, where a 12MP HEIC can be ~8-15MB (docs/review §8.5).
      const compressed = await Promise.all(files.map((f) => compressImage(f)));

      const pageUrls: string[] = [];
      for (let i = 0; i < compressed.length; i++) {
        const path = `${user.id}/${crypto.randomUUID()}/${i + 1}.jpg`;
        const { error: uploadErr } = await supabase.storage
          .from("submission-pages")
          .upload(path, compressed[i], { contentType: "image/jpeg" });
        if (uploadErr) throw uploadErr;

        const { data: signed } = await supabase.storage
          .from("submission-pages")
          .createSignedUrl(path, 60 * 60 * 24 * 7);
        if (signed?.signedUrl) pageUrls.push(signed.signedUrl);
      }

      const res = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionPaperId: paperId,
          pageUrls,
          submissionType: "WEB_UPLOAD",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Upload failed.");

      router.push(`/dashboard/submissions/${json.submissionId}`);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="paper">Question paper</Label>
        {papers.length === 0 ? (
          <p className="text-sm text-muted-foreground rounded-lg border border-border p-3">
            No mock exams available yet for the vertical-slice pilot subjects. Check back soon.
          </p>
        ) : (
          <Select value={paperId} onValueChange={setPaperId}>
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

      <div className="space-y-1.5">
        <Label htmlFor="pages">Script pages</Label>
        <Input
          id="pages"
          type="file"
          accept="image/*,.pdf,.heic"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
        />
        {files.length > 0 && (
          <p className="text-xs text-muted-foreground">{files.length} page(s) selected.</p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" size="lg" className="w-full" disabled={status === "uploading" || papers.length === 0}>
        {status === "uploading" ? "Uploading…" : "Submit for grading"}
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
