'use client';

import React, { useState } from 'react';
import { Globe, Moon } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { LanguageToggle } from '@/components/LanguageToggle';
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
      if (optIn) {
        formData.set('trainingDataOptIn', 'on');
      }

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

  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'ST';

  return (
    <>
      <PageHeader title={t('settings.title')} description={t('settings.desc')}>
        <button type="button" className="primary-btn" onClick={handleSave} disabled={saving}>
          {saving ? t('common.saving') : t('common.save_changes')}
        </button>
      </PageHeader>

      <div className="settings-layout">
        <aside>
          <button type="button" className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>
            {t('settings.profile_tab')}
          </button>
          <button type="button" className={activeTab === 'learning' ? 'active' : ''} onClick={() => setActiveTab('learning')}>
            {t('settings.learning_tab')}
          </button>
          <button type="button" className={activeTab === 'notifications' ? 'active' : ''} onClick={() => setActiveTab('notifications')}>
            {t('settings.notifications_tab')}
          </button>
          <button type="button" className={activeTab === 'appearance' ? 'active' : ''} onClick={() => setActiveTab('appearance')}>
            {t('settings.appearance_tab')}
          </button>
          <button type="button" className={activeTab === 'privacy' ? 'active' : ''} onClick={() => setActiveTab('privacy')}>
            {t('settings.privacy_tab')}
          </button>
        </aside>

        <section>
          {activeTab === 'profile' && (
            <>
              <h2>{t('settings.personal_details')}</h2>
              <p>{language === 'bn' ? 'তোমার ছবি ও ব্যক্তিগত তথ্য আপডেট করো।' : 'Update your photo and personal information.'}</p>
              
              <div className="profile-edit">
                <div className="large-avatar">{initials}</div>
                <div>
                  <b>{language === 'bn' ? 'প্রোফাইল ছবি' : 'Profile photo'}</b>
                  <p style={{ margin: '2px 0 8px', fontSize: 12, color: 'var(--muted-foreground)' }}>
                    {language === 'bn' ? 'তোমার ড্যাশবোর্ড ও রিপোর্ট কার্ডে দেখানো হবে।' : 'Shown on your dashboard and report cards.'}
                  </p>
                  <button type="button">{t('settings.change_avatar')}</button>
                </div>
              </div>
              
              <label>
                {t('settings.full_name')}
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="e.g. Anam Rahman" />
              </label>

              <div style={{ marginTop: 24 }}>
                <button type="button" className="primary-btn" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                  {saving ? t('common.saving') : t('common.save_changes')}
                </button>
              </div>
            </>
          )}

          {activeTab === 'learning' && (
            <>
              <h2>Academic Details</h2>
              <p>Update your exam preferences and targets.</p>

              <label>
                {t('settings.exam_type')}
                <select value={examType} onChange={(e) => setExamType(e.target.value as 'HSC' | 'SSC')}>
                  <option value="HSC">{language === 'bn' ? 'HSC (উচ্চ মাধ্যমিক)' : 'HSC (Higher Secondary)'}</option>
                  <option value="SSC">{language === 'bn' ? 'SSC (মাধ্যমিক)' : 'SSC (Secondary School)'}</option>
                </select>
              </label>
              
              <label>
                {t('settings.academic_group')}
                <select value={group} onChange={(e) => setGroup(e.target.value as 'SCIENCE' | 'HUMANITIES' | 'BUSINESS_STUDIES')}>
                  <option value="SCIENCE">{language === 'bn' ? 'বিজ্ঞান' : 'Science'}</option>
                  <option value="HUMANITIES">{language === 'bn' ? 'মানবিক' : 'Humanities'}</option>
                  <option value="BUSINESS_STUDIES">{language === 'bn' ? 'ব্যবসায় শিক্ষা' : 'Business Studies'}</option>
                </select>
              </label>
              
              <label>
                {t('settings.target_board')}
                <select value={board} onChange={(e) => setBoard(e.target.value)}>
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
              
              <label>
                {t('settings.target_year')}
                <input type="number" value={targetExamYear} onChange={(e) => setTargetExamYear(Number(e.target.value))} min={2026} max={2030} />
              </label>

              <div style={{ marginTop: 24 }}>
                <button type="button" className="primary-btn" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                  {saving ? t('common.saving') : t('common.save_changes')}
                </button>
              </div>
            </>
          )}

          {activeTab === 'appearance' && (
            <>
              <h2>Appearance & Language</h2>
              <p>Customize how SheraTutor looks for you.</p>

              <div className="appearance-toggle" style={{ marginBottom: 12 }}>
                <div>
                  <b><Globe size={15} /> {language === 'bn' ? 'ভাষার পছন্দ' : 'Language'}</b>
                  <small>{language === 'bn' ? 'ওয়েবসাইটের ভাষা বাংলা বা ইংরেজিতে পরিবর্তন করো।' : 'Switch website language between Bangla and English.'}</small>
                </div>
                <LanguageToggle showIcon={false} />
              </div>

              <div className="appearance-toggle">
                <div>
                  <b><Moon size={15} /> {darkMode ? t('common.light_mode') : t('common.dark_mode')}</b>
                  <small>{language === 'bn' ? 'লাইট ও ডার্ক থিমের মধ্যে পরিবর্তন করো।' : 'Toggle between light and dark themes.'}</small>
                </div>
                <button type="button" className={`theme-switch ${darkMode ? 'on' : ''}`.trim()} onClick={toggleDarkMode} aria-label="Toggle dark theme"><i /></button>
              </div>
            </>
          )}

          {activeTab === 'privacy' && (
            <>
              <h2>Privacy Settings</h2>
              <p>Manage your data sharing and consent.</p>

              <div style={{ margin: '18px 0' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                  <input type="checkbox" checked={optIn} onChange={(e) => setOptIn(e.target.checked)} style={{ width: 'auto', margin: 0 }} />
                  <span>{t('settings.opt_in')}</span>
                </label>
              </div>

              <div style={{ marginTop: 24 }}>
                <button type="button" className="primary-btn" onClick={handleSave} disabled={saving} style={{ width: '100%', justifyContent: 'center' }}>
                  {saving ? t('common.saving') : t('common.save_changes')}
                </button>
              </div>
            </>
          )}

          {activeTab === 'notifications' && (
            <>
              <h2>Notifications</h2>
              <p>We will add email and push notification preferences here soon.</p>
            </>
          )}

        </section>
      </div>
    </>
  );
}
