'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  BookOpen,
  ArrowRight,
  Clock,
  Award,
  Layers,
  ShieldCheck,
  Gauge,
  Atom,
  Calculator,
  FlaskConical,
  Dna,
  Binary,
  Compass,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Filter,
  Zap,
  RotateCcw,
  Check,
  Activity,
  BatteryCharging,
  Flame,
  Waves,
  Sun,
  Glasses,
  Scale,
  GitBranch,
  Triangle,
  Circle,
  Mountain,
  Grid,
  Hash,
  Shapes,
  Box,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export type SubjectKey = 'all' | 'physics' | 'math' | 'chemistry' | 'higher-math' | 'biology';

interface ChapterLesson {
  num: string;
  titleBn: string;
  titleEn: string;
}

interface LiveChapter {
  id: number;
  subjectKey: SubjectKey;
  subjectNameBn: string;
  subjectNameEn: string;
  href: string;
  titleBn: string;
  titleEn: string;
  chNumBn: string;
  chNumEn: string;
  timeBn: string;
  timeEn: string;
  weightBn: string;
  weightEn: string;
  descBn: string;
  descEn: string;
  lessons: ChapterLesson[];
  ctaBn: string;
  ctaEn: string;
  ctaIcon: React.ComponentType<{ className?: string }>;
  accentColor: string;
  borderHover: string;
  badgeTextBn: string;
  badgeSubBn: string;
}

interface UpcomingChapter {
  chNumBn: string;
  chNumEn: string;
  titleBn: string;
  titleEn: string;
  descBn: string;
  descEn: string;
  tagBn?: string;
}

interface SubjectItem {
  id: SubjectKey;
  nameBn: string;
  nameEn: string;
  code: string;
  icon: React.ComponentType<{ className?: string }>;
  taglineBn: string;
  taglineEn: string;
  activeCount: number;
  totalChaptersBn: string;
  totalChaptersEn: string;
  bgGlow: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  accentBg: string;
  liveChapters: LiveChapter[];
  upcomingChapters: UpcomingChapter[];
}

export function GuidebookLibraryView() {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const searchParams = useSearchParams();

  const [activeSubject, setActiveSubject] = useState<SubjectKey>('all');

  // Read URL query parameter ?subject=... if present
  useEffect(() => {
    const sub = searchParams.get('subject');
    if (sub && ['physics', 'math', 'chemistry', 'higher-math', 'biology'].includes(sub)) {
      setActiveSubject(sub as SubjectKey);
    }
  }, [searchParams]);

  // Subjects & Chapters Data Definition
  const SUBJECTS: SubjectItem[] = [
    {
      id: 'physics',
      nameBn: 'পদার্থবিজ্ঞান',
      nameEn: 'Physics',
      code: 'PHY-136',
      icon: Atom,
      taglineBn: 'যন্ত্রপাতি সিমুলেশন, মেকানিক্স ও ত্রুটি বিশ্লেষণ',
      taglineEn: 'Instrument Simulators, Mechanics & Error Analysis',
      activeCount: 12,
      totalChaptersBn: '১৪টি অধ্যায়',
      totalChaptersEn: '14 Chapters',
      bgGlow: 'hover:border-emerald-500/80 hover:bg-emerald-500/5',
      borderColor: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-600 hover:bg-emerald-700',
      liveChapters: [
        {
          id: 1,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/1',
          titleBn: 'ভৌত রাশি ও পরিমাপ',
          titleEn: 'Physical Quantities & Measurement',
          chNumBn: 'অধ্যায় ০১',
          chNumEn: 'Chapter 01',
          timeBn: '১৫ মিনিট',
          timeEn: '15 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ভার্নিয়ার ক্যালিউপার্স সিমুলেটর, স্ক্রু গজ ল্যাব, বল ও কাজের মাত্রা সমীকরণ যাচাই এবং ঘনক/গোলকের আয়তনে শতকরা ত্রুটির বোর্ড ট্র্যাপ।',
          descEn:
            'Interactive Vernier Calipers simulator, Screw Gauge lab, dimensional analysis inspector, and volume percentage error trap.',
          lessons: [
            { num: '০১', titleBn: 'পরিমাপ ও মৌলিক রাশি', titleEn: '7 Fundamental SI Units' },
            { num: '০২', titleBn: 'ভার্নিয়ার ক্যালিউপার্স', titleEn: 'Vernier Calipers' },
            { num: '০৩', titleBn: 'স্ক্রু গজ ও লঘিষ্ঠ গণন', titleEn: 'Screw Gauge Lab' },
            { num: '০৪', titleBn: 'মাত্রা সমীকরণ গোয়েন্দা', titleEn: 'Dimensional Analysis' },
            { num: '০৫', titleBn: 'শতকরা ত্রুটির বিস্তার', titleEn: 'Error Propagation' },
          ],
          ctaBn: 'পদার্থবিজ্ঞান ল্যাব খুলুন',
          ctaEn: 'Open Physics Lab',
          ctaIcon: Gauge,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'ভার্নিয়ার ও স্ক্রু গজ সিমুলেটর',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 2,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/2',
          titleBn: 'গতি (Motion)',
          titleEn: 'Motion & Kinematics',
          chNumBn: 'অধ্যায় ০২',
          chNumEn: 'Chapter 02',
          timeBn: '১৮ মিনিট',
          timeEn: '18 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'গতির ৪টি সমীকরণ ও কার সিমুলেটর, গ্যালিলিওর পরন্ত বস্তু চেম্বার, বাস-গরু ব্রেকিং সৃজনশীল এবং v-t লেখচিত্রের ক্ষেত্রফল ও ঢাল বিশ্লেষণ।',
          descEn:
            '4 equations of motion & interactive car simulator, Galileo free-fall vacuum chamber, bus & cow collision CQ, and v-t graph area & slope analyzer.',
          lessons: [
            { num: '০১', titleBn: 'স্থিতি, গতি ও ৫ প্রকার গতি', titleEn: '5 Motion Types & Reference' },
            { num: '০২', titleBn: 'দূরত্ব বনাম সরণ ও বেগ', titleEn: 'Distance vs Displacement' },
            { num: '০৩', titleBn: 'গতির ৪টি সমীকরণ ও কার ল্যাব', titleEn: '4 Equations of Motion' },
            { num: '০৪', titleBn: 'গ্যালিলিওর পরন্ত বস্তু ল্যাব', titleEn: 'Galileo Free Fall Lab' },
            { num: '০৫', titleBn: 'গ্রাফ গোয়েন্দা: s-t ও v-t', titleEn: 'Motion Graph Area & Slope' },
          ],
          ctaBn: 'গতি ল্যাব খুলুন',
          ctaEn: 'Open Motion Lab',
          ctaIcon: Activity,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'কার সিমুলেটর ও পরন্ত বস্তু চেম্বার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 3,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/3',
          titleBn: 'বল (Force)',
          titleEn: 'Dynamics, Momentum & Friction',
          chNumBn: 'অধ্যায় ০৩',
          chNumEn: 'Chapter 03',
          timeBn: '২০ মিনিট',
          timeEn: '20 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'বাসের জড়তা সিমুলেটর, F = ma ও ঘর্ষণ ত্বরণ ল্যাব, বন্দুকের পশ্চাৎবেগ (V = -mv/M), ২-গাড়ির মুখোমুখি সংঘর্ষ ও ৪ প্রকার ঘর্ষণের বোর্ড প্রস্তুতি।',
          descEn:
            'Bus passenger inertia simulator, F = ma & frictional acceleration lab, rifle recoil mechanics, 2-car collision conservation, and 4 friction types.',
          lessons: [
            { num: '০১', titleBn: 'জড়তা ও মৌলিক ৪টি বল', titleEn: 'Inertia & 4 Fundamental Forces' },
            { num: '০২', titleBn: 'নিউটনের দ্বিতীয় সূত্র ও F=ma', titleEn: 'Newton 2nd Law & F=ma' },
            { num: '০৩', titleBn: 'তৃতীয় সূত্র ও বন্দুকের পশ্চাৎবেগ', titleEn: 'Newton 3rd Law & Gun Recoil' },
            { num: '০৪', titleBn: 'ভরবেগের সংরক্ষণ ও সংঘর্ষ', titleEn: 'Momentum Conservation & Collisions' },
            { num: '০৫', titleBn: '৪ প্রকার ঘর্ষণ ও ঘর্ষণ বল', titleEn: '4 Friction Types & fk' },
          ],
          ctaBn: 'বল ল্যাব খুলুন',
          ctaEn: 'Open Force Lab',
          ctaIcon: Zap,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'পশ্চাৎবেগ ও সংঘর্ষ সিমুলেটর',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 4,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/4',
          titleBn: 'কাজ, ক্ষমতা ও শক্তি',
          titleEn: 'Work, Power & Energy',
          chNumBn: 'অধ্যায় ০৪',
          chNumEn: 'Chapter 04',
          timeBn: '২২ মিনিট',
          timeEn: '22 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'কাজ ও বলের মধ্যবর্তী কোণ (W = Fs cos θ), গতিশক্তি ও ভরবেগ সম্পর্ক, স্প্রিং-এর বিভবশক্তি, যান্ত্রিক শক্তির সংরক্ষণশীলতা এবং মোটরের কর্মদক্ষতা (%) ল্যাব।',
          descEn:
            'Work & force-displacement angle analyzer, kinetic energy & momentum, spring potential energy, mechanical energy conservation, and water pump efficiency.',
          lessons: [
            { num: '০১', titleBn: 'কাজ ও বলের মধ্যবর্তী কোণ', titleEn: 'Work & Angle θ Analysis' },
            { num: '০২', titleBn: 'গতিশক্তি ও কাজ-শক্তি উপপাদ্য', titleEn: 'Kinetic Energy & W = ΔEk' },
            { num: '০৩', titleBn: 'বিভবশক্তি ও স্প্রিং-এর শক্তি', titleEn: 'Potential Energy & Spring Ep' },
            { num: '০৪', titleBn: 'যান্ত্রিক শক্তির সংরক্ষণশীলতা', titleEn: 'Mechanical Energy Conservation' },
            { num: '০৫', titleBn: 'ক্ষমতা ও মোটরের কর্মদক্ষতা (%)', titleEn: 'Power & Motor Efficiency (η)' },
          ],
          ctaBn: 'শক্তি ল্যাব খুলুন',
          ctaEn: 'Open Energy Lab',
          ctaIcon: BatteryCharging,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'শক্তির নিত্যতা ও পাম্প কর্মদক্ষতা',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 5,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/5',
          titleBn: 'পদার্থের অবস্থা ও চাপ',
          titleEn: 'States of Matter & Pressure',
          chNumBn: 'অধ্যায় ০৫',
          chNumEn: 'Chapter 05',
          timeBn: '২০ মিনিট',
          timeEn: '20 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'আর্কিমিডিসের নীতি ও প্লবতা ল্যাব, তরলের গভীরতায় চাপ (P = hρg), প্যাসকেলের হাইড্রোলিক প্রেস বল বৃদ্ধি এবং হুকের স্থিতিস্থাপকতা ও ইয়ং-এর গুণাঙ্ক।',
          descEn:
            'Archimedes principle & buoyancy lab, hydrostatic pressure (P = hρg), Pascal hydraulic force multiplier, and Hooke elasticity & Young modulus.',
          lessons: [
            { num: '০১', titleBn: 'চাপ ও উপাদান ঘনত্ব ল্যাব', titleEn: 'Pressure & Material Density' },
            { num: '০২', titleBn: 'তরলের অভ্যন্তরে চাপ (hρg)', titleEn: 'Pressure in Liquids (hρg)' },
            { num: '০৩', titleBn: 'আর্কিমিডিসের নীতি ও প্লবতা', titleEn: 'Archimedes & Buoyancy' },
            { num: '০৪', titleBn: 'প্যাসকেলের হাইড্রোলিক প্রেস', titleEn: 'Pascal Hydraulic Press' },
            { num: '০৫', titleBn: 'ব্যারোমিটার ও ইয়ং-এর গুণাঙ্ক', titleEn: 'Barometer & Young Modulus' },
          ],
          ctaBn: 'চাপ ও প্লবতা ল্যাব খুলুন',
          ctaEn: 'Open Pressure Lab',
          ctaIcon: Gauge,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'আর্কিমিডিস ও প্যাসকেলের সূত্র',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 6,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/6',
          titleBn: 'বস্তুর ওপর তাপের প্রভাব',
          titleEn: 'Effect of Heat on Matter',
          chNumBn: 'অধ্যায় ০৬',
          chNumEn: 'Chapter 06',
          timeBn: '২২ মিনিট',
          timeEn: '22 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'তাপমাত্রা স্কেল রূপান্তর (C/5 = (F-32)/9), কঠিনের প্রসারণ (α, β, γ) ও রেললাইনের ফাঁক, তরলের আপাত ও প্রকৃত প্রসারণ, ক্যালোরিমিতির তাপ বিনিময় এবং সুপ্ততাপ হিটিং কার্ভ।',
          descEn:
            'Temperature scale conversion, solid expansion (α, β, γ) & rail gap safety, real vs apparent liquid expansion, calorimetry thermal balance, and latent heat phase curve.',
          lessons: [
            { num: '০১', titleBn: 'তাপমাত্রা স্কেল ও আণবিক গতি', titleEn: 'Temperature Scales & Kinetics' },
            { num: '০২', titleBn: 'কঠিনের প্রসারণ ও রেললাইন', titleEn: 'Solid Expansion & Rail Gap' },
            { num: '০৩', titleBn: 'তরলের প্রসারণ ও ব্যতিক্রমী বরফ', titleEn: 'Liquid & Anomalous Water' },
            { num: '০৪', titleBn: 'আপেক্ষিক তাপ ও ক্যালোরিমিতি', titleEn: 'Specific Heat & Calorimetry' },
            { num: '০৫', titleBn: 'সুপ্ততাপ ও প্রেশার কুকার', titleEn: 'Latent Heat & Pressure Cooker' },
          ],
          ctaBn: 'তাপ ও ক্যালোরিমিতি ল্যাব খুলুন',
          ctaEn: 'Open Heat Lab',
          ctaIcon: Flame,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'ক্যালোরিমিতি ও সুপ্ততাপ মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 7,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/7',
          titleBn: 'তরঙ্গ ও শব্দ',
          titleEn: 'Waves & Sound',
          chNumBn: 'অধ্যায় ০৭',
          chNumEn: 'Chapter 07',
          timeBn: '২২ মিনিট',
          timeEn: '22 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সরল ছন্দিত স্পন্দন ও পর্যায়কাল (T = 2π√(l/g)), অনুপ্রস্থ ও অনুদৈর্ঘ্য তরঙ্গ, বায়ুতে শব্দের বেগে তাপমাত্রার প্রভাব (v ∝ √T), প্রতিধ্বনি ও কূপের গভীরতা এবং আল্ট্রাসোনিক সোনার (SONAR) ল্যাব।',
          descEn:
            'Simple harmonic pendulum & spring, transverse vs longitudinal waves, sound velocity with temperature (v ∝ √T), echo & well depth simulator, and ultrasonic SONAR survey.',
          lessons: [
            { num: '০১', titleBn: 'সরল স্পন্দন গতি ও পর্যায়কাল', titleEn: 'Simple Harmonic Motion (SHM)' },
            { num: '০২', titleBn: 'তরঙ্গ সৃষ্টি ও প্রকারভেদ (v = fλ)', titleEn: 'Transverse & Longitudinal Waves' },
            { num: '০৩', titleBn: 'বিভিন্ন মাধ্যমে শব্দের বেগ ও তাপমাত্রা', titleEn: 'Sound Speed & Mediums (v ∝ √T)' },
            { num: '০৪', titleBn: 'প্রতিধ্বনি ও প্রতিফলন ল্যাব (2d = vt)', titleEn: 'Echo & Well Depth Simulator' },
            { num: '০৫', titleBn: 'শব্দের বিস্তার ও সোনার (SONAR)', titleEn: 'Ultrasound, Range & SONAR' },
          ],
          ctaBn: 'তরঙ্গ ও শব্দ ল্যাব খুলুন',
          ctaEn: 'Open Waves Lab',
          ctaIcon: Waves,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'প্রতিধ্বনি ও শব্দের বেগ মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 8,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/8',
          titleBn: 'আলোর প্রতিফলন',
          titleEn: 'Reflection of Light',
          chNumBn: 'অধ্যায় ০৮',
          chNumEn: 'Chapter 08',
          timeBn: '২২ মিনিট',
          timeEn: '22 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'প্রতিফলনের সূত্র (∠i = ∠r) ও সমতল দর্পণ, অবতল দর্পণে ৬-অবস্থান রে-ট্রেসিং, উত্তল দর্পণের দৃষ্টি ক্ষেত্র ও রিয়ার ভিউ মিরর, দর্পণ সমীকরণ (১/u + ১/v = ১/f) এবং পাহাড়ি বাঁকের ৪৫° আয়না।',
          descEn:
            'Laws of reflection (∠i = ∠r) & plane mirror, concave mirror 6-position ray tracing, convex mirror wide FOV rear-view safety, mirror equation solver, and 45° mountain curve mirrors.',
          lessons: [
            { num: '০১', titleBn: 'আলোর প্রকৃতি ও প্রতিফলনের সূত্র', titleEn: 'Laws of Reflection & Plane Mirror' },
            { num: '০২', titleBn: 'অবতল দর্পণ ও ৬-অবস্থান রে-ট্রেসিং', titleEn: 'Concave Mirror 6-Position Ray Tracing' },
            { num: '০৩', titleBn: 'উত্তল দর্পণ ও গাড়ির রিয়ার ভিউ', titleEn: 'Convex Mirror & Wide Field of View' },
            { num: '০৪', titleBn: 'দর্পণ সমীকরণ ও রৈখিক বিবর্ধন', titleEn: 'Mirror Equation & Magnification' },
            { num: '০৫', titleBn: 'পাহাড়ি বাঁকের আয়না ও অপটিক্যাল যন্ত্র', titleEn: 'Blind Curve Mirrors & Devices' },
          ],
          ctaBn: 'প্রতিফলন ল্যাব খুলুন',
          ctaEn: 'Open Reflection Lab',
          ctaIcon: Sun,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'অবতল ও উত্তল দর্পণ মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 9,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/9',
          titleBn: 'আলোর প্রতিসরণ',
          titleEn: 'Refraction of Light',
          chNumBn: 'অধ্যায় ০৯',
          chNumEn: 'Chapter 09',
          timeBn: '২২ মিনিট',
          timeEn: '22 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'স্নেলের সূত্র (n₁ sin θ₁ = n₂ sin θ₂), সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন (TIR), অপটিক্যাল ফাইবার ও মরুভূমির মরীচিকা, উত্তল/অবতল লেন্সের ৬-অবস্থান রশ্মিচিত্র এবং চোখের চশমার ক্ষমতা (P = ১/f)।',
          descEn:
            "Snell's law, critical angle & total internal reflection (TIR), optical fiber core-cladding transmission, mirage & prism dispersion, thin lens ray tracing, and spectacle power solver (P = 1/f).",
          lessons: [
            { num: '০১', titleBn: 'স্নেলের সূত্র ও প্রতিসরণাঙ্ক', titleEn: "Snell's Law & Refractive Index" },
            { num: '০২', titleBn: 'সংকট কোণ ও পূর্ণ প্রতিফলন', titleEn: 'Critical Angle & Total Internal Reflection' },
            { num: '০৩', titleBn: 'অপটিক্যাল ফাইবার ও মরীচিকা', titleEn: 'Fiber Optics, Mirage & Prism' },
            { num: '০৪', titleBn: 'উত্তল ও অবতল লেন্সের রশ্মিচিত্র', titleEn: 'Convex & Concave Lens Ray Tracing' },
            { num: '০৫', titleBn: 'লেন্স সমীকরণ ও চোখের দৃষ্টিত্রুটি', titleEn: 'Lens Power & Eye Defect Corrections' },
          ],
          ctaBn: 'প্রতিসরণ ও লেন্স ল্যাব খুলুন',
          ctaEn: 'Open Refraction Lab',
          ctaIcon: Glasses,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'লেন্স ও প্রতিসরণাঙ্ক মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 10,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/10',
          titleBn: 'স্থির তড়িৎ',
          titleEn: 'Static Electricity',
          chNumBn: 'অধ্যায় ১০',
          chNumEn: 'Chapter 10',
          timeBn: '২২ মিনিট',
          timeEn: '22 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ঘর্ষণে আধান সৃষ্টি ও ইলেকট্রন বিনিময়, স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র ও আবেশ, কুলম্বের সূত্র (F = k q₁q₂ / r²), তড়িৎ প্রাবল্য ও বলরেখা, তড়িৎ বিভব (V = W/q), ধারক (C = Q/V) এবং বজ্রনিরোধক দণ্ডের নিরাপত্তা।',
          descEn:
            'Triboelectric charging & electron transfer, gold leaf electroscope & charging by induction, Coulomb law inverse square collider, electric field lines & null point, electric potential, capacitors and lightning safety.',
          lessons: [
            { num: '০১', titleBn: 'ঘর্ষণে স্থির বিদ্যুৎ ও ইলেকট্রন', titleEn: 'Triboelectric Friction & Charge' },
            { num: '০২', titleBn: 'স্বর্ণপাত তড়িৎবীক্ষণ ও আবেশ', titleEn: 'Gold Leaf Electroscope & Induction' },
            { num: '০৩', titleBn: 'কুলম্বের সূত্র ও দূরত্বের প্রভাব', titleEn: "Coulomb's Law & Force Vectors" },
            { num: '০৪', titleBn: 'তড়িৎ প্রাবল্য ও বলরেখা সিমুলেটর', titleEn: 'Electric Field & Lines of Force' },
            { num: '০৫', titleBn: 'তড়িৎ বিভব, ধারক ও বজ্রপাত ল্যাব', titleEn: 'Potential, Capacitors & Lightning' },
          ],
          ctaBn: 'স্থির তড়িৎ ল্যাব খুলুন',
          ctaEn: 'Open Static Electricity Lab',
          ctaIcon: Zap,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'কুলম্বের বল ও আবেশ মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 11,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/11',
          titleBn: 'চল তড়িৎ',
          titleEn: 'Current Electricity',
          chNumBn: 'অধ্যায় ১১',
          chNumEn: 'Chapter 11',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ওহমের সূত্র (V = IR), আপেক্ষিক রোধ ও তারের জ্যামিতি (R = ρL/A), শ্রেণি-সমান্তরাল তুল্য রোধ ও নষ্ট ভোল্টেজ (v = Ir), মাসিক বিদ্যুৎ বিল (kWh) এবং গৃহস্থালি নিরাপদ বর্তনী ও আর্থিং।',
          descEn:
            "Ohm's law (V = IR), resistivity & wire geometry (R = ρL/A), series-parallel equivalent circuits & lost volts, monthly kWh electric bill calculation, and household safe circuits & earthing.",
          lessons: [
            { num: '০১', titleBn: 'ওহমের সূত্র ও রোধক ল্যাব', titleEn: "Ohm's Law & I-V Curve" },
            { num: '০২', titleBn: 'আপেক্ষিক রোধ ও তারের জ্যামিতি', titleEn: 'Resistivity & Geometry' },
            { num: '০৩', titleBn: 'শ্রেণি ও সমান্তরাল বর্তনী সিমুলেটর', titleEn: 'Series, Parallel & Lost Volts' },
            { num: '০৪', titleBn: 'তড়িৎ ক্ষমতা ও বিদ্যুৎ বিল ক্যালকুলেটর', titleEn: 'Electric Power & Billing' },
            { num: '০৫', titleBn: 'গৃহস্থালি নিরাপদ বর্তনী ও শর্ট-সার্কিট', titleEn: 'Household Safety & MCB' },
          ],
          ctaBn: 'চল তড়িৎ ল্যাব খুলুন',
          ctaEn: 'Open Current Electricity Lab',
          ctaIcon: BatteryCharging,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'ওহমের সূত্র ও বর্তনী মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 12,
          subjectKey: 'physics',
          subjectNameBn: 'পদার্থবিজ্ঞান',
          subjectNameEn: 'Physics',
          href: '/dashboard/playground/v2/physics/12',
          titleBn: 'বিদ্যুতের চৌম্বক ক্রিয়া',
          titleEn: 'Magnetic Effects of Current',
          chNumBn: 'অধ্যায় ১২',
          chNumEn: 'Chapter 12',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ওয়েরস্টেডের পরীক্ষা ও ডান হাতের বুড়ো আঙুল নিয়ম, সলিনয়েড ও তাড়িতচুম্বক ডোমেইন ল্যাব, ডিসি মোটর ও ফ্লেমিং-এর বাম হস্ত নিয়ম, তাড়িতচৌম্বক আবেশ ও এসি জেনারেটর এবং ট্রান্সফরমার ও পাওয়ার গ্রিড ট্রান্সমিশন।',
          descEn:
            "Oersted's experiment & right-hand thumb rule, solenoid & electromagnet domains, DC motor & Fleming's left-hand rule, electromagnetic induction & AC generator, and transformer equations & power grid transmission.",
          lessons: [
            { num: '০১', titleBn: 'ওয়েরস্টেডের পরীক্ষা ও ডান হাতের নিয়ম', titleEn: "Oersted Experiment & Right-Hand Rule" },
            { num: '০২', titleBn: 'সলিনয়েড ও তাড়িতচুম্বক ডোমেইন ল্যাব', titleEn: "Solenoid & Electromagnet Domains" },
            { num: '০৩', titleBn: 'ডিসি মোটর ও ফ্লেমিং-এর বাম হস্ত নিয়ম', titleEn: "DC Motor & Fleming's Left-Hand Rule" },
            { num: '০৪', titleBn: 'তাড়িতচৌম্বক আবেশ ও এসি জেনারেটর', titleEn: "Electromagnetic Induction & AC Generator" },
            { num: '০৫', titleBn: 'ট্রান্সফরমার ও পাওয়ার গ্রিড সিমুলেটর', titleEn: "Transformer & Power Grid Simulator" },
          ],
          ctaBn: 'চৌম্বক ক্রিয়া ল্যাব খুলুন',
          ctaEn: 'Open Magnetic Effects Lab',
          ctaIcon: Compass,
          accentColor: 'text-emerald-600',
          borderHover: 'hover:border-emerald-500',
          badgeTextBn: 'মোটর, জেনারেটর ও ট্রান্সফরমার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
      ],
      upcomingChapters: [
        {
          chNumBn: 'অধ্যায় ১৩',
          chNumEn: 'Chapter 13',
          titleBn: 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স',
          titleEn: 'Modern Physics & Electronics',
          descBn: 'তেজস্ক্রিয়তা (আলফা, বিটা, গামা রশ্মি), অর্ধায়ু, অর্ধপরিবাহী ডায়োড, ট্রানজিস্টর ও সমন্বিত বর্তনী (IC)।',
          descEn: 'Radioactivity (alpha, beta, gamma rays), half-life, semiconductor diodes, transistors and integrated circuits (IC).',
          tagBn: 'পরবর্তী রিলিজ',
        },
      ],
    },
    {
      id: 'math',
      nameBn: 'সাধারণ গণিত',
      nameEn: 'General Mathematics',
      code: 'MATH-109',
      icon: Calculator,
      taglineBn: 'শান্ত উপপাদ্য, বীজগাণিতিক প্রমাণ ও ক্যালকুলেশন লজিক',
      taglineEn: 'Calm Theorems, Proof Narratives & Algebraic Logic',
      activeCount: 17,
      totalChaptersBn: '১৭টি অধ্যায়',
      totalChaptersEn: '17 Chapters',
      bgGlow: 'hover:border-primary/80 hover:bg-primary/5',
      borderColor: 'border-primary/40',
      badgeBg: 'bg-primary/10 text-primary border-primary/20',
      badgeText: 'text-primary',
      accentBg: 'bg-[#FF6B57] hover:bg-[#e05340]',
      liveChapters: [
        {
          id: 1,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/1',
          titleBn: 'বাস্তব সংখ্যা',
          titleEn: 'Real Numbers',
          chNumBn: 'অধ্যায় ০১',
          chNumEn: 'Chapter 01',
          timeBn: '১৫ মিনিট',
          timeEn: '15 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সংখ্যার শ্রেণিবিন্যাস বৃক্ষ, √২ অমূলদ হওয়ার ফ্রেম-বাই-ফ্রেম গোয়েন্দা প্রমাণ, আবৃত্ত দশমিকের লাইভ ৯-০ ক্যালকুলেটর এবং রেড লাইন পদ্ধতি।',
          descEn:
            'Interactive number tree, frame-by-frame √2 proof narrative, recurring decimal live decoder, and red line alignment.',
          lessons: [
            { num: '০১', titleBn: 'সংখ্যার মহাবিশ্ব', titleEn: 'Universe of Numbers' },
            { num: '০২', titleBn: 'প্রমাণের গোয়েন্দা (√২)', titleEn: 'Proof Detective (√2)' },
            { num: '০৩', titleBn: 'আবৃত্ত দশমিক কোড', titleEn: 'Recurring Decimal Code' },
            { num: '০৪', titleBn: 'রেড লাইন যোগ-বিয়োগ', titleEn: 'Red Line Method' },
            { num: '০৫', titleBn: 'ঝটপট বোর্ড কুইজ', titleEn: 'Rapid Board Quiz' },
          ],
          ctaBn: 'গাইডবুক খুলুন ও পড়ুন',
          ctaEn: 'Open Guidebook',
          ctaIcon: BookOpen,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'গাইডেড অরিয়েন্টেশন অন্তর্ভুক্ত',
          badgeSubBn: '৪-ধাপের নির্দেশিকা পথ',
        },
        {
          id: 2,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/2',
          titleBn: 'সেট ও ফাংশন',
          titleEn: 'Sets & Functions',
          chNumBn: 'অধ্যায় ০২',
          chNumEn: 'Chapter 02',
          timeBn: '২০ মিনিট',
          timeEn: '20 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ভেনচিত্র ম্যাপিং ও সেট অপারেশন, শক্তি সেট ও ২^n উপসেট প্রমাণ, কার্তেসীয় গুণজ ও অন্বয় গ্রিড এবং ফাংশন ডোমেন-রেঞ্জ ক্যালকুলেটর।',
          descEn:
            'Interactive Venn diagrams, power sets and 2^n subsets proof, Cartesian product relations grid, and function domain-range machine.',
          lessons: [
            { num: '০১', titleBn: 'সেট প্রকাশের পদ্ধতি ও প্রকারভেদ', titleEn: 'Set Notations & Types' },
            { num: '০২', titleBn: 'ভেনচিত্র ও সেট অপারেশন ল্যাব', titleEn: 'Venn Diagram & Operations' },
            { num: '০৩', titleBn: 'শক্তি সেট ও উপসেট সিমুলেটর', titleEn: 'Power Set & 2^n Subsets' },
            { num: '০৪', titleBn: 'কার্তেসীয় গুণজ ও অন্বয় ল্যাব', titleEn: 'Cartesian Product & Relations' },
            { num: '০৫', titleBn: 'ফাংশন, ডোমেন ও রেঞ্জ মেশিন', titleEn: 'Function, Domain & Range' },
          ],
          ctaBn: 'সেট ও ফাংশন ল্যাব খুলুন',
          ctaEn: 'Open Sets & Functions Lab',
          ctaIcon: Layers,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'ভেনচিত্র ও ফাংশন ডোমেন-রেঞ্জ',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 3,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/3',
          titleBn: 'বীজগাণিতিক রাশি',
          titleEn: 'Algebraic Expressions',
          chNumBn: 'অধ্যায় ০৩',
          chNumEn: 'Chapter 03',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'জ্যামিতিক টাইলস পার্টিশন প্রমাণ, x ± 1/x এর পাওয়ার সিঁড়ি ক্যালকুলেটর, মিডল-টার্ম স্প্লিটার এবং ভাগশেষ উপপাদ্য ভ্যানিশিং মেথড ল্যাব।',
          descEn:
            'Geometric tile proofs, x ± 1/x symmetrical power ladder, middle-term factor splitter, and remainder theorem vanishing lab.',
          lessons: [
            { num: '০১', titleBn: 'জ্যামিতিক টাইলস ও বর্গ-ঘন বিস্তার', titleEn: 'Geometric Tiles & Identities' },
            { num: '০২', titleBn: 'প্রতিসম x ± 1/x পাওয়ার সিঁড়ি', titleEn: 'x ± 1/x Power Ladder' },
            { num: '০৩', titleBn: 'মিডল-টার্ম উৎপাদক স্প্লিটার', titleEn: 'Middle-Term Factor Splitter' },
            { num: '০৪', titleBn: 'ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড', titleEn: 'Remainder & Factor Theorem' },
            { num: '০৫', titleBn: 'চক্র-ক্রমিক ও প্রতিসম রাশি ল্যাব', titleEn: 'Cyclic & Symmetric Expressions' },
          ],
          ctaBn: 'বীজগাণিতিক রাশি ল্যাব খুলুন',
          ctaEn: 'Open Algebraic Expressions Lab',
          ctaIcon: Binary,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'টাইলস প্রমাণ ও পাওয়ার সিঁড়ি',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 4,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/4',
          titleBn: 'সূচক ও লগারিদম',
          titleEn: 'Exponents & Logarithms',
          chNumBn: 'অধ্যায় ০৪',
          chNumEn: 'Chapter 04',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সূচকের ঘাত স্কেল ও শূন্য/ঋণাত্মক সূচকের সিঁড়ি, লগারিদম রূপান্তর তুলাদণ্ড, লগের মৌলিক ধর্মাবলি, সূচকীয় সমীকরণ সমাধানকারী এবং পূর্ণক-অংশক ল্যাব।',
          descEn:
            'Exponent power scale & zero/negative exponent ladder, logarithm balance converter, laws of logs, exponential equations solver, and characteristic-mantissa lab.',
          lessons: [
            { num: '০১', titleBn: 'সূচকের মৌলিক নিয়ম ও ঘাত স্কেল', titleEn: 'Laws of Indices & Power Scale' },
            { num: '০২', titleBn: 'লগারিদমের রূপান্তর তুলাদণ্ড ল্যাব', titleEn: 'Logarithm Definition & Balance' },
            { num: '০৩', titleBn: 'লগের গুণ, ভাগ ও ভিত্তি পরিবর্তন', titleEn: 'Laws of Logs & Base Change' },
            { num: '০৪', titleBn: 'সূচকীয় সমীকরণ সমাধানকারী', titleEn: 'Exponential Equations Solver' },
            { num: '০৫', titleBn: 'বৈজ্ঞানিক রূপ, পূর্ণক ও অংশক ল্যাব', titleEn: 'Scientific Notation, Char & Mantissa' },
          ],
          ctaBn: 'সূচক ও লগারিদম ল্যাব খুলুন',
          ctaEn: 'Open Exponents & Logs Lab',
          ctaIcon: Scale,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'রূপান্তর তুলাদণ্ড ও পূর্ণক-অংশক',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 5,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/5',
          titleBn: 'এক চলকবিশিষ্ট সমীকরণ',
          titleEn: 'Equations in One Variable',
          chNumBn: 'অধ্যায় ০৫',
          chNumEn: 'Chapter 05',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সমীকরণ বনাম অভেদ তুলাদণ্ড, দ্বিঘাত সমীকরণের নিশ্চায়ক কোলাইডার (D = b² - 4ac), অমূলদ সমীকরণের অবান্তর মূল ডিটেক্টর এবং বাস্তবভিত্তিক সমস্যা সমাধান ল্যাব।',
          descEn:
            'Equation vs identity balance scale, quadratic discriminant collider (D = b² - 4ac), extraneous root detector, and real-world word problems solver.',
          lessons: [
            { num: '০১', titleBn: 'সমীকরণ বনাম অভেদ তুলাদণ্ড', titleEn: 'Equation vs Identity Balance' },
            { num: '০২', titleBn: 'একঘাত সমীকরণ ও পক্ষান্তর ল্যাব', titleEn: 'Linear Equations & Transposition' },
            { num: '০৩', titleBn: 'দ্বিঘাত সমীকরণ ও নিশ্চায়ক কোলাইডার', titleEn: 'Quadratic & Discriminant Collider' },
            { num: '০৪', titleBn: 'অমূলদ সমীকরণ ও অবান্তর মূল ডিটেক্টর', titleEn: 'Radicals & Extraneous Root Detector' },
            { num: '০৫', titleBn: 'বাস্তব সমস্যা ও সমীকরণ গঠন', titleEn: 'Word Problems & Equation Modeling' },
          ],
          ctaBn: 'সমীকরণ ল্যাব খুলুন',
          ctaEn: 'Open Equations Lab',
          ctaIcon: GitBranch,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'নিশ্চায়ক ও অবান্তর মূল ডিটেক্টর',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 6,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/6',
          titleBn: 'রেখা, কোণ ও ত্রিভুজ',
          titleEn: 'Lines, Angles & Triangles',
          chNumBn: 'অধ্যায় ০৬',
          chNumEn: 'Chapter 06',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সন্নিহিত ও বিপ্রতীপ কোণ রোটেশন, সমান্তরাল রেখা ও ছেদক কোণ (একান্তর, অনুরূপ, অন্তঃস্থ), ত্রিভুজের কোণ সমষ্টি ১৮০° ও বহিঃস্থ কোণ উপপাদ্য, সর্বসমতার ৪টি শর্ত এবং পিথাগোরাস অসমতা ল্যাব।',
          descEn:
            'Adjacent & vertically opposite angle rotation, parallel lines & transversal angles (alternate, corresponding, interior), triangle angle sum 180° & exterior angle, 4 congruence criteria, and Pythagorean inequality.',
          lessons: [
            { num: '০১', titleBn: 'রেখা, কোণ ও সন্নিহিত/বিপ্রতীপ ল্যাব', titleEn: 'Lines, Angles & Linear Pair' },
            { num: '০২', titleBn: 'সমান্তরাল রেখা ও ছেদক কোণ ল্যাব', titleEn: 'Parallel Lines & Transversal' },
            { num: '০৩', titleBn: 'ত্রিভুজের কোণ সমষ্টি ১৮০° ও বহিঃস্থ কোণ', titleEn: 'Angle Sum 180° & Exterior Angle' },
            { num: '০৪', titleBn: 'ত্রিভুজের সর্বসমতার ৪টি শর্ত ল্যাব', titleEn: '4 Congruence Criteria (SAS/SSS/ASA/RHS)' },
            { num: '০৫', titleBn: 'পিথাগোরাস ও বাহুর অসমতা কোলাইডার', titleEn: 'Pythagoras & Triangle Inequality' },
          ],
          ctaBn: 'জ্যামিতি ল্যাব খুলুন',
          ctaEn: 'Open Geometry Lab',
          ctaIcon: Triangle,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'সমান্তরাল রেখা ও সর্বসমতা প্রুভার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 7,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/7',
          titleBn: 'ব্যবহারিক জ্যামিতি',
          titleEn: 'Practical Geometry',
          chNumBn: 'অধ্যায় ০৭',
          chNumEn: 'Chapter 07',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ত্রিভুজ অঙ্কন (সমষ্টি, অন্তর ও পরিসীমা ল্যাব), চতুর্ভুজ অঙ্কনের ৫টি স্বতন্ত্র শর্ত, সমকোণী ত্রিভুজ, রম্বসের দুই কর্ণ ও ট্রাপিজিয়াম সিমুলেটর।',
          descEn:
            'Triangle constructions (sum, difference & perimeter labs), 5 independent quadrilateral conditions, right triangles, rhombus & trapezoid simulator.',
          lessons: [
            { num: '০১', titleBn: 'ত্রিভুজ অঙ্কন: ভূমি, কোণ ও বাহুর সমষ্টি', titleEn: 'Triangle: Base, Angle & Sum of Sides' },
            { num: '০২', titleBn: 'ত্রিভুজ অঙ্কন: ভূমি, কোণ ও বাহুর অন্তর', titleEn: 'Triangle: Base, Angle & Difference of Sides' },
            { num: '০৩', titleBn: 'সমকোণী ও বিশেষ ত্রিভুজ অঙ্কন ল্যাব', titleEn: 'Right & Special Triangle Constructions' },
            { num: '০৪', titleBn: 'চতুর্ভুজ অঙ্কনের ৫টি স্বতন্ত্র শর্ত ল্যাব', titleEn: '5 Independent Quadrilateral Conditions' },
            { num: '০৫', titleBn: 'ট্রাপিজিয়াম ও রম্বস অঙ্কন সিমুলেটর', titleEn: 'Trapezoid & Rhombus Construction Simulator' },
          ],
          ctaBn: 'ব্যবহারিক জ্যামিতি ল্যাব খুলুন',
          ctaEn: 'Open Practical Geometry Lab',
          ctaIcon: Compass,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'কম্পাস-স্কেল সিমুলেটর ও সম্পাদ্য',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 8,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/8',
          titleBn: 'বৃত্ত',
          titleEn: 'Circle',
          chNumBn: 'অধ্যায় ০৮',
          chNumEn: 'Chapter 08',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'বৃত্তের কেন্দ্র ও জ্যা সংক্রান্ত উপপাদ্য, উপপাদ্য ২০ (কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ), বৃত্তস্থ চতুর্ভুজ, স্পর্শক এবং পরিবৃত্ত ও অন্তর্বৃত্ত সিমুলেটর।',
          descEn:
            'Circle center & chords, theorem 20 (central angle is double inscribed angle), cyclic quadrilaterals, tangents, and circumcircle/incircle construction simulator.',
          lessons: [
            { num: '০১', titleBn: 'বৃত্তের কেন্দ্র ও জ্যা সংক্রান্ত উপপাদ্য ল্যাব', titleEn: 'Circle Center & Chords Theorems Lab' },
            { num: '০২', titleBn: 'কেন্দ্রস্থ কোণ বৃত্তস্থ কোণের দ্বিগুণ ল্যাব', titleEn: 'Central vs Inscribed Angle Lab (Th 20)' },
            { num: '০৩', titleBn: 'বৃত্তস্থ চতুর্ভুজ ও বিপরীত কোণ উপপাদ্য', titleEn: 'Cyclic Quadrilateral Theorems (Th 23 & 24)' },
            { num: '০৪', titleBn: 'বৃত্তের স্পর্শক ও বহিঃস্থ বিন্দুর স্পর্শক ল্যাব', titleEn: 'Tangent & External Secant Lab (Th 25 & 26)' },
            { num: '০৫', titleBn: 'পরিবৃত্ত, অন্তর্বৃত্ত ও বহির্বৃত্ত অঙ্কন সিমুলেটর', titleEn: 'Circumcircle, Incircle & Excircle Simulator' },
          ],
          ctaBn: 'বৃত্ত ল্যাব খুলুন',
          ctaEn: 'Open Circle Lab',
          ctaIcon: Circle,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'উপপাদ্য ২০ ও স্পর্শক সিমুলেটর',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 9,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/9',
          titleBn: 'ত্রিকোণমিতিক অনুপাত',
          titleEn: 'Trigonometric Ratios',
          chNumBn: 'অধ্যায় ০৯',
          chNumEn: 'Chapter 09',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সমকোণী ত্রিভুজ ও ৬টি ত্রিকোণমিতিক অনুপাত, মৌলিক ৩টি অভেদাবলি ল্যাব, আদর্শ কোণের মান ছক ও হাতের তালু কৌশল, সমীকরণ সমাধান এবং পরিপূরক কোণ ল্যাব।',
          descEn:
            'Right-angled triangles & 6 trig ratios, 3 fundamental identities, standard angle value table & hand trick, equation solving, and complementary angles lab.',
          lessons: [
            { num: '০১', titleBn: 'সমকোণী ত্রিভুজ ও ৬টি মৌলিক ত্রিকোণমিতিক অনুপাত', titleEn: 'Right Triangle & 6 Fundamental Trig Ratios' },
            { num: '০২', titleBn: 'মৌলিক ৩টি ত্রিকোণমিতিক অভেদাবলি ল্যাব', titleEn: '3 Fundamental Trigonometric Identities' },
            { num: '০৩', titleBn: 'আদর্শ কোণসমূহের মান ছক ও হাতের তালু কৌশল', titleEn: 'Standard Trig Values Table & Hand Trick' },
            { num: '০৪', titleBn: 'ত্রিকোণমিতিক সমীকরণ সমাধান ও শর্ত ল্যাব', titleEn: 'Trigonometric Equations & Angle Constraints' },
            { num: '০৫', titleBn: 'পরিপূরক কোণ ও অনুপাতের রূপান্তর ল্যাব', titleEn: 'Complementary Angles & Ratio Conversions' },
          ],
          ctaBn: 'ত্রিকোণমিতি ল্যাব খুলুন',
          ctaEn: 'Open Trigonometry Lab',
          ctaIcon: Triangle,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'মান ছক ও অভেদাবলি সিমুলেটর',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 10,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/10',
          titleBn: 'দূরত্ব ও উচ্চতা',
          titleEn: 'Distance & Elevation',
          chNumBn: 'অধ্যায় ১০',
          chNumEn: 'Chapter 10',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'উন্নতি ও অবনতি কোণ সিমুলেটর, টাওয়ারের উচ্চতা ও ৩০°-৪৫°-৬০° অঙ্কন বিধি, নদীর বিস্তার ও দুই কোণ ল্যাব, ঝড়ে গাছ ভাঙার বাস্তব সমস্যা এবং বিপরীত পাশের দুই বস্তু ল্যাব।',
          descEn:
            'Angle of elevation & depression simulator, tower height & 30-45-60 drawing rules, river width & two-point observation lab, broken tree simulator, and dual object depression lab.',
          lessons: [
            { num: '০১', titleBn: 'উন্নতি কোণ ও অবনতি কোণ ল্যাব', titleEn: 'Angle of Elevation & Depression Simulator' },
            { num: '০২', titleBn: 'টাওয়ারের উচ্চতা ও ৩০°-৪৫°-৬০° জ্যামিতিক চিত্র', titleEn: 'Tower Height & 30-45-60 Geometry Rules' },
            { num: '০৩', titleBn: 'নদীর বিস্তার নির্ণয় ও দুই বিন্দুর পর্যবেক্ষণ', titleEn: 'River Width & Two Observation Points' },
            { num: '০৪', titleBn: 'ঝড়ে গাছ বা খুঁটি ভাঙার সমস্যা ল্যাব', titleEn: 'Broken Tree / Pole Simulator' },
            { num: '০৫', titleBn: 'বেলুন ও বিপরীত পাশের দুই বস্তু ল্যাব', titleEn: 'Dual Object Depression / Balloon Altitude' },
          ],
          ctaBn: 'দূরত্ব ও উচ্চতা ল্যাব খুলুন',
          ctaEn: 'Open Distance & Elevation Lab',
          ctaIcon: Mountain,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'উন্নতি-অবনতি ও গাছ ভাঙা ল্যাব',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 11,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/11',
          titleBn: 'বীজগাণিতিক অনুপাত ও সমানুপাত',
          titleEn: 'Algebraic Ratio & Proportion',
          chNumBn: 'অধ্যায় ১১',
          chNumEn: 'Chapter 11',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'অনুপাত ও সমানুপাত মৌলিক ধর্ম, যোজন ও বিয়োজন সিমুলেটর, ক্রমিক সমানুপাতি ও k-পদ্ধতি প্রমাণ, ধারাবাহিক অনুপাত ও "দ" গুণন নিয়ম এবং জটিল সমীকরণ সমাধান ল্যাব।',
          descEn:
            'Ratio & proportion fundamentals, componendo & dividendo balancer, continued proportion & k-method proof, compound ratio & distribution, and radical equation solver.',
          lessons: [
            { num: '০১', titleBn: 'অনুপাত ও সমানুপাত মৌলিক ধর্ম ল্যাব', titleEn: 'Ratio, Proportion & Cross-Multiplication' },
            { num: '০২', titleBn: 'যোজন ও বিয়োজন সিমুলেটর ল্যাব', titleEn: 'Componendo & Dividendo Balancer' },
            { num: '০৩', titleBn: 'ক্রমিক সমানুপাতি ও k-পদ্ধতি ল্যাব', titleEn: 'Continued Proportion & k-Method Proof' },
            { num: '০৪', titleBn: 'ধারাবাহিক অনুপাত ও বাস্তব বণ্টন ল্যাব', titleEn: 'Compound Ratio & Money Distribution' },
            { num: '০৫', titleBn: 'জটিল সমীকরণ সমাধান ল্যাব', titleEn: 'Radical Equation Solver via Comp-Div' },
          ],
          ctaBn: 'অনুপাত ও সমানুপাত ল্যাব খুলুন',
          ctaEn: 'Open Ratio & Proportion Lab',
          ctaIcon: Scale,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'যোজন-বিয়োজন ও k-পদ্ধতি মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 12,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/12',
          titleBn: 'দুই চলকবিশিষ্ট সরল সহসমীকরণ',
          titleEn: 'Simultaneous Linear Equations',
          chNumBn: 'অধ্যায় ১২',
          chNumEn: 'Chapter 12',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সহসমীকরণের প্রকৃতি ও শর্তাবলি, প্রতিস্থাপন ও অপনয়ন ডুয়েল ল্যাব, আড়গুণন ম্যাট্রিক্স, লেখচিত্র ও ছেদবিন্দু সিমুলেটর এবং নৌকা-স্রোতের বাস্তব গাণিতিক সমস্যা ল্যাব।',
          descEn:
            'System consistency & 3 conditions, substitution vs elimination dual lab, cross-multiplication determinant matrix, graphical intersection simulator, and upstream-downstream boat speed lab.',
          lessons: [
            { num: '০১', titleBn: 'সহসমীকরণের প্রকৃতি ও ৩টি শর্ত ল্যাব', titleEn: 'System Consistency & 3 Conditions' },
            { num: '০২', titleBn: 'প্রতিস্থাপন ও অপনয়ন ডুয়েল ল্যাব', titleEn: 'Substitution vs Elimination Dual Lab' },
            { num: '০৩', titleBn: 'আড়গুণন বা বজ্রগুণন ম্যাট্রিক্স ল্যাব', titleEn: 'Cross-Multiplication Determinant' },
            { num: '০৪', titleBn: 'লেখচিত্র ও ছেদবিন্দু সিমুলেটর ল্যাব', titleEn: 'Coordinate Graph & Intersection P(x,y)' },
            { num: '০৫', titleBn: 'বাস্তব সমস্যা: নৌকা ও স্রোতের বেগ ল্যাব', titleEn: 'Real-Life Upstream-Downstream Speed' },
          ],
          ctaBn: 'সহসমীকরণ ল্যাব খুলুন',
          ctaEn: 'Open Simultaneous Equations Lab',
          ctaIcon: Grid,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'আড়গুণন ও লেখচিত্র মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 13,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/13',
          titleBn: 'সসীম ধারা',
          titleEn: 'Finite Series',
          chNumBn: 'অধ্যায় ১৩',
          chNumEn: 'Chapter 13',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সমান্তর ধারা ও n-তম পদ, সমষ্টি ও গাউস পেয়ারিং, বিশেষ ৩টি স্বাভাবিক ধারা (∑n, ∑n², ∑n³), গুণোত্তর ধারা বৃদ্ধি ও লগারিদমিক রূপান্তর ল্যাব।',
          descEn:
            'Arithmetic progression & n-th term, AP sum & Gauss pairing, 3 special natural series (sum n, sum n^2, sum n^3), geometric progression & logarithmic series lab.',
          lessons: [
            { num: '০১', titleBn: 'সমান্তর ধারা ও n-তম পদ সিমুলেটর ল্যাব', titleEn: 'Arithmetic Progression & n-th Term' },
            { num: '০২', titleBn: 'সমান্তর ধারার সমষ্টি ও গাউস পেয়ারিং ল্যাব', titleEn: 'AP Sum & Gauss Pair Visualizer' },
            { num: '০৩', titleBn: 'বিশেষ ৩টি স্বাভাবিক ধারা ল্যাব (∑n, ∑n², ∑n³)', titleEn: 'Natural Numbers, Squares & Cubes' },
            { num: '০৪', titleBn: 'গুণোত্তর ধারা ও সাধারণ অনুপাত ল্যাব', titleEn: 'Geometric Progression & Growth' },
            { num: '০৫', titleBn: 'গুণোত্তর ধারার সমষ্টি ও লগারিদমিক ধারা ল্যাব', titleEn: 'GP Summation & Logarithmic Series' },
          ],
          ctaBn: 'সসীম ধারা ল্যাব খুলুন',
          ctaEn: 'Open Finite Series Lab',
          ctaIcon: Hash,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'সমান্তর, গুণোত্তর ও গাউস মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 14,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/14',
          titleBn: 'অনুপাত, সদৃশতা ও প্রতিসমতা',
          titleEn: 'Ratio, Similarity & Symmetry',
          chNumBn: 'অধ্যায় ১৪',
          chNumEn: 'Chapter 14',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'থেলিসের উপপাদ্য ও সমান্তরাল রেখা বিভাজন, কোণের অন্তঃসমদ্বিখণ্ডক উপপাদ্য, সদৃশকোণী ত্রিভুজ অনুপাত, সদৃশ ত্রিভুজ ক্ষেত্রফল অনুপাত উপপাদ্য ৩৩ এবং রৈখিক ও ঘূর্ণন প্রতিসমতা মাত্রা ল্যাব।',
          descEn:
            "Thales's theorem parallel division, angle bisector theorem, similar triangles ratio, similar triangle area theorem 33 (k^2), and line/rotational symmetry order lab.",
          lessons: [
            { num: '০১', titleBn: 'থেলিসের উপপাদ্য ও সমান্তরাল বিভাজন ল্যাব', titleEn: "Thales's Theorem & Parallel Division" },
            { num: '০২', titleBn: 'কোণের অন্তঃসমদ্বিখণ্ডক ও অনুপাত বিভাজক ল্যাব', titleEn: 'Angle Bisector Division Theorem' },
            { num: '০৩', titleBn: 'সদৃশকোণী ত্রিভুজ ও অনুরূপ বাহুর অনুপাত ল্যাব', titleEn: 'Equiangular Triangles & Side Proportions' },
            { num: '০৪', titleBn: 'সদৃশ ত্রিভুজ ক্ষেত্রফল বনাম বাহুর বর্গ ল্যাব', titleEn: 'Similar Triangles Area Theorem 33' },
            { num: '০৫', titleBn: 'রৈখিক ও ঘূর্ণন প্রতিসমতা মাত্রা ল্যাব', titleEn: 'Line & Rotational Symmetry Order Lab' },
          ],
          ctaBn: 'অনুপাত ও সদৃশতা ল্যাব খুলুন',
          ctaEn: 'Open Ratio & Similarity Lab',
          ctaIcon: Shapes,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'থেলিস ও ঘূর্ণন প্রতিসমতা মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 15,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/15',
          titleBn: 'ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য',
          titleEn: 'Area Theorems & Constructions',
          chNumBn: 'অধ্যায় ১৫',
          chNumEn: 'Chapter 15',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'একই ভূমি ও সমান্তরাল যুগলে সামান্তরিক ক্ষেত্রফল (উপপাদ্য ৩৫), ত্রিভুজ ক্ষেত্রফল বনাম সামান্তরিকের অর্ধেক (উপপাদ্য ৩৬), মধ্যমা ক্ষেত্রফল সমদ্বিখণ্ডন, পিথাগোরাস ও গারফিল্ড ট্রাপিজিয়াম ব্যবচ্ছেদ এবং সম্পাদ্য ১৩ ল্যাব।',
          descEn:
            'Parallelograms on same base (Thm 35), triangle half-area (Thm 36), median bisection, Pythagoras Garfield trapezoid dissection and construction 13 lab.',
          lessons: [
            { num: '০১', titleBn: 'একই ভূমি ও সমান্তরাল যুগলে সামান্তরিক ল্যাব', titleEn: 'Parallelograms on Same Base (Thm 35)' },
            { num: '০২', titleBn: 'ত্রিভুজ ক্ষেত্রফল বনাম সামান্তরিকের অর্ধেক ল্যাব', titleEn: 'Triangles Half-Parallelogram Area (Thm 36)' },
            { num: '০৩', titleBn: 'মধ্যমা দ্বারা ত্রিভুজ ক্ষেত্রফল সমদ্বিখণ্ডন ল্যাব', titleEn: 'Median Bisects Area Equally' },
            { num: '০৪', titleBn: 'পিথাগোরাস ও গারফিল্ড ট্রাপিজিয়াম ব্যবচ্ছেদ ল্যাব', titleEn: "Pythagoras & Garfield's Trapezoid" },
            { num: '০৫', titleBn: 'ক্ষেত্রফল সংরক্ষণ সম্পাদ্য ল্যাব (ত্রিভুজ থেকে সামান্তরিক)', titleEn: 'Construction 13 Area-Conserving Lab' },
          ],
          ctaBn: 'ক্ষেত্রফল ও সম্পাদ্য ল্যাব খুলুন',
          ctaEn: 'Open Area & Construction Lab',
          ctaIcon: Compass,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'পিথাগোরাস ও ক্ষেত্রফল সমতা মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 16,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/16',
          titleBn: 'পরিমিতি',
          titleEn: 'Mensuration',
          chNumBn: 'অধ্যায় ১৬',
          chNumEn: 'Chapter 16',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'ত্রিভুজ ক্ষেত্রফল চতুর্মুখী ল্যাব, চতুর্ভুজ ও ট্রাপিজিয়াম সিমুলেটর, সুষম বহুভুজ ও অপোথেম ল্যাব, বৃত্ত ও বৃত্তকলার চাপ দৈর্ঘ্য এবং ৩-মাত্রিক ঘনবস্তু ও বেলনের সমগ্রপৃষ্ঠ ও আয়তন।',
          descEn:
            'Triangles area master lab, quadrilaterals & trapezoid simulator, regular polygon & apothem lab, circle & sector arc length, and 3D cuboid, cube & cylinder surface and volume.',
          lessons: [
            { num: '০১', titleBn: 'ত্রিভুজ ক্ষেত্রফল বহুমুখী ল্যাব', titleEn: 'Triangles Area Master Lab (16.1)' },
            { num: '০২', titleBn: 'চতুর্ভুজ ও ট্রাপিজিয়াম সিমুলেটর ল্যাব', titleEn: 'Quadrilaterals: Parallelogram, Rhombus, Trapezoid' },
            { num: '০৩', titleBn: 'সুষম বহুভুজ ক্ষেত্রফল ও অন্তঃকোণ ল্যাব', titleEn: 'Regular Polygons Area & Angles Lab (16.2)' },
            { num: '০৪', titleBn: 'বৃত্ত, বৃত্তকলা ও চাকার ঘূর্ণন ল্যাব', titleEn: 'Circle, Sector Area & Wheel Revolutions (16.3)' },
            { num: '০৫', titleBn: '৩-মাত্রিক আয়তাকার ঘনবস্তু, ঘনক ও বেলন ল্যাব', titleEn: '3D Solids: Cuboid, Cube & Cylinder (16.4)' },
          ],
          ctaBn: 'পরিমিতি ল্যাব খুলুন',
          ctaEn: 'Open Mensuration Lab',
          ctaIcon: Box,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'ত্রিভুজ, বৃত্তকলা ও সিলিন্ডার মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
        {
          id: 17,
          subjectKey: 'math',
          subjectNameBn: 'সাধারণ গণিত',
          subjectNameEn: 'General Mathematics',
          href: '/dashboard/playground/v2/math/17',
          titleBn: 'পরিসংখ্যান',
          titleEn: 'Statistics',
          chNumBn: 'অধ্যায় ১৭',
          chNumEn: 'Chapter 17',
          timeBn: '২৫ মিনিট',
          timeEn: '25 min',
          weightBn: '১০ নম্বর',
          weightEn: '10 Marks',
          descBn:
            'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয় সিমুলেটর, মধ্যক ও ক্রমযোজিত গণসংখ্যা সারণি, প্রচুরক ও প্রান্তিক শ্রেণি ট্র্যাপ, অজিভ রেখা থেকে মধ্যক প্রজেকশন এবং আয়তলেখ ও বহুভুজ ল্যাব।',
          descEn:
            'Short-cut method for mean simulator, median & cumulative frequency table, mode & boundary class traps, Ogive curve median projection, and histogram & frequency polygon lab.',
          lessons: [
            { num: '০১', titleBn: 'সংক্ষিপ্ত পদ্ধতিতে গড় নির্ণয় সিমুলেটর', titleEn: 'Short-cut Method for Mean (17.1)' },
            { num: '০২', titleBn: 'মধ্যক নির্ণয় ও ক্রমযোজিত গণসংখ্যা ল্যাব', titleEn: 'Median & Cumulative Frequency (17.2)' },
            { num: '০৩', titleBn: 'প্রচুরক নির্ণয় সিমুলেটর', titleEn: 'Mode of Grouped Data (17.3)' },
            { num: '০৪', titleBn: 'অজিভ রেখা ও মধ্যক সন্ধানী', titleEn: 'Ogive Curve & Median Projection (17.4)' },
            { num: '০৫', titleBn: 'আয়তলেখ ও গণসংখ্যা বহুভুজ ল্যাব', titleEn: 'Histogram & Frequency Polygon (17.5)' },
          ],
          ctaBn: 'পরিসংখ্যান ল্যাব খুলুন',
          ctaEn: 'Open Statistics Lab',
          ctaIcon: BarChart3,
          accentColor: 'text-primary',
          borderHover: 'hover:border-primary',
          badgeTextBn: 'গড়, মধ্যক, প্রচুরক ও অজিভ মাস্টার',
          badgeSubBn: '৫-ধাপের সম্পূর্ণ প্রস্তুতি',
        },
      ],
      upcomingChapters: [],
    },
    {
      id: 'higher-math',
      nameBn: 'উচ্চতর গণিত',
      nameEn: 'Higher Mathematics',
      code: 'HMATH-126',
      icon: Binary,
      taglineBn: 'স্থানাঙ্ক জ্যামিতি, ত্রিকোণমিতি ও অসীম ধারা',
      taglineEn: 'Coordinate Geometry, Trig & Infinite Series',
      activeCount: 0,
      totalChaptersBn: '১৪টি অধ্যায়',
      totalChaptersEn: '14 Chapters',
      bgGlow: 'hover:border-sky-500/80 hover:bg-sky-500/5',
      borderColor: 'border-sky-500/40',
      badgeBg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20',
      badgeText: 'text-sky-600 dark:text-sky-400',
      accentBg: 'bg-sky-600 hover:bg-sky-700',
      liveChapters: [],
      upcomingChapters: [
        {
          chNumBn: 'অধ্যায় ০১',
          chNumEn: 'Chapter 01',
          titleBn: 'উচ্চতর সেট ও ফাংশন',
          titleEn: 'Advanced Sets & Functions',
          descBn: 'এক-এক ফাংশন ও বিপরীত ফাংশন গ্রাফ বিশ্লেষণ ও প্রমাণের ড্রয়ার।',
          descEn: 'One-to-one function and inverse function graph analyzer.',
        },
        {
          chNumBn: 'অধ্যায় ০৭',
          chNumEn: 'Chapter 07',
          titleBn: 'অসীম ধারা (Infinite Series)',
          titleEn: 'Infinite Series',
          descBn: 'গুণোত্তর ধারার অসীমতক সমষ্টি ও অভিসারিতা সীমা ভিজ্যুয়ালাইজার।',
          descEn: 'Sum to infinity and convergence limit visualizer.',
        },
        {
          chNumBn: 'অধ্যায় ১১',
          chNumEn: 'Chapter 11',
          titleBn: 'স্থানাঙ্ক জ্যামিতি',
          titleEn: 'Coordinate Geometry',
          descBn: 'ত্রিভুজের ক্ষেত্রফল, বিন্দুর দূরত্ব ও সরলরেখার ঢাল ডাইনামিক গ্রিড।',
          descEn: 'Area of triangle, distance between points & slope grid.',
        },
      ],
    },
    {
      id: 'chemistry',
      nameBn: 'রসায়ন',
      nameEn: 'Chemistry',
      code: 'CHEM-137',
      icon: FlaskConical,
      taglineBn: 'পরমাণুর মডেল, পর্যায় সারণি ও রাসায়নিক বন্ধন ল্যাব',
      taglineEn: 'Atomic Models, Periodic Table & Chemical Bonds Lab',
      activeCount: 0,
      totalChaptersBn: '১২টি অধ্যায়',
      totalChaptersEn: '12 Chapters',
      bgGlow: 'hover:border-violet-500/80 hover:bg-violet-500/5',
      borderColor: 'border-violet-500/40',
      badgeBg: 'bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20',
      badgeText: 'text-violet-600 dark:text-violet-400',
      accentBg: 'bg-violet-600 hover:bg-violet-700',
      liveChapters: [],
      upcomingChapters: [
        {
          chNumBn: 'অধ্যায় ০৩',
          chNumEn: 'Chapter 03',
          titleBn: 'পদার্থের গঠন ও পরমাণু মডেল',
          titleEn: 'Structure of Matter',
          descBn: 'রাদারফোর্ড ও বোর মডেলের কক্ষপথ ইলেকট্রন ঘূর্ণন ৩D সিমুলেটর।',
          descEn: 'Rutherford & Bohr orbit electron rotation 3D simulator.',
        },
        {
          chNumBn: 'অধ্যায় ০৪',
          chNumEn: 'Chapter 04',
          titleBn: 'পর্যায় সারণি ল্যাব (Periodic Table)',
          titleEn: 'Periodic Table Lab',
          descBn: 'ইন্টারেক্টিভ ১১৮টি মৌল, ইলেকট্রন বিন্যাস ও পর্যায়বৃত্ত ধর্মের মানচিত্র।',
          descEn: 'Interactive 118 elements, electron configuration & periodic trends.',
        },
        {
          chNumBn: 'অধ্যায় ০৫',
          chNumEn: 'Chapter 05',
          titleBn: 'রাসায়নিক বন্ধন',
          titleEn: 'Chemical Bonds',
          descBn: 'আয়নিক ও সমযোজী বন্ধনের ইলেকট্রন শেয়ারিং অ্যানিমেশন।',
          descEn: 'Ionic and covalent bonding electron sharing animation.',
        },
      ],
    },
    {
      id: 'biology',
      nameBn: 'জীববিজ্ঞান',
      nameEn: 'Biology',
      code: 'BIO-138',
      icon: Dna,
      taglineBn: 'কোষীয় গঠন, মাইটোসিস বিভাজন ও জিনতত্ত্ব',
      taglineEn: 'Cell Architecture, Mitosis Division & Genetics',
      activeCount: 0,
      totalChaptersBn: '১৪টি অধ্যায়',
      totalChaptersEn: '14 Chapters',
      bgGlow: 'hover:border-emerald-500/80 hover:bg-emerald-500/5',
      borderColor: 'border-emerald-500/40',
      badgeBg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      badgeText: 'text-emerald-600 dark:text-emerald-400',
      accentBg: 'bg-emerald-600 hover:bg-emerald-700',
      liveChapters: [],
      upcomingChapters: [
        {
          chNumBn: 'অধ্যায় ০২',
          chNumEn: 'Chapter 02',
          titleBn: 'জীবকোষ ও টিস্যু',
          titleEn: 'Plant & Animal Cells',
          descBn: 'উদ্ভিদ ও প্রাণিকোষের অঙ্গাণুসমূহের ৩D এক্সপ্লোরার ও ফাংশন মানচিত্র।',
          descEn: 'Plant and animal cell organelle 3D explorer and function map.',
        },
        {
          chNumBn: 'অধ্যায় ০৩',
          chNumEn: 'Chapter 03',
          titleBn: 'কোষ বিভাজন (Cell Division)',
          titleEn: 'Cell Division',
          descBn: 'মাইটোসিস ও মিয়োসিসের ধাপভিত্তিক ক্রোমোজোম রূপান্তর ল্যাব।',
          descEn: 'Mitosis and meiosis step-by-step chromosome transition lab.',
        },
      ],
    },
  ];

  // Filtered Subject Items based on selection
  const displayedSubjects =
    activeSubject === 'all' ? SUBJECTS : SUBJECTS.filter((s) => s.id === activeSubject);

  const totalLiveChapters = SUBJECTS.reduce((acc, curr) => acc + curr.activeCount, 0);

  return (
    <div className="space-y-12">
      {/* V2 Hero Header - Calm Editorial Style */}
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 sm:p-10 shadow-sm">
        <div className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <BookOpen className="h-3.5 w-3.5" />
            <span>
              {isBn
                ? 'সংস্করণ ২ • ভার্চুয়াল ইন্টারেক্টিভ গাইডবুক'
                : 'Version 2 • Virtual Interactive Guidebook'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight font-heading text-foreground">
            {isBn ? 'শান্ত পরিবেশ, ' : 'Calm Discovery, '}
            <span className="text-[#FF6B57]">
              {isBn ? 'গভীর যুক্তি ও বোর্ড প্রস্তুতি' : 'Deep Logic & Board Mastery'}
            </span>
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {isBn
              ? 'অনর্থক গেমিফিকেশন বা টাইমার চাপ ছাড়া বিষয় ও অধ্যায়ভিত্তিক শিখন। প্রথমে বিষয় নির্বাচন করুন, তারপর অধ্যায়ের প্রতিটি সূত্রের পেছনের যুক্তি বুঝুন ও এসএসসি বোর্ড পরীক্ষায় সর্বোচ্চ নম্বর নিশ্চিত করুন।'
              : 'Study textbook chapters step-by-step without gaming timers. Pick your subject first, then explore each chapter’s foundational logic, interactive simulators, and board exam rubrics.'}
          </p>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 1. SUBJECTS SELECTION BAR (বিষয় নির্বাচন করুন) */}
      {/* ========================================================= */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-[#FF6B57]" />
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground font-heading">
                {isBn ? 'বিষয় নির্বাচন করুন' : 'Select Subject'}
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                {isBn
                  ? 'প্রথমে বিষয় বেছে নাও, এরপর বিষয়ের অন্তর্গত প্রতিটি অধ্যায় বিস্তারিত দেখো'
                  : 'Choose a subject first, then explore chapters under each subject'}
              </p>
            </div>
          </div>

          {/* Quick Pill Filter & All Toggle */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              {isBn
                ? `${totalLiveChapters}টি অধ্যায় সম্পূর্ণ লাইভ`
                : `${totalLiveChapters} Chapters Live`}
            </span>
          </div>
        </div>

        {/* 5 Distinct Subject Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            const isSelected = activeSubject === sub.id;
            const hasLiveChapters = sub.activeCount > 0;

            return (
              <button
                key={sub.id}
                data-subject-card={sub.id}
                onClick={() => setActiveSubject(sub.id)}
                className={`group relative text-left p-4 rounded-2xl border-2 transition-all flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-[#FF6B57] bg-primary/5 shadow-md ring-2 ring-[#FF6B57]/20'
                    : 'border-border/70 bg-card hover:border-border hover:shadow-sm'
                }`}
              >
                <div className="space-y-3">
                  {/* Icon & Live Badge */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#FF6B57] text-white shadow-xs'
                          : 'bg-muted/70 text-foreground group-hover:bg-primary/10 group-hover:text-primary'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>

                    {hasLiveChapters ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{isBn ? `${sub.activeCount} অধ্যায় লাইভ` : `${sub.activeCount} Live`}</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground">
                        {isBn ? 'শীঘ্রই' : 'Soon'}
                      </span>
                    )}
                  </div>

                  {/* Title & Code */}
                  <div>
                    <div className="text-[11px] font-mono text-muted-foreground font-semibold">
                      {sub.code}
                    </div>
                    <div className="text-base font-extrabold text-foreground group-hover:text-primary transition-colors">
                      {isBn ? sub.nameBn : sub.nameEn}
                    </div>
                    <div className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {isBn ? sub.taglineBn : sub.taglineEn}
                    </div>
                  </div>
                </div>

                {/* Bottom Syllabus pill */}
                <div className="pt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{isBn ? sub.totalChaptersBn : sub.totalChaptersEn}</span>
                  <ChevronRight
                    className={`h-3.5 w-3.5 transition-transform ${
                      isSelected ? 'translate-x-1 text-[#FF6B57]' : 'text-muted-foreground'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>

        {/* Horizontal Quick Filter Pills Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 pb-2">
          <button
            data-subject-pill="all"
            onClick={() => setActiveSubject('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeSubject === 'all'
                ? 'bg-foreground text-background shadow-xs'
                : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{isBn ? 'সকল বিষয় (All Subjects)' : 'All Subjects'}</span>
          </button>

          {SUBJECTS.map((sub) => {
            const Icon = sub.icon;
            const isSelected = activeSubject === sub.id;
            return (
              <button
                key={sub.id}
                data-subject-pill={sub.id}
                onClick={() => setActiveSubject(sub.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#FF6B57] text-white shadow-xs'
                    : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{isBn ? sub.nameBn : sub.nameEn}</span>
                {sub.activeCount > 0 && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-600'
                    }`}
                  >
                    {sub.activeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. CHAPTERS PER SUBJECT (বিষয় অনুযায়ী অধ্যায়সমূহ) */}
      {/* ========================================================= */}
      <div className="space-y-12">
        {displayedSubjects.map((sub) => {
          const SubIcon = sub.icon;
          const hasLive = sub.liveChapters.length > 0;

          return (
            <section
              key={sub.id}
              className="space-y-6 pt-6 border-t border-border/70 first:pt-0 first:border-0"
            >
              {/* Subject Header Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-muted/30 border border-border/70">
                <div className="flex items-center gap-3.5">
                  <div className="h-12 w-12 rounded-2xl bg-card border border-border/80 flex items-center justify-center text-foreground shadow-xs shrink-0">
                    <SubIcon className="h-6 w-6 text-[#FF6B57]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl sm:text-2xl font-black text-foreground font-heading">
                        {isBn ? sub.nameBn : sub.nameEn}
                      </h3>
                      <span className="text-xs font-mono font-bold text-muted-foreground px-2 py-0.5 bg-muted rounded-md border border-border/50">
                        {sub.code}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                      {isBn ? sub.taglineBn : sub.taglineEn} •{' '}
                      {isBn ? `সিলেবাস: ${sub.totalChaptersBn}` : `Syllabus: ${sub.totalChaptersEn}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  {hasLive ? (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-xl border border-emerald-500/20 flex items-center gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>
                        {isBn
                          ? `${sub.liveChapters.length}টি অধ্যায় সম্পূর্ণ প্রস্তুত`
                          : `${sub.liveChapters.length} Chapter Ready`}
                      </span>
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-xl border border-border">
                      {isBn ? 'আসন্ন নতুন ল্যাব' : 'Coming Soon'}
                    </span>
                  )}
                </div>
              </div>

              {/* LIVE CHAPTER CARDS UNDER THIS SUBJECT */}
              {sub.liveChapters.length > 0 && (
                <div className="space-y-6">
                  {sub.liveChapters.map((ch) => {
                    const CtaIcon = ch.ctaIcon;
                    return (
                      <div
                        key={ch.id}
                        className={`group relative overflow-hidden rounded-3xl border-2 bg-card p-6 sm:p-8 transition-all hover:shadow-xl ${
                          sub.id === 'physics'
                            ? 'border-emerald-500/30 hover:border-emerald-500'
                            : 'border-primary/30 hover:border-primary'
                        }`}
                      >
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          {/* Left Details */}
                          <div className="space-y-5 flex-1">
                            <div className="flex flex-wrap items-center gap-2.5">
                              <span
                                className={`rounded-lg px-3 py-1 text-xs font-black flex items-center gap-1.5 border ${
                                  sub.id === 'physics'
                                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                    : 'bg-primary/10 text-primary border-primary/20'
                                }`}
                              >
                                <SubIcon className="h-3.5 w-3.5" />
                                <span>{isBn ? `${ch.chNumBn} • ${sub.nameBn}` : `${ch.chNumEn} • ${sub.nameEn}`}</span>
                              </span>

                              <span className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5" />
                                <span>{isBn ? `পড়ার সময়: ${ch.timeBn}` : `Study Time: ${ch.timeEn}`}</span>
                              </span>

                              <span className="rounded-lg bg-rose-500/10 border border-rose-500/20 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                                <Award className="h-3.5 w-3.5" />
                                <span>{isBn ? `বোর্ড পরীক্ষায় মান: ${ch.weightBn}` : `Board Weight: ${ch.weightEn}`}</span>
                              </span>
                            </div>

                            <div>
                              <h4 className="text-2xl sm:text-3xl font-black text-foreground font-heading mb-2">
                                {isBn ? ch.titleBn : ch.titleEn}
                              </h4>
                              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                                {isBn ? ch.descBn : ch.descEn}
                              </p>
                            </div>

                            {/* 5 Lessons Mini Pill List */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2">
                              {ch.lessons.map((lesson) => (
                                <div
                                  key={lesson.num}
                                  className="flex items-center gap-2 rounded-xl bg-muted/40 border border-border/50 px-3 py-2 text-xs font-semibold"
                                >
                                  <span
                                    className={`font-mono font-bold ${
                                      sub.id === 'physics' ? 'text-emerald-600' : 'text-primary'
                                    }`}
                                  >
                                    {lesson.num}
                                  </span>
                                  <span className="text-foreground">
                                    {isBn ? lesson.titleBn : lesson.titleEn}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Right CTA Box */}
                          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch gap-3 lg:w-60">
                            <Link
                              href={ch.href as any}
                              className={`flex items-center justify-center gap-2 rounded-2xl text-white px-6 py-4 text-sm font-extrabold shadow-lg transition-all hover:scale-[1.02] ${
                                sub.id === 'physics'
                                  ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                                  : 'bg-[#FF6B57] hover:bg-[#e05340] shadow-[#FF6B57]/20'
                              }`}
                            >
                              <CtaIcon className="h-4 w-4" />
                              <span>{isBn ? ch.ctaBn : ch.ctaEn}</span>
                              <ArrowRight className="h-4 w-4" />
                            </Link>

                            <div className="rounded-2xl border border-border/60 bg-muted/30 p-3 text-center">
                              <div className="text-[11px] text-muted-foreground">
                                {isBn ? ch.badgeTextBn : 'Interactive Simulator'}
                              </div>
                              <div className="text-xs font-bold text-foreground mt-0.5">
                                {isBn ? ch.badgeSubBn : '5-Step Board Mastery'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* UPCOMING CHAPTERS UNDER THIS SUBJECT */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {isBn
                        ? `${sub.nameBn} এর আসন্ন ভার্চুয়াল অধ্যায়সমূহ`
                        : `Upcoming Chapters for ${sub.nameEn}`}
                    </span>
                  </div>
                  {activeSubject !== 'all' && (
                    <button
                      onClick={() => setActiveSubject('all')}
                      className="text-primary hover:underline"
                    >
                      {isBn ? 'সব বিষয় দেখুন' : 'Show All Subjects'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {sub.upcomingChapters.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-dashed border-border/70 bg-card/50 p-4.5 space-y-2 opacity-80 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                        <span className="font-mono text-primary font-bold">
                          {isBn ? item.chNumBn : item.chNumEn}
                        </span>
                        <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                          {item.tagBn || (isBn ? 'পরিকল্পিত' : 'Planned')}
                        </span>
                      </div>
                      <h5 className="text-sm font-extrabold text-foreground">
                        {isBn ? item.titleBn : item.titleEn}
                      </h5>
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                        {isBn ? item.descBn : item.descEn}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          );
        })}
      </div>

      {/* ========================================================= */}
      {/* 3. PEDAGOGICAL DESIGN MANIFESTO */}
      {/* ========================================================= */}
      <div className="rounded-3xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/30 p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <ShieldCheck className="h-5 w-5" />
          <span>
            {isBn ? 'কেন সংস্করণ ২ শিক্ষার্থীদের জন্য সবচেয়ে কার্যকর?' : 'Why Version 2 Works for Students'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="space-y-1.5">
            <div className="font-bold text-sm text-foreground">
              {isBn ? '১. শান্ত শিখন পরিবেশ (Calm Focus)' : '1. Calm Focus'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn
                ? 'কোলাহলপূর্ণ টাইমার ও স্ট্রিকের চাপ সরিয়ে শিক্ষার্থীদের দীর্ঘস্থায়ী মনোযোগ ধরে রাখে।'
                : 'Removes chaotic timers and gamified stress, fostering deep, uninterrupted comprehension.'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-sm text-foreground">
              {isBn ? '২. ফ্রেম-বাই-ফ্রেম যুক্তি (Proof Narrative)' : '2. Proof Narrative'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn
                ? 'সূত্র মুখস্থ না করিয়ে "কেন এই ধাপ?" ড্রয়ার ও সিমুলেটরের মাধ্যমে যৌক্তিক সত্যতা উন্মোচন করে।'
                : 'Unveils the foundational logic behind each formula through step-by-step interactive simulations.'}
            </p>
          </div>
          <div className="space-y-1.5">
            <div className="font-bold text-sm text-foreground">
              {isBn ? '৩. বোর্ড পরীক্ষার নিশ্চয়তা (Exam Secure)' : '3. Exam Secure'}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {isBn
                ? 'প্রত্যেকটি ইন্টারঅ্যাকশন সরাসরি এসএসসি বোর্ড সৃজনশীল ও বহুনির্বাচনীর সাথে সামঞ্জস্যপূর্ণ।'
                : 'Every interaction directly maps to NCTB SSC Board creative questions and marking rubrics.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
