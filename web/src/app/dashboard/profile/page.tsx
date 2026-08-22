import { createClient } from '@/lib/supabase/server';
import { SettingsPageClient } from '@/components/pages/SettingsPageClient';

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('*')
    .eq('user_id', user!.id)
    .maybeSingle();

  return <SettingsPageClient profile={profile} />;
}
