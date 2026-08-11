import { createClient } from "@/lib/supabase/server";
import { UploadForm } from "@/components/upload-form";

export default async function UploadPage() {
  const supabase = await createClient();
  const { data: papers } = await supabase
    .from("question_papers")
    .select("id, title, subjects(name_en)")
    .eq("is_public_template", true)
    .limit(20);

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Upload your answer script</h1>
        <p className="text-sm text-muted-foreground">
          Photograph each page clearly, in order. JPG, PNG, HEIC, or PDF.
        </p>
      </div>
      <UploadForm papers={papers ?? []} />
    </div>
  );
}
