import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { submissionStatusLabel } from "@/lib/submission-status";

const PAGE_SIZE = 20;

export default async function SubmissionsListPage({
  searchParams,
}: PageProps<"/dashboard/submissions">) {
  const { offset: offsetParam } = await searchParams;
  const offset = Number(offsetParam ?? 0) || 0;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("student_profiles")
    .select("id")
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!profile) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground mb-4">Finish setting up your profile first.</p>
        <Button asChild>
          <Link href="/onboarding">Complete onboarding</Link>
        </Button>
      </div>
    );
  }

  const { data: submissions, count } = await supabase
    .from("exam_submissions")
    .select("*, question_papers(title, subjects(name_en))", { count: "exact" })
    .eq("student_id", profile.id)
    .order("submitted_at", { ascending: false })
    .range(offset, offset + PAGE_SIZE - 1);

  const hasMore = (count ?? 0) > offset + PAGE_SIZE;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading font-bold text-2xl">Submissions</h1>
          <p className="text-sm text-muted-foreground">Your full grading history.</p>
        </div>
        <Button asChild size="sm">
          <Link href="/dashboard/upload">Upload a script</Link>
        </Button>
      </div>

      {(submissions ?? []).length === 0 ? (
        <Card className="shadow-sm">
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            No submissions yet. Upload a script to get graded.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {(submissions ?? []).map((s) => (
            <Link
              key={s.id}
              href={`/dashboard/submissions/${s.id}`}
              className="flex items-center justify-between gap-3 rounded-lg border border-border p-4 hover:bg-muted transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {s.question_papers?.subjects?.name_en ?? "Subject"} — {s.question_papers?.title ?? "Paper"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(s.submitted_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-muted-foreground">
                  {s.total_score_obtained != null ? `${s.total_score_obtained}/${s.max_possible_score}` : "—"}
                </span>
                <Badge variant={s.status === "COMPLETED" ? "default" : "secondary"}>
                  {submissionStatusLabel(s.status)}
                </Badge>
              </div>
            </Link>
          ))}
        </div>
      )}

      {(offset > 0 || hasMore) && (
        <div className="flex items-center justify-between pt-2">
          <Button variant="outline" size="sm" disabled={offset === 0} asChild={offset > 0}>
            {offset > 0 ? (
              <Link href={`/dashboard/submissions?offset=${Math.max(0, offset - PAGE_SIZE)}`}>Previous</Link>
            ) : (
              <span>Previous</span>
            )}
          </Button>
          <Button variant="outline" size="sm" disabled={!hasMore} asChild={hasMore}>
            {hasMore ? (
              <Link href={`/dashboard/submissions?offset=${offset + PAGE_SIZE}`}>Load more</Link>
            ) : (
              <span>Load more</span>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
