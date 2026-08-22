'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  ChevronRight,
  HelpCircle,
  Settings,
  Trophy,
  X,
} from 'lucide-react';
import { navItems } from '@/data/mockData';

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
  userName = 'Anam Rahman',
  userSub = 'HSC · Science',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const isNavActive = (href?: string) => {
    if (!href) return false;
    if (href === '/dashboard' || href === '/') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

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
          {navItems.map((item, i) =>
            item.group ? (
              <div className="nav-heading" key={`group-${i}`}>
                {item.label}
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href}
                className={isNavActive(item.href) ? 'active' : ''}
                onClick={() => setOpen(false)}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.isNew && <i>New</i>}
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
            <span>Achievements</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className={isNavActive('/dashboard/profile') ? 'active' : ''}
            onClick={() => setOpen(false)}
          >
            <Settings size={18} />
            <span>Settings</span>
          </Link>

          <div className="help-card">
            <div className="help-icon">
              <HelpCircle size={18} />
            </div>
            <b>Need a hand?</b>
            <p>Ask your personal examiner.</p>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                router.push('/dashboard/tutor');
              }}
            >
              Get help <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
