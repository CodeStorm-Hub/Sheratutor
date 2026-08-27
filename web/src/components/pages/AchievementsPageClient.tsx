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
        <button type="button" className="ghost-btn" onClick={handleShare}>
          <Share2 size={16} /> Share
        </button>
      </PageHeader>

      <div className="achievements-hero">
        <div className="level-badge">
          <Award size={48} color="#fff" />
        </div>
        <h1>{language === 'bn' ? `লেভেল ${currentLevel}: বোর্ড স্কলার` : `Level ${currentLevel}: Board Scholar`}</h1>
        <p>{language === 'bn' ? 'অসাধারণ! তোমার প্রস্তুতি এগিয়ে যাচ্ছে।' : 'Incredible! Your preparation is moving forward.'}</p>
        
        <div className="xp-bar-container">
          <div className="xp-meta">
            <span>{earnedXp} XP</span>
            <span>{xpNeeded} XP to Level {currentLevel + 1}</span>
          </div>
          <div className="xp-track">
            <span style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      <div className="badges-grid mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {badges.map((badge, idx) => (
          <div key={idx} className={`p-6 border rounded-xl flex flex-col items-center text-center ${!badge.unlocked ? 'opacity-50 grayscale' : ''}`}>
            <div className={`w-16 h-16 ${badge.unlocked ? 'bg-mint/20 text-mint' : 'bg-gray-100 text-gray-400'} rounded-full flex items-center justify-center mb-4 text-2xl`}>
              {badge.icon}
            </div>
            <h3 className="font-bold">{language === 'bn' ? badge.title_bn : badge.title}</h3>
            <p className="text-sm text-gray-500 mt-2">{language === 'bn' ? badge.description_bn : badge.description}</p>
            <div className="mt-4 text-xs font-semibold">{badge.value}</div>
          </div>
        ))}
      </div>
    </>
  );
}
