'use client';

import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { useTheme } from '@/context/ThemeContext';

export const ClientShell: React.FC<{
  children: React.ReactNode;
  userName?: string;
  userSub?: string;
  userInitials?: string;
}> = ({ children, userName, userSub, userInitials }) => {
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div
      className={`app ${darkMode ? 'dark ' : ''}${
        collapsed ? 'nav-collapsed' : ''
      }`.trim()}
    >
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
            darkMode={darkMode}
            setDarkMode={setDarkMode}
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
