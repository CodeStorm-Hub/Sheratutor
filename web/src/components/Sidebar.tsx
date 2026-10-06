'use client';

import React from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Atom,
  BookOpen,
  Calendar,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Home,
  LineChart,
  Settings,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { LogoMark } from '@/components/logo';
import { useLanguage } from '@/context/LanguageContext';

type NavEntry =
  | { group: true; label: string }
  | { group?: false; label: string; href: string; icon: React.ElementType; isNew?: boolean };

interface SidebarContentProps {
  userName?: string;
  userSub?: string;
  isAdmin?: boolean;
  onNavigate?: () => void;
}

export function SidebarContent({
  userName = 'Student',
  userSub = 'HSC · Science',
  isAdmin = false,
  onNavigate,
}: SidebarContentProps) {
  const pathname = usePathname();
  const { language, t } = useLanguage();

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard' || pathname === '/';
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const items: NavEntry[] = [
    { label: t('nav.home'), href: '/dashboard', icon: Home },
    { group: true, label: t('nav.learning') },
    { label: t('nav.tutor'), href: '/dashboard/tutor', icon: Sparkles },
    { label: t('nav.physics_lab'), href: '/dashboard/playground/physics', icon: Atom, isNew: true },
    { label: t('nav.exams'), href: '/dashboard/practice', icon: BookOpen },
    { label: t('nav.simulator'), href: '/dashboard/board-simulator', icon: GraduationCap },
    { group: true, label: t('nav.assessment') },
    { label: t('nav.grading'), href: '/dashboard/upload', icon: FileCheck2 },
    { label: t('nav.results'), href: '/dashboard/submissions', icon: ClipboardCheck },
    { label: t('nav.mistakes'), href: '/dashboard/mistake-analysis', icon: LineChart },
    { group: true, label: t('nav.planning') },
    { label: t('nav.planner'), href: '/dashboard/study-plan', icon: Calendar },
    ...(isAdmin
      ? [
          { group: true as const, label: language === 'bn' ? 'প্রশাসন' : 'ADMINISTRATION' },
          { label: language === 'bn' ? 'ওয়েটলিস্ট কার্যক্রম' : 'Waitlist Ops', href: '/dashboard/admin/waitlist', icon: Users },
        ]
      : []),
  ];

  const bottom: NavEntry[] = [
    { label: t('nav.achievements'), href: '/dashboard/achievements', icon: Trophy },
    { label: t('nav.settings'), href: '/dashboard/profile', icon: Settings },
  ];

  const displayUserSub = language === 'bn'
    ? userSub
        .replace('Science', 'বিজ্ঞান')
        .replace('Humanities', 'মানবিক')
        .replace('Business Studies', 'ব্যবসায় শিক্ষা')
        .replace('Board', 'বোর্ড')
        .replace('HSC', 'এইচএসসি')
        .replace('SSC', 'এসএসসি')
    : userSub;

  return (
    <div className="flex h-full flex-col p-3">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-2 pt-1 pb-3">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="group flex items-center gap-2.5 transition-transform active:scale-[0.98]"
        >
          <div className="relative flex-none">
            <LogoMark className="size-8 transition-transform group-hover:scale-105 duration-200" />
            <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-sidebar" />
          </div>
          <div className="flex flex-col">
            <span className="font-heading text-lg font-bold tracking-tight leading-none text-foreground">
              Shera<span className="text-coral">Tutor</span>
            </span>
            <span className="font-mono text-[9.5px] font-bold tracking-wider text-muted-foreground uppercase leading-tight mt-0.5">
              {language === 'bn' ? 'স্মার্ট বোর্ড লার্নিং' : 'Smart Board Prep'}
            </span>
          </div>
        </Link>
        <span className="rounded-md border border-border/60 bg-surface-2/60 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          {language === 'bn' ? 'এইচএসসি · এসএসসি' : 'HSC · SSC'}
        </span>
      </div>

      {/* Interactive Student Identity Card */}
      <Link
        href="/dashboard/profile"
        onClick={onNavigate}
        className="group mb-2.5 flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface-1/70 p-2 transition-all hover:bg-surface-2 hover:border-border hover:shadow-xs active:scale-[0.985]"
        title={language === 'bn' ? 'প্রোফাইল ও বোর্ড সেটিংস দেখুন' : 'View profile & board settings'}
      >
        <div className="relative flex-none">
          <span className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#FF6B57] to-amber-500 text-sm font-extrabold text-white shadow-xs transition-transform group-hover:scale-105">
            {userName.charAt(0).toUpperCase()}
          </span>
          <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-surface-1" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-foreground group-hover:text-cta transition-colors">
            {userName}
          </p>
          <p className="truncate text-[11px] text-muted-foreground">{displayUserSub}</p>
        </div>
        <ChevronRight className="size-3.5 flex-none text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
      </Link>

      {/* Navigation List */}
      <nav className="-mx-1 flex-1 overflow-y-auto px-1 pr-1.5 space-y-0.5 scrollbar-thin">
        {items.map((item, i) => {
          if (item.group) {
            return (
              <div
                key={`g-${i}`}
                className="pt-3.5 pb-1 px-2.5 first:pt-1 flex items-center gap-2"
              >
                <span className="font-mono text-3xs font-bold tracking-[0.11em] text-muted-foreground/80 uppercase">
                  {item.label}
                </span>
                <span className="h-px flex-1 bg-border/40" />
              </div>
            );
          }

          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href as Route}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-medium transition-all duration-150',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                active
                  ? 'bg-surface-2 dark:bg-surface-2 text-foreground font-semibold shadow-xs'
                  : 'text-sidebar-foreground/75 hover:bg-surface-2/60 hover:text-foreground active:scale-[0.985]',
              )}
            >
              {active && (
                <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-cta shadow-[0_0_8px_rgba(255,85,56,0.5)]" />
              )}
              <Icon
                className={cn(
                  'size-[18px] flex-none transition-transform duration-150 group-hover:scale-110',
                  active ? 'text-cta' : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
              {item.isNew && (
                <span className="inline-flex items-center gap-1 rounded-full border border-coral/30 bg-coral/15 px-1.5 py-0.5 font-mono text-3xs font-bold text-coral uppercase tracking-wide">
                  <span className="size-1 rounded-full bg-coral animate-pulse" />
                  {language === 'bn' ? 'নতুন' : 'NEW'}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Area: Achievements, Settings & AI Tutor Mini-Card */}
      <div className="mt-auto flex flex-col gap-0.5 pt-2 border-t border-border/40">
        {bottom.map((item) => {
          if (item.group) return null;
          const active = isActive(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href as Route}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-xs sm:text-sm font-medium transition-all duration-150',
                'focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                active
                  ? 'bg-surface-2 dark:bg-surface-2 text-foreground font-semibold shadow-xs'
                  : 'text-sidebar-foreground/75 hover:bg-surface-2/60 hover:text-foreground active:scale-[0.985]',
              )}
            >
              {active && (
                <span className="absolute left-1 top-2 bottom-2 w-1 rounded-full bg-cta shadow-[0_0_8px_rgba(255,85,56,0.5)]" />
              )}
              <Icon
                className={cn(
                  'size-[18px] flex-none transition-transform duration-150 group-hover:scale-110',
                  active ? 'text-cta' : 'text-muted-foreground group-hover:text-foreground',
                )}
              />
              <span className="flex-1 truncate">{item.label}</span>
            </Link>
          );
        })}

        {/* Compact AI Study Assistant Mini-Card */}
        <div className="mt-2 relative overflow-hidden rounded-xl border border-border/70 bg-surface-1/80 p-2.5 shadow-xs transition-all hover:border-cta/40 hover:bg-surface-1 group">
          <div className="absolute -top-6 -right-6 size-14 rounded-full bg-cta/15 blur-lg pointer-events-none" />
          <div className="flex items-center gap-2">
            <span className="grid size-6 flex-none place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-slate-950 shadow-xs">
              <Sparkles className="size-3.5" />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-foreground">{t('nav.help_title')}</p>
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="truncate text-[10.5px] text-muted-foreground">{t('nav.help_desc')}</p>
            </div>
          </div>
          <Link
            href="/dashboard/tutor"
            onClick={onNavigate}
            className="mt-2 flex w-full items-center justify-center gap-1 rounded-lg bg-surface-2 px-2 py-1.5 text-xs font-semibold text-cta transition-all hover:bg-cta hover:text-white active:scale-[0.98]"
          >
            <span>{t('nav.help_btn')}</span>
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
