'use client';

import React, { useState } from 'react';
import { Globe, Moon, Sun } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
import { updateProfile } from '@/app/actions/profile';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProfileData {
  full_name: string | null;
  exam_type: 'HSC' | 'SSC' | null;
  academic_group: 'SCIENCE' | 'HUMANITIES' | 'BUSINESS_STUDIES' | string | null;
  education_board: string | null;
  target_exam_year?: number | null;
  training_data_opt_in?: boolean | null;
}

const fieldClass =
  'mt-1.5 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:ring-2 focus:ring-ring';
const saveBtnClass =
  'inline-flex items-center justify-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90 disabled:opacity-60';

export function SettingsPageClient({ profile }: { profile: ProfileData | null }) {
  const [activeTab, setActiveTab] = useState('profile');
  const { mounted, darkMode, toggleDarkMode } = useTheme();
  const { language, t } = useLanguage();

  const [fullName, setFullName] = useState(profile?.full_name || 'Student');
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
      if (optIn) formData.set('trainingDataOptIn', 'on');

      const res = await updateProfile({ status: 'idle' }, formData);
      if (res.status === 'error') {
        toast.error(res.message || (language === 'bn' ? 'সেটিংস সংরক্ষণে সমস্যা হয়েছে' : 'Failed to update settings'));
      } else {
        toast.success(language === 'bn' ? 'সেটিংস সফলভাবে সংরক্ষিত হয়েছে!' : 'Settings updated successfully!');
      }
    } catch {
      toast.error(language === 'bn' ? 'সেটিংস সংরক্ষণে সমস্যা হয়েছে' : 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const initials =
    fullName
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'ST';

  const tabs: { id: string; label: string }[] = [
    { id: 'profile', label: t('settings.profile_tab') },
    { id: 'learning', label: t('settings.learning_tab') },
    { id: 'notifications', label: t('settings.notifications_tab') },
    { id: 'appearance', label: t('settings.appearance_tab') },
    { id: 'privacy', label: t('settings.privacy_tab') },
  ];

  const saveBlock = () => (
    <div className="mt-6">
      <button type="button" className={cn(saveBtnClass, 'w-full')} onClick={handleSave} disabled={saving}>
        {saving ? t('common.saving') : t('common.save_changes')}
      </button>
    </div>
  );

  return (
    <>
      <PageHeader title={t('settings.title')} description={t('settings.desc')}>
        <button type="button" className={saveBtnClass} onClick={handleSave} disabled={saving}>
          {saving ? t('common.saving') : t('common.save_changes')}
        </button>
      </PageHeader>

      <div className="grid gap-6 md:grid-cols-[200px_1fr]">
        <aside className="flex gap-1 overflow-x-auto md:flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'shrink-0 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-accent text-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        <section className="min-w-0 rounded-2xl border border-border bg-card p-6 shadow-xs">
          {activeTab === 'profile' && (
            <>
              <h2 className="font-heading text-lg font-bold">{t('settings.personal_details')}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === 'bn' ? 'তোমার ছবি ও ব্যক্তিগত তথ্য আপডেট করো।' : 'Update your photo and personal information.'}
              </p>

              <div className="mt-5 flex items-center gap-4">
                <div className="grid size-14 flex-none place-items-center rounded-full bg-navy text-sm font-bold text-surface-1">
                  {initials}
                </div>
                <div>
                  <b className="text-sm">{language === 'bn' ? 'প্রোফাইল ছবি' : 'Profile photo'}</b>
                  <p className="mt-0.5 mb-2 text-xs text-muted-foreground">
                    {language === 'bn' ? 'তোমার ড্যাশবোর্ড ও রিপোর্ট কার্ডে দেখানো হবে।' : 'Shown on your dashboard and report cards.'}
                  </p>
                  <button
                    type="button"
                    className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                  >
                    {t('settings.change_avatar')}
                  </button>
                </div>
              </div>

              <label className="mt-5 block text-sm font-medium">
                {t('settings.full_name')}
                <input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Anam Rahman"
                  className={fieldClass}
                />
              </label>

              {saveBlock()}
            </>
          )}

          {activeTab === 'learning' && (
            <>
              <h2 className="font-heading text-lg font-bold">Academic Details</h2>
              <p className="mt-1 text-sm text-muted-foreground">Update your exam preferences and targets.</p>

              <label className="mt-5 block text-sm font-medium">
                {t('settings.exam_type')}
                <select value={examType} onChange={(e) => setExamType(e.target.value as 'HSC' | 'SSC')} className={fieldClass}>
                  <option value="HSC">{language === 'bn' ? 'HSC (উচ্চ মাধ্যমিক)' : 'HSC (Higher Secondary)'}</option>
                  <option value="SSC">{language === 'bn' ? 'SSC (মাধ্যমিক)' : 'SSC (Secondary School)'}</option>
                </select>
              </label>

              <label className="mt-4 block text-sm font-medium">
                {t('settings.academic_group')}
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value as 'SCIENCE' | 'HUMANITIES' | 'BUSINESS_STUDIES')}
                  className={fieldClass}
                >
                  <option value="SCIENCE">{language === 'bn' ? 'বিজ্ঞান' : 'Science'}</option>
                  <option value="HUMANITIES">{language === 'bn' ? 'মানবিক' : 'Humanities'}</option>
                  <option value="BUSINESS_STUDIES">{language === 'bn' ? 'ব্যবসায় শিক্ষা' : 'Business Studies'}</option>
                </select>
              </label>

              <label className="mt-4 block text-sm font-medium">
                {t('settings.target_board')}
                <select value={board} onChange={(e) => setBoard(e.target.value)} className={fieldClass}>
                  <option value="DHAKA">{language === 'bn' ? 'ঢাকা বোর্ড' : 'Dhaka Board'}</option>
                  <option value="CHITTAGONG">{language === 'bn' ? 'চট্টগ্রাম বোর্ড' : 'Chittagong Board'}</option>
                  <option value="RAJSHAHI">{language === 'bn' ? 'রাজশাহী বোর্ড' : 'Rajshahi Board'}</option>
                  <option value="SYLHET">{language === 'bn' ? 'সিলেট বোর্ড' : 'Sylhet Board'}</option>
                  <option value="BARISAL">{language === 'bn' ? 'বরিশাল বোর্ড' : 'Barisal Board'}</option>
                  <option value="COMILLA">{language === 'bn' ? 'কুমিল্লা বোর্ড' : 'Comilla Board'}</option>
                  <option value="DINAJPUR">{language === 'bn' ? 'দিনাজপুর বোর্ড' : 'Dinajpur Board'}</option>
                  <option value="JESSORE">{language === 'bn' ? 'যশোর বোর্ড' : 'Jessore Board'}</option>
                  <option value="MYMENSINGH">{language === 'bn' ? 'ময়মনসিংহ বোর্ড' : 'Mymensingh Board'}</option>
                  <option value="MADRASAH">{language === 'bn' ? 'মাদ্রাসা বোর্ড' : 'Madrasah Board'}</option>
                  <option value="TECHNICAL">{language === 'bn' ? 'কারিগরি বোর্ড' : 'Technical Board'}</option>
                </select>
              </label>

              <label className="mt-4 block text-sm font-medium">
                {t('settings.target_year')}
                <input
                  type="number"
                  value={targetExamYear}
                  onChange={(e) => setTargetExamYear(Number(e.target.value))}
                  min={2026}
                  max={2030}
                  className={fieldClass}
                />
              </label>

              {saveBlock()}
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <h2 className="font-heading text-lg font-bold">Appearance &amp; Language</h2>
              <p className="mt-1 text-sm text-muted-foreground">Customize how SheraTutor looks for you.</p>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div>
                  <b className="flex items-center gap-1.5 text-sm">
                    <Globe size={15} /> {language === 'bn' ? 'ভাষার পছন্দ' : 'Language'}
                  </b>
                  <small className="text-xs text-muted-foreground">
                    {language === 'bn'
                      ? 'ওয়েবসাইটের ভাষা বাংলা বা ইংরেজিতে পরিবর্তন করো।'
                      : 'Switch website language between Bangla and English.'}
                  </small>
                </div>
                <LanguageToggle showIcon={false} />
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-border p-4">
                <div>
                  <b className="flex items-center gap-1.5 text-sm" suppressHydrationWarning>
                    {mounted && darkMode ? <Sun size={15} /> : <Moon size={15} />}{' '}
                    {mounted && darkMode ? t('common.light_mode') : t('common.dark_mode')}
                  </b>
                  <small className="text-xs text-muted-foreground">
                    {language === 'bn' ? 'লাইট ও ডার্ক থিমের মধ্যে পরিবর্তন করো।' : 'Toggle between light and dark themes.'}
                  </small>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={mounted ? darkMode : undefined}
                  onClick={toggleDarkMode}
                  aria-label="Toggle dark theme"
                  suppressHydrationWarning
                  className={cn(
                    'relative h-6 w-11 shrink-0 rounded-full border border-border transition-colors',
                    mounted && darkMode ? 'bg-cta' : 'bg-surface-2',
                  )}
                >
                  <span
                    className={cn(
                      'absolute top-0.5 left-0.5 size-4 rounded-full bg-surface-1 shadow-sm transition-transform',
                      mounted && darkMode && 'translate-x-5',
                    )}
                  />
                </button>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <h2 className="font-heading text-lg font-bold">Privacy Settings</h2>
              <p className="mt-1 text-sm text-muted-foreground">Manage your data sharing and consent.</p>

              <label className="mt-5 flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={optIn}
                  onChange={(e) => setOptIn(e.target.checked)}
                  className="size-4 accent-cta"
                />
                <span>{t('settings.opt_in')}</span>
              </label>

              {saveBlock()}
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h2 className="font-heading text-lg font-bold">Notifications</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                We will add email and push notification preferences here soon.
              </p>
            </>
          )}
        </section>
      </div>
    </>
  );
}
