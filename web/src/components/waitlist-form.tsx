'use client';

import { useActionState, useState } from 'react';
import { joinWaitlist, type WaitlistState } from '@/app/actions/waitlist';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';

const initialState: WaitlistState = { status: 'idle' };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const [isMinor, setIsMinor] = useState(true);

  if (state.status === 'success') {
    return (
      <div
        style={{
          borderRadius: 16,
          background: '#e8fbf5',
          border: '1px solid #23d9a5',
          padding: '24px 20px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <CheckCircle2 size={32} color="#0da076" style={{ margin: '0 auto 10px' }} />
        <p
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: '#0a7d5c',
            margin: 0,
          }}
        >
          {state.message || 'ওয়েটলিস্টে সফলভাবে যুক্ত হয়েছ! আমরা শিগগিরই যোগাযোগ করব।'}
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 13,
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <div style={{ width: '100%' }}>
        <label
          htmlFor="fullName"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: 6,
          }}
        >
          তোমার নাম <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder="পুরো নাম লেখো"
          required
          autoComplete="name"
          style={{
            width: '100%',
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            background: '#fff',
            color: 'var(--navy)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ width: '100%' }}>
        <label
          htmlFor="phone"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: 6,
          }}
        >
          ফোন নম্বর <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <input
          id="phone"
          name="phone"
          placeholder="০১XXXXXXXXX"
          inputMode="tel"
          required
          autoComplete="tel"
          style={{
            width: '100%',
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: 'Space Mono, monospace',
            background: '#fff',
            color: 'var(--navy)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ width: '100%' }}>
        <label
          htmlFor="email"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--navy)',
            marginBottom: 6,
          }}
        >
          ইমেইল (ঐচ্ছিক)
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          style={{
            width: '100%',
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            background: '#fff',
            color: 'var(--navy)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div className="waitlist-exam-row">
        <div>
          <label
            htmlFor="examType"
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--navy)',
              marginBottom: 6,
            }}
          >
            পরীক্ষা <span style={{ color: 'var(--coral)' }}>*</span>
          </label>
          <select
            id="examType"
            name="examType"
            defaultValue="HSC"
            required
            style={{
              width: '100%',
              maxWidth: '100%',
              border: '1px solid var(--border)',
              borderRadius: 9,
              padding: '10px 12px',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              background: '#fff',
              color: 'var(--navy)',
              boxSizing: 'border-box',
            }}
          >
            <option value="HSC">HSC (এইচএসসি)</option>
            <option value="SSC">SSC (এসএসসি)</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="targetExamYear"
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--navy)',
              marginBottom: 6,
            }}
          >
            পরীক্ষার বছর <span style={{ color: 'var(--coral)' }}>*</span>
          </label>
          <input
            id="targetExamYear"
            name="targetExamYear"
            type="number"
            inputMode="numeric"
            defaultValue={2026}
            min={2026}
            max={2030}
            required
            style={{
              width: '100%',
              maxWidth: '100%',
              border: '1px solid var(--border)',
              borderRadius: 9,
              padding: '10px 12px',
              fontSize: 13,
              fontFamily: 'Space Mono, monospace',
              background: '#fff',
              color: 'var(--navy)',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
        <input
          id="isMinor"
          name="isMinor"
          type="checkbox"
          checked={isMinor}
          onChange={(e) => setIsMinor(e.target.checked)}
          style={{ width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--coral)', flexShrink: 0 }}
        />
        <label
          htmlFor="isMinor"
          style={{
            fontSize: 12,
            color: 'var(--muted)',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          আমার বয়স ১৮ বছরের কম
        </label>
      </div>

      {isMinor && (
        <div
          style={{
            borderRadius: 12,
            background: '#f7f8fc',
            border: '1px solid var(--border)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <ShieldCheck size={16} color="#69718c" style={{ flexShrink: 0, marginTop: 2 }} />
            <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, lineHeight: 1.45 }}>
              বাংলাদেশের ব্যক্তিগত তথ্য সুরক্ষা আইন, ২০২৬ অনুযায়ী নাবালকের যোগাযোগের তথ্য
              সংগ্রহের আগে অভিভাবকের সম্মতি প্রয়োজন।
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginTop: 2 }}>
            <input
              id="guardianConsentAcknowledged"
              name="guardianConsentAcknowledged"
              type="checkbox"
              style={{ width: 15, height: 15, cursor: 'pointer', marginTop: 2, accentColor: 'var(--coral)', flexShrink: 0 }}
            />
            <label
              htmlFor="guardianConsentAcknowledged"
              style={{
                fontSize: 11,
                color: 'var(--navy)',
                lineHeight: 1.4,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              আমি এই শিক্ষার্থীর অভিভাবক, অথবা তার পক্ষে নিশ্চিত করছি — এবং শুধুমাত্র
              বিজ্ঞপ্তির জন্য এই যোগাযোগের তথ্য সংরক্ষণে সম্মতি দিচ্ছি।
            </label>
          </div>
        </div>
      )}

      {state.status === 'error' && (
        <p style={{ color: 'var(--coral)', fontSize: 12, margin: '2px 0 0' }}>
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
          padding: '12px 18px',
          fontSize: 14,
          marginTop: 4,
          background: 'var(--navy)',
          boxShadow: '0 6px 16px rgba(20, 24, 43, 0.15)',
          boxSizing: 'border-box',
        }}
      >
        {pending ? 'যোগ হচ্ছে…' : 'ওয়েটলিস্টে যোগ দাও'} <ArrowRight size={16} />
      </button>
    </form>
  );
}
