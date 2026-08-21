import { createClient } from "@/lib/supabase/server";
import { TutorPageClient } from "@/components/tutor-page-client";

export default async function TutorPage() {
  const supabase = await createClient();

  const { data: subjects } = await supabase
    .from("subjects")
    .select("id, name_en, name_bn, chapters(id, chapter_no, title_en, title_bn)")
    .order("name_en");

  const { data: sessionsData } = await supabase
    .from("tutor_chat_sessions")
    .select("id, title, context_json, updated_at")
    .eq("mode", "general")
    .order("updated_at", { ascending: false })
    .limit(50);

  return (
    <div className="h-full pb-20 md:pb-0 min-h-[26rem]">
      <TutorPageClient subjects={subjects ?? []} initialSessions={sessionsData ?? []} />
    </div>
  );
}
