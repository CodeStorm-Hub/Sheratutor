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
      <div className="rounded-2xl bg-card/5 dark:bg-white/5 border border-green/30 p-6 text-center">
        <p className="font-heading font-bold text-lg text-green-deep dark:text-green">
          {state.message}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4 w-full max-w-md">
      <div className="space-y-1.5">
        <Label htmlFor="fullName">তোমার নাম</Label>
        <Input id="fullName" name="fullName" placeholder="পুরো নাম লেখো" required autoComplete="name" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="phone">ফোন নম্বর</Label>
        <Input id="phone" name="phone" placeholder="০১XXXXXXXXX" inputMode="tel" required autoComplete="tel" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">ইমেইল (ঐচ্ছিক)</Label>
        <Input id="email" name="email" type="email" autoComplete="email" />
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

      <div className="flex items-start gap-2 pt-1">
        <Checkbox
          id="isMinor"
          name="isMinor"
          defaultChecked
          onCheckedChange={(v) => setIsMinor(v === true)}
        />
        <Label htmlFor="isMinor" className="font-normal text-sm text-muted-foreground leading-snug">
          আমার বয়স ১৮ বছরের কম
        </Label>
      </div>

      {isMinor && (
        <div className="rounded-lg bg-muted p-3 space-y-2">
          <p className="text-xs text-muted-foreground leading-snug">
            বাংলাদেশের ব্যক্তিগত তথ্য সুরক্ষা আইন, ২০২৬ অনুযায়ী নাবালকের যোগাযোগের তথ্য
            সংগ্রহের আগে অভিভাবকের সম্মতি প্রয়োজন। নিচের চেকবক্সটি একজন অভিভাবক নিশ্চিত করবেন।
          </p>
          <div className="flex items-start gap-2">
            <Checkbox id="guardianConsentAcknowledged" name="guardianConsentAcknowledged" />
            <Label htmlFor="guardianConsentAcknowledged" className="font-normal text-xs leading-snug">
              আমি এই শিক্ষার্থীর অভিভাবক, অথবা তার পক্ষে নিশ্চিত করছি — এবং শুধুমাত্র
              আগাম অ্যাক্সেসের বিজ্ঞপ্তির জন্য SheraTutor-কে এই যোগাযোগের তথ্য সংরক্ষণে সম্মতি
              দিচ্ছি। এই তথ্য কখনো বিক্রি বা অন্য কোনো কাজে ব্যবহার হবে না।
            </Label>
          </div>
        </div>
      )}

      {state.status === "error" && (
        <p className="text-sm text-destructive">{state.message}</p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "যোগ হচ্ছে…" : "ওয়েটলিস্টে যোগ দাও"}
      </Button>
    </form>
  );
}
