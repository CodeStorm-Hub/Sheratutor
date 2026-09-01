import React from 'react';
import { redirect } from 'next/navigation';
import { getUser } from '@/lib/supabase/auth';
import { getServiceRoleClient } from '@/lib/supabase/service-role';
import { WaitlistTable, type WaitlistRecord } from './waitlist-table';
import { Users, ShieldAlert } from 'lucide-react';

export const metadata = {
  title: 'Waitlist Operations — SheraTutor Admin',
  description: 'Manage and export waitlist registrations and double opt-in verifications.',
};

export default async function AdminWaitlistPage() {
  const { user } = await getUser();

  if (!user) {
    redirect('/login');
  }

  const adminEmails = [
    'syed.salman.reza.181@gmail.com',
    ...(process.env.ADMIN_EMAILS ? process.env.ADMIN_EMAILS.split(',').map((e) => e.trim().toLowerCase()) : []),
  ];

  const isAdmin = Boolean(user.email && adminEmails.includes(user.email.toLowerCase()));

  if (!isAdmin) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <ShieldAlert size={32} />
        </div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
          Access Restricted
        </h1>
        <p className="mt-2 max-w-md text-xs leading-relaxed text-muted-foreground">
          This administration dashboard is restricted to SheraTutor authorized management accounts ({user.email}).
        </p>
      </div>
    );
  }

  // Fetch all waitlist signups securely using service role
  const supabase = getServiceRoleClient();
  const { data: signups, error } = await supabase
    .from('waitlist_signups')
    .select(
      'id, full_name, email, phone, exam_type, target_exam_year, signup_role, is_minor, guardian_consent_acknowledged, email_verified, created_at, verified_at'
    )
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[AdminWaitlistFetchError]', error);
  }

  const records: WaitlistRecord[] = (signups || []).map((row) => ({
    id: row.id,
    full_name: row.full_name,
    email: row.email,
    phone: row.phone,
    exam_type: row.exam_type,
    target_exam_year: row.target_exam_year,
    signup_role: row.signup_role,
    is_minor: row.is_minor,
    guardian_consent_acknowledged: row.guardian_consent_acknowledged,
    email_verified: Boolean(row.email_verified),
    created_at: row.created_at,
    verified_at: row.verified_at,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex size-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
              <Users size={16} />
            </span>
            <h1 className="font-heading text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Waitlist Operations
            </h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Monitor real-time student and parent registrations, double opt-in confirmations, and export data.
          </p>
        </div>
      </div>

      <WaitlistTable initialRecords={records} />
    </div>
  );
}
