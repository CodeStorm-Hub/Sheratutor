'use client';

import React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Home,
  LineChart,
  Settings,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/context/LanguageContext';

type NavEntry =
  | { group: true; label: string }
  | { group?: false; label: string; href: string; icon: React.ElementType; isNew?: boolean };

interface SidebarContentProps {
  userName?: string;
  userSub?: string;
  onNavigate?: () => void;
}

export function SidebarContent({
  userName = 'Student',
  userSub = 'HSC · Science',
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const items: NavEntry[] = [
    { label: t('nav.home'), href: '/dashboard', icon: Home },
    { group: true, label: t('nav.learning') },
    { label: t('nav.tutor'), href: '/dashboard/tutor', icon: Sparkles },
    { label: t('nav.exams'), href: '/dashboard/practice', icon: BookOpen },
    { label: t('nav.simulator'), href: '/dashboard/board-simulator', icon: GraduationCap, isNew: true },
    { group: true, label: t('nav.assessment') },
    { label: t('nav.grading'), href: '/dashboard/upload', icon: FileCheck2 },
    { label: t('nav.results'), href: '/dashboard/submissions', icon: ClipboardCheck },
    { label: t('nav.mistakes'), href: '/dashboard/mistake-analysis', icon: LineChart },
    { group: true, label: t('nav.planning') },
    { label: t('nav.planner'), href: '/dashboard/study-plan', icon: Calendar },
  ];

  const bottom: NavEntry[] = [
    { label: t('nav.achievements'), href: '/dashboard/achievements', icon: Trophy },
    { label: t('nav.settings'), href: '/dashboard/profile', icon: Settings },
  ];

  const linkClass = (href: string) =>
    cn(
      'group flex items-center gap-3 rounded-lg border-l-2 border-transparent px-3 py-2 text-[13px] font-medium transition-colors',
      isActive(href)
        ? 'border-l-cta bg-sidebar-accent text-foreground'
        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-foreground',
    );

  return (
    <div className="flex h-full flex-col gap-1 p-3">
      <Link
        href="/dashboard"
        onClick={onNavigate}
        className="flex items-center gap-2 px-2 pt-1 pb-3"
      >
        <span
          aria-hidden
          className="flex size-8 flex-none -rotate-3 items-end gap-[2px] rounded-lg bg-navy p-1.5"
        >
          <span className="h-2 w-1 rounded-sm bg-surface-1" />
          <span className="h-3.5 w-1 rounded-sm bg-sun" />
          <span className="h-[18px] w-1 rounded-sm bg-cta" />
        </span>
        <span className="font-heading text-lg font-bold tracking-tight">
          Shera<span className="text-coral">Tutor</span>
        </span>
      </Link>

      <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-background px-2.5 py-2">
        <span className="grid size-8 flex-none place-items-center rounded-lg bg-sun text-sm font-extrabold text-slate-950">
          {userName.charAt(0)}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold">{userName}</p>
          <p className="truncate text-xs text-muted-foreground">{userSub}</p>
        </div>
      </div>

      <nav className="-mx-1 flex-1 overflow-y-auto px-1">
        {items.map((item, i) =>
          item.group ? (
            <p
              key={`g-${i}`}
              className="mt-4 mb-1.5 px-2.5 font-mono text-[11px] font-bold tracking-[0.09em] text-muted-foreground uppercase first:mt-1"
            >
              {item.label}
            </p>
          ) : (
            <Link
              key={item.href}
              href={item.href as Route}
              onClick={onNavigate}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={linkClass(item.href)}
            >
              <item.icon className="size-[18px] flex-none" />
              <span className="flex-1">{item.label}</span>
              {item.isNew && (
                <span className="rounded-md bg-cta/15 px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wide text-cta uppercase">
                  {language === 'bn' ? 'নতুন' : 'New'}
                </span>
              )}
            </Link>
          ),
        )}
      </nav>

      <div className="mt-auto flex flex-col gap-0.5 pt-3">
        {bottom.map((item) =>
          item.group ? null : (
            <Link
              key={item.href}
              href={item.href as Route}
              onClick={onNavigate}
              aria-current={isActive(item.href) ? 'page' : undefined}
              className={linkClass(item.href)}
            >
              <item.icon className="size-[18px] flex-none" />
              <span>{item.label}</span>
            </Link>
          ),
        )}

        <div className="mt-3 rounded-xl bg-cta/10 p-3.5">
          <span className="grid size-7 place-items-center rounded-lg bg-sun text-slate-950">
            <HelpCircle className="size-[18px]" />
          </span>
          <p className="mt-2 text-xs font-semibold">{t('nav.help_title')}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{t('nav.help_desc')}</p>
          <button
            type="button"
            onClick={() => {
              onNavigate?.();
              router.push('/dashboard/tutor');
            }}
            className="mt-2 font-mono text-[11px] font-semibold text-navy hover:text-cta"
          >
            {t('nav.help_btn')} →
          </button>
        </div>
      </div>
    </div>
  );
}
