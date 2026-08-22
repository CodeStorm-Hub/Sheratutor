'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Calendar,
  ChevronRight,
  LineChart,
  LogOut,
  Menu,
  Moon,
  Search,
  Sparkles,
  Sun,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { signOut } from '@/app/actions/auth';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userInitials?: string;
  userName?: string;
  userSub?: string;
}

const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/dashboard': 'Home',
  '/dashboard/tutor': 'AI Tutor',
  '/dashboard/practice': 'Mock Exams',
  '/dashboard/practice/generate': 'Question Paper Generator',
  '/dashboard/board-simulator': 'Board Simulator',
  '/dashboard/upload': 'AI Grading',
  '/dashboard/submissions': 'Results',
  '/dashboard/mistake-analysis': 'Mistake Analysis',
  '/dashboard/study-plan': 'Study Planner',
  '/dashboard/achievements': 'Achievements',
  '/dashboard/profile': 'Settings',
};

const quickLinks = [
  { label: 'AI Tutor', href: '/dashboard/tutor', icon: Sparkles, desc: 'Ask questions & learn concepts' },
  { label: 'AI Grading', href: '/dashboard/upload', icon: User, desc: 'Submit written answer scripts' },
  { label: 'Mock Exams', href: '/dashboard/practice', icon: LineChart, desc: 'Practice board question papers' },
  { label: 'Board Simulator', href: '/dashboard/board-simulator', icon: Trophy, desc: 'Full timed board exam simulation' },
  { label: 'Study Planner', href: '/dashboard/study-plan', icon: Calendar, desc: 'View today’s adaptive tasks' },
  { label: 'Mistake Analysis', href: '/dashboard/mistake-analysis', icon: LineChart, desc: 'Review marks recovery' },
  { label: 'Achievements', href: '/dashboard/achievements', icon: Trophy, desc: 'XP points & scholarship badges' },
  { label: 'Profile & Settings', href: '/dashboard/profile', icon: User, desc: 'Board, group & preferences' },
];

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  setOpen,
  darkMode,
  setDarkMode,
  userInitials = 'AR',
  userName = 'Anam Rahman',
  userSub = 'HSC · Science',
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Determine current page title
  let pageTitle = 'Workspace';
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname === route || (route !== '/' && route !== '/dashboard' && pathname.startsWith(route))) {
      pageTitle = title;
      break;
    }
  }

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Global ⌘ K / Ctrl K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const toggleNav = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1050) {
      setOpen(true);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  const filteredLinks = quickLinks.filter(
    (l) =>
      l.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header>
        <button
          type="button"
          className="menu-btn"
          onClick={toggleNav}
          aria-label={collapsed ? 'Show navigation' : 'Hide navigation'}
        >
          <Menu size={21} />
        </button>

        <div className="crumb">
          <span>Workspace</span>
          <ChevronRight size={15} />
          <b>{pageTitle}</b>
        </div>

        <div className="header-actions">
          {/* Search Trigger */}
          <button
            type="button"
            className="command"
            onClick={() => setSearchOpen(true)}
            aria-label="Search workspace (⌘ K)"
          >
            <Search size={16} />
            <span>Search anything</span>
            <kbd>⌘ K</kbd>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            className="round-btn theme-icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          {/* Notifications Dropdown */}
          <div style={{ position: 'relative' }} ref={notifRef}>
            <button
              type="button"
              className="round-btn"
              onClick={() => {
                setNotifOpen(!notifOpen);
                setProfileOpen(false);
              }}
              aria-label="View notifications"
            >
              <Bell size={18} />
              <i />
            </button>

            {notifOpen && (
              <div className="header-dropdown notif-dropdown">
                <div className="dropdown-header">
                  <b>Notifications</b>
                  <button
                    type="button"
                    className="small-link-btn"
                    onClick={() => setNotifOpen(false)}
                  >
                    Mark all read
                  </button>
                </div>

                <div className="notif-list">
                  <div className="notif-item unread">
                    <span className="notif-badge mint">✓</span>
                    <div>
                      <b>Physics 1st Paper Graded</b>
                      <p>Score: 8/10 (A+) · Formula verified & feedback ready.</p>
                      <time>10m ago</time>
                    </div>
                  </div>

                  <div className="notif-item unread">
                    <span className="notif-badge coral">⚡</span>
                    <div>
                      <b>Trigonometry Review Needed</b>
                      <p>AI detected 3 step-based error patterns to recover marks.</p>
                      <time>1h ago</time>
                    </div>
                  </div>

                  <div className="notif-item">
                    <span className="notif-badge sun">🔥</span>
                    <div>
                      <b>7-Day Streak Active</b>
                      <p>You&apos;re 120 XP away from Level 13!</p>
                      <time>Yesterday</time>
                    </div>
                  </div>
                </div>

                <div className="dropdown-footer">
                  <Link
                    href="/dashboard/submissions"
                    onClick={() => setNotifOpen(false)}
                  >
                    See all assessments <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar & Dropdown */}
          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="avatar-btn"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
              aria-label="Open user profile menu"
            >
              <div className="avatar">{userInitials}</div>
            </button>

            {profileOpen && (
              <div className="header-dropdown profile-dropdown">
                {/* Profile Header Info */}
                <div className="profile-menu-head">
                  <div className="avatar" style={{ width: 42, height: 42, fontSize: 13 }}>
                    {userInitials}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <b className="profile-name">{userName}</b>
                    <small className="profile-sub">{userSub}</small>
                  </div>
                </div>

                <div className="dropdown-divider" />

                {/* Profile Navigation Links */}
                <div className="profile-menu-links">
                  <Link
                    href="/dashboard/profile"
                    className="profile-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <User size={16} />
                    <span>Profile & Settings</span>
                  </Link>

                  <Link
                    href="/dashboard/study-plan"
                    className="profile-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Calendar size={16} />
                    <span>Study Planner</span>
                  </Link>

                  <Link
                    href="/dashboard/achievements"
                    className="profile-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <Trophy size={16} />
                    <span>Achievements & XP</span>
                  </Link>

                  <Link
                    href="/dashboard/submissions"
                    className="profile-link"
                    onClick={() => setProfileOpen(false)}
                  >
                    <LineChart size={16} />
                    <span>My Assessments</span>
                  </Link>
                </div>

                <div className="dropdown-divider" />

                {/* Theme Switch Row */}
                <div
                  className="profile-menu-row"
                  onClick={() => setDarkMode(!darkMode)}
                  style={{ cursor: 'pointer' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    <span style={{ fontSize: 13, fontWeight: 500 }}>
                      {darkMode ? 'Light Theme' : 'Dark Theme'}
                    </span>
                  </div>
                  <div className={`theme-switch ${darkMode ? 'on' : ''}`}>
                    <i />
                  </div>
                </div>

                <div className="dropdown-divider" />

                {/* Sign Out Button */}
                <form action={signOut} style={{ margin: 0, padding: 0 }}>
                  <button type="submit" className="signout-btn">
                    <LogOut size={16} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Global ⌘ K Command Search Dialog */}
      {searchOpen && (
        <div
          className="search-modal-backdrop"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="search-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="search-modal-head">
              <Search size={18} color="#69718c" />
              <input
                autoFocus
                placeholder="Search tools, subjects, exams, or settings…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSearchOpen(false)}
                aria-label="Close search"
              >
                <X size={18} />
              </button>
            </div>

            <div className="search-results-list">
              <div className="search-group-title">QUICK NAVIGATION</div>
              {filteredLinks.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
                  No matching workspace tools found for &ldquo;{searchQuery}&rdquo;
                </div>
              ) : (
                filteredLinks.map((item) => (
                  <div
                    key={item.href}
                    className="search-result-item"
                    onClick={() => {
                      setSearchOpen(false);
                      router.push(item.href);
                    }}
                  >
                    <div className="search-item-icon">
                      <item.icon size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <b>{item.label}</b>
                      <small>{item.desc}</small>
                    </div>
                    <ChevronRight size={16} color="#9aa1b3" />
                  </div>
                ))
              )}
            </div>

            <div className="search-modal-footer">
              <span>Press <kbd>ESC</kbd> to close</span>
              <span>Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
