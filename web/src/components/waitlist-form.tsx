'use client';

import { useActionState, useState } from 'react';
import { joinWaitlist, type WaitlistState } from '@/app/actions/waitlist';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const initialState: WaitlistState = { status: 'idle' };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const [isMinor, setIsMinor] = useState(true);
  const { language, t } = useLanguage();

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
          {state.message || t('form.success_msg')}
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
          {t('form.name_label')} <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder={t('form.name_placeholder')}
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
          {t('form.phone_label')} <span style={{ color: 'var(--coral)' }}>*</span>
        </label>
        <input
          id="phone"
          name="phone"
          placeholder={t('form.phone_placeholder')}
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
          {t('form.email_label')}
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
            {t('form.exam_label')} <span style={{ color: 'var(--coral)' }}>*</span>
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
            <option value="HSC">{language === 'bn' ? 'HSC (এইচএসসি)' : 'HSC (Higher Secondary)'}</option>
            <option value="SSC">{language === 'bn' ? 'SSC (এসএসসি)' : 'SSC (Secondary)'}</option>
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
            {t('form.exam_year_label')} <span style={{ color: 'var(--coral)' }}>*</span>
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
          {t('form.minor_checkbox')}
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
              {t('form.pdpa_notice')}
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
              {t('form.consent_checkbox')}
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
        {pending ? t('form.submitting') : t('form.submit_btn')} <ArrowRight size={16} />
      </button>
    </form>
  );
}
