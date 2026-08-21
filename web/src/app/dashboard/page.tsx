import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { submissionStatusLabel } from "@/lib/submission-status";
import { MarkGlyph, levelFromScore, markGlyphClasses } from "@/components/mark-glyph";

export default async function DashboardPage() {
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
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">তোমার ড্যাশবোর্ড দেখতে প্রথমে প্রোফাইল সম্পূর্ণ করো।</p>
        <Button asChild>
          <Link href="/onboarding">প্রোফাইল সম্পূর্ণ করো</Link>
        </Button>
      </div>
    );
  }

  const { data: weaknesses } = await supabase
    .from("weakness_logs")
    .select("*, chapters(title_en, title_bn, subjects(name_en))")
    .eq("student_id", profile.id)
    .order("weakness_score", { ascending: false })
    .limit(12);

  const { data: submissions } = await supabase
    .from("exam_submissions")
    .select("*")
    .eq("student_id", profile.id)
    .order("submitted_at", { ascending: false })
    .limit(5);

  const quickWins = (weaknesses ?? []).slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-2xl">ফিরে আসার জন্য স্বাগতম</h1>
          <p className="text-sm text-muted-foreground">
            {profile.exam_type} {profile.target_exam_year} &middot; {profile.academic_group?.replace("_", " ")}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/upload">খাতা জমা দাও</Link>
        </Button>
      </div>

      {/* Quick wins surfaces first — the actionable item, not the score, is what a student should see on open. */}
      <Card>
        <CardHeader>
          <CardTitle className="margin-rule text-sm font-heading font-bold">এখনই যা ঠিক করতে পারো</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2.5">
          {quickWins.length === 0 && (
            <p className="text-sm text-muted-foreground">
              একটি মক পরীক্ষার খাতা জমা দাও, তাহলে তোমার জন্য নির্দিষ্ট পরামর্শ পাবে।
            </p>
          )}
          {quickWins.map((w) => {
            const level = levelFromScore(Number(w.weakness_score));
            return (
              <div key={w.id} className="flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  <MarkGlyph level={level} />
                  <span className="truncate">{w.chapters?.title_bn || w.chapters?.title_en || "অধ্যায়"}</span>
                </div>
                <Badge variant="outline" className={`shrink-0 font-tabular ${markGlyphClasses(level)}`}>
                  {(Number(w.weakness_score) * 100).toFixed(0)}% ঘাটতি
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="eyebrow text-xs text-muted-foreground">মোমেন্টাম স্কোর</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading font-extrabold text-4xl text-primary font-tabular">
              {Number(profile.overall_momentum_score ?? 0).toFixed(0)}
            </p>
            <Progress value={Number(profile.overall_momentum_score ?? 0)} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="eyebrow text-xs text-muted-foreground">সাম্প্রতিক জমা</CardTitle>
              <Link href="/dashboard/submissions" className="text-xs font-medium text-primary hover:underline">
                সব দেখো
              </Link>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {(submissions ?? []).length === 0 && (
              <p className="text-sm text-muted-foreground">এখনও কোনো খাতা জমা দাওনি।</p>
            )}
            {(submissions ?? []).slice(0, 3).map((s) => (
              <Link
                key={s.id}
                href={`/dashboard/submissions/${s.id}`}
                className="flex items-center justify-between text-sm rounded-lg border border-border p-2.5 hover:bg-muted transition-colors"
              >
                <span className="truncate">{submissionStatusLabel(s.status)}</span>
                <span className="text-muted-foreground font-tabular shrink-0">
                  {s.total_score_obtained != null ? `${s.total_score_obtained}/${s.max_possible_score}` : "—"}
                </span>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="eyebrow text-xs text-muted-foreground">বিষয়ভিত্তিক বোঝাপড়ার মানচিত্র</CardTitle>
        </CardHeader>
        <CardContent>
          {(weaknesses ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">এখনও কোনো তথ্য নেই — মূল্যায়ন হওয়ার সাথে সাথে এই মানচিত্র তৈরি হবে।</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(weaknesses ?? []).map((w) => {
                const level = levelFromScore(Number(w.weakness_score));
                return (
                  <div
                    key={w.id}
                    className={`flex items-center gap-2 rounded-lg border p-3 text-sm font-medium ${markGlyphClasses(level)}`}
                  >
                    <MarkGlyph level={level} />
                    <span className="truncate">{w.chapters?.title_bn || w.chapters?.title_en || "অধ্যায়"}</span>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
