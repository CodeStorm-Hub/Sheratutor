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
  const [dob, setDob] = useState("");

  const minor = useMemo(() => {
    if (!dob) return true; // default to the stricter path until known
    const d = new Date(dob);
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 18);
    return d > cutoff;
  }, [dob]);

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 bg-background">
      <div className="mb-8">
        <Logo />
      </div>

      <form action={formAction} className="w-full max-w-md space-y-5">
        <div className="text-center space-y-1 mb-2">
          <h1 className="font-heading font-bold text-2xl">Tell us about your exam</h1>
          <p className="text-sm text-muted-foreground">This helps us build your study plan.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="dateOfBirth">Date of birth</Label>
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
            <Label htmlFor="examType">Exam</Label>
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
            <Label htmlFor="targetExamYear">Target year</Label>
            <Input id="targetExamYear" name="targetExamYear" type="number" defaultValue={2027} min={2026} max={2030} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="educationBoard">Education board</Label>
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
          <Label htmlFor="academicGroup">Group</Label>
          <Select name="academicGroup" defaultValue="SCIENCE" required>
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

        {minor && (
          <div className="rounded-lg bg-muted p-4 space-y-3">
            <p className="text-xs text-muted-foreground leading-snug">
              Since you&apos;re under 18, Bangladesh&apos;s Personal Data Protection Act,
              2026 requires a parent or guardian&apos;s consent before we can create
              your account.
            </p>
            <div className="space-y-1.5">
              <Label htmlFor="guardianPhone">Parent/guardian phone number</Label>
              <Input id="guardianPhone" name="guardianPhone" placeholder="01XXXXXXXXX" />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox id="guardianConsentGiven" name="guardianConsentGiven" />
              <Label htmlFor="guardianConsentGiven" className="font-normal text-xs leading-snug">
                I am this student&apos;s parent/guardian (or confirming with their
                knowledge) and I consent to SheraTutor processing this student&apos;s
                academic and performance data as described in the Privacy Policy.
              </Label>
            </div>
          </div>
        )}

        {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "Saving…" : "Continue"}
        </Button>
      </form>
    </div>
  );
}
