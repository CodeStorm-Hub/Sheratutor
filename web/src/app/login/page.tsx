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
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--paper)',
        padding: '32px 16px',
      }}
    >
      <Link href="/" style={{ textDecoration: 'none', marginBottom: 24 }}>
        <Logo />
      </Link>

      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          border: '1px solid var(--border)',
          borderRadius: 18,
          padding: '32px 28px',
          boxShadow: '0 8px 30px rgba(28, 35, 65, 0.04)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ font: "800 26px 'Baloo 2', sans-serif", margin: 0 }}>
            Welcome back
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 13, margin: '6px 0 0' }}>
            Sign in to continue your HSC study momentum.
          </p>
        </div>

        <form action={signInWithGoogle} style={{ marginBottom: 18 }}>
          <button
            type="submit"
            style={{
              width: '100%',
              border: '1px solid var(--border)',
              background: '#fff',
              borderRadius: 10,
              padding: '11px 14px',
              font: '600 13px Inter',
              color: 'var(--navy)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            Continue with Google
          </button>
        </form>

        <div
          style={{
            position: 'relative',
            textAlign: 'center',
            margin: '20px 0',
          }}
        >
          <hr style={{ border: 0, borderTop: '1px solid var(--border)' }} />
          <span
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: '#fff',
              padding: '0 10px',
              color: 'var(--muted)',
              fontSize: 11,
              fontFamily: 'Space Mono',
            }}
          >
            OR
          </span>
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 6,
                color: 'var(--navy)',
              }}
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
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 9,
                padding: '10px 12px',
                fontSize: 13,
                fontFamily: 'Inter',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label
              htmlFor="password"
              style={{
                display: 'block',
                fontSize: 11,
                fontWeight: 600,
                marginBottom: 6,
                color: 'var(--navy)',
              }}
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
              style={{
                width: '100%',
                border: '1px solid var(--border)',
                borderRadius: 9,
                padding: '10px 12px',
                fontSize: 13,
                fontFamily: 'Inter',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {state.status === 'error' && (
            <p style={{ color: 'var(--coral)', fontSize: 12, margin: '4px 0 0' }}>
              {state.message}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="primary-btn"
            style={{
              width: '100%',
              justifyContent: 'center',
              padding: '12px',
              marginTop: 6,
            }}
          >
            {pending ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--muted)',
            marginTop: 22,
          }}
        >
          New to SheraTutor?{' '}
          <Link
            href="/signup"
            style={{
              color: 'var(--coral)',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Create free account
          </Link>
        </p>
      </div>
    </div>
  );
}
