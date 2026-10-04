"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from "@/context/LanguageContext";

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
  const { language } = useLanguage();
  const isBn = language === "bn";

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="examType">{isBn ? "পরীক্ষা" : "Exam"}</Label>
          <Select name="examType" defaultValue={examType} required>
            <SelectTrigger id="examType" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SSC">{isBn ? "SSC (মাধ্যমিক)" : "SSC"}</SelectItem>
              <SelectItem value="HSC">{isBn ? "HSC (উচ্চ মাধ্যমিক)" : "HSC"}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="targetExamYear">{isBn ? "পরীক্ষার বছর" : "Target Exam Year"}</Label>
          <Input id="targetExamYear" name="targetExamYear" type="number" inputMode="numeric" defaultValue={targetExamYear} min={2026} max={2030} required />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="educationBoard">{isBn ? "শিক্ষা বোর্ড" : "Education Board"}</Label>
        <Select name="educationBoard" defaultValue={educationBoard} required>
          <SelectTrigger id="educationBoard" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {BOARDS.map((b) => (
              <SelectItem key={b} value={b}>
                {b.charAt(0) + b.slice(1).toLowerCase()} {isBn ? "বোর্ড" : "Board"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="academicGroup">{isBn ? "গ্রুপ" : "Academic Group"}</Label>
        <Select name="academicGroup" defaultValue={academicGroup} required>
          <SelectTrigger id="academicGroup" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SCIENCE">{isBn ? "বিজ্ঞান" : "Science"}</SelectItem>
            <SelectItem value="HUMANITIES">{isBn ? "মানবিক" : "Humanities"}</SelectItem>
            <SelectItem value="BUSINESS_STUDIES">{isBn ? "ব্যবসায় শিক্ষা" : "Business Studies"}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-start gap-2 rounded-lg bg-muted p-4">
        <Checkbox id="trainingDataOptIn" name="trainingDataOptIn" defaultChecked={trainingDataOptIn} />
        <Label htmlFor="trainingDataOptIn" className="font-normal text-xs leading-snug">
          {isBn
            ? "আমার মূল্যায়িত খাতাগুলো মডেল উন্নত করতে ব্যবহারের অনুমতি দাও। এটি ঐচ্ছিক ও ডিফল্টভাবে বন্ধ থাকে — যেকোনো সময় পরিবর্তন করতে পারবে।"
            : "Allow my evaluated scripts to be used for model improvements. This is optional and disabled by default — you can change it anytime."}
        </Label>
      </div>

      {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}
      {state.status === "success" && <p className="text-sm text-green-deep dark:text-green">{state.message}</p>}

      <Button type="submit" disabled={pending}>
        {pending
          ? (isBn ? "সংরক্ষণ হচ্ছে…" : "Saving…")
          : (isBn ? "পরিবর্তন সংরক্ষণ করো" : "Save Changes")}
      </Button>
    </form>
  );
}
