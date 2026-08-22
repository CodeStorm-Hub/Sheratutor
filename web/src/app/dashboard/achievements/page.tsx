import React from 'react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { achievementsData } from '@/data/mockData';
import { ArrowUpRight } from 'lucide-react';

export default function AchievementsPage() {
  return (
    <>
      <PageHeader
        title="Achievements"
        description="Milestones on your path to board excellence."
      >
        <button type="button" className="primary-btn">
          Share achievements <ArrowUpRight size={15} />
        </button>
      </PageHeader>

      <section className="achievement-hero">
        <div>
          <Tag color="sun">LEVEL 12</Tag>
          <h2>Rising Scholar</h2>
          <p>2,840 XP earned this term · 160 XP to next level</p>
          <i>
            <em />
          </i>
        </div>
        <span>🏆</span>
      </section>

      <section className="achievement-grid">
        {achievementsData.map((a) => (
          <article key={a.title}>
            <span>{a.icon}</span>
            <Tag color="mint">{a.value}</Tag>
            <h3>{a.title}</h3>
            <b>Unlocked</b>
            <p>{a.description}</p>
          </article>
        ))}
      </section>
    </>
  );
}
