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
          <Label htmlFor="examType">পরীক্ষা</Label>
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
          <Label htmlFor="targetExamYear">পরীক্ষার বছর</Label>
          <Input id="targetExamYear" name="targetExamYear" type="number" inputMode="numeric" defaultValue={targetExamYear} min={2026} max={2030} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="educationBoard">শিক্ষা বোর্ড</Label>
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
        <Label htmlFor="academicGroup">গ্রুপ</Label>
        <Select name="academicGroup" defaultValue={academicGroup} required>
          <SelectTrigger id="academicGroup" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SCIENCE">বিজ্ঞান</SelectItem>
            <SelectItem value="HUMANITIES">মানবিক</SelectItem>
            <SelectItem value="BUSINESS_STUDIES">ব্যবসায় শিক্ষা</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-muted p-4">
        <Checkbox id="trainingDataOptIn" name="trainingDataOptIn" defaultChecked={trainingDataOptIn} />
        <Label htmlFor="trainingDataOptIn" className="font-normal text-xs leading-snug">
          আমার মূল্যায়িত খাতাগুলো মডেল উন্নত করতে ব্যবহারের অনুমতি দাও। এটি ঐচ্ছিক ও
          ডিফল্টভাবে বন্ধ থাকে — যেকোনো সময় পরিবর্তন করতে পারবে।
        </Label>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      {state.status === "success" && <p className="text-sm text-green-deep dark:text-green">{state.message}</p>}

      <Button type="submit" disabled={pending}>
        {pending ? "সংরক্ষণ হচ্ছে…" : "পরিবর্তন সংরক্ষণ করো"}
      </Button>
    </form>
  );
}
