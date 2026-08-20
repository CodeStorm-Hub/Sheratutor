import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!profile) {
    return <p className="text-sm text-muted-foreground">Finish setting up your profile first.</p>;
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div>
        <h1 className="font-heading font-bold text-2xl">Profile</h1>
        <p className="text-sm text-muted-foreground">{user?.email}</p>
      </div>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="eyebrow text-xs text-muted-foreground">Exam details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm
            educationBoard={profile.education_board}
            examType={profile.exam_type}
            academicGroup={profile.academic_group}
            targetExamYear={profile.target_exam_year}
            trainingDataOptIn={profile.training_data_opt_in ?? false}
          />
        </CardContent>
      </Card>
    </div>
  );
}
