"use client";

import { useActionState, useState } from "react";
import { joinWaitlist, type WaitlistState } from "@/app/actions/waitlist";
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

const initialState: WaitlistState = { status: "idle" };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const [isMinor, setIsMinor] = useState(true);

  if (state.status === "success") {
    return (
      <div className="rounded-2xl bg-card-navy/5 dark:bg-white/5 border border-mint/30 p-6 text-center">
        <p className="font-heading font-bold text-lg text-mint-deep dark:text-mint">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 w-full max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">Full name</Label>
        <Input id="fullName" name="fullName" placeholder="তোমার নাম" required autoComplete="name" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">Phone number</Label>
        <Input id="phone" name="phone" placeholder="01XXXXXXXXX" required autoComplete="tel" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">Email (optional)</Label>
        <Input id="email" name="email" type="email" autoComplete="email" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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

      <div className="flex items-start gap-2 pt-1">
        <Checkbox
          id="isMinor"
          name="isMinor"
          defaultChecked
          onCheckedChange={(v) => setIsMinor(v === true)}
        />
        <Label htmlFor="isMinor" className="font-normal text-sm text-muted-foreground leading-snug">
          I am under 18 years old
        </Label>
      </div>

      {isMinor && (
        <div className="rounded-lg bg-muted p-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-snug">
            Bangladesh&apos;s Personal Data Protection Act, 2026 requires verifiable
            parental/guardian consent before we collect a minor&apos;s contact
            information. A parent or guardian should confirm the checkbox below.
          </p>
          <div className="flex items-start gap-2">
            <Checkbox id="guardianConsentAcknowledged" name="guardianConsentAcknowledged" />
            <Label htmlFor="guardianConsentAcknowledged" className="font-normal text-xs leading-snug">
              I am this student&apos;s parent/guardian, or I am confirming on their
              behalf, and I consent to SheraTutor storing this contact information
              to notify us about early access. We will never sell this data or use
              it for anything else.
            </Label>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Joining…" : "Join the waitlist"}
      </Button>
    </form>
  );
}
