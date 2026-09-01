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
  userInitials?: string;
  userName?: string;
  userSub?: string;
}

export const Header: React.FC<HeaderProps> = ({
  onMenuClick,
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
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-10">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label={language === 'bn' ? 'মেনু খোলো' : 'Open menu'}
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground">
          <span className="hidden sm:inline">{t('common.workspace')}</span>
          <ChevronRight className="hidden size-3.5 sm:inline" />
          <span className="truncate font-semibold text-foreground">{pageTitle}</span>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <LanguageToggle />

          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label={language === 'bn' ? 'খোঁজো' : 'Search'}
            className="hidden items-center gap-2 rounded-lg border border-border bg-surface-1 px-2.5 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground md:flex"
          >
            <Search className="size-4" />
            <span className="hidden max-w-[160px] truncate lg:inline">
              {t('common.search_placeholder')}
            </span>
            <kbd className="ml-1 rounded border border-border px-1 font-mono text-3xs font-medium">
              {isMac ? '⌘K' : 'Ctrl K'}
            </kbd>
          </button>

          {/* Theme */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label={language === 'bn' ? 'থিম' : 'Theme'} suppressHydrationWarning>
                {themeMounted && resolvedTheme === 'dark' ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {([
                ['light', Sun, t('common.light_mode', 'Light')],
                ['dark', Moon, t('common.dark_mode', 'Dark')],
                ['system', Monitor, language === 'bn' ? 'সিস্টেম' : 'System'],
              ] as const).map(([value, Icon, label]) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setTheme(value)}
                  className={cn(themeChoice === value && 'bg-accent text-accent-foreground')}
                >
                  <Icon className="size-4" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative" aria-label={t('common.notifications', 'Notifications')}>
                <Bell className="size-[18px]" />
                {hasUnread && <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-cta ring-2 ring-background" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <div className="flex items-center justify-between px-1 py-1">
                <DropdownMenuLabel className="p-0">{t('common.notifications', 'Notifications')}</DropdownMenuLabel>
                {hasUnread && (
                  <button
                    type="button"
                    className="text-xs font-medium text-cta hover:underline"
                    onClick={() => setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))}
                  >
                    {t('common.mark_all_read', 'Mark all read')}
                  </button>
                )}
              </div>
              <DropdownMenuSeparator />
              {notifications.length === 0 ? (
                <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                  {language === 'bn' ? 'নতুন কোনো নোটিফিকেশন নেই' : 'No new notifications'}
                </p>
              ) : (
                <div className="max-h-72 overflow-y-auto">
                  {notifications.map((n) => (
                    <DropdownMenuItem key={n.id} asChild className="items-start gap-2.5 py-2">
                      <Link href={n.href as Route}>
                        <span className="mt-0.5 grid size-5 flex-none place-items-center rounded-full bg-accent2/15 text-2xs text-accent2">
                          ✓
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-semibold">{n.title}</span>
                          <span className="block text-xs text-muted-foreground">{n.desc}</span>
                          <span className="mt-0.5 block font-mono text-3xs text-muted-foreground">{n.time}</span>
                        </span>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/submissions" className="justify-between">
                  {t('common.see_all', 'See all')}
                  <ChevronRight className="size-3.5" />
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                aria-label={language === 'bn' ? 'অ্যাকাউন্ট মেনু' : 'Account menu'}
                className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Avatar className="size-9">
                  <AvatarFallback className="bg-navy text-xs font-bold text-surface-1">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <div className="flex items-center gap-2.5 p-2">
                <Avatar className="size-10">
                  <AvatarFallback className="bg-navy text-xs font-bold text-surface-1">{userInitials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{userName}</p>
                  <p className="truncate text-xs text-muted-foreground">{userSub}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              {[
                { href: '/dashboard/profile', icon: User, label: t('nav.settings') },
                { href: '/dashboard/study-plan', icon: Calendar, label: t('nav.planner') },
                { href: '/dashboard/achievements', icon: Trophy, label: t('nav.achievements') },
                { href: '/dashboard/submissions', icon: LineChart, label: t('nav.results') },
              ].map((row) => (
                <DropdownMenuItem key={row.href} asChild>
                  <Link href={row.href as Route}>
                    <row.icon className="size-4" />
                    {row.label}
                  </Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild variant="destructive">
                <button type="button" className="w-full" onClick={() => signOut()}>
                  <LogOut className="size-4" />
                  {t('common.sign_out', 'Sign out')}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent showCloseButton={false} className="gap-0 overflow-hidden p-0 sm:max-w-lg">
          <DialogTitle className="sr-only">{t('common.search_title', 'Search')}</DialogTitle>
          <div className="flex items-center gap-2.5 border-b border-border px-4">
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
              className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          <div className="max-h-80 overflow-y-auto p-2">
            <p className="px-2 py-1.5 font-mono text-2xs font-bold tracking-wide text-muted-foreground uppercase">
              {t('common.search_title', 'Quick links')}
            </p>
            {filtered.length === 0 ? (
              <p className="px-2 py-6 text-center text-sm text-muted-foreground">
                {t('common.search_empty', 'Nothing found')}
              </p>
            ) : (
              filtered.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  onClick={() => setSearchOpen(false)}
                  className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-accent"
                >
                  <span className="grid size-8 flex-none place-items-center rounded-lg bg-accent text-muted-foreground">
                    <item.icon className="size-[17px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.label}</span>
                    <span className="block truncate text-xs text-muted-foreground">{item.desc}</span>
                  </span>
                  <ChevronRight className="size-4 flex-none text-muted-foreground" />
                </Link>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
