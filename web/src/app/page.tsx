'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { WaitlistForm } from '@/components/waitlist-form';
import { KhataPreview } from '@/components/khata-preview';
import { LandingRubricDemo } from '@/components/landing-rubric-demo';
import { Tag } from '@/components/Tag';
import { Camera, ScanText, ClipboardCheck, ArrowRight, BookCheck, ShieldCheck, Award } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { createClient } from '@/lib/supabase/client';

export default function LandingPage() {
  const { t, language } = useLanguage();
  const [studentCount, setStudentCount] = useState(2892);

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const supabase = createClient();
        const { count } = await supabase
          .from('student_profiles')
          .select('*', { count: 'exact', head: true });
        if (count !== null && count > 0) {
          setStudentCount(2892 + count);
        }
      } catch {
        // use fallback count
      }
    };
    fetchCount();
  }, []);

  const howItWorks = [
    {
      icon: Camera,
      title: t('landing.step1_title'),
      body: t('landing.step1_desc'),
      stepNum: '01',
    },
    {
      icon: ScanText,
      title: t('landing.step2_title'),
      body: t('landing.step2_desc'),
      stepNum: '02',
    },
    {
      icon: ClipboardCheck,
      title: t('landing.step3_title'),
      body: t('landing.step3_desc'),
      stepNum: '03',
    },
  ];

  const valueProps = [
    {
      eyebrow: t('landing.card1_eyebrow'),
      title: t('landing.card1_title'),
      body: t('landing.card1_desc'),
      icon: BookCheck,
    },
    {
      eyebrow: t('landing.card2_eyebrow'),
      title: t('landing.card2_title'),
      body: t('landing.card2_desc'),
      icon: Award,
    },
    {
      eyebrow: t('landing.card3_eyebrow'),
      title: t('landing.card3_title'),
      body: t('landing.card3_desc'),
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="landing-container">
      {/* Sticky Header */}
      <header className="landing-header">
        <Logo tagline />
        <div className="landing-nav-actions">
          <LanguageToggle />
          <Link href="/login" className="landing-signin-btn">
            {t('common.sign_in')}
          </Link>
          <Link href="/dashboard" className="primary-btn landing-cta-btn">
            <span>{t('common.open_workspace')}</span> <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-left">
            <div className="flex items-center gap-2">
              <Tag color="sun">{t('landing.badge')}</Tag>
              <span className="font-mono text-xs text-[#52655d] font-bold">
                {language === 'bn' ? 'SSC ও HSC ২০২৬-২০২৭' : 'SSC & HSC 2026-2027'}
              </span>
            </div>

            <h1 className="landing-hero-title">
              {t('landing.hero_title_1')}{' '}
              <span className="text-[#006a4e] block sm:inline">
                {t('landing.hero_title_2')}
              </span>
            </h1>

            <p className="landing-hero-desc">
              {t('landing.hero_desc')}
            </p>

            {/* Clear Primary CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2 w-full">
              <Link
                href="/dashboard"
                className="px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm inline-flex items-center gap-2 shadow-md transition-all duration-150"
              >
                <span>{t('landing.start_free_cta')}</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#demo-section"
                className="px-5 py-3.5 rounded-xl bg-card hover:bg-muted/80 text-foreground font-semibold text-sm inline-flex items-center gap-2 border border-border transition-all duration-150"
              >
                <span>{t('landing.try_demo_cta')}</span>
              </a>
            </div>

            {/* Community Social Proof Banner */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
              <span className="w-2 h-2 rounded-full bg-[#23d9a5] animate-pulse" />
              <span>
                {language === 'bn' ? (
                  <>
                    <strong className="text-foreground font-bold">
                      {studentCount.toLocaleString('bn-BD')}+
                    </strong>{' '}
                    জন শিক্ষার্থী ইতিমধ্যে যুক্ত হয়েছে
                  </>
                ) : (
                  <>
                    <strong className="text-foreground font-bold">
                      {studentCount.toLocaleString()}+
                    </strong>{' '}
                    students already practicing
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="landing-paper-preview">
            <KhataPreview className="w-full max-w-sm drop-shadow-sm" />
          </div>
        </section>

        {/* Interactive Rubric Demo Section */}
        <section id="demo-section" className="w-full py-10 flex flex-col gap-6">
          <div className="flex flex-col gap-2 max-w-2xl">
            <span className="font-mono text-xs font-bold text-accent-foreground uppercase tracking-wider">
              {language === 'bn' ? 'সরাসরি ডেমো' : 'LIVE INTERACTIVE DEMO'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground m-0 font-heading">
              {t('landing.curriculum_title')}
            </h2>
            <p className="text-sm text-muted-foreground m-0 leading-relaxed">
              {t('landing.curriculum_subtitle')}
            </p>
          </div>

          <LandingRubricDemo />
        </section>

        {/* How It Works Section */}
        <section className="w-full py-8 flex flex-col gap-6">
          <div className="flex flex-col gap-1 max-w-xl">
            <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
              {language === 'bn' ? 'সহজ ৩টি ধাপ' : 'SIMPLE 3-STEP PROCESS'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground m-0 font-heading">
              {t('landing.how_it_works')}
            </h2>
          </div>

          <div className="landing-cards-grid">
            {howItWorks.map((step) => (
              <div key={step.title} className="landing-feature-card bg-card text-card-foreground border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-primary bg-primary/15 px-2.5 py-1 rounded-full">
                    {step.stepNum}
                  </span>
                  <step.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground m-0">
                  {step.title}
                </h3>
                <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Value Proposition Cards (Examiner Margin Rule) */}
        <section className="w-full py-6 flex flex-col gap-6">
          <div className="landing-cards-grid">
            {valueProps.map((card) => (
              <div key={card.title} className="landing-promise-card bg-card text-card-foreground border border-border rounded-2xl p-6 flex flex-col gap-3 shadow-xs">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-destructive uppercase tracking-wider">
                    {card.eyebrow}
                  </span>
                  <card.icon size={16} className="text-muted-foreground" />
                </div>
                <h3 className="font-heading font-bold text-lg text-foreground m-0">
                  {card.title}
                </h3>
                <p className="text-xs text-muted-foreground m-0 leading-relaxed">
                  {card.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Dedicated Early Access / Community Section */}
        <section id="waitlist-section" className="w-full py-10 my-4 bg-card text-card-foreground rounded-2xl border border-border p-6 sm:p-10 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="flex flex-col gap-3">
              <span className="font-mono text-xs font-bold text-primary uppercase tracking-wider">
                {language === 'bn' ? 'অগ্রাধিকার তালিকা' : 'PRIORITY ACCESS'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground m-0 font-heading">
                {t('landing.waitlist_section_title')}
              </h2>
              <p className="text-sm text-muted-foreground m-0 leading-relaxed">
                {t('landing.waitlist_section_desc')}
              </p>
              <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{t('landing.boards_covered')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span>{language === 'bn' ? '১০০% ফ্রি — কোনো হিডেন চার্জ বা সাবস্ক্রিপশন নেই' : '100% Free for Students — No Hidden Subscriptions'}</span>
                </div>
              </div>
            </div>

            <div className="w-full">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      {/* Trust & Rich Footer */}
      <footer className="landing-footer">
        <div className="w-full max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 py-4">
          <div className="flex flex-col items-center sm:items-start gap-1.5">
            <Logo tagline />
            <p className="text-xs text-muted-foreground m-0">
              &copy; {new Date().getFullYear()} SheraTutor &middot; {t('landing.footer_text')}
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap justify-center">
            <span>{t('landing.footer_boards')}</span>
            <span>&middot;</span>
            <span>{t('landing.footer_privacy')}</span>
            <span>&middot;</span>
            <span>{t('landing.footer_terms')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
