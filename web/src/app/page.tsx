'use client';

import React from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { WaitlistForm } from '@/components/waitlist-form';
import { KhataPreview } from '@/components/khata-preview';
import { Tag } from '@/components/Tag';
import { Camera, ScanText, ClipboardCheck, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ThemeToggle } from '@/components/theme-toggle';

export default function LandingPage() {
  const { t } = useLanguage();

  const howItWorks = [
    {
      icon: Camera,
      title: t('landing.step1_title'),
      body: t('landing.step1_desc'),
    },
    {
      icon: ScanText,
      title: t('landing.step2_title'),
      body: t('landing.step2_desc'),
    },
    {
      icon: ClipboardCheck,
      title: t('landing.step3_title'),
      body: t('landing.step3_desc'),
    },
  ];

  const valueProps = [
    {
      eyebrow: t('landing.card1_eyebrow'),
      title: t('landing.card1_title'),
      body: t('landing.card1_desc'),
    },
    {
      eyebrow: t('landing.card2_eyebrow'),
      title: t('landing.card2_title'),
      body: t('landing.card2_desc'),
    },
    {
      eyebrow: t('landing.card3_eyebrow'),
      title: t('landing.card3_title'),
      body: t('landing.card3_desc'),
    },
  ];

  return (
    <div className="landing-container">
      {/* Responsive Header */}
      <header className="landing-header">
        <Logo tagline />
        <div className="landing-nav-actions">
          <LanguageToggle />
          <ThemeToggle />
          <Link href="/login" className="landing-signin-btn">
            {t('common.sign_in')}
          </Link>
          <Link href="/dashboard" className="primary-btn landing-cta-btn">
            <span>{t('common.open_workspace')}</span> <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-left">
            <Tag color="sun">{t('landing.badge')}</Tag>

            <h1 className="landing-hero-title">
              {t('landing.hero_title_1')}{' '}
              <span style={{ color: 'var(--coral)' }}>
                {t('landing.hero_title_2')}
              </span>
            </h1>

            <p className="landing-hero-desc">
              {t('landing.hero_desc')}
            </p>

            <div className="landing-form-box">
              <WaitlistForm />
            </div>
          </div>

          <div className="landing-paper-preview">
            <KhataPreview className="w-full max-w-sm drop-shadow-sm" />
          </div>
        </section>

        {/* How it works */}
        <section className="landing-cards-grid">
          {howItWorks.map((step, i) => (
            <div
              key={step.title}
              className="landing-feature-card"
            >
              <div className="landing-card-header">
                <span className="landing-card-step-num">
                  {`0${i + 1}`}
                </span>
                <step.icon size={18} className="landing-card-icon" />
              </div>
              <h3 className="landing-card-title">
                {step.title}
              </h3>
              <p className="landing-card-body">
                {step.body}
              </p>
            </div>
          ))}
        </section>

        {/* Problem / Solution / Promise */}
        <section className="landing-cards-grid">
          {valueProps.map((card) => (
            <div
              key={card.title}
              className="landing-promise-card"
            >
              <span className="landing-card-eyebrow">
                {card.eyebrow}
              </span>
              <h3 className="landing-card-title">
                {card.title}
              </h3>
              <p className="landing-card-body">
                {card.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <Logo tagline />
        <p className="landing-footer-text">
          &copy; {new Date().getFullYear()} SheraTutor &middot; {t('landing.footer_text')}
        </p>
      </footer>
    </div>
  );
}
