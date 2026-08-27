'use client';

import React from 'react';
import Link from 'next/link';
import { ScoreRing } from '@/components/ScoreRing';
import { BarChart } from '@/components/BarChart';
import {
  ChevronRight,
  ChevronDown,
  FileCheck2,
  MoreHorizontal,
  Play,
  Sparkles,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface DashboardClientProps {
  firstName: string;
  totalCompleted: number;
  gradeLetter: string;
  avgScorePct: number | null;
  percentileRank: number;
  momentumScore: number;
  targetExamYear: number;
  targetExamBoard: string;
  examType: string;
  displaySubjects: Array<{
    id: string;
    name_en: string;
    name_bn: string;
    code: string;
    progress: number;
    chapterCount: number;
  }>;
  todayTasks: Array<{
    title: string;
    subtitle: string;
    time: string;
    checked: boolean;
  }>;
  hasActivePlan: boolean;
  submissionsCount: number;
  hasSubmissions: boolean;
}

export function DashboardPageClient({
  firstName,
  totalCompleted,
  gradeLetter,
  avgScorePct,
  percentileRank,
  momentumScore,
  targetExamYear,
  targetExamBoard,
  examType,
  displaySubjects,
  todayTasks,
  hasActivePlan,
  submissionsCount,
  hasSubmissions,
}: DashboardClientProps) {
  const { language, t } = useLanguage();

  return (
    <>
      {/* Welcome & Action Banner */}
      <section className="welcome">
        <div>
          <h1>
            {t('dashboard.greeting')} {firstName}
          </h1>
          <p>
            {totalCompleted > 0
              ? `${language === 'bn' ? 'তোমার' : 'You have'} ${totalCompleted} ${t('dashboard.welcome_active')}`
              : t('dashboard.welcome_new')}
          </p>
        </div>
        <Link
          href="/dashboard/practice"
          className="focus-button"
          style={{ textDecoration: 'none' }}
        >
          <Play size={16} fill="currentColor" />
          <span>{t('dashboard.focus_btn')}</span>
        </Link>
      </section>

      {/* Primary Overview Stat Grid */}
      <section className="stat-grid">
        {/* Card 1: Real Board Prediction */}
        <article className="prediction">
          <header>
            <div>
              <span>{t('dashboard.prediction_title')}</span>
              <p>
                {totalCompleted > 0
                  ? `${t('dashboard.prediction_desc')} (${totalCompleted})`
                  : t('dashboard.prediction_new')}
              </p>
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Prediction options"
            >
              <MoreHorizontal size={17} />
            </button>
          </header>

          <div className="prediction-main">
            <div className="big-grade" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <b>{gradeLetter}</b>
              <small style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {avgScorePct !== null ? `(${avgScorePct}%)` : 'N/A'}
              </small>
            </div>

            <div className="percentile">
              <label>
                {totalCompleted > 0
                  ? `${t('dashboard.percentile_top')} ${percentileRank}% ${t('dashboard.percentile_board')}`
                  : t('dashboard.percentile_ready')}
              </label>
              <div className="bar">
                <span
                  style={{
                    width: `${
                      totalCompleted > 0
                        ? Math.max(15, 100 - percentileRank)
                        : 20
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="prediction-footer">
            <span>
              {totalCompleted > 0
                ? t('dashboard.prediction_footer_rubric')
                : t('dashboard.prediction_footer_ready')}
            </span>
            <Link
              href="/dashboard/submissions"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <p>
                {t('dashboard.view_results')} <ChevronRight size={14} />
              </p>
            </Link>
          </div>
        </article>

        {/* Card 2: Exam Readiness */}
        <article className="readiness">
          <header>
            <div>
              <span>{t('dashboard.readiness_title')}</span>
              <p>
                {momentumScore > 0
                  ? t('dashboard.readiness_track')
                  : t('dashboard.readiness_building')}
              </p>
            </div>
            <button
              type="button"
              className="icon-btn"
              aria-label="Readiness options"
            >
              <MoreHorizontal size={17} />
            </button>
          </header>

          <div className="readiness-content">
            <ScoreRing value={momentumScore} />
            <p>
              {momentumScore > 0
                ? t('dashboard.readiness_mastery')
                : t('dashboard.readiness_calc')}
            </p>
          </div>
        </article>

        {/* Card 3: Target Exam */}
        <article className="exam-card">
          <header>
            <div>
              <span>{t('dashboard.target_exam_title')}</span>
              <p>
                {targetExamYear} {t('dashboard.target_batch')}
              </p>
            </div>
            <button type="button" className="icon-btn" aria-label="Exam details">
              <MoreHorizontal size={17} />
            </button>
          </header>

          <div className="exam-info">
            <b>
              {examType} · {targetExamBoard}
            </b>
            <div className="exam-date" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{language === 'bn' ? 'বোর্ড পরীক্ষা' : 'Board Exam'}</span>
              <p>{targetExamYear}</p>
            </div>
          </div>
        </article>
      </section>

      {/* Curriculum Subjects Section */}
      <section className="section-heading">
        <div>
          <h2>{t('dashboard.subjects_title')}</h2>
          <p>{t('dashboard.subjects_desc')}</p>
        </div>
        <Link
          href="/dashboard/tutor"
          className="link-with-icon"
          style={{ textDecoration: 'none' }}
        >
          {t('dashboard.ask_tutor')} <ChevronRight size={15} />
        </Link>
      </section>

      <section className="subjects">
        {displaySubjects.map((sub, idx) => {
          const colors = ['mint', 'coral', 'sun', 'mint'];
          const color = colors[idx % colors.length];
          const displayName = language === 'bn' ? (sub.name_bn || sub.name_en) : sub.name_en;
          const subTitle = language === 'bn' ? sub.name_en : (sub.name_bn || sub.code);

          return (
            <Link
              key={sub.id}
              href="/dashboard/practice"
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <article className={`subject ${color}`}>
                <div className="subject-icon">
                  <Sparkles size={20} />
                </div>
                <h3>{displayName}</h3>
                <small>{subTitle}</small>
                <div className="progress">
                  <span style={{ width: `${sub.progress}%` }} />
                </div>
                <div className="subject-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span>{sub.progress}% {language === 'bn' ? 'দক্ষতা' : 'mastery'}</span>
                  <span>·</span>
                  <span>{sub.chapterCount} {language === 'bn' ? 'টি অধ্যায়' : 'chapters'}</span>
                </div>
              </article>
            </Link>
          );
        })}
      </section>

      {/* Lower Dual Grid: Focus Plan & Performance Track */}
      <section className="lower-grid">
        {/* Today's Focus Checklist */}
        <article className="focus-panel">
          <div className="panel-header">
            <div>
              <h2>{t('dashboard.todays_focus_title')}</h2>
              <p>
                {hasActivePlan
                  ? t('dashboard.todays_focus_adaptive')
                  : t('dashboard.todays_focus_custom')}
              </p>
            </div>
            <Link
              href="/dashboard/study-plan"
              className="chip"
              style={{ textDecoration: 'none' }}
            >
              {todayTasks.length} {t('dashboard.tasks_count')} <ChevronDown size={14} />
            </Link>
          </div>

          <div className="task-list">
            {todayTasks.map((tItem, i) => (
              <div
                className={`task ${tItem.checked ? 'completed' : ''}`}
                key={`${tItem.title}-${i}`}
              >
                <span className={tItem.checked ? 'check' : ''}>
                  {tItem.checked ? '✓' : ''}
                </span>
                <div>
                  <b>{tItem.title}</b>
                  <small>{tItem.subtitle}</small>
                </div>
                <time>{tItem.time}</time>
                <button
                  type="button"
                  aria-label="More task options"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="panel-footer">
            <Link
              href="/dashboard/study-plan"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {t('dashboard.view_full_plan')} <ChevronRight size={14} />
            </Link>
          </div>
        </article>

        {/* Assessment Tracker Panel */}
        <article className="progress-panel">
          <div className="panel-header">
            <div>
              <h2>{t('dashboard.activity_title')}</h2>
              <p>
                {hasSubmissions
                  ? `${submissionsCount} ${t('dashboard.activity_desc')}`
                  : t('dashboard.activity_empty')}
              </p>
            </div>
            <Link
              href="/dashboard/upload"
              className="primary-btn sm"
              style={{ textDecoration: 'none' }}
            >
              <FileCheck2 size={14} /> {language === 'bn' ? 'খাতা জমা' : 'Upload'}
            </Link>
          </div>

          <BarChart data={hasSubmissions ? undefined : [0,0,0,0,0,0,0]} />

          <div className="progress-stats">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem' }}>{t('dashboard.tests_submitted')}</span>
              <strong style={{ fontSize: '1.25rem' }}>{submissionsCount}{language === 'bn' ? 'টি' : ''}</strong>
              <small style={{ fontSize: '0.75rem' }}>{t('dashboard.this_term')}</small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem' }}>{t('dashboard.avg_score')}</span>
              <strong style={{ fontSize: '1.25rem' }}>{avgScorePct !== null ? `${avgScorePct}%` : '—'}</strong>
              <small style={{ fontSize: '0.75rem' }}>
                {totalCompleted > 0
                  ? `${totalCompleted}${language === 'bn' ? 'টি মূল্যায়ন' : ' tests'}`
                  : t('dashboard.new_student')}
              </small>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span style={{ fontSize: '0.75rem' }}>{t('dashboard.momentum_label')}</span>
              <strong style={{ fontSize: '1.25rem' }}>{momentumScore}%</strong>
              <small style={{ fontSize: '0.75rem' }}>{language === 'bn' ? 'সক্রিয়' : 'Active'}</small>
            </div>
          </div>

          <div className="panel-footer">
            <Link
              href="/dashboard/submissions"
              style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              {t('dashboard.view_all_results')}
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
