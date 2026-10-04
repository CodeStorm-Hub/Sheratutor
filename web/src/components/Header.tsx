'use client';

import React, { useState, useEffect } from 'react';
import type { Route } from 'next';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Bell,
  Calendar,
  ChevronRight,
  LineChart,
  LogOut,
  Menu,
  Monitor,
  Moon,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Sparkles,
  Sun,
  Trophy,
  User,
} from 'lucide-react';
import { signOut } from '@/app/actions/auth';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface NotificationItem {
  id: string;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  href: string;
}

interface HeaderProps {
  onMenuClick: () => void;
  onDesktopSidebarToggle?: () => void;
  desktopSidebarOpen?: boolean;
  userInitials?: string;
  userName?: string;
  userSub?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
  onDesktopSidebarToggle,
  desktopSidebarOpen = true,
  userInitials = 'ST',
  userName = 'Student',
  userSub = 'HSC · Science',
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { mounted: themeMounted, resolvedTheme, theme, setTheme } = useTheme();
  const supabase = createClient();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    if (typeof navigator !== 'undefined') {
      setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
    }
  }, []);

  // Live "grading complete" notifications.
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'exam_submissions', filter: 'status=eq.GRADED' },
        (payload) => {
          setNotifications((prev) => [
            {
              id: String(payload.new.id),
              title: language === 'bn' ? 'খাতা মূল্যায়ন সম্পন্ন হয়েছে!' : 'Paper grading complete',
              desc:
                language === 'bn'
                  ? 'তোমার পরীক্ষার খাতাটি মূল্যায়ন করা হয়েছে। ফলাফল দেখতে ক্লিক করো।'
                  : 'Your exam paper has been graded. Tap to see the result.',
              time: language === 'bn' ? 'এইমাত্র' : 'Just now',
              unread: true,
              href: `/dashboard/submissions/${payload.new.id}`,
            },
            ...prev,
          ]);
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, language]);

  // ⌘K / Ctrl-K opens search.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const routeTitles: Record<string, string> = {
    '/dashboard': t('nav.home'),
    '/dashboard/playground/v2': language === 'bn' ? 'খেলার মাঠ (Playground V2)' : 'Playground V2',
    '/dashboard/playground': language === 'bn' ? 'খেলার মাঠ (Playground V2)' : 'Playground V2',
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
    '/dashboard/admin/waitlist': language === 'bn' ? 'প্রশাসন ও ওয়েটলিস্ট' : 'Waitlist Ops',
  };

  const quickLinks = [
    { label: t('nav.playground'), href: '/dashboard/playground/v2', icon: Sparkles, desc: language === 'bn' ? 'ভার্চুয়াল ল্যাব ও সিমুলেশন' : 'Virtual labs & interactive simulations' },
    { label: t('nav.tutor'), href: '/dashboard/tutor', icon: Sparkles, desc: language === 'bn' ? 'প্রশ্ন জিজ্ঞাসা করো ও ধারণা বোঝো' : 'Ask questions & learn concepts' },
    { label: t('nav.grading'), href: '/dashboard/upload', icon: User, desc: language === 'bn' ? 'হাতে লেখা খাতা জমা দাও' : 'Submit written answer scripts' },
    { label: t('nav.exams'), href: '/dashboard/practice', icon: LineChart, desc: language === 'bn' ? 'বোর্ড স্ট্যান্ডার্ড প্রশ্ন অনুশীলন' : 'Practice board question papers' },
    { label: t('nav.simulator'), href: '/dashboard/board-simulator', icon: Trophy, desc: language === 'bn' ? 'টাইমারযুক্ত পূর্ণাঙ্গ বোর্ড পরীক্ষা' : 'Full timed board exam simulation' },
    { label: t('nav.planner'), href: '/dashboard/study-plan', icon: Calendar, desc: language === 'bn' ? 'আজকের অ্যাডাপ্টিভ কাজ দেখো' : "View today's adaptive tasks" },
    { label: t('nav.mistakes'), href: '/dashboard/mistake-analysis', icon: LineChart, desc: language === 'bn' ? 'নম্বর পুনরুদ্ধারের বিশ্লেষণ' : 'Review marks recovery' },
    { label: t('nav.achievements'), href: '/dashboard/achievements', icon: Trophy, desc: language === 'bn' ? 'এক্সপি পয়েন্ট ও ব্যাজ' : 'XP points & badges' },
    { label: t('nav.settings'), href: '/dashboard/profile', icon: User, desc: language === 'bn' ? 'বোর্ড, বিভাগ ও পছন্দসমূহ' : 'Board, group & preferences' },
  ];

  let pageTitle = t('common.workspace');
  for (const [route, title] of Object.entries(routeTitles)) {
    if (pathname === route || (route !== '/dashboard' && pathname.startsWith(route))) {
      pageTitle = title;
      break;
    }
  }

  const filtered = quickLinks.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.href.toLowerCase().includes(q)
    );
  });

  const hasUnread = notifications.some((n) => n.unread);
  const themeChoice = theme ?? 'system';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-2.5 sm:gap-3 border-b border-border/80 bg-background/85 px-3.5 sm:px-6 lg:px-8 backdrop-blur-md">
        {/* Mobile menu drawer trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden rounded-xl hover:bg-surface-2 active:scale-95"
          onClick={onMenuClick}
          aria-label={language === 'bn' ? 'মেনু খোলো' : 'Open menu'}
        >
          <Menu className="size-5" />
        </Button>

        {/* Desktop sidebar rail toggle */}
        {onDesktopSidebarToggle && (
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex rounded-xl hover:bg-surface-2 active:scale-95 transition-all text-muted-foreground hover:text-foreground"
            onClick={onDesktopSidebarToggle}
            aria-label={
              desktopSidebarOpen
                ? language === 'bn'
                  ? 'সাইডবার লুকান'
                  : 'Collapse sidebar'
                : language === 'bn'
                ? 'সাইডবার প্রসারিত করুন'
                : 'Expand sidebar'
            }
            title={
              desktopSidebarOpen
                ? language === 'bn'
                  ? 'সাইডবার লুকান'
                  : 'Collapse sidebar'
                : language === 'bn'
                ? 'সাইডবার প্রসারিত করুন'
                : 'Expand sidebar'
            }
          >
            {desktopSidebarOpen ? <PanelLeftClose className="size-5" /> : <PanelLeftOpen className="size-5" />}
          </Button>
        )}

        {/* Tactile Breadcrumb */}
        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 font-medium hover:bg-surface-2 hover:text-foreground transition-colors"
          >
            <span>{t('common.workspace')}</span>
          </Link>
          <ChevronRight className="hidden size-3.5 text-muted-foreground/60 sm:inline flex-none" />
          <span className="truncate font-semibold text-foreground bg-surface-2/60 dark:bg-surface-2/80 px-2 py-0.5 rounded-md border border-border/50 text-[11px] sm:text-xs shadow-2xs">
            {pageTitle}
          </span>
        </div>

        {/* Right Action Stack */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Language Switcher */}
          <LanguageToggle />

          {/* Desktop Search Button */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={language === 'bn' ? 'অনুসন্ধান' : 'Search'}
            className="hidden md:flex items-center gap-2.5 rounded-xl border border-border/70 bg-surface-1/70 dark:bg-surface-2/60 px-2.5 py-1.5 text-xs text-muted-foreground transition-all hover:border-cta/40 hover:bg-surface-2 hover:text-foreground shadow-2xs active:scale-[0.98]"
          >
            <Search className="size-3.5 text-muted-foreground/80 flex-none" />
            <span className="hidden max-w-[140px] lg:max-w-[190px] truncate sm:inline">
              {t('common.search_placeholder')}
            </span>
            <kbd className="ml-1 inline-flex items-center rounded-md border border-border/80 bg-surface-2 dark:bg-surface-3 px-1.5 py-0.5 font-mono text-3xs font-bold text-muted-foreground/90 shadow-2xs">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          {/* Mobile Search Icon Button */}
          <Button
            variant="outline"
            size="icon"
            className="flex md:hidden rounded-xl border-border/70 bg-surface-1/70 hover:bg-surface-2 active:scale-95"
            onClick={() => setSearchOpen(true)}
            aria-label={language === 'bn' ? 'অনুসন্ধান' : 'Search'}
          >
            <Search className="size-4" />
          </Button>

          {/* Theme Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-xl border-border/70 bg-surface-1/70 hover:bg-surface-2 hover:text-foreground active:scale-95 transition-all"
                aria-label={language === 'bn' ? 'থিম' : 'Theme'}
                suppressHydrationWarning
              >
                {themeMounted && resolvedTheme === 'dark' ? (
                  <Sun className="size-[18px] text-amber-400" />
                ) : (
                  <Moon className="size-[18px] text-indigo-400" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl border-border/80 p-1 shadow-md">
              {([
                ['light', Sun, t('common.light_mode', 'Light')],
                ['dark', Moon, t('common.dark_mode', 'Dark')],
                ['system', Monitor, language === 'bn' ? 'সিস্টেম' : 'System'],
              ] as const).map(([value, Icon, label]) => {
                const isSelected = themeChoice === value;
                return (
                  <DropdownMenuItem
                    key={value}
                    onClick={() => setTheme(value)}
                    className={cn(
                      'flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-medium cursor-pointer transition-colors',
                      isSelected
                        ? 'bg-cta/15 text-cta font-semibold'
                        : 'hover:bg-surface-2 text-foreground',
                    )}
                  >
                    <Icon className={cn('size-4', isSelected ? 'text-cta' : 'text-muted-foreground')} />
                    <span className="flex-1">{label}</span>
                    {isSelected && <span className="size-1.5 rounded-full bg-cta" />}
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications Bell */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative rounded-xl border-border/70 bg-surface-1/70 hover:bg-surface-2 hover:text-foreground active:scale-95 transition-all"
                aria-label={t('common.notifications', 'Notifications')}
              >
                <Bell className="size-[18px]" />
                {hasUnread && (
                  <span className="absolute top-1.5 right-1.5 flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cta opacity-75" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-cta ring-2 ring-background" />
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-xl border-border/80 p-1.5 shadow-xl">
              <div className="flex items-center justify-between px-2 py-1.5">
                <div className="flex items-center gap-1.5">
                  <DropdownMenuLabel className="p-0 text-xs font-bold text-foreground">
                    {t('common.notifications', 'Notifications')}
                  </DropdownMenuLabel>
                  {hasUnread && (
                    <span className="rounded-full bg-cta/15 px-1.5 py-0.2 font-mono text-3xs font-bold text-cta">
                      {notifications.filter((n) => n.unread).length}
                    </span>
                  )}
                </div>
                {hasUnread && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-cta hover:underline cursor-pointer"
                    onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                  >
                    {t('common.mark_all_read', 'Mark all read')}
                  </button>
                )}
              </div>
              <DropdownMenuSeparator className="my-1" />
              {notifications.length === 0 ? (
                <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                  {language === 'bn' ? 'নতুন কোনো নোটিফিকেশন নেই' : 'No new notifications'}
                </p>
              ) : (
                <div className="max-h-72 overflow-y-auto space-y-1">
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} asChild className="items-start gap-2.5 rounded-lg p-2 cursor-pointer">
                      <Link href={n.href as Route}>
                        <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-accent2/15 text-2xs text-accent2">
                          ✓
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-semibold text-foreground">{n.title}</span>
                          <span className="block text-xs text-muted-foreground line-clamp-2">{n.desc}</span>
                          <span className="mt-0.5 block font-mono text-3xs text-muted-foreground">{n.time}</span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild className="rounded-lg py-1.5 cursor-pointer">
                <Link href="/dashboard/submissions" className="justify-between text-xs font-semibold text-muted-foreground hover:text-foreground">
                  {t('common.see_all', 'See all')}
                  <ChevronRight className="size-3.5" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Student Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={language === 'bn' ? 'অ্যাকাউন্ট মেনু' : 'Account menu'}
                className="group rounded-xl outline-hidden focus-visible:ring-2 focus-visible:ring-ring active:scale-95 transition-transform"
              >
                <div className="relative">
                  <Avatar className="size-9 rounded-xl border border-border/80 shadow-xs transition-transform group-hover:scale-105">
                    <AvatarFallback className="bg-gradient-to-br from-[#FF6B57] to-amber-500 text-xs font-black text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 rounded-xl border-border/80 p-1.5 shadow-xl">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-surface-2/60 mb-1">
                <Avatar className="size-10 rounded-xl border border-border/60">
                  <AvatarFallback className="bg-gradient-to-br from-[#FF6B57] to-amber-500 text-xs font-black text-white">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-bold text-foreground">{userName}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{userSub}</p>
                </div>
              </div>
              <DropdownMenuSeparator className="my-1" />
              {[
                { href: '/dashboard/profile', icon: User, label: t('nav.settings') },
                { href: '/dashboard/study-plan', icon: Calendar, label: t('nav.planner') },
                { href: '/dashboard/achievements', icon: Trophy, label: t('nav.achievements') },
                { href: '/dashboard/submissions', icon: LineChart, label: t('nav.results') },
              ].map((row) => (
                <DropdownMenuItem key={row.href} asChild className="rounded-lg py-2 cursor-pointer">
                  <Link href={row.href as Route} className="flex items-center gap-2.5 text-xs font-medium">
                    <row.icon className="size-4 text-muted-foreground" />
                    <span>{row.label}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator className="my-1" />
              <DropdownMenuItem asChild variant="destructive" className="rounded-lg py-2 cursor-pointer">
                <button type="button" className="w-full flex items-center gap-2.5 text-xs font-medium" onClick={() => signOut()}>
                  <LogOut className="size-4" />
                  <span>{t('common.sign_out', 'Sign out')}</span>
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Global Command Palette / Search Dialog */}
      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-lg rounded-2xl border-border/80 shadow-2xl">
          <DialogTitle className="sr-only">{t('common.search_title', 'Search')}</DialogTitle>
          <div className="flex items-center gap-2.5 border-b border-border/70 bg-surface-1 px-4">
            <Search className="size-4 flex-none text-muted-foreground" />
            <input
              id="global-search-input"
              name="search"
              aria-label={language === 'bn' ? 'অনুসন্ধান' : 'Search'}
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                language === 'bn' ? 'টুল, বিষয়, পরীক্ষা বা সেটিংস খোঁজো…' : 'Search tools, exams, or settings…'
              }
              className="h-12 flex-1 bg-transparent text-sm outline-hidden placeholder:text-muted-foreground/70"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2 space-y-1">
            <p className="px-2 py-1 font-mono text-3xs font-bold tracking-wider text-muted-foreground uppercase">
              {t('common.search_title', 'Quick links')}
            </p>
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-xs text-muted-foreground">
                {t('common.search_empty', 'Nothing found')}
              </p>
            ) : (
              filtered.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  onClick={() => setSearchOpen(false)}
                  className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-left transition-all hover:bg-surface-2 active:scale-[0.99]"
                >
                  <span className="grid size-8 flex-none place-items-center rounded-lg bg-surface-2 text-muted-foreground group-hover:bg-cta/15 group-hover:text-cta transition-colors">
                    <item.icon className="size-4" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs sm:text-sm font-semibold text-foreground group-hover:text-cta transition-colors">
                      {item.label}
                    </span>
                    <span className="block truncate text-[11px] text-muted-foreground">{item.desc}</span>
                  </span>
                  <ChevronRight className="size-4 flex-none text-muted-foreground/60 transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </Link>
              ))
            )}
          </div>
          {/* Raycast-style keyboard footer */}
          <div className="flex items-center justify-between border-t border-border/60 bg-surface-2/40 px-3.5 py-2 font-mono text-3xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface-1 px-1 py-0.5 font-bold">↵</kbd>
                <span>{language === 'bn' ? 'নির্বাচন' : 'select'}</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <kbd className="rounded border border-border bg-surface-1 px-1 py-0.5 font-bold">↑↓</kbd>
                <span>{language === 'bn' ? 'ন্যাভিগেট' : 'navigate'}</span>
              </span>
            </div>
            <span className="inline-flex items-center gap-1">
              <kbd className="rounded border border-border bg-surface-1 px-1 py-0.5 font-bold">Esc</kbd>
              <span>{language === 'bn' ? 'বন্ধ করুন' : 'close'}</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
