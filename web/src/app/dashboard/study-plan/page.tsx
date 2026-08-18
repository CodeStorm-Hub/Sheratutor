import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { generateStudyPlan } from "@/app/actions/study-plan";

type ScheduleDay = {
  day: number;
  chapters: { chapterId: string; title: string; subject: string; weaknessScore: number }[];
};

export default async function StudyPlanPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: plan } = profile
    ? await supabase
        .from("study_plans")
        .select("*")
        .eq("student_id", profile.id)
        .eq("is_active", true)
        .maybeSingle()
    : { data: null };

  const schedule = plan?.daily_schedule_json as { cycleDays: number; days: ScheduleDay[] } | undefined;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl">Study Plan</h1>
          <p className="text-sm text-muted-foreground">
            A 14-day revision cycle, weighted toward your weakest chapters.
          </p>
        </div>
        {plan && (
          <form action={generateStudyPlan}>
            <Button type="submit" size="sm" variant="outline" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Regenerate
            </Button>
          </form>
        )}
      </div>

      {!schedule ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              You don&apos;t have an active study plan yet. Generate one based on your weakness heatmap —
              upload a few scripts first for a plan tailored to your actual gaps.
            </p>
            <form action={generateStudyPlan}>
              <Button type="submit" className="gap-1.5">
                <Sparkles className="w-4 h-4" />
                Generate my study plan
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {schedule.days.map((d) => (
            <Card key={d.day} className={d.chapters.length === 0 ? "opacity-50" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="eyebrow text-xs text-muted-foreground">Day {d.day}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {d.chapters.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Rest day</p>
                ) : (
                  d.chapters.map((c, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="font-medium truncate">{c.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.subject}</p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          c.weaknessScore >= 0.67
                            ? "bg-coral/20 text-coral-deep border-coral/30 shrink-0"
                            : c.weaknessScore >= 0.34
                              ? "bg-sunshine/20 text-ink-navy dark:text-sunshine border-sunshine/40 shrink-0"
                              : "bg-mint/20 text-mint-deep border-mint/30 shrink-0"
                        }
                      >
                        {(c.weaknessScore * 100).toFixed(0)}%
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
