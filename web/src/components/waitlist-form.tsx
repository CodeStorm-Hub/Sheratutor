'use client';

import { useActionState, useState } from 'react';
import { joinWaitlist, type WaitlistState } from '@/app/actions/waitlist';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const initialState: WaitlistState = { status: 'idle' };

export function WaitlistForm() {
  const [state, formAction, pending] = useActionState(joinWaitlist, initialState);
  const [role, setRole] = useState<'student' | 'guardian'>('student');
  const [isMinor, setIsMinor] = useState(true);
  const { language, t } = useLanguage();

  const isGuardian = role === 'guardian';
  const showConsent = isGuardian || isMinor;

  if (state.status === 'success') {
    return (
      <div
        style={{
          borderRadius: 16,
          background: 'color-mix(in srgb, var(--mint) 14%, var(--card))',
          border: '1px solid color-mix(in srgb, var(--mint) 45%, transparent)',
          padding: '24px 20px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <CheckCircle2 size={32} color="var(--mint)" style={{ margin: '0 auto 10px' }} />
        <p
          style={{
            fontFamily: "'Baloo 2', sans-serif",
            fontWeight: 700,
            fontSize: 18,
            color: 'var(--foreground)',
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
      <input type="hidden" name="signupRole" value={role} />
      {/* Honeypot field for bot suppression */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        style={{ display: 'none', position: 'absolute', opacity: 0, pointerEvents: 'none' }}
        aria-hidden="true"
      />

      <div
        role="radiogroup"
        aria-label={t('form.role_student') + ' / ' + t('form.role_guardian')}
        className="grid w-full grid-cols-2 gap-2 rounded-xl border border-border bg-muted/40 p-1"
      >
        {(['student', 'guardian'] as const).map((r) => (
          <button
            key={r}
            type="button"
            role="radio"
            aria-checked={role === r}
            onClick={() => setRole(r)}
            className={
              'cursor-pointer rounded-lg px-3 py-2 text-xs font-semibold transition-colors ' +
              (role === r
                ? 'bg-cta text-cta-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground')
            }
          >
            {r === 'student' ? t('form.role_student') : t('form.role_guardian')}
          </button>
        ))}
      </div>

      <div style={{ width: '100%' }}>
        <label
          htmlFor="fullName"
          style={{
            display: 'block',
            fontSize: 12,
            fontWeight: 600,
            color: 'var(--foreground)',
            marginBottom: 6,
          }}
        >
          {isGuardian ? t('form.name_label_guardian') : t('form.name_label')}{' '}
          <span style={{ color: 'var(--coral)' }}>*</span>
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
            background: 'var(--background)',
            color: 'var(--foreground)',
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
            color: 'var(--foreground)',
            marginBottom: 6,
          }}
        >
          {t('form.email_label')} <span style={{ color: 'var(--coral)' }}>*</span>
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
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: 'Inter, sans-serif',
            background: 'var(--background)',
            color: 'var(--foreground)',
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
            color: 'var(--foreground)',
            marginBottom: 6,
          }}
        >
          {t('form.phone_label')}
        </label>
        <input
          id="phone"
          name="phone"
          placeholder={t('form.phone_placeholder')}
          inputMode="tel"
          autoComplete="tel"
          style={{
            width: '100%',
            maxWidth: '100%',
            border: '1px solid var(--border)',
            borderRadius: 9,
            padding: '10px 14px',
            fontSize: 13,
            fontFamily: 'Space Mono, monospace',
            background: 'var(--background)',
            color: 'var(--foreground)',
            boxSizing: 'border-box',
          }}
        />
      </div>

      <div className="grid w-full grid-cols-2 gap-2.5">
        <div>
          <label
            htmlFor="examType"
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--foreground)',
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
              background: 'var(--background)',
              color: 'var(--foreground)',
              boxSizing: 'border-box',
            }}
          >
            <option value="HSC">{language === 'bn' ? 'HSC (এইচএসসি)' : 'HSC (Higher Secondary)'}</option>
            <option value="SSC">{language === 'bn' ? 'SSC (এসএসসি)' : 'SSC (Secondary)'}</option>
            <option value="ADMISSION">{language === 'bn' ? 'বিশ্ববিদ্যালয় ভর্তি' : 'University Admission'}</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="targetExamYear"
            style={{
              display: 'block',
              fontSize: 12,
              fontWeight: 600,
              color: 'var(--foreground)',
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
              background: 'var(--background)',
              color: 'var(--foreground)',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {isGuardian ? (
        <input type="hidden" name="isMinor" value="on" />
      ) : (
        <div className="flex items-center gap-2 mt-0.5">
          <input
            id="isMinor"
            name="isMinor"
            type="checkbox"
            checked={isMinor}
            onChange={(e) => setIsMinor(e.target.checked)}
            className="w-4 h-4 cursor-pointer accent-primary shrink-0"
          />
          <label
            htmlFor="isMinor"
            className="text-xs text-foreground cursor-pointer select-none"
          >
            {t('form.minor_checkbox')}
          </label>
        </div>
      )}

      {showConsent && (
        <div className="rounded-xl bg-card border border-border p-3.5 flex flex-col gap-2.5 w-full max-w-full box-border">
          <div className="flex items-start gap-2">
            <ShieldCheck size={16} className="text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground m-0 leading-relaxed">
              {t('form.pdpa_notice')}
            </p>
          </div>
          <div className="flex items-start gap-2 mt-0.5">
            <input
              id="guardianConsentAcknowledged"
              name="guardianConsentAcknowledged"
              type="checkbox"
              className="w-4 h-4 cursor-pointer mt-0.5 accent-primary shrink-0"
            />
            <label
              htmlFor="guardianConsentAcknowledged"
              className="text-xs text-foreground leading-snug cursor-pointer select-none"
            >
              {isGuardian ? t('form.consent_checkbox_guardian') : t('form.consent_checkbox')}
            </label>
          </div>
        </div>
      )}

      {state.status === 'error' && (
        <p className="text-destructive text-xs mt-1 mb-0">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-1 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-cta px-4 py-3 text-sm font-semibold text-cta-foreground shadow-sm transition-colors hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t('form.submitting') : t('form.submit_btn')} <ArrowRight size={16} />
      </button>
    </form>
  );
}
