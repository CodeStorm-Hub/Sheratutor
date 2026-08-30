'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';

export const ClientShell: React.FC<{
  children: React.ReactNode;
  userName?: string;
  userSub?: string;
  userInitials?: string;
}> = ({ children, userName, userSub, userInitials }) => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  // Theme is applied by next-themes on <html> (the legacy `.dark` descendant
  // selectors match from there); no need to mirror it onto `.app`, which would
  // only reintroduce a hydration mismatch.
  return (
    <div className={`app ${collapsed ? 'nav-collapsed' : ''}`.trim()}>
      {/* Mobile Drawer Backdrop */}
      {open && (
        <div
          className="sidebar-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Close sidebar overlay"
        />
      )}

      <Sidebar
        open={open}
        setOpen={setOpen}
        collapsed={collapsed}
        userName={userName}
        userSub={userSub}
      />
      <main>
        <div className="main-canvas">
          <Header
            collapsed={collapsed}
            setCollapsed={setCollapsed}
            setOpen={setOpen}
            userInitials={userInitials}
            userName={userName}
            userSub={userSub}
          />
          {children}
        </div>
      </main>
    </div>
  );
};
