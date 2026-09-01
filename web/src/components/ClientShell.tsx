'use client';

import React, { useState, Suspense } from 'react';
import { SidebarContent } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet';

export const ClientShell: React.FC<{
  children: React.ReactNode;
  userName?: string;
  userSub?: string;
  userInitials?: string;
  isAdmin?: boolean;
}> = ({ children, userName, userSub, userInitials, isAdmin = false }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-sidebar-border bg-sidebar lg:block">
        <Suspense fallback={<div className="h-full w-full bg-sidebar" />}>
          <SidebarContent userName={userName} userSub={userSub} isAdmin={isAdmin} />
        </Suspense>
      </aside>

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

      <div className="lg:pl-64">
        <Suspense fallback={<header className="sticky top-0 z-30 flex h-16 w-full items-center border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-10" />}>
          <Header
            onMenuClick={() => setMobileOpen(true)}
            userInitials={userInitials}
            userName={userName}
            userSub={userSub}
          />
        </Suspense>
        <main className="mx-auto w-full max-w-[1400px] px-4 pt-6 pb-16 sm:px-6 lg:px-10">
          {children}
        </main>
      </div>
    </div>
  );
};
