import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { generateStudyPlan } from "@/app/actions/study-plan";
import { cn } from "@/lib/utils";

type ScheduleDay = {
  day: number;
  chapters: { chapterId: string; title: string; subject: string; weaknessScore: number }[];
};

function weaknessBadgeClass(score: number) {
  if (score >= 0.67) return "bg-red-soft text-red-deep border-red/30 shrink-0";
  if (score >= 0.34) return "bg-ochre-soft text-ochre-deep dark:text-ochre border-ochre/40 shrink-0";
  return "bg-green-soft text-green-deep border-green/30 shrink-0";
}

// Not a component — a plain data helper, so calling Date.now() here doesn't
// trip the render-purity rule; the request-time "now" is exactly what a
// server-rendered "which day of the cycle is today" needs.
//
// Returns a 1-indexed day number (1..cycleDays) to match the `day` field
// generateStudyPlan writes into daily_schedule_json (`i + 1`, not `i`).
function currentCycleDay(startDate: string, cycleDays: number): number {
  const daysSinceStart = Math.floor((Date.now() - new Date(startDate).getTime()) / (24 * 60 * 60 * 1000));
  return (((daysSinceStart % cycleDays) + cycleDays) % cycleDays) + 1;
}

function DayCard({ d, isToday }: { d: ScheduleDay; isToday: boolean }) {
  return (
    <Card className={cn(d.chapters.length === 0 && "opacity-60", isToday && "ring-2 ring-red/60")}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <CardTitle className="eyebrow text-xs text-muted-foreground font-tabular">দিন {d.day}</CardTitle>
          {isToday && <Badge className="bg-red text-white text-[10px] px-1.5 py-0">আজ</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {d.chapters.length === 0 ? (
          <p className="text-xs text-muted-foreground">বিশ্রামের দিন</p>
        ) : (
          d.chapters.map((c, idx) => (
            <div key={idx} className="flex items-center justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="font-medium truncate">{c.title}</p>
                <p className="text-xs text-muted-foreground truncate">{c.subject}</p>
              </div>
              <Badge variant="outline" className={cn("font-tabular", weaknessBadgeClass(c.weaknessScore))}>
                {(c.weaknessScore * 100).toFixed(0)}%
              </Badge>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

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

  // .maybeSingle() throws if more than one row matches — defend against that
  // instead of trusting "at most one active plan per student" as invariant.
  // (generateStudyPlan deactivates old plans before inserting a new one, but
  // only logs if that update fails rather than blocking the insert, so two
  // active rows can exist; take the most recent one rather than erroring.)
  const { data: plans } = profile
    ? await supabase
        .from("study_plans")
        .select("*")
        .eq("student_id", profile.id)
        .eq("is_active", true)
        .order("created_at", { ascending: false })
        .limit(1)
    : { data: null };
  const plan = plans?.[0] ?? null;

  const schedule = plan?.daily_schedule_json as { cycleDays: number; days: ScheduleDay[] } | undefined;

  const todayDay =
    schedule && plan?.start_date ? currentCycleDay(plan.start_date, schedule.cycleDays) : null;

  const today = schedule?.days.find((d) => d.day === todayDay);
  const restOfCycle = schedule?.days.filter((d) => d.day !== todayDay) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl">পড়ার পরিকল্পনা</h1>
          <p className="text-sm text-muted-foreground">
            তোমার দুর্বল অধ্যায়গুলোর উপর জোর দিয়ে ১৪ দিনের রিভিশন চক্র।
          </p>
        </div>
        {plan && (
          <form action={generateStudyPlan}>
            <Button type="submit" size="sm" variant="outline" className="gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              নতুন করে তৈরি করো
            </Button>
          </form>
        )}
      </div>

      {!schedule ? (
        <Card>
          <CardContent className="py-16 text-center space-y-4">
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              এখনও কোনো সক্রিয় পড়ার পরিকল্পনা নেই। তোমার দুর্বলতার মানচিত্র অনুযায়ী একটি
              তৈরি করো — নির্দিষ্ট পরিকল্পনার জন্য প্রথমে কয়েকটি খাতা জমা দাও।
            </p>
            <form action={generateStudyPlan}>
              <Button type="submit" className="gap-1.5">
                <Sparkles className="w-4 h-4" />
                আমার পড়ার পরিকল্পনা তৈরি করো
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {today && (
            <div>
              <span className="eyebrow text-xs text-red">আজকের পড়া</span>
              <div className="mt-2 max-w-sm">
                <DayCard d={today} isToday />
              </div>
            </div>
          )}

          <div>
            <span className="eyebrow text-xs text-muted-foreground">বাকি চক্র</span>
            <div className="mt-2 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {restOfCycle.map((d) => (
                <DayCard key={d.day} d={d} isToday={false} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
