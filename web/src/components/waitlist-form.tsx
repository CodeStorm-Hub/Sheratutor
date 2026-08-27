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
      <div className="waitlist-success-box">
        <CheckCircle2 size={32} className="waitlist-success-icon" />
        <p className="waitlist-success-text">
          {state.message || t('form.success_msg')}
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="waitlist-form">
      <div className="waitlist-field">
        <label htmlFor="fullName" className="waitlist-label">
          {t('form.name_label')} <span className="text-coral">*</span>
        </label>
        <input
          id="fullName"
          name="fullName"
          placeholder={t('form.name_placeholder')}
          required
          autoComplete="name"
          className="waitlist-input"
        />
      </div>

      <div className="waitlist-field">
        <label htmlFor="phone" className="waitlist-label">
          {t('form.phone_label')} <span className="text-coral">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          placeholder={t('form.phone_placeholder')}
          inputMode="tel"
          required
          autoComplete="tel"
          className="waitlist-input font-mono"
        />
      </div>

      <div className="waitlist-field">
        <label htmlFor="email" className="waitlist-label">
          {t('form.email_label')}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className="waitlist-input"
        />
      </div>

      <div className="waitlist-exam-row">
        <div className="waitlist-field">
          <label htmlFor="examType" className="waitlist-label">
            {t('form.exam_label')} <span className="text-coral">*</span>
          </label>
          <select
            id="examType"
            name="examType"
            defaultValue="HSC"
            required
            className="waitlist-select"
          >
            <option value="HSC">{language === 'bn' ? 'HSC (এইচএসসি)' : 'HSC (Higher Secondary)'}</option>
            <option value="SSC">{language === 'bn' ? 'SSC (এসএসসি)' : 'SSC (Secondary)'}</option>
            <option value="Admission">{language === 'bn' ? 'ভর্তি পরীক্ষা (Admission)' : 'University Admission'}</option>
          </select>
        </div>

        <div className="waitlist-field">
          <label htmlFor="targetExamYear" className="waitlist-label">
            {t('form.exam_year_label')} <span className="text-coral">*</span>
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
            className="waitlist-input font-mono"
          />
        </div>
      </div>

      <div className="waitlist-checkbox-row">
        <input
          id="isMinor"
          name="isMinor"
          type="checkbox"
          checked={isMinor}
          onChange={(e) => setIsMinor(e.target.checked)}
          className="waitlist-checkbox"
        />
        <label htmlFor="isMinor" className="waitlist-checkbox-label">
          {t('form.minor_checkbox')}
        </label>
      </div>

      {isMinor && (
        <div className="waitlist-pdpa-box">
          <div className="waitlist-pdpa-header">
            <ShieldCheck size={16} className="waitlist-pdpa-shield" />
            <p className="waitlist-pdpa-text">
              {t('form.pdpa_notice')}
            </p>
          </div>
          <div className="waitlist-checkbox-row">
            <input
              id="guardianConsentAcknowledged"
              name="guardianConsentAcknowledged"
              type="checkbox"
              className="waitlist-checkbox"
            />
            <label
              htmlFor="guardianConsentAcknowledged"
              className="waitlist-pdpa-consent-label"
            >
              {t('form.consent_checkbox')}
            </label>
          </div>
        </div>
      )}

      {state.status === 'error' && (
        <p className="waitlist-error-msg">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="primary-btn waitlist-submit-btn"
      >
        {pending ? t('form.submitting') : t('form.submit_btn')} <ArrowRight size={16} />
      </button>
    </form>
  );
}
