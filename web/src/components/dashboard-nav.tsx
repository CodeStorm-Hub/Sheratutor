"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { signOut } from "@/app/actions/auth";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Upload,
  FileText,
  Sparkles,
  CalendarDays,
  User,
  LogOut,
  MoreHorizontal,
  FilePlus2,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_LINKS = [
  { href: "/dashboard", label: "ড্যাশবোর্ড", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "খাতা জমা দাও", icon: Upload },
  { href: "/dashboard/submissions", label: "ফলাফল", icon: FileText },
  { href: "/dashboard/tutor", label: "AI টিউটর", icon: Sparkles },
  { href: "/dashboard/study-plan", label: "পড়ার পরিকল্পনা", icon: CalendarDays },
  { href: "/dashboard/practice/generate", label: "প্রশ্নপত্র তৈরি করো", icon: FilePlus2 },
  { href: "/dashboard/profile", label: "প্রোফাইল", icon: User },
];

// Bottom tab bar: five thumb-reach targets. Upload is the primary action —
// raised and marked red, matching the examiner-red accent used everywhere
// else a decisive action happens. Everything else lives behind "আরও".
const TAB_LINKS = [
  { href: "/dashboard", label: "বাড়ি", icon: LayoutDashboard },
  { href: "/dashboard/submissions", label: "ফলাফল", icon: FileText },
  { href: "/dashboard/tutor", label: "টিউটর", icon: Sparkles },
];

const MORE_LINKS = [
  { href: "/dashboard/study-plan", label: "পড়ার পরিকল্পনা", icon: CalendarDays },
  { href: "/dashboard/practice/generate", label: "প্রশ্নপত্র তৈরি করো", icon: FilePlus2 },
  { href: "/dashboard/profile", label: "প্রোফাইল", icon: User },
];

function isActive(pathname: string, href: string) {
  return href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

function SidebarLinks({ collapsed }: { collapsed: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 flex flex-col gap-1 p-3">
      {SIDEBAR_LINKS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            title={collapsed ? label : undefined}
            aria-label={collapsed ? label : undefined}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              collapsed && "justify-center px-0",
              active
                ? "bg-primary/10 text-primary font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOutButton({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="p-3 border-t border-border space-y-2">
      {!collapsed && <ThemeToggle />}
      <form action={signOut}>
        <Button
          variant="ghost"
          size="sm"
          type="submit"
          title={collapsed ? "সাইন আউট" : undefined}
          aria-label={collapsed ? "সাইন আউট" : undefined}
          className={cn("w-full gap-2.5 text-muted-foreground", collapsed ? "justify-center px-0" : "justify-start")}
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && "সাইন আউট"}
        </Button>
      </form>
    </div>
  );
}

function MoreSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const pathname = usePathname();
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p-0 rounded-t-2xl">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="text-sm eyebrow text-muted-foreground">আরও</SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col p-3 pt-0 gap-1">
          {MORE_LINKS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active ? "bg-primary/10 text-primary" : "text-foreground hover:bg-muted"
                )}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {label}
              </Link>
            );
          })}
          <div className="pt-2 mt-1 border-t border-border">
            <ThemeToggle className="mb-1" />
            <form action={signOut}>
              <Button variant="ghost" size="sm" type="submit" className="w-full justify-start gap-3 text-muted-foreground px-3 py-2.5 h-auto">
                <LogOut className="w-4 h-4" />
                সাইন আউট
              </Button>
            </form>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export function DashboardNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar — collapses to an icon-only rail so pages that want
          the width (like the tutor chat) can reclaim it on large screens. */}
      <aside
        className={cn(
          "hidden md:flex md:flex-col md:border-r md:border-border md:shrink-0 transition-[width] duration-150",
          collapsed ? "md:w-16" : "md:w-60"
        )}
      >
        <div className={cn("flex items-center border-b border-border p-4", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <Link href="/dashboard">
              <Logo />
            </Link>
          )}
          <button
            type="button"
            onClick={() => setCollapsed((v) => !v)}
            title={collapsed ? "সাইডবার খোলো" : "সাইডবার সংকুচিত করো"}
            aria-label={collapsed ? "সাইডবার খোলো" : "সাইডবার সংকুচিত করো"}
            className="text-muted-foreground hover:text-foreground hover:bg-muted rounded-md p-1.5 transition-colors shrink-0"
          >
            {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>
        <SidebarLinks collapsed={collapsed} />
        <SignOutButton collapsed={collapsed} />
      </aside>

      {/* Mobile top bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border">
        <Link href="/dashboard">
          <Logo />
        </Link>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/95 backdrop-blur supports-backdrop-filter:bg-card/80"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="grid grid-cols-5 items-end h-16 px-1">
          {TAB_LINKS.slice(0, 2).map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-full text-xs font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}

          <div className="flex items-start justify-center -mt-5">
            <Link
              href="/dashboard/upload"
              aria-label="খাতা জমা দাও"
              className="flex flex-col items-center gap-1 group"
            >
              <span className="flex items-center justify-center w-14 h-14 rounded-full bg-red text-white shadow-lg shadow-red/30 group-active:scale-95 transition-transform">
                <Upload className="w-6 h-6" />
              </span>
              <span className="text-xs font-medium text-red">জমা দাও</span>
            </Link>
          </div>

          {TAB_LINKS.slice(2).map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex flex-col items-center justify-center gap-0.5 h-full text-xs font-medium",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="w-5 h-5" />
                {label}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 h-full text-xs font-medium",
              MORE_LINKS.some((l) => isActive(pathname, l.href)) ? "text-primary" : "text-muted-foreground"
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            আরও
          </button>
        </div>
      </nav>

      <MoreSheet open={moreOpen} onOpenChange={setMoreOpen} />
    </>
  );
}
