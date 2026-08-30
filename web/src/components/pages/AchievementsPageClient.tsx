'use client';

import React from 'react';
import { PageHeader } from '@/components/PageHeader';
import { Award, Share2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface BadgeItem {
  icon: string;
  value: string;
  title: string;
  title_bn: string;
  description: string;
  description_bn: string;
  unlocked: boolean;
}

interface Props {
  currentLevel: number;
  earnedXp: number;
  xpNeeded: number;
  progressPct: number;
  badges: BadgeItem[];
}

export function AchievementsPageClient({ currentLevel, earnedXp, xpNeeded, progressPct, badges }: Props) {
  const { language, t } = useLanguage();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'SheraTutor Level Up!',
          text: `I just reached Level ${currentLevel} on SheraTutor with ${earnedXp} XP!`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      alert(language === 'bn' ? 'শেয়ারিং অপশন সমর্থিত নয়' : 'Web Share API not supported in this browser');
    }
  };

  // Safe fallback for i18n
  const safeT = (key: string) => {
    try {
      return (t as any)(key);
    } catch {
      return key;
    }
  };

  return (
    <>
      <PageHeader
        title={safeT('achievements.title')}
        description={safeT('achievements.desc')}
      >
        <button
          type="button"
          onClick={handleShare}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold transition-colors hover:bg-accent"
        >
          <Share2 size={16} /> Share
        </button>
      </PageHeader>

      <div className="flex flex-col items-center rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-xs">
        <div className="mb-4 grid size-20 place-items-center rounded-full bg-cta text-cta-foreground">
          <Award size={40} />
        </div>
        <h2 className="font-heading text-xl font-bold">
          {language === 'bn' ? `লেভেল ${currentLevel}: বোর্ড স্কলার` : `Level ${currentLevel}: Board Scholar`}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {language === 'bn' ? 'অসাধারণ! তোমার প্রস্তুতি এগিয়ে যাচ্ছে।' : 'Incredible! Your preparation is moving forward.'}
        </p>

        <div className="mx-auto mt-6 w-full max-w-[480px]">
          <div className="mb-2 flex items-center justify-between text-sm font-semibold font-tabular">
            <span>{earnedXp} XP</span>
            <span className="text-muted-foreground">·</span>
            <span>{xpNeeded} XP to Level {currentLevel + 1}</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-surface-2">
            <span
              className="block h-full rounded-full bg-cta transition-[width] duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        {badges.map((badge, idx) => (
          <div key={idx} className={`p-6 bg-card border border-border text-foreground rounded-2xl flex flex-col items-center text-center shadow-xs transition-colors ${!badge.unlocked ? 'opacity-50 grayscale' : ''}`}>
            <div className={`w-16 h-16 ${badge.unlocked ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'} rounded-full flex items-center justify-center mb-4 text-2xl`}>
              {badge.icon}
            </div>
            <h3 className="font-bold text-foreground">{language === 'bn' ? badge.title_bn : badge.title}</h3>
            <p className="text-sm text-muted-foreground mt-2">{language === 'bn' ? badge.description_bn : badge.description}</p>
            <div className="mt-4 text-xs font-mono font-semibold px-3 py-1 bg-muted/60 text-muted-foreground rounded-full border border-border/50">{badge.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}
