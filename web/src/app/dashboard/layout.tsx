import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ClientShell } from '@/components/ClientShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('full_name, exam_type, academic_group, education_board')
    .eq('user_id', user.id)
    .maybeSingle();

  const fullName =
    (user.user_metadata?.full_name as string) ||
    profile?.full_name ||
    'Anam Rahman';

  const userSub = profile
    ? `${profile.exam_type ?? 'HSC'} · ${(profile.academic_group ?? 'Science').replace('_', ' ')}`
    : 'HSC · Science';

  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AR';

  return (
    <ClientShell
      userName={fullName}
      userSub={userSub}
      userInitials={initials}
    >
      {children}
    </ClientShell>
  );
}
