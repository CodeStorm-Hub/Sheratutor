'use client';

import React, { useState } from 'react';
import { Moon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useTheme } from '@/context/ThemeContext';
import { updateProfile } from '@/app/actions/profile';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string | null;
  exam_type: 'HSC' | 'SSC' | null;
  academic_group: 'SCIENCE' | 'HUMANITIES' | 'BUSINESS_STUDIES' | string | null;
  education_board: string | null;
  target_exam_year?: number | null;
  training_data_opt_in?: boolean | null;
}

export function SettingsPageClient({ profile }: { profile: ProfileData | null }) {
  const [activeTab, setActiveTab] = useState('profile');
  const { darkMode, toggleDarkMode } = useTheme();

  const [fullName, setFullName] = useState(profile?.full_name || 'Anam Rahman');
  const [examType, setExamType] = useState<'HSC' | 'SSC'>(profile?.exam_type || 'HSC');
  const [group, setGroup] = useState<'SCIENCE' | 'HUMANITIES' | 'BUSINESS_STUDIES'>('SCIENCE');
  const [board, setBoard] = useState(profile?.education_board || 'DHAKA');
  const [targetExamYear, setTargetExamYear] = useState(profile?.target_exam_year || 2026);
  const [optIn, setOptIn] = useState(profile?.training_data_opt_in ?? false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.set('fullName', fullName);
      formData.set('examType', examType);
      formData.set('academicGroup', group);
      formData.set('educationBoard', board);
      formData.set('targetExamYear', String(targetExamYear));
      if (optIn) {
        formData.set('trainingDataOptIn', 'on');
      }

      const res = await updateProfile({ status: 'idle' }, formData);
      if (res.status === 'error') {
        toast.error(res.message || 'Failed to update settings');
      } else {
        toast.success('Settings updated successfully!');
      }
    } catch {
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AR';

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account, preferences, and personal details."
      >
        <button
          type="button"
          className="primary-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </PageHeader>

      <div className="settings-layout">
        <aside>
          <button
            type="button"
            className={activeTab === 'profile' ? 'active' : ''}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            type="button"
            className={activeTab === 'learning' ? 'active' : ''}
            onClick={() => setActiveTab('learning')}
          >
            Learning preferences
          </button>
          <button
            type="button"
            className={activeTab === 'notifications' ? 'active' : ''}
            onClick={() => setActiveTab('notifications')}
          >
            Notifications
          </button>
          <button
            type="button"
            className={activeTab === 'appearance' ? 'active' : ''}
            onClick={() => setActiveTab('appearance')}
          >
            Appearance
          </button>
          <button
            type="button"
            className={activeTab === 'privacy' ? 'active' : ''}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy & security
          </button>
        </aside>

        <section>
          <h2>Personal details</h2>
          <p>Update your photo and personal information.</p>

          <div className="profile-edit">
            <div className="large-avatar">{initials}</div>
            <div>
              <b>Profile photo</b>
              <p style={{ margin: '2px 0 8px', fontSize: 11, color: '#68718a' }}>
                Shown on your dashboard and report cards.
              </p>
              <button type="button">Change avatar</button>
            </div>
          </div>

          <label>
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Anam Rahman"
            />
          </label>

          <label>
            Exam Type
            <select
              value={examType}
              onChange={(e) => setExamType(e.target.value as 'HSC' | 'SSC')}
            >
              <option value="HSC">HSC (Higher Secondary)</option>
              <option value="SSC">SSC (Secondary School)</option>
            </select>
          </label>

          <label>
            Academic Group
            <select
              value={group}
              onChange={(e) => setGroup(e.target.value as 'SCIENCE' | 'HUMANITIES' | 'BUSINESS_STUDIES')}
            >
              <option value="SCIENCE">Science</option>
              <option value="HUMANITIES">Humanities</option>
              <option value="BUSINESS_STUDIES">Business Studies</option>
            </select>
          </label>

          <label>
            Target Board
            <select
              value={board}
              onChange={(e) => setBoard(e.target.value)}
            >
              <option value="DHAKA">Dhaka Board</option>
              <option value="CHITTAGONG">Chittagong Board</option>
              <option value="RAJSHAHI">Rajshahi Board</option>
              <option value="SYLHET">Sylhet Board</option>
              <option value="BARISAL">Barisal Board</option>
              <option value="COMILLA">Comilla Board</option>
              <option value="DINAJPUR">Dinajpur Board</option>
              <option value="JESSORE">Jessore Board</option>
              <option value="MYMENSINGH">Mymensingh Board</option>
              <option value="MADRASAH">Madrasah Board</option>
              <option value="TECHNICAL">Technical Board</option>
            </select>
          </label>

          <label>
            Target Exam Year
            <input
              type="number"
              value={targetExamYear}
              onChange={(e) => setTargetExamYear(Number(e.target.value))}
              min={2026}
              max={2030}
            />
          </label>

          <div style={{ margin: '18px 0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={optIn}
                onChange={(e) => setOptIn(e.target.checked)}
                style={{ width: 'auto', margin: 0 }}
              />
              <span>Opt-in to anonymous AI training data improvement (PDPA compliant)</span>
            </label>
          </div>

          <div className="appearance-toggle">
            <div>
              <b>
                <Moon size={15} /> Dark mode
              </b>
              <small>Toggle between light and dark themes.</small>
            </div>
            <button
              type="button"
              className={`theme-switch ${darkMode ? 'on' : ''}`.trim()}
              onClick={toggleDarkMode}
              aria-label="Toggle dark theme"
            >
              <i />
            </button>
          </div>

          <div style={{ marginTop: 24 }}>
            <button
              type="button"
              className="primary-btn"
              onClick={handleSave}
              disabled={saving}
              style={{ width: '100%', justifyContent: 'center' }}
            >
              {saving ? 'Saving changes…' : 'Save changes'}
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
