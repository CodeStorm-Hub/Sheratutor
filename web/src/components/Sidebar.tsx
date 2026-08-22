'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  Home,
  LineChart,
  Settings,
  Sparkles,
  Trophy,
  X,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  collapsed: boolean;
  userName?: string;
  userSub?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  open,
  setOpen,
  collapsed,
  userName = 'Student',
  userSub = 'HSC · Science',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();

  const isNavActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard' || href === '/') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const dynamicNavItems = [
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

  return (
    <aside className={`sidebar ${open ? 'open ' : ''}${collapsed ? 'collapsed' : ''}`.trim()}>
      {/* Brand Header */}
      <div className="brand">
        <Link
          href="/dashboard"
          className="brand-link"
          style={{ display: 'flex', alignItems: 'center', gap: 'inherit', textDecoration: 'none', color: 'inherit' }}
        >
          <div className="brand-mark">
            <span />
            <span />
            <span />
          </div>
          <span>
            Shera<span>Tutor</span>
          </span>
        </Link>
        <button
          type="button"
          className="mobile-close"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* User Card */}
      <div className="school">
        <div className="school-icon">{userName.charAt(0)}</div>
        <div>
          <b>{userName}</b>
          <small>{userSub}</small>
        </div>
        <ChevronDown size={15} />
      </div>

      {/* Scrollable Navigation Menu Area */}
      <div className="sidebar-scroll">
        <nav>
          {dynamicNavItems.map((item, i) =>
            item.group ? (
              <div className="nav-heading" key={`group-${i}`}>
                {item.label}
              </div>
            ) : (
              <Link
                key={`${item.label}-${item.href}`}
                href={item.href || '#'}
                className={isNavActive(item.href) ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                {item.icon && <item.icon size={18} />}
                <span>{item.label}</span>
                {item.isNew && <i>{language === 'bn' ? 'নতুন' : 'New'}</i>}
              </Link>
            )
          )}
        </nav>

        <div className="sidebar-bottom">
          <Link
            href="/dashboard/achievements"
            className={isNavActive('/dashboard/achievements') ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            <Trophy size={18} />
            <span>{t('nav.achievements')}</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={isNavActive('/dashboard/profile') ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            <Settings size={18} />
            <span>{t('nav.settings')}</span>
          </Link>

          <div className="help-card">
            <div className="help-icon">
              <HelpCircle size={18} />
            </div>
            <b>{t('nav.help_title')}</b>
            <p>{t('nav.help_desc')}</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/tutor');
              }}
            >
              {t('nav.help_btn')} <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
