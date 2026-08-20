"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { generateStudyPlan, type StudyPlanState } from "@/app/actions/study-plan";

const initialState: StudyPlanState = { status: "idle" };

export function GenerateStudyPlanButton({
  label,
  size = "default",
}: {
  label: string;
  size?: "default" | "sm";
}) {
  const [state, formAction, pending] = useActionState(generateStudyPlan, initialState);

  return (
    <form action={formAction} className="space-y-2">
      <Button type="submit" size={size} variant={size === "sm" ? "outline" : "default"} className="gap-1.5" disabled={pending}>
        <Sparkles className="w-3.5 h-3.5" />
        {pending ? "Generating…" : label}
      </Button>
      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
    </form>
  );
}
