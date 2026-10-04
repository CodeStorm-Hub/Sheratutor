'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { GoogleIcon } from '@/components/ui/google-icon';
import {
  signUpWithEmail,
  signInWithGoogle,
  type AuthState,
} from '@/app/actions/auth';
import { Logo } from '@/components/logo';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';

const initialState: AuthState = { status: 'idle' };

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(
    signUpWithEmail,
    initialState
  );
  const { language } = useLanguage();
  const isBn = language === 'bn';

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 sm:p-8 relative">
      <div className="absolute top-4 right-4">
        <LanguageToggle />
      </div>

      <Link href="/" className="no-underline mb-6">
        <Logo />
      </Link>

      <div className="w-full max-w-[400px] bg-card text-card-foreground border border-border rounded-2xl p-7 sm:p-8 shadow-md">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl text-foreground m-0 tracking-tight">
            {isBn ? 'নতুন একাউন্ট খুলুন' : 'Create free account'}
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 mb-0">
            {isBn
              ? 'HSC ও SSC প্রস্তুতির জন্য তোমার ব্যক্তিগত AI শিক্ষক।'
              : 'Get your personal AI examiner for HSC & SSC.'}
          </p>
        </div>

        <form action={signInWithGoogle} className="mb-5">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 border border-border bg-card hover:bg-muted/60 text-foreground font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
          >
            <GoogleIcon className="shrink-0" />
            {isBn ? 'গুগল দিয়ে সাইন আপ করুন' : 'Sign up with Google'}
          </button>
        </form>

        <div className="relative text-center my-5">
          <hr className="border-0 border-t border-border" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2.5 text-muted-foreground text-xs font-mono tracking-wider">
            {isBn ? 'অথবা' : 'OR'}
          </span>
        </div>

        <form action={formAction} className="flex flex-col gap-3.5">
          <div>
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold mb-1.5 text-foreground"
            >
              {isBn ? 'পূর্ণ নাম' : 'Full name'}
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder={isBn ? 'যেমন: আনাম রহমান' : 'e.g. Anam Rahman'}
              className="w-full border border-border bg-background text-foreground placeholder:text-muted-foreground/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors box-border"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold mb-1.5 text-foreground"
            >
              {isBn ? 'ইমেইল ঠিকানা' : 'Email address'}
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full border border-border bg-background text-foreground placeholder:text-muted-foreground/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors box-border"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-semibold mb-1.5 text-foreground"
            >
              {isBn ? 'পাসওয়ার্ড (কমপক্ষে ৮ অক্ষর)' : 'Password (min 8 chars)'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              placeholder="••••••••"
              className="w-full border border-border bg-background text-foreground placeholder:text-muted-foreground/60 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors box-border"
            />
          </div>

          {state.status === 'error' && (
            <p className="text-destructive text-xs mt-1 mb-0">
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="mt-1.5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90 disabled:opacity-60"
          >
            {pending
              ? (isBn ? 'একাউন্ট তৈরি হচ্ছে…' : 'Creating account…')
              : (isBn ? 'সাইন আপ করুন' : 'Sign up')}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-0">
          {isBn ? 'ইতোমধ্যে একাউন্ট আছে? ' : 'Already have an account? '}
          <Link
            href="/login"
            className="text-primary hover:underline font-semibold no-underline"
          >
            {isBn ? 'সাইন ইন করুন' : 'Sign in'}
          </Link>
        </p>
      </div>
    </div>
  );
}
