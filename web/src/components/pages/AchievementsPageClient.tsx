'use client';

import React from 'react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { ArrowUpRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface BadgeItem {
  icon: string;
  value: string;
  title: string;
  title_bn?: string;
  description: string;
  description_bn?: string;
  unlocked: boolean;
}

interface AchievementsClientProps {
  currentLevel: number;
  earnedXp: number;
  xpNeeded: number;
  progressPct: number;
  badges: BadgeItem[];
}

export function AchievementsPageClient({
  currentLevel,
  earnedXp,
  xpNeeded,
  progressPct,
  badges,
}: AchievementsClientProps) {
  const { language, t } = useLanguage();

  const getRankTitle = (lvl: number) => {
    if (language === 'bn') {
      if (lvl >= 5) return 'বোর্ড স্কলার';
      if (lvl >= 3) return 'উদীয়মান শিক্ষার্থী';
      return 'শিক্ষানবিস';
    }
    if (lvl >= 5) return 'Board Scholar';
    if (lvl >= 3) return 'Rising Scholar';
    return 'Apprentice Learner';
  };

  return (
    <>
      <PageHeader
        title={t('achievements.title')}
        description={t('achievements.desc')}
      >
        <button type="button" className="primary-btn">
          {t('achievements.share')} <ArrowUpRight size={15} />
        </button>
      </PageHeader>

      <section className="achievement-hero">
        <div>
          <Tag color="sun">
            {language === 'bn' ? `লেভেল ${currentLevel}` : `LEVEL ${currentLevel}`}
          </Tag>
          <h2>{getRankTitle(currentLevel)}</h2>
          <p>
            {earnedXp} {t('achievements.xp_earned')} &nbsp;&middot;&nbsp; {xpNeeded} {t('achievements.to_next_level')} {currentLevel + 1}
          </p>
          <i>
            <em style={{ width: `${progressPct}%` }} />
          </i>
        </div>
        <span>🏆</span>
      </section>

      <section className="achievement-grid">
        {badges.map((a) => {
          const badgeTitle = language === 'bn' && a.title_bn ? a.title_bn : a.title;
          const badgeDesc = language === 'bn' && a.description_bn ? a.description_bn : a.description;
          return (
            <article
              key={a.title}
              style={{ opacity: a.unlocked ? 1 : 0.65 }}
            >
              <span>{a.icon}</span>
              <Tag color={a.unlocked ? 'mint' : 'lilac'}>{a.value}</Tag>
              <h3>{badgeTitle}</h3>
              <b>{a.unlocked ? t('common.unlocked') : t('common.locked')}</b>
              <p>{badgeDesc}</p>
            </article>
          );
        })}
      </section>
    </>
  );
}
