import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "@/components/upload-form";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: papers } = await supabase
    .from("question_papers")
    .select("id, title, subjects(name_en), questions(id, question_number, question_text_en)")
    .or(`is_public_template.eq.true,created_by_user_id.eq.${user!.id}`)
    .limit(20);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl">Upload your answer script</h1>
          <p className="text-sm text-muted-foreground">
            Photograph each page clearly, in order. JPG, PNG, HEIC, or PDF.
          </p>
        </div>
        <Link
          href="/dashboard/practice/generate"
          className="text-xs font-medium text-primary hover:underline shrink-0 whitespace-nowrap"
        >
          Generate a practice paper
        </Link>
      </div>
      <UploadForm papers={papers ?? []} />
    </div>
  );
}
