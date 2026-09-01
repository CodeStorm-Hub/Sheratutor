import React from 'react';
import Link from 'next/link';
import type { Route } from 'next';
import { cookies } from 'next/headers';
import { cacheLife } from 'next/cache';
import { Logo } from '@/components/logo';
import { WaitlistForm } from '@/components/waitlist-form';
import { KhataPreview } from '@/components/khata-preview';
import { LandingRubricDemo } from '@/components/landing-rubric-demo';
import { StudentCount } from '@/components/landing/student-count';
import { CopyrightYear } from '@/components/landing/copyright-year';
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
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';
import { translations, type Language, type TranslationKey } from '@/data/translations';

type Accent = 'mint' | 'sun' | 'coral' | 'mark' | 'indigo';

/** Per-section accent palette — all drawn from the brand tokens.
 * Class strings are spelled out in full so Tailwind's scanner picks them up. */
const ACCENT: Record<
  Accent,
  { text: string; chip: string; soft: string; bar: string; ring: string; iconWrap: string }
> = {
  mint: { text: 'text-mint', chip: 'border-mint/45 bg-mint/15 text-mint', soft: 'bg-mint/15 text-mint', bar: 'bg-mint', ring: 'border-mint/25', iconWrap: 'bg-mint/12 text-mint' },
  sun: { text: 'text-sun', chip: 'border-sun/50 bg-sun/18 text-sun', soft: 'bg-sun/18 text-sun', bar: 'bg-sun', ring: 'border-sun/30', iconWrap: 'bg-sun/15 text-sun' },
  coral: { text: 'text-coral', chip: 'border-coral/45 bg-coral/15 text-coral', soft: 'bg-coral/15 text-coral', bar: 'bg-coral', ring: 'border-coral/25', iconWrap: 'bg-coral/12 text-coral' },
  mark: { text: 'text-mark', chip: 'border-mark/45 bg-mark/15 text-mark', soft: 'bg-mark/15 text-mark', bar: 'bg-mark', ring: 'border-mark/25', iconWrap: 'bg-mark/12 text-mark' },
  indigo: { text: 'text-navy', chip: 'border-navy/40 bg-navy/12 text-navy', soft: 'bg-navy/15 text-navy', bar: 'bg-navy', ring: 'border-navy/25', iconWrap: 'bg-navy/12 text-navy' },
};

function SectionHeading({
  kicker,
  title,
  sub,
  accent,
  size = 'lg',
  className,
}: {
  kicker?: string;
  title: string;
  sub?: string;
  accent: Accent;
  size?: 'lg' | 'md';
  className?: string;
}) {
  const a = ACCENT[accent];
  return (
    <div className={cn('flex max-w-2xl flex-col items-start gap-4', className)}>
      {kicker ? (
        <span
          className={cn(
            'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[0.72rem] font-bold tracking-[0.18em] uppercase',
            a.chip,
          )}
        >
          <span className="size-2 rounded-full bg-current" />
          {kicker}
        </span>
      ) : null}
      <h2
        className={cn(
          'font-heading font-extrabold tracking-[-0.02em] text-balance text-heading',
          size === 'lg'
            ? 'text-[clamp(2rem,5.2vw,3rem)] leading-[1.04]'
            : 'text-[clamp(1.6rem,3.6vw,2.15rem)] leading-[1.08]',
        )}
      >
        {title}
      </h2>
      <span className={cn('h-1 rounded-full', a.bar, size === 'lg' ? 'w-20' : 'w-14')} />
      {sub ? (
        <p className="max-w-xl text-[0.9375rem] leading-relaxed text-muted-foreground">{sub}</p>
      ) : null}
    </div>
  );
}

async function CachedLandingUI({ lang }: { lang: Language }) {
  'use cache';
  cacheLife('hours');

  const isBn = lang === 'bn';
  const dict = translations[lang] as Record<string, string>;
  const en = translations.en as Record<string, string>;
  const t = (key: TranslationKey | string) => dict[key] ?? en[key] ?? key;

  const howItWorks = [
    { icon: Camera, title: t('landing.step1_title'), body: t('landing.step1_desc'), stepNum: '01', accent: 'coral' as Accent },
    { icon: ScanText, title: t('landing.step2_title'), body: t('landing.step2_desc'), stepNum: '02', accent: 'sun' as Accent },
    { icon: ClipboardCheck, title: t('landing.step3_title'), body: t('landing.step3_desc'), stepNum: '03', accent: 'mint' as Accent },
  ];

  const valueProps = [
    { eyebrow: t('landing.card1_eyebrow'), title: t('landing.card1_title'), body: t('landing.card1_desc'), icon: BookCheck, accent: 'mark' as Accent },
    { eyebrow: t('landing.card2_eyebrow'), title: t('landing.card2_title'), body: t('landing.card2_desc'), icon: Award, accent: 'mint' as Accent },
    { eyebrow: t('landing.card3_eyebrow'), title: t('landing.card3_title'), body: t('landing.card3_desc'), icon: ShieldCheck, accent: 'coral' as Accent },
  ];

  return (
    <div className="flex min-h-dvh w-full scroll-smooth flex-col overflow-x-hidden bg-background">
      <header className="w-full border-b border-border">
        <div className="mx-auto flex w-full max-w-[1240px] items-center justify-between gap-2 px-4 py-3.5 sm:gap-2.5 sm:px-6 sm:py-4">
          <Logo tagline />
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <LanguageToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[1240px] flex-1 flex-col items-center px-4 sm:px-6">
        <section className="grid w-full items-center gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="flex w-full flex-col items-start gap-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-coral/40 bg-coral/10 px-3 py-1.5 text-xs font-bold tracking-tight text-coral">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral/70" />
                <span className="relative inline-flex size-2 rounded-full bg-coral" />
              </span>
              {t('landing.badge')}
            </span>

            <h1 className="font-heading text-[clamp(1.5rem,5.2vw,2.625rem)] leading-tight font-extrabold tracking-tight break-words text-heading">
              {t('landing.hero_title_1')}{' '}
              <span className="block text-coral sm:inline">{t('landing.hero_title_2')}</span>
            </h1>

            <p className="text-[clamp(1.125rem,3.8vw,1.625rem)] leading-[1.7]">
              <span className="box-decoration-clone rounded-md bg-coral/15 px-2 py-1 font-heading font-extrabold tracking-tight text-heading">
                {t('landing.hero_tagline')}
              </span>
            </p>

            <p className="max-w-[520px] text-[clamp(0.875rem,3.2vw,1.25rem)] leading-relaxed text-muted-foreground">
              {t('landing.hero_desc')}
            </p>

            <p className="text-[clamp(0.9375rem,3vw,1.125rem)] font-semibold text-coral">
              {t('landing.hero_pitch')}
            </p>

            <div className="flex w-full flex-wrap items-center gap-3 pt-2">
              <a
                href="#waitlist-section"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-md transition-all hover:opacity-90"
              >
                <span>{t('landing.waitlist_cta')}</span>
                <ArrowRight size={16} />
              </a>
            </div>

            <StudentCount lang={lang} />
          </div>

          <div className="flex w-full items-center justify-center overflow-hidden">
            <KhataPreview className="w-full max-w-sm drop-shadow-sm" lang={lang} />
          </div>
        </section>

        <section id="demo-section" className="flex w-full flex-col gap-6 py-10">
          <SectionHeading
            accent="mint"
            title={t('landing.curriculum_title')}
            sub={t('landing.curriculum_subtitle')}
          />
          <LandingRubricDemo />
        </section>

        <section className="flex w-full flex-col gap-6 py-8">
          <SectionHeading
            accent="sun"
            kicker={isBn ? 'সহজ ৩টি ধাপ' : 'SIMPLE 3-STEP PROCESS'}
            title={t('landing.how_it_works')}
          />

          <div className="grid w-full gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((step) => {
              const a = ACCENT[step.accent];
              return (
                <div
                  key={step.title}
                  className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={cn(
                        'inline-flex size-8 items-center justify-center rounded-full font-mono text-xs font-bold',
                        a.soft,
                      )}
                    >
                      {step.stepNum}
                    </span>
                    <step.icon size={20} className={a.text} />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-heading">{step.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{step.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex w-full flex-col gap-6 py-6">
          <SectionHeading
            accent="mark"
            kicker={t('landing.problem_kicker')}
            title={t('landing.problem_title')}
          />
          <div className="grid w-full gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
            {valueProps.map((card) => {
              const a = ACCENT[card.accent];
              return (
                <div
                  key={card.title}
                  className={cn(
                    'flex flex-col gap-3 rounded-2xl border bg-card p-6 text-card-foreground shadow-xs',
                    a.ring,
                  )}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span className={cn('font-mono text-xs font-bold tracking-wider uppercase', a.text)}>
                      {card.eyebrow}
                    </span>
                    <span className={cn('inline-flex size-7 items-center justify-center rounded-lg', a.iconWrap)}>
                      <card.icon size={15} />
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-heading">{card.title}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{card.body}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section
          id="waitlist"
          className="my-4 w-full rounded-2xl border border-border bg-card p-6 py-10 text-card-foreground shadow-md sm:p-10"
        >
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
            <div className="flex flex-col gap-3">
              <SectionHeading
                accent="coral"
                size="md"
                kicker={isBn ? 'অগ্রাধিকার তালিকা' : 'PRIORITY ACCESS'}
                title={t('landing.waitlist_section_title')}
              />
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
              &copy; <CopyrightYear /> SheraTutor &middot; {t('landing.footer_text')}
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
            <span>{t('landing.footer_boards')}</span>
            <span>&middot;</span>
            <Link href={'/privacy' as Route} className="transition-colors hover:text-foreground">
              {t('landing.footer_privacy')}
            </Link>
            <span>&middot;</span>
            <Link href={'/terms' as Route} className="transition-colors hover:text-foreground">
              {t('landing.footer_terms')}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

async function DynamicLanding() {
  const cookieStore = await cookies();
  const lang: Language = cookieStore.get('sheratutor_lang')?.value === 'en' ? 'en' : 'bn';
  return <CachedLandingUI lang={lang} />;
}

export default function LandingPage() {
  return (
    <React.Suspense fallback={<CachedLandingUI lang="bn" />}>
      <DynamicLanding />
    </React.Suspense>
  );
}
