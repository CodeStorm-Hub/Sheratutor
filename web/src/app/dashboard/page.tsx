import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const HEATMAP_COLOR: Record<string, string> = {
  low: "bg-mint/20 text-mint-deep border-mint/30", // mastered
  mid: "bg-sunshine/20 text-ink-navy dark:text-sunshine border-sunshine/40", // review needed
  high: "bg-coral/20 text-coral-deep border-coral/30", // critical gap
};

function bucket(score: number) {
  if (score < 0.34) return "low";
  if (score < 0.67) return "mid";
  return "high";
}

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
        <p className="text-muted-foreground mb-4">Finish setting up your profile to see your dashboard.</p>
        <Button asChild>
          <Link href="/onboarding">Complete onboarding</Link>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl">Welcome back</h1>
          <p className="text-sm text-muted-foreground">
            {profile.exam_type} {profile.target_exam_year} &middot; {profile.academic_group?.replace("_", " ")}
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/dashboard/upload">Upload a script</Link>
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="eyebrow text-xs text-muted-foreground">Momentum Score</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-heading font-extrabold text-4xl text-primary">
              {Number(profile.overall_momentum_score ?? 0).toFixed(0)}
            </p>
            <Progress value={Number(profile.overall_momentum_score ?? 0)} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="eyebrow text-xs text-muted-foreground">AI Quick Wins</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickWins.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Upload a mock exam to get personalized recommendations.
              </p>
            )}
            {quickWins.map((w) => (
              <div key={w.id} className="flex items-center justify-between text-sm">
                <span>{w.chapters?.title_en ?? "Chapter"}</span>
                <Badge variant="outline" className={HEATMAP_COLOR[bucket(Number(w.weakness_score))]}>
                  {(Number(w.weakness_score) * 100).toFixed(0)}% gap
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="eyebrow text-xs text-muted-foreground">Subject Understanding Heatmap</CardTitle>
        </CardHeader>
        <CardContent>
          {(weaknesses ?? []).length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet — your heatmap fills in as you get graded.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(weaknesses ?? []).map((w) => (
                <div
                  key={w.id}
                  className={`rounded-lg border p-3 text-sm font-medium ${HEATMAP_COLOR[bucket(Number(w.weakness_score))]}`}
                >
                  {w.chapters?.title_en ?? "Chapter"}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="eyebrow text-xs text-muted-foreground">Recent submissions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(submissions ?? []).length === 0 && (
            <p className="text-sm text-muted-foreground">No submissions yet.</p>
          )}
          {(submissions ?? []).map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/submissions/${s.id}`}
              className="flex items-center justify-between text-sm rounded-lg border border-border p-3 hover:bg-muted transition-colors"
            >
              <span className="capitalize">{s.status.toLowerCase().replace("_", " ")}</span>
              <span className="text-muted-foreground">
                {s.total_score_obtained != null ? `${s.total_score_obtained}/${s.max_possible_score}` : "—"}
              </span>
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
