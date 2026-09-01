'use client';

import React, { useState, useMemo } from 'react';
import {
  Users,
  CheckCircle2,
  Clock,
  Download,
  Search,
  UserCheck,
  Shield,
  GraduationCap,
} from 'lucide-react';

export interface WaitlistRecord {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  exam_type: string | null;
  target_exam_year: number | null;
  signup_role: string | null;
  is_minor: boolean;
  guardian_consent_acknowledged: boolean;
  email_verified: boolean;
  created_at: string;
  verified_at: string | null;
}

interface WaitlistTableProps {
  initialRecords: WaitlistRecord[];
}

export function WaitlistTable({ initialRecords }: WaitlistTableProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | 'student' | 'guardian'>('all');
  const [examFilter, setExamFilter] = useState<'all' | 'HSC' | 'SSC'>('all');

  const stats = useMemo(() => {
    const total = initialRecords.length;
    const verified = initialRecords.filter((r) => r.email_verified).length;
    const unverified = total - verified;
    const guardians = initialRecords.filter((r) => r.signup_role === 'guardian').length;
    const students = initialRecords.filter((r) => r.signup_role === 'student').length;
    const hsc = initialRecords.filter((r) => r.exam_type === 'HSC').length;
    const ssc = initialRecords.filter((r) => r.exam_type === 'SSC').length;

    return { total, verified, unverified, guardians, students, hsc, ssc };
  }, [initialRecords]);

  const filtered = useMemo(() => {
    return initialRecords.filter((r) => {
      if (statusFilter === 'verified' && !r.email_verified) return false;
      if (statusFilter === 'unverified' && r.email_verified) return false;
      if (roleFilter !== 'all' && r.signup_role !== roleFilter) return false;
      if (examFilter !== 'all' && r.exam_type !== examFilter) return false;

      if (search.trim()) {
        const q = search.toLowerCase();
        const matchesName = r.full_name?.toLowerCase().includes(q);
        const matchesEmail = r.email?.toLowerCase().includes(q);
        const matchesPhone = r.phone?.toLowerCase().includes(q);
        return matchesName || matchesEmail || matchesPhone;
      }
      return true;
    });
  }, [initialRecords, search, statusFilter, roleFilter, examFilter]);

  const exportCSV = () => {
    const headers = [
      'ID',
      'Full Name',
      'Email',
      'Email Verified',
      'Phone',
      'Role',
      'Exam Type',
      'Target Year',
      'Is Minor',
      'Guardian Consent',
      'Created At',
      'Verified At',
    ];

    const rows = filtered.map((r) => [
      `"${r.id}"`,
      `"${(r.full_name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      r.email_verified ? 'YES' : 'NO',
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      r.signup_role || 'student',
      r.exam_type || 'HSC',
      r.target_exam_year || 2026,
      r.is_minor ? 'YES' : 'NO',
      r.guardian_consent_acknowledged ? 'YES' : 'NO',
      `"${r.created_at || ''}"`,
      `"${r.verified_at || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      `sheratutor-waitlist-${new Date().toISOString().split('T')[0]}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Metric summary cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Total Signups</span>
            <Users size={16} className="text-primary" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{stats.total}</p>
          <p className="mt-1 text-xs text-muted-foreground">All time registrations</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Verified (Double Opt-in)</span>
            <CheckCircle2 size={16} className="text-mint" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-mint">{stats.verified}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.total > 0 ? Math.round((stats.verified / stats.total) * 100) : 0}% verification rate
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Pending Verification</span>
            <Clock size={16} className="text-sun" />
          </div>
          <p className="mt-2 text-2xl font-bold tracking-tight text-sun">{stats.unverified}</p>
          <p className="mt-1 text-xs text-muted-foreground">Awaiting inbox confirmation</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">Audience Breakdown</span>
            <GraduationCap size={16} className="text-coral" />
          </div>
          <p className="mt-2 text-base font-bold tracking-tight text-foreground">
            {stats.students} Students &middot; {stats.guardians} Parents
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.hsc} HSC &middot; {stats.ssc} SSC
          </p>
        </div>
      </div>

      {/* Control bar: search, filters, export */}
      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="guardian">Guardian</option>
          </select>

          <select
            value={examFilter}
            onChange={(e) => setExamFilter(e.target.value as any)}
            className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none"
          >
            <option value="all">All Exams</option>
            <option value="HSC">HSC</option>
            <option value="SSC">SSC</option>
          </select>

          <button
            onClick={exportCSV}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
          >
            <Download size={14} /> Export CSV ({filtered.length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-border bg-muted/40 font-mono font-semibold uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3">User & Role</th>
                <th className="px-4 py-3">Email Status</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Exam / Year</th>
                <th className="px-4 py-3">Consent</th>
                <th className="px-4 py-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                    No waitlist signups match the selected criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((record) => (
                  <tr key={record.id} className="transition-colors hover:bg-muted/25">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{record.full_name}</div>
                      <div className="text-3xs font-mono uppercase text-muted-foreground">
                        {record.signup_role === 'guardian' ? 'Guardian / Parent' : 'Student'}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-foreground">{record.email}</div>
                      <div className="mt-0.5">
                        {record.email_verified ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-mint/15 px-2 py-0.5 text-3xs font-semibold text-mint">
                            <CheckCircle2 size={10} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-2 py-0.5 text-3xs font-semibold text-sun">
                            <Clock size={10} /> Pending
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-mono text-muted-foreground">
                      {record.phone || '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-foreground">{record.exam_type || 'HSC'}</span>
                      <span className="text-muted-foreground"> &middot; {record.target_exam_year || 2026}</span>
                    </td>
                    <td className="px-4 py-3">
                      {record.guardian_consent_acknowledged ? (
                        <span className="inline-flex items-center gap-1 text-mint" title="Guardian consent acknowledged">
                          <Shield size={12} /> Yes
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(record.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
