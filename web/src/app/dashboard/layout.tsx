import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav } from "@/components/dashboard-nav";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="h-dvh flex flex-col md:flex-row bg-background overflow-hidden">
      <DashboardNav />
      {/* Padding and max-width live on each page now, not here — a full-bleed
          page (like the tutor chat) needs to opt out of both, which isn't
          possible when a shared wrapper forces them on every route. */}
      <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
    </div>
  );
}
