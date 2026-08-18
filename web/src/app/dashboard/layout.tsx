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
    <div className="min-h-full flex flex-col md:flex-row bg-background">
      <DashboardNav />
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto w-full">{children}</div>
      </main>
    </div>
  );
}
