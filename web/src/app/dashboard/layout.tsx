import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getUser } from '@/lib/supabase/auth';
import { ClientShell } from '@/components/ClientShell';

function ShellFallback({ children }: { children: React.ReactNode }) {
  return (
    <ClientShell
      userName=""
      userSub="Loading..."
      userInitials=""
    >
      {children}
    </ClientShell>
  );
}

async function AuthenticatedDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { user } = await getUser();

  if (!user) redirect('/login');

  // Check admin status
  const adminEmails = [
    'syed.salman.reza.181@gmail.com',
    ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()) : []),
  ];
  const isAdmin = Boolean(user.email && adminEmails.includes(user.email.toLowerCase()));

  // Fetch user profile and student profile in parallel
  const [{ data: userProfile }, { data: studentProfile }] = await Promise.all([
    supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .maybeSingle(),
    supabase
      .from('student_profiles')
      .select('id, exam_type, academic_group, education_board, target_exam_year')
      .eq('user_id', user.id)
      .maybeSingle(),
  ]);

  // Extract real full name
  const fullName =
    userProfile?.full_name ||
    (user.user_metadata?.full_name as string) ||
    (user.email ? user.email.split('@')[0] : 'Student');

  // Extract real exam & group subtitle
  const examType = studentProfile?.exam_type || 'HSC';
  const group = studentProfile?.academic_group
    ? studentProfile.academic_group.replace('_', ' ')
    : 'Science';
  const board = studentProfile?.education_board
    ? ` · ${studentProfile.education_board.charAt(0) + studentProfile.education_board.slice(1).toLowerCase()} Board`
    : '';

  const userSub = `${examType} · ${group}${board}`;

  // Extract initials dynamically
  const nameParts = fullName.trim().split(/\s+/);
  const initials =
    nameParts.length > 1
      ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase()
      : (nameParts[0]?.slice(0, 2) || 'ST').toUpperCase();

  return (
    <ClientShell
      userName={fullName}
      userSub={userSub}
      userInitials={initials}
      isAdmin={isAdmin}
    >
      {children}
    </ClientShell>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<ShellFallback>{children}</ShellFallback>}>
      <AuthenticatedDashboardShell>{children}</AuthenticatedDashboardShell>
    </Suspense>
  );
}
