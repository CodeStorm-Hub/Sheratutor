"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BOARDS = [
  "DHAKA", "RAJSHAHI", "COMILLA", "BARISAL", "SYLHET",
  "CHITTAGONG", "JESSORE", "DINAJPUR", "MYMENSINGH", "MADRASAH", "TECHNICAL",
];

const initialState: ProfileState = { status: "idle" };

export function ProfileForm({
  educationBoard,
  examType,
  academicGroup,
  targetExamYear,
  trainingDataOptIn,
}: {
  educationBoard: string;
  examType: string;
  academicGroup: string;
  targetExamYear: number;
  trainingDataOptIn: boolean;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="examType">Exam</Label>
          <Select name="examType" defaultValue={examType} required>
            <SelectTrigger id="examType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SSC">SSC</SelectItem>
              <SelectItem value="HSC">HSC</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="targetExamYear">Target year</Label>
          <Input id="targetExamYear" name="targetExamYear" type="number" defaultValue={targetExamYear} min={2026} max={2030} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="educationBoard">Education board</Label>
        <Select name="educationBoard" defaultValue={educationBoard} required>
          <SelectTrigger id="educationBoard" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOARDS.map((b) => (
              <SelectItem key={b} value={b}>
                {b.charAt(0) + b.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="academicGroup">Group</Label>
        <Select name="academicGroup" defaultValue={academicGroup} required>
          <SelectTrigger id="academicGroup" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SCIENCE">Science</SelectItem>
            <SelectItem value="HUMANITIES">Humanities</SelectItem>
            <SelectItem value="BUSINESS_STUDIES">Business Studies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-muted p-4">
        <Checkbox id="trainingDataOptIn" name="trainingDataOptIn" defaultChecked={trainingDataOptIn} />
        <Label htmlFor="trainingDataOptIn" className="font-normal text-xs leading-snug">
          Help improve SheraTutor by letting my graded scripts be used to train the grading model.
          This is optional and off by default — you can change it any time.
        </Label>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      {state.status === "success" && <p className="text-sm text-mint-deep dark:text-mint">{state.message}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "Saving…" : "Save changes"}
      </Button>
    </form>
  );
}
