'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell, Calendar, ChevronRight, LineChart, LogOut, Menu, Moon, Search,
  Sparkles, Sun, Trophy, User, X
} from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { createClient } from '@/lib/supabase/client';

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

export const Header: React.FC<HeaderProps> = ({
  collapsed,
  setCollapsed,
  setOpen,
  darkMode,
  setDarkMode,
  userInitials = 'ST',
  userName = 'Student',
  userSub = 'HSC · Science',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();
  const supabase = createClient();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initial fetch of unread notifications could go here

    // Listen for grading completion
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'exam_submissions',
          filter: 'status=eq.GRADED'
        },
        (payload) => {
          console.log('Submission graded!', payload);
          setNotifications(prev => [{
            id: payload.new.id,
            title: language === 'bn' ? 'খাতা মূল্যায়ন সম্পন্ন হয়েছে!' : 'Paper Grading Complete!',
            desc: language === 'bn' ? 'তোমার পরীক্ষার খাতাটি মূল্যায়ন করা হয়েছে। ফলাফল দেখতে ক্লিক করো।' : 'Your exam paper has been graded. Click to view results.',
            time: 'Just now',
            unread: true,
            href: `/dashboard/submissions/${payload.new.id}`
          }, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, language]);

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

  // Keyboard shortcut for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const routeTitles: Record<string, string> = {
    '/': t('nav.home'),
    '/dashboard': t('nav.home'),
    '/dashboard/tutor': t('nav.tutor'),
    '/dashboard/practice': t('nav.exams'),
    '/dashboard/practice/generate': language === 'bn' ? 'প্রশ্নপত্র জেনারেটর' : 'Question Generator',
    '/dashboard/board-simulator': t('nav.simulator'),
    '/dashboard/upload': t('nav.grading'),
    '/dashboard/submissions': t('nav.results'),
    '/dashboard/mistake-analysis': t('nav.mistakes'),
    '/dashboard/study-plan': t('nav.planner'),
    '/dashboard/achievements': t('nav.achievements'),
    '/dashboard/profile': t('nav.settings'),
  };

  const quickLinks = [
    { label: t('nav.tutor'), href: '/dashboard/tutor', icon: Sparkles, desc: language === 'bn' ? 'প্রশ্ন জিজ্ঞাসা করুন ও ধারণা বুঝুন' : 'Ask questions & learn concepts' },
    { label: t('nav.grading'), href: '/dashboard/upload', icon: User, desc: language === 'bn' ? 'হাতে লেখা খাতা জমা দিন' : 'Submit written answer scripts' },
    { label: t('nav.exams'), href: '/dashboard/practice', icon: LineChart, desc: language === 'bn' ? 'বোর্ড স্ট্যান্ডার্ড প্রশ্ন অনুশীলন' : 'Practice board question papers' },
    { label: t('nav.simulator'), href: '/dashboard/board-simulator', icon: Trophy, desc: language === 'bn' ? 'টাইমারযুক্ত পূর্ণাঙ্গ বোর্ড পরীক্ষা' : 'Full timed board exam simulation' },
    { label: t('nav.planner'), href: '/dashboard/study-plan', icon: Calendar, desc: language === 'bn' ? 'আজকের অ্যাডাপ্টিভ কাজ দেখুন' : 'View today’s adaptive tasks' },
    { label: t('nav.mistakes'), href: '/dashboard/mistake-analysis', icon: LineChart, desc: language === 'bn' ? 'নম্বর পুনরুদ্ধারের বিশ্লেষণ' : 'Review marks recovery' },
    { label: t('nav.achievements'), href: '/dashboard/achievements', icon: Trophy, desc: language === 'bn' ? 'এক্সপি পয়েন্ট ও ব্যাজ' : 'XP points & scholarship badges' },
    { label: t('nav.settings'), href: '/dashboard/profile', icon: User, desc: language === 'bn' ? 'বোর্ড, বিভাগ ও পছন্দসমূহ' : 'Board, group & preferences' },
  ];

  let pageTitle = t('common.workspace');
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname === route || (route !== '/' && route !== '/dashboard' && pathname.startsWith(route))) {
      pageTitle = title;
      break;
    }
  }

  const toggleNav = () => {
    if (window.innerWidth <= 1050) {
      setOpen(true);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const filteredLinks = quickLinks.filter(
    (item) =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.href.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <header>
        <button type="button" className="menu-btn" onClick={toggleNav} aria-label="Toggle navigation menu">
          <Menu size={21} />
        </button>

        <div className="crumb">
          <span>{t('common.workspace')}</span>
          <ChevronRight size={15} />
          <b>{pageTitle}</b>
        </div>

        <div className="header-actions">
          <LanguageToggle />

          <button type="button" className="command" onClick={() => setSearchOpen(true)}>
            <Search size={16} />
            <span>{t('common.search_placeholder')}</span>
            <kbd>{isMac ? '⌘ K' : 'Ctrl K'}</kbd>
          </button>

          <button 
            type="button" 
            className="round-btn theme-icon" 
            onClick={() => setDarkMode(!darkMode)}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={17} /> : <Moon size={17} />}
          </button>

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
              {notifications.some(n => n.unread) && <i />}
            </button>

            {notifOpen && (
              <div className="header-dropdown notif-dropdown">
                <div className="dropdown-header">
                  <b>{t('common.notifications')}</b>
                  <button type="button" className="small-link-btn" onClick={() => setNotifications(prev => prev.map(n => ({...n, unread: false})))}>
                    {t('common.mark_all_read')}
                  </button>
                </div>

                <div className="notif-list">
                  {notifications.map(n => (
                    <Link href={n.href} key={n.id} onClick={() => setNotifOpen(false)} style={{textDecoration: 'none'}}>
                      <div className={`notif-item ${n.unread ? 'unread' : ''}`}>
                        <span className="notif-badge mint">✓</span>
                        <div>
                          <b>{n.title}</b>
                          <p>{n.desc}</p>
                          <time>{n.time}</time>
                        </div>
                      </div>
                    </Link>
                  ))}
                  
                  {notifications.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      No new notifications
                    </div>
                  )}
                </div>

                <div className="dropdown-footer">
                  <Link href="/dashboard/submissions" onClick={() => setNotifOpen(false)}>
                    {t('common.see_all')} <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div style={{ position: 'relative' }} ref={profileRef}>
            <button
              type="button"
              className="avatar-btn"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotifOpen(false);
              }}
            >
              <div className="avatar">{userInitials}</div>
            </button>

            {profileOpen && (
              <div className="header-dropdown profile-dropdown">
                <div className="profile-menu-head">
                  <div className="avatar" style={{ width: 42, height: 42, fontSize: 13 }}>{userInitials}</div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <b className="profile-name">{userName}</b>
                    <small className="profile-sub">{userSub}</small>
                  </div>
                </div>
                <div className="dropdown-divider" />
                <div className="profile-menu-links">
                  <Link href="/dashboard/profile" className="profile-link" onClick={() => setProfileOpen(false)}>
                    <User size={16} /><span>{t('nav.settings')}</span>
                  </Link>
                  <Link href="/dashboard/study-plan" className="profile-link" onClick={() => setProfileOpen(false)}>
                    <Calendar size={16} /><span>{t('nav.planner')}</span>
                  </Link>
                  <Link href="/dashboard/achievements" className="profile-link" onClick={() => setProfileOpen(false)}>
                    <Trophy size={16} /><span>{t('nav.achievements')}</span>
                  </Link>
                  <Link href="/dashboard/submissions" className="profile-link" onClick={() => setProfileOpen(false)}>
                    <LineChart size={16} /><span>{t('nav.results')}</span>
                  </Link>
                </div>
                <div className="dropdown-divider" />
                <div className="profile-menu-row" onClick={() => setDarkMode(!darkMode)} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                    <span style={{ fontSize: 13, fontWeight: 500 }}>{darkMode ? t('common.light_mode') : t('common.dark_mode')}</span>
                  </div>
                  <div className={`theme-switch ${darkMode ? 'on' : ''}`}><i /></div>
                </div>
                <div className="dropdown-divider" />
                <form action={signOut} style={{ margin: 0, padding: 0 }}>
                  <button type="submit" className="signout-btn">
                    <LogOut size={16} /><span>{t('common.sign_out')}</span>
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {searchOpen && (
        <div className="search-modal-backdrop" onClick={() => setSearchOpen(false)}>
          <div className="search-modal" onClick={(e) => e.stopPropagation()}>
            <div className="search-modal-head">
              <Search size={18} color="#69718c" />
              <input autoFocus placeholder={language === 'bn' ? 'টুলস, বিষয়, পরীক্ষা বা সেটিংস খুঁজুন…' : 'Search tools, subjects, exams, or settings…'} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
              <button type="button" className="modal-close-btn" onClick={() => setSearchOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="search-results-list">
              <div className="search-group-title">{t('common.search_title')}</div>
              {filteredLinks.length === 0 ? (
                <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>{t('common.search_empty')}</div>
              ) : (
                filteredLinks.map((item) => (
                  <div key={item.href} className="search-result-item" onClick={() => { setSearchOpen(false); router.push(item.href); }}>
                    <div className="search-item-icon"><item.icon size={17} /></div>
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
              <span>{t('common.search_footer_esc')}</span>
              <span>{t('common.search_footer_nav')}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
