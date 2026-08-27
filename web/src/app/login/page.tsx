'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import {
  signInWithEmail,
  signInWithGoogle,
  type AuthState,
} from '@/app/actions/auth';
import { Logo } from '@/components/logo';

const initialState: AuthState = { status: 'idle' };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(
    signInWithEmail,
    initialState
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 sm:p-8">
      <Link href="/" className="no-underline mb-6">
        <Logo />
      </Link>

      <div className="w-full max-w-[400px] bg-card text-card-foreground border border-border rounded-2xl p-7 sm:p-8 shadow-md">
        <div className="text-center mb-6">
          <h1 className="font-bold text-2xl text-foreground m-0 tracking-tight">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mt-1.5 mb-0">
            Sign in to continue your HSC study momentum.
          </p>
        </div>

        <form action={signInWithGoogle} className="mb-5">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2.5 border border-border bg-card hover:bg-muted/60 text-foreground font-semibold text-sm py-2.5 px-4 rounded-xl transition-colors cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0" aria-hidden="true">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>
        </form>

        <div className="relative text-center my-5">
          <hr className="border-0 border-t border-border" />
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2.5 text-muted-foreground text-[11px] font-mono">
            OR
          </span>
        </div>

        <form action={formAction} className="flex flex-col gap-3.5">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold mb-1.5 text-foreground"
            >
              Email address
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
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
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
            className="primary-btn w-full justify-center py-2.5 mt-1.5 font-semibold text-sm shadow-xs"
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6 mb-0">
          New to SheraTutor?{' '}
          <Link
            href="/signup"
            className="text-primary hover:underline font-semibold no-underline"
          >
            Create free account
          </Link>
        </p>
      </div>
    </div>
  );
}
