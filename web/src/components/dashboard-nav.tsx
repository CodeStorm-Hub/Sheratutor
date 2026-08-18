"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { signOut } from "@/app/actions/auth";
import { LayoutDashboard, Upload, FileText, Sparkles, CalendarDays, User, LogOut, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload script", icon: Upload },
  { href: "/dashboard/submissions", label: "Submissions", icon: FileText },
  { href: "/dashboard/tutor", label: "AI Tutor", icon: Sparkles },
  { href: "/dashboard/study-plan", label: "Study Plan", icon: CalendarDays },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 flex flex-col gap-1 p-3">
      {NAV_LINKS.map(({ href, label, icon: Icon }) => {
        const active = href === "/dashboard" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
              active
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function SignOutButton() {
  return (
    <form action={signOut} className="p-3 border-t border-border">
      <Button variant="ghost" size="sm" type="submit" className="w-full justify-start gap-2.5 text-muted-foreground">
        <LogOut className="w-4 h-4" />
        Sign out
      </Button>
    </form>
  );
}

export function DashboardNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-60 md:flex-col md:border-r md:border-border md:shrink-0">
        <Link href="/dashboard" className="p-4 border-b border-border">
          <Logo />
        </Link>
        <NavLinks />
        <SignOutButton />
      </aside>

      {/* Mobile top bar */}
      <header className="flex md:hidden items-center justify-between px-4 py-3 border-b border-border">
        <Link href="/dashboard">
          <Logo />
        </Link>
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SheetHeader className="p-4 border-b border-border">
              <SheetTitle>
                <Logo />
              </SheetTitle>
            </SheetHeader>
            <NavLinks onNavigate={() => setMobileOpen(false)} />
            <SignOutButton />
          </SheetContent>
        </Sheet>
      </header>
    </>
  );
}
