import { createClient } from "@/lib/supabase/server";
import { GeneratePaperForm } from "./generate-paper-form";

export default async function GeneratePracticePaperPage() {
  const supabase = await createClient();
  const { data: subjects } = await supabase.from("subjects").select("id, name_en").order("name_en");
  const { data: chapters } = await supabase
    .from("chapters")
    .select("id, subject_id, chapter_no, title_en")
    .order("chapter_no");

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Generate a practice paper</h1>
        <p className="text-sm text-muted-foreground">
          Pick a subject and chapters — SheraTutor writes a mock paper grounded in the real NCTB curriculum.
        </p>
      </div>
      <GeneratePaperForm subjects={subjects ?? []} chapters={chapters ?? []} />
    </div>
  );
}
