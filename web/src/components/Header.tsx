'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { Bell, ChevronRight, Menu, Moon, Search, Sun } from 'lucide-react';

interface HeaderProps {
  collapsed: boolean;
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  userInitials?: string;
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

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  setOpen,
  darkMode,
  setDarkMode,
  userInitials = 'AR',
}) => {
  const pathname = usePathname();

  // Find best matching title
  let pageTitle = 'Workspace';
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname === route || (route !== '/' && route !== '/dashboard' && pathname.startsWith(route))) {
      pageTitle = title;
      break;
    }
  }

  const toggleNav = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 1050) {
      setOpen(true);
    } else {
      setCollapsed((prev) => !prev);
    }
  };

  return (
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
        <button type="button" className="command" aria-label="Search workspace">
          <Search size={16} />
          <span>Search anything</span>
          <kbd>⌘ K</kbd>
        </button>
        <button
          type="button"
          className="round-btn theme-icon"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle dark mode"
        >
          {darkMode ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button type="button" className="round-btn" aria-label="Notifications">
          <Bell size={18} />
          <i />
        </button>
        <div className="avatar">{userInitials}</div>
      </div>
    </header>
  );
};
