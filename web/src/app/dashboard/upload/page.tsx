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
    <div className="max-w-lg mx-auto w-full px-4 md:px-6 py-6 md:py-8 pb-24 md:pb-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl">খাতা জমা দাও</h1>
          <p className="text-sm text-muted-foreground">
            প্রতিটি পৃষ্ঠার ছবি স্পষ্টভাবে, ক্রম অনুযায়ী তোলো।
          </p>
        </div>
        <Link
          href="/dashboard/practice/generate"
          className="text-xs font-medium text-primary hover:underline shrink-0 whitespace-nowrap"
        >
          প্রশ্নপত্র তৈরি করো
        </Link>
      </div>
      <UploadForm papers={papers ?? []} />
    </div>
  );
}
