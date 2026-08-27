"use client";

import { useActionState, useMemo, useState } from "react";
import { completeOnboarding, type OnboardingState } from "@/app/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Logo } from "@/components/logo";

const initialState: OnboardingState = { status: "idle" };

const BOARDS = [
  "DHAKA", "RAJSHAHI", "COMILLA", "BARISAL", "SYLHET",
  "CHITTAGONG", "JESSORE", "DINAJPUR", "MYMENSINGH", "MADRASAH", "TECHNICAL",
];

export default function OnboardingPage() {
  const [state, formAction, pending] = useActionState(completeOnboarding, initialState);
  const [dob, setDob] = useState("2008-01-15");

  const minor = useMemo(() => {
    if (!dob) return true; // default to the stricter path until known
    const d = new Date(dob);
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 18);
    return d > cutoff;
  }, [dob]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
      <div className="mb-8">
        <Logo />
      </div>

      <form action={formAction} className="w-full max-w-md space-y-5">
        <div className="text-center space-y-1 mb-2">
          <h1 className="font-heading font-bold text-2xl">তোমার পরীক্ষা সম্পর্কে বলো</h1>
          <p className="text-sm text-muted-foreground">এটি তোমার পড়ার পরিকল্পনা তৈরিতে সাহায্য করবে।</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">জন্ম তারিখ</Label>
          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="examType">পরীক্ষা</Label>
            <Select name="examType" defaultValue="SSC" required>
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
            <Input id="targetExamYear" name="targetExamYear" type="number" inputMode="numeric" defaultValue={2027} min={2026} max={2030} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="educationBoard">শিক্ষা বোর্ড</Label>
          <Select name="educationBoard" defaultValue="DHAKA" required>
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
          <Select name="academicGroup" defaultValue="SCIENCE" required>
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

        {minor && (
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-snug">
              তোমার বয়স ১৮ বছরের কম হওয়ায়, বাংলাদেশের ব্যক্তিগত তথ্য সুরক্ষা আইন,
              ২০২৬ অনুযায়ী অ্যাকাউন্ট তৈরির আগে একজন অভিভাবকের সম্মতি প্রয়োজন।
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="guardianPhone">অভিভাবকের ফোন নম্বর</Label>
              <Input id="guardianPhone" name="guardianPhone" placeholder="০১XXXXXXXXX" inputMode="tel" />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="guardianConsentGiven" name="guardianConsentGiven" />
              <Label htmlFor="guardianConsentGiven" className="font-normal text-xs leading-snug">
                আমি এই শিক্ষার্থীর অভিভাবক (অথবা তার জানা মতে নিশ্চিত করছি) এবং
                গোপনীয়তা নীতিতে বর্ণিত অনুযায়ী SheraTutor-কে এই শিক্ষার্থীর
                একাডেমিক ও পারফরম্যান্স তথ্য প্রক্রিয়াকরণে সম্মতি দিচ্ছি।
              </Label>
            </div>
          </div>
        )}

        {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "সংরক্ষণ হচ্ছে…" : "চালিয়ে যাও"}
        </Button>
      </form>
    </div>
  );
}
