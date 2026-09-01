import React, { Suspense } from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { createClient } from '@/lib/supabase/server';
import { CheckCircle2, AlertCircle, Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

interface VerifyPageProps {
  searchParams: Promise<{ token?: string }>;
}

export const metadata = {
  title: 'Verify Waitlist Spot — SheraTutor',
  description: 'Confirm your spot on the SheraTutor priority waitlist.',
};

function VerifyFallback() {
  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg sm:p-10">
      <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Loader2 size={32} className="animate-spin" />
      </div>
      <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
        যাচাই করা হচ্ছে...
      </h1>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        Verifying your spot...
      </p>
    </div>
  );
}

async function VerifyContent({ searchParams }: VerifyPageProps) {
  const { token } = await searchParams;

  let state: 'success' | 'already_verified' | 'invalid' = 'invalid';

  if (
    token &&
    typeof token === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token)
  ) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.rpc('verify_waitlist_token', {
        p_token: token,
      });

      if (!error && data) {
        if (data.reason === 'verified_now') {
          state = 'success';
        } else if (data.reason === 'already_verified') {
          state = 'already_verified';
        } else {
          state = 'invalid';
        }
      }
    } catch {
      state = 'invalid';
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg sm:p-10">
      {state === 'success' && (
        <>
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-mint/15 text-mint">
            <CheckCircle2 size={36} />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            ওয়েটলিস্ট নিশ্চিত হয়েছে!
          </h1>
          <p className="mt-1 text-sm font-medium text-mint">
            Waitlist Spot Confirmed
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            তোমার ইমেইল সফলভাবে ভেরিফাই হয়েছে। SheraTutor এর আর্লি অ্যাক্সেস ও প্রস্তুতি পর্ব শুরু হওয়ার সাথে সাথে আমরা তোমাকে জানিয়ে দেব।
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Thank you for verifying your email. You are officially locked in for priority onboarding.
          </p>

          <div className="mt-8">
            <Link
              href={'/' as Route}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3.5 text-sm font-semibold text-cta-foreground shadow-sm transition hover:opacity-90"
            >
              মূল পাতায় ফিরে যাও <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}

      {state === 'already_verified' && (
        <>
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-sun/15 text-sun">
            <Sparkles size={36} />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            ইতিমধ্যে নিশ্চিত করা আছে
          </h1>
          <p className="mt-1 text-sm font-medium text-sun">
            Already Verified
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            এই ইমেইলটি আগেই নিশ্চিত করা হয়েছে। তুমি ইতিমধ্যেই SheraTutor এর অগ্রাধিকার তালিকায় অন্তর্ভুক্ত আছো।
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Your email was already confirmed. No further action is required.
          </p>

          <div className="mt-8">
            <Link
              href={'/' as Route}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-muted px-5 py-3.5 text-sm font-semibold text-foreground transition hover:bg-muted/80"
            >
              মূল পাতায় ফিরে যাও <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}

      {state === 'invalid' && (
        <>
          <div className="mx-auto mb-5 flex size-16 items-center justify-center rounded-full bg-destructive/15 text-destructive">
            <AlertCircle size={36} />
          </div>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            অবৈধ বা মেয়াদোত্তীর্ণ লিঙ্ক
          </h1>
          <p className="mt-1 text-sm font-medium text-destructive">
            Invalid or Expired Link
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            ভেরিফিকেশন লিঙ্কটি সঠিক নয় অথবা মেয়াদ শেষ হয়ে গেছে। অনুগ্রহ করে আবার ওয়েটলিস্টে যোগ দেওয়ার চেষ্টা করো।
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            The verification token could not be found. Please submit the waitlist form again.
          </p>

          <div className="mt-8">
            <Link
              href={'/#waitlist-section' as Route}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cta px-5 py-3.5 text-sm font-semibold text-cta-foreground shadow-sm transition hover:opacity-90"
            >
              ওয়েটলিস্টে পুনরায় যোগ দাও <ArrowRight size={16} />
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function WaitlistVerifyPage({ searchParams }: VerifyPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground sm:px-6">
      <div className="mb-8">
        <Logo tagline />
      </div>

      <Suspense fallback={<VerifyFallback />}>
        <VerifyContent searchParams={searchParams} />
      </Suspense>

      <div className="mt-8 text-center text-xs text-muted-foreground">
        &copy; 2026 SheraTutor &middot; sheratutor.tech
      </div>
    </div>
  );
}
