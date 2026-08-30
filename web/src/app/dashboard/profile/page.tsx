import { createClient } from '@/lib/supabase/server';
import { SettingsPageClient } from '@/components/pages/SettingsPageClient';

// TODO: Cache Components adoption. Refactor this route so this opt-out can be removed.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
export const instant = false;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: userProfile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user?.id ?? '')
    .maybeSingle();

  const { data: studentProfile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user?.id ?? '')
    .maybeSingle();

  const resolvedProfile = {
    full_name:
      userProfile?.full_name ||
      (user?.user_metadata?.full_name as string) ||
      (user?.email ? user.email.split('@')[0] : 'Student'),
    exam_type: studentProfile?.exam_type || 'HSC',
    academic_group: studentProfile?.academic_group || 'SCIENCE',
    education_board: studentProfile?.education_board || 'DHAKA',
    target_exam_year: studentProfile?.target_exam_year || 2026,
    training_data_opt_in: studentProfile?.training_data_opt_in ?? false,
  };

  return <SettingsPageClient profile={resolvedProfile} />;
}
