"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signInWithEmail, signInWithGoogle, type AuthState } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/logo";

const initialState: AuthState = { status: "idle" };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInWithEmail, initialState);

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 bg-background">
      <Link href="/" className="mb-8">
        <Logo />
      </Link>

      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-1">
          <h1 className="font-heading font-bold text-2xl">আবার স্বাগতম</h1>
        </div>

        <form action={signInWithGoogle}>
          <Button type="submit" variant="outline" className="w-full" size="lg">
            Google দিয়ে চালিয়ে যাও
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">অথবা</span>
          </div>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">ইমেইল</Label>
            <Input id="email" name="email" type="email" required autoComplete="email" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="password">পাসওয়ার্ড</Label>
            <Input id="password" name="password" type="password" required autoComplete="current-password" />
          </div>

          {state.status === "error" && <p className="text-sm text-destructive">{state.message}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={pending}>
            {pending ? "লগ ইন হচ্ছে…" : "লগ ইন করো"}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          SheraTutor-এ নতুন?{" "}
          <Link href="/signup" className="text-primary font-medium hover:underline">
            সাইন আপ করো
          </Link>
        </p>
      </div>
    </div>
  );
}
