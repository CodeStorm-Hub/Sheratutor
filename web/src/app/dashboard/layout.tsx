import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardNav, DashboardMobileHeader } from "@/components/dashboard-nav";
import { DashboardBreadcrumbs } from "@/components/dashboard-breadcrumbs";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default async function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <SidebarProvider>
      <DashboardNav />
      <SidebarInset>
        <DashboardMobileHeader />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8 overflow-y-auto">
          <div className="max-w-5xl 2xl:max-w-7xl mx-auto w-full">
            <DashboardBreadcrumbs />
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
