import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { Logo } from '@/components/logo';
import { WaitlistForm } from '@/components/waitlist-form';
import { KhataPreview } from '@/components/khata-preview';
import { LandingRubricDemo } from '@/components/landing-rubric-demo';
import { StudentCount } from '@/components/landing/student-count';
import { Tag } from '@/components/Tag';
import {
  ArrowRight,
  BookCheck,
  ShieldCheck,
  Award,
  Camera,
  ScanText,
  ClipboardCheck,
} from 'lucide-react';
import { LanguageToggle } from '@/components/LanguageToggle';
import { translations, type Language, type TranslationKey } from '@/data/translations';

export default async function LandingPage() {
  const cookieStore = await cookies();
  const lang: Language = cookieStore.get('sheratutor_lang')?.value === 'en' ? 'en' : 'bn';
  const isBn = lang === 'bn';
  const dict = translations[lang] as Record<string, string>;
  const en = translations.en as Record<string, string>;
  const t = (key: TranslationKey | string) => dict[key] ?? en[key] ?? key;

  const howItWorks = [
    { icon: Camera, title: t('landing.step1_title'), body: t('landing.step1_desc'), stepNum: '01' },
    { icon: ScanText, title: t('landing.step2_title'), body: t('landing.step2_desc'), stepNum: '02' },
    { icon: ClipboardCheck, title: t('landing.step3_title'), body: t('landing.step3_desc'), stepNum: '03' },
  ];

  const valueProps = [
    { eyebrow: t('landing.card1_eyebrow'), title: t('landing.card1_title'), body: t('landing.card1_desc'), icon: BookCheck },
    { eyebrow: t('landing.card2_eyebrow'), title: t('landing.card2_title'), body: t('landing.card2_desc'), icon: Award },
    { eyebrow: t('landing.card3_eyebrow'), title: t('landing.card3_title'), body: t('landing.card3_desc'), icon: ShieldCheck },
  ];

  const eyebrow = 'font-mono text-xs font-bold tracking-wider uppercase';

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-surface-1">
      <header className="flex w-full items-center justify-between gap-2.5 border-b border-border px-6 py-4">
        <Logo tagline />
        <div className="flex shrink-0 items-center gap-2">
          <LanguageToggle />
          <Link
            href="/login"
            className="hidden whitespace-nowrap px-2.5 py-1.5 text-xs font-semibold text-heading hover:text-cta sm:inline"
          >
            {t('common.sign_in')}
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg bg-cta px-3.5 py-2 text-xs font-semibold text-cta-foreground transition-colors hover:opacity-90"
          >
            <span>{t('common.open_workspace')}</span> <ArrowRight size={14} />
          </Link>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center px-6">
        <section className="grid w-full items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex w-full flex-col items-start gap-4">
            <div className="flex items-center gap-2">
              <Tag color="sun">{t('landing.badge')}</Tag>
              <span className="font-mono text-xs font-bold text-muted-foreground">
                {isBn ? 'SSC ও HSC ২০২৬-২০২৭' : 'SSC & HSC 2026-2027'}
              </span>
            </div>

            <h1 className="font-heading text-[clamp(1.5rem,5.2vw,2.625rem)] leading-tight font-extrabold tracking-tight break-words text-heading">
              {t('landing.hero_title_1')}{' '}
              <span className="block text-coral sm:inline">{t('landing.hero_title_2')}</span>
            </h1>

            <p className="max-w-[520px] text-[clamp(0.875rem,3.2vw,1.25rem)] leading-relaxed text-muted-foreground">
              {t('landing.hero_desc')}
            </p>

            <div className="flex w-full flex-wrap items-center gap-3 pt-2">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
              >
                <span>{t('landing.start_free_cta')}</span>
                <ArrowRight size={16} />
              </Link>
              <a
                href="#demo-section"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
              >
                <span>{t('landing.try_demo_cta')}</span>
              </a>
            </div>

            <StudentCount lang={lang} />
          </div>

          <div className="flex w-full items-center justify-center overflow-hidden">
            <KhataPreview className="w-full max-w-sm drop-shadow-sm" lang={lang} />
          </div>
        </section>

        <section id="demo-section" className="flex w-full flex-col gap-6 py-10">
          <div className="flex max-w-2xl flex-col gap-2">
            <span className={`${eyebrow} text-accent-foreground`}>
              {isBn ? 'সরাসরি ডেমো' : 'LIVE INTERACTIVE DEMO'}
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              {t('landing.curriculum_title')}
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{t('landing.curriculum_subtitle')}</p>
          </div>
          <LandingRubricDemo />
        </section>

        <section className="flex w-full flex-col gap-6 py-8">
          <div className="flex max-w-xl flex-col gap-1">
            <span className={`${eyebrow} text-primary`}>
              {isBn ? 'সহজ ৩টি ধাপ' : 'SIMPLE 3-STEP PROCESS'}
            </span>
            <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              {t('landing.how_it_works')}
            </h2>
          </div>

          <div className="grid w-full gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step) => (
              <div
                key={step.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-primary/15 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                    {step.stepNum}
                  </span>
                  <step.icon size={20} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">{step.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{step.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex w-full flex-col gap-6 py-6">
          <div className="grid w-full gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-3 rounded-r-2xl border border-l-2 border-border border-l-mark bg-card p-6 text-card-foreground shadow-xs"
              >
                <div className="mb-1 flex items-center justify-between">
                  <span className={`${eyebrow} text-destructive`}>{card.eyebrow}</span>
                  <card.icon size={16} className="text-muted-foreground" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground">{card.title}</h3>
                <p className="text-xs leading-relaxed text-muted-foreground">{card.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section
          id="waitlist-section"
          className="my-4 w-full rounded-2xl border border-border bg-card p-6 py-10 text-card-foreground shadow-md sm:p-10"
        >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <span className={`${eyebrow} text-primary`}>
                {isBn ? 'অগ্রাধিকার তালিকা' : 'PRIORITY ACCESS'}
              </span>
              <h2 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
                {t('landing.waitlist_section_title')}
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground">{t('landing.waitlist_section_desc')}</p>
              <div className="mt-4 flex flex-col gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>{t('landing.boards_covered')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-primary" />
                  <span>
                    {isBn
                      ? '১০০% ফ্রি — কোনো হিডেন চার্জ বা সাবস্ক্রিপশন নেই'
                      : '100% Free for Students — No Hidden Subscriptions'}
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full">
              <WaitlistForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border">
        <div className="mx-auto flex w-full max-w-[1240px] flex-col items-center justify-between gap-6 px-6 py-6 text-xs text-muted-foreground sm:flex-row">
          <div className="flex flex-col items-center gap-1.5 sm:items-start">
            <Logo tagline />
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} SheraTutor &middot; {t('landing.footer_text')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
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
