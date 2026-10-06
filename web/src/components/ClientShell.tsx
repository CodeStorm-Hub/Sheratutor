'use client';

import React, { useState, Suspense } from 'react';
import { usePathname } from 'next/navigation';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { SidebarContent } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';
import { useLanguage } from '@/context/LanguageContext';

function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPlayground = pathname?.startsWith('/dashboard/playground');

  return (
    <main
      className={`mx-auto w-full pt-6 pb-16 transition-all duration-300 ${
        isPlayground
          ? 'max-w-[1720px] px-3 sm:px-6 lg:px-8'
          : 'max-w-[1400px] px-4 pt-6 pb-16 sm:px-6 lg:px-10'
      }`}
    >
      {children}
    </main>
  );
}

export const ClientShell: React.FC<{
  children: React.ReactNode;
  userName?: string;
  userSub?: string;
  userInitials?: string;
  isAdmin?: boolean;
}> = ({ children, userName, userSub, userInitials, isAdmin = false }) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-in-out lg:block ${
          desktopSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <Suspense fallback={<div className="h-full w-full bg-sidebar" />}>
          <SidebarContent userName={userName} userSub={userSub} isAdmin={isAdmin} />
        </Suspense>

        {/* Desktop collapse button at header alignment edge */}
        <button
          onClick={() => setDesktopSidebarOpen(false)}
          className="absolute -right-3 top-5 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-sidebar-border bg-sidebar text-muted-foreground shadow-xs hover:text-foreground hover:bg-surface-2 transition-all hover:scale-110 active:scale-95 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          title={isBn ? 'ড্যাশবোর্ড সাইডবার লুকান' : 'Collapse sidebar'}
          aria-label={isBn ? 'ড্যাশবোর্ড সাইডবার লুকান' : 'Collapse sidebar'}
        >
          <PanelLeftClose className="h-3.5 w-3.5" />
        </button>
      </aside>

      {/* Floating expand button when desktop sidebar is collapsed */}
      {!desktopSidebarOpen && (
        <button
          onClick={() => setDesktopSidebarOpen(true)}
          className="fixed left-3 top-4 z-50 hidden lg:flex h-8 w-8 items-center justify-center rounded-xl border border-border bg-card shadow-sm hover:bg-surface-2 text-foreground hover:text-cta transition-all hover:scale-105 active:scale-95 animate-in fade-in focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring"
          title={isBn ? 'ড্যাশবোর্ড সাইডবার খুলুন' : 'Expand sidebar'}
          aria-label={isBn ? 'ড্যাশবোর্ড সাইডবার খুলুন' : 'Expand sidebar'}
        >
          <PanelLeftOpen className="h-4 w-4" />
        </button>
      )}

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-72 gap-0 border-r border-sidebar-border bg-sidebar p-0 !animate-none !opacity-100 transition-transform duration-200 ease-out data-[state=closed]:-translate-x-full data-[state=open]:translate-x-0"
        >
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <Suspense fallback={<div className="h-full w-full bg-sidebar" />}>
            <SidebarContent
              userName={userName}
              userSub={userSub}
              isAdmin={isAdmin}
              onNavigate={() => setMobileOpen(false)}
            />
          </Suspense>
        </SheetContent>
      </Sheet>

      <div
        className={`transition-all duration-300 ${
          desktopSidebarOpen ? 'lg:pl-64' : 'lg:pl-0'
        }`}
      >
        <Suspense fallback={<header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-10" />}>
          <Header
            onMenuClick={() => setMobileOpen(true)}
            onDesktopSidebarToggle={() => setDesktopSidebarOpen(!desktopSidebarOpen)}
            desktopSidebarOpen={desktopSidebarOpen}
            userInitials={userInitials}
            userName={userName}
            userSub={userSub}
          />
        </Suspense>
        <Suspense
          fallback={
            <main
              aria-busy="true"
              aria-label="Loading content"
              className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-16 sm:px-6 lg:px-10"
            >
              <div className="animate-pulse space-y-4">
                <div className="h-8 w-1/3 rounded-lg bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="h-40 rounded-xl bg-muted" />
                  <div className="h-40 rounded-xl bg-muted" />
                  <div className="h-40 rounded-xl bg-muted" />
                </div>
              </div>
            </main>
          }
        >
          <MainContent>{children}</MainContent>
        </Suspense>
      </div>
    </div>
  );
};
