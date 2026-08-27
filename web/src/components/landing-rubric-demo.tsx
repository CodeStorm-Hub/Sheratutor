'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { AlertTriangle, Sparkles, BookOpen } from 'lucide-react';

interface RubricStep {
  stepCode: string;
  stepNameBn: string;
  stepNameEn: string;
  status: 'correct' | 'deduction' | 'partial';
  mark: string;
  detailBn: string;
  detailEn: string;
  recoveryBn?: string;
  recoveryEn?: string;
}

interface DemoSubject {
  id: string;
  nameBn: string;
  nameEn: string;
  boardBn: string;
  boardEn: string;
  cqPromptBn: string;
  cqPromptEn: string;
  formula: string;
  totalScoreBn: string;
  totalScoreEn: string;
  steps: RubricStep[];
}

const DEMO_SUBJECTS: DemoSubject[] = [
  {
    id: 'physics',
    nameBn: 'পদার্থবিজ্ঞান ১ম পত্র (গতিবিদ্যা)',
    nameEn: 'Physics 1st Paper (Dynamics)',
    boardBn: 'ঢাকা বোর্ড ২০২৪ স্ট্যান্ডার্ড',
    boardEn: 'Dhaka Board 2024 Standard',
    cqPromptBn: 'একটি ক্রিকেট বলকে ভূমির সাথে ৩০° কোণে ২০ m/s বেগে নিক্ষেপ করা হলো। বলটির সর্বোচ্চ উচ্চতা ও বিচরণকাল নির্ণয় করো।',
    cqPromptEn: 'A cricket ball is projected at 30° with a velocity of 20 m/s. Calculate maximum height and time of flight.',
    formula: 'H = (u² sin²θ) / (2g),   T = (2u sinθ) / g',
    totalScoreBn: '৩ / ৪ (A)',
    totalScoreEn: '3 / 4 (A)',
    steps: [
      {
        stepCode: 'ধাপ ১ [জ্ঞান ও অনুধাবন]',
        stepNameBn: 'সঠিক সূত্র নির্বাচন ও তথ্য উপস্থাপন',
        stepNameEn: 'Formula selection & given values',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'প্রক্ষেপকের সর্বোচ্চ উচ্চতার সমীকরণ H = (u² sin²θ)/(2g) সঠিকভাবে লিপিবদ্ধ করা হয়েছে।',
        detailEn: 'Correctly stated the projectile height formula H = (u² sin²θ)/(2g).',
      },
      {
        stepCode: 'ধাপ ২ [প্রয়োগ]',
        stepNameBn: 'কোণ ও অভিকর্ষজ ত্বরণের মান বসানো',
        stepNameEn: 'Substituting values of angle & gravity',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'u = 20 m/s, θ = 30°, g = 9.8 ms⁻² এর মান নির্ভুলভাবে স্থাপন করা হয়েছে।',
        detailEn: 'Accurately inserted values for initial velocity, angle, and acceleration due to gravity.',
      },
      {
        stepCode: 'ধাপ ৩ [উচ্চতর দক্ষতা]',
        stepNameBn: 'গণনা ও একক বিভ্রাট',
        stepNameEn: 'Calculation & unit discrepancy',
        status: 'deduction',
        mark: '-১/১',
        detailBn: 'হিসেবে ত্রুটি: sin²(30°) = 0.25 এর স্থানে 0.5 বিবেচনা করায় উচ্চতা 10.2m এর বদলে 5.1m এসেছে।',
        detailEn: 'Calculation mistake: Used sin(30°) instead of squaring the sine value.',
        recoveryBn: 'পুনরুদ্ধার পথ: sin(30°) = 0.5, সুতরাং sin²(30°) = 0.25 ব্যবহার করে H = 5.10 m নির্ণয় করো।',
        recoveryEn: 'Recovery tip: Remember to square the trigonometric ratio before multiplying.',
      },
      {
        stepCode: 'ধাপ ৪ [উপসংহার]',
        stepNameBn: 'বিচরণকাল নির্ণয় ও চূড়ান্ত ফলাফল',
        stepNameEn: 'Time of flight & conclusion',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'T = (2 × 20 × sin30°) / 9.8 = 2.04 s নির্ভুলভাবে নির্ণীত।',
        detailEn: 'Time of flight accurately computed as 2.04 seconds.',
      },
    ],
  },
  {
    id: 'math',
    nameBn: 'উচ্চতর গণিত ১ম পত্র (ক্যালকুলাস)',
    nameEn: 'Higher Math 1st Paper (Calculus)',
    boardBn: 'চট্টগ্রাম বোর্ড ২০২৪ স্ট্যান্ডার্ড',
    boardEn: 'Chittagong Board 2024 Standard',
    cqPromptBn: 'y = x³ - 3x² - 9x + 5 বক্ররেখার চরম বিন্দু ও নতি পরিবর্তন বিন্দু নির্ণয় করো।',
    cqPromptEn: 'Find the turning points and inflection points of the curve y = x³ - 3x² - 9x + 5.',
    formula: 'dy/dx = 3x² - 6x - 9 = 0 ⟹ x = 3, -1',
    totalScoreBn: '৪ / ৪ (A+)',
    totalScoreEn: '4 / 4 (A+)',
    steps: [
      {
        stepCode: 'ধাপ ১ [প্রথম অন্তরীকরণ]',
        stepNameBn: 'dy/dx নির্ণয় ও সমীকরণ গঠন',
        stepNameEn: 'First derivative computation',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'dy/dx = 3x² - 6x - 9 সঠিকভাবে প্রতিপাদিত।',
        detailEn: 'First derivative correctly derived.',
      },
      {
        stepCode: 'ধাপ ২ [চরম মান শর্ত]',
        stepNameBn: 'dy/dx = 0 বিবেচনায় x এর মান',
        stepNameEn: 'Critical points determination',
        status: 'correct',
        mark: '+১/১',
        detailBn: '3(x - 3)(x + 1) = 0 থেকে x = 3 ও x = -1 নির্ণীত।',
        detailEn: 'Roots correctly identified as x = 3 and x = -1.',
      },
      {
        stepCode: 'ধাপ ৩ [দ্বিতীয় অন্তরীকরণ]',
        stepNameBn: 'd²y/dx² দ্বারা সর্বোচ্চ/সর্বনিম্ন পরীক্ষা',
        stepNameEn: 'Second derivative test',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'x = 3 এ d²y/dx² = 12 > 0 (লঘিষ্ঠ মান), x = -1 এ d²y/dx² = -12 < 0 (গুরু মান)।',
        detailEn: 'Successfully verified local maxima and minima using second derivative.',
      },
      {
        stepCode: 'ধাপ ৪ [স্থানাঙ্ক]',
        stepNameBn: 'বিন্দুর পূর্ণ স্থানাঙ্ক উপস্থাপন',
        stepNameEn: 'Coordinate pair formatting',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'সর্বোচ্চ বিন্দু (-1, 10) এবং সর্বনিম্ন বিন্দু (3, -22) যথাযথভাবে লিপিবদ্ধ।',
        detailEn: 'Extremum coordinates cleanly presented with all calculations preserved.',
      },
    ],
  },
  {
    id: 'chemistry',
    nameBn: 'রসায়ন ২য় পত্র (পরিমাণগত রসায়ন)',
    nameEn: 'Chemistry 2nd Paper (Quantitative Chemistry)',
    boardBn: 'রাজশাহী বোর্ড ২০২৪ স্ট্যান্ডার্ড',
    boardEn: 'Rajshahi Board 2024 Standard',
    cqPromptBn: '0.1 M 25 mL HCl দ্রবণকে প্রশমিত করতে কত আয়তন 0.05 M Na₂CO₃ দ্রবণ প্রয়োজন?',
    cqPromptEn: 'What volume of 0.05 M Na₂CO₃ solution is required to neutralize 25 mL of 0.1 M HCl?',
    formula: '2HCl + Na₂CO₃ ⟶ 2NaCl + H₂O + CO₂',
    totalScoreBn: '২ / ৩ (A)',
    totalScoreEn: '2 / 3 (A)',
    steps: [
      {
        stepCode: 'ধাপ ১ [সমীকরণ]',
        stepNameBn: 'সমতাকৃত রাসায়নিক সমীকরণ',
        stepNameEn: 'Balanced chemical equation',
        status: 'correct',
        mark: '+১/১',
        detailBn: '2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂ সমীকরণটি সঠিক মোল অনুপাতে লিখিত।',
        detailEn: 'Balanced stoichiometric equation properly written.',
      },
      {
        stepCode: 'ধাপ ২ [সূত্র প্রয়োগ]',
        stepNameBn: 'মোল অনুপাত ও টাইট্রেশন সূত্র',
        stepNameEn: 'Molar stoichiometry relation',
        status: 'correct',
        mark: '+১/১',
        detailBn: 'V₁S₁ / n₁ = V₂S₂ / n₂ সূত্রটি যথাযথভাবে প্রযুক্ত।',
        detailEn: 'Neutralization titration relation accurately deployed.',
      },
      {
        stepCode: 'ধাপ ৩ [চূড়ান্ত আয়তন]',
        stepNameBn: 'আয়তন গণনা ও একক উপস্থাপন',
        stepNameEn: 'Volume calculation & units',
        status: 'deduction',
        mark: '-১/১',
        detailBn: 'মোল অনুপাত n₁ = 2 ও n₂ = 1 উল্টে ফেলায় 25 mL এর পরিবর্তে 100 mL এসেছে।',
        detailEn: 'Acid-base stoichiometric coefficients inverted during substitution.',
        recoveryBn: 'পুনরুদ্ধার পথ: V₂ = (25 × 0.1 × 1) / (2 × 0.05) = 25 mL। বোর্ডের মূল্যায়নে এটি কমন ভুল।',
        recoveryEn: 'Recovery tip: Keep acid stoichiometry coefficient on denominator of base calculation.',
      },
    ],
  },
];

export function LandingRubricDemo() {
  const { language } = useLanguage();
  const [activeSubjectId, setActiveSubjectId] = useState('physics');
  const [showRecovery, setShowRecovery] = useState(true);

  const subject = DEMO_SUBJECTS.find((s) => s.id === activeSubjectId) || DEMO_SUBJECTS[0];

  return (
    <div className="w-full bg-white rounded-2xl border border-[#dde4dd] shadow-[0_8px_30px_rgba(20,37,31,0.04)] overflow-hidden">
      {/* Header Bar */}
      <div className="bg-[#f7f8f5] border-b border-[#dde4dd] px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#d92638]" />
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[#52655d]">
            {language === 'bn' ? 'NCTB বোর্ড মার্কিং রুব্রিক সিমুলেটর' : 'NCTB BOARD MARKING RUBRIC SIMULATOR'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#e2f0e9] text-[#00543d] font-mono text-xs font-bold">
            <Sparkles size={12} />
            {language === 'bn' ? subject.boardBn : subject.boardEn}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#fdeaec] text-[#d92638] font-mono text-xs font-bold">
            {language === 'bn' ? `স্কোর: ${subject.totalScoreBn}` : `Score: ${subject.totalScoreEn}`}
          </span>
        </div>
      </div>

      {/* Subject Selector Tabs */}
      <div className="flex border-b border-[#dde4dd] bg-[#ffffff] overflow-x-auto p-1.5 gap-1.5">
        {DEMO_SUBJECTS.map((s) => {
          const isActive = s.id === activeSubjectId;
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSubjectId(s.id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 ${
                isActive
                  ? 'bg-[#006a4e] text-white shadow-sm'
                  : 'text-[#52655d] hover:bg-[#f7f8f5] hover:text-[#14251f]'
              }`}
            >
              <BookOpen size={13} />
              <span>{language === 'bn' ? s.nameBn : s.nameEn}</span>
            </button>
          );
        })}
      </div>

      {/* CQ Prompt & Equation Strip */}
      <div className="p-4 sm:p-6 bg-[#ffffff] border-b border-[#dde4dd]">
        <div className="flex items-start gap-3">
          <div className="w-1.5 h-12 bg-[#006a4e] rounded-full flex-shrink-0 mt-1" />
          <div className="flex-1 min-w-0">
            <span className="font-mono text-xs font-bold text-[#b97f08] uppercase tracking-wider block mb-1">
              {language === 'bn' ? 'সৃজনশীল প্রশ্ন উদ্দীপক' : 'QUESTION STIMULUS & PROBLEM'}
            </span>
            <p className="text-sm font-medium text-[#14251f] leading-relaxed m-0">
              {language === 'bn' ? subject.cqPromptBn : subject.cqPromptEn}
            </p>
            <div className="mt-2.5 inline-block px-3 py-1.5 rounded-md bg-[#f7f8f5] border border-[#dde4dd] font-mono text-xs text-[#00543d]">
              {subject.formula}
            </div>
          </div>
        </div>
      </div>

      {/* Granular Step-by-Step Examiner Evaluation */}
      <div className="p-4 sm:p-6 bg-[#fafbf9] flex flex-col gap-3.5">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold text-[#14251f] uppercase tracking-wider">
            {language === 'bn' ? 'বোর্ড পরীক্ষকের পুঙ্খানুপুঙ্খ ব্যবচ্ছেদ' : 'EXAMINER STEP BREAKDOWN'}
          </span>
          <button
            type="button"
            onClick={() => setShowRecovery(!showRecovery)}
            className="text-xs text-[#006a4e] font-semibold hover:underline flex items-center gap-1"
          >
            {showRecovery
              ? language === 'bn'
                ? 'পুনরুদ্ধার টিপস লুকান'
                : 'Hide recovery tips'
              : language === 'bn'
              ? 'পুনরুদ্ধার টিপস দেখুন'
              : 'Show recovery tips'}
          </button>
        </div>

        <div className="flex flex-col gap-3">
          {subject.steps.map((step, idx) => {
            const isDeduction = step.status === 'deduction';
            return (
              <div
                key={idx}
                className={`rounded-xl p-3.5 sm:p-4 transition-all ${
                  isDeduction
                    ? 'bg-[#ffffff] border-l-[3px] border-l-[#d92638] border-t border-r border-b border-[#dde4dd] shadow-sm'
                    : 'bg-[#ffffff] border border-[#dde4dd]'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-[#52655d]">
                      {step.stepCode}
                    </span>
                    <span className="text-xs font-bold text-[#14251f]">
                      {language === 'bn' ? step.stepNameBn : step.stepNameEn}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded-full ${
                      isDeduction
                        ? 'bg-[#fdeaec] text-[#d92638]'
                        : 'bg-[#e2f0e9] text-[#00543d]'
                    }`}
                  >
                    {step.mark}
                  </span>
                </div>

                <p className="text-xs text-[#52655d] leading-relaxed m-0">
                  {language === 'bn' ? step.detailBn : step.detailEn}
                </p>

                {showRecovery && step.recoveryBn && (
                  <div className="mt-2.5 pt-2.5 border-t border-[#dde4dd] flex items-start gap-2 text-xs text-[#d92638] bg-[#fffbfb] -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
                    <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
                    <span className="font-medium">
                      {language === 'bn' ? step.recoveryBn : step.recoveryEn}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
