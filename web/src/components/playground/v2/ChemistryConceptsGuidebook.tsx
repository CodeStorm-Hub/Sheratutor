'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  Flame,
  Biohazard,
  Radiation,
  Skull,
  Droplets,
  TestTube2,
  Thermometer,
  ShieldCheck,
  Zap,
  Activity,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Award,
  AlertCircle,
  Copy,
  Sparkles,
  Send,
  Sliders,
  ChevronDown,
  ChevronRight,
  Eye,
  Info,
  HelpCircle,
  Trophy,
  Bookmark,
  Lightbulb,
  Check,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Layers,
  Search,
  Share2,
  FileText,
  Apple,
  Scale,
  Sparkle,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// 8 GHS Hazard Symbols defined in NCTB Chemistry Chapter 1
interface HazardSymbol {
  id: string;
  nameBn: string;
  nameEn: string;
  code: string;
  iconType: 'explosive' | 'flammable' | 'oxidizing' | 'toxic' | 'health' | 'irritant' | 'radioactive' | 'environmental' | 'corrosive';
  riskLevelBn: 'চরম বিপজ্জনক' | 'উচ্চ ঝুঁকি' | 'মধ্যম ঝুঁকি' | 'সতর্কতা প্রয়োজন';
  riskLevelEn: 'Extremely Hazardous' | 'High Risk' | 'Moderate Risk' | 'Caution Required';
  examplesBn: string[];
  examplesEn: string[];
  hazardsBn: string;
  hazardsEn: string;
  precautionsBn: string;
  precautionsEn: string;
  disposalBn: string;
  disposalEn: string;
  colorClass: string;
  bgGlow: string;
}

const GHS_HAZARD_SYMBOLS: HazardSymbol[] = [
  {
    id: 'explosive',
    nameBn: 'বিস্ফোরক পদার্থ',
    nameEn: 'Explosive Substance',
    code: 'GHS01',
    iconType: 'explosive',
    riskLevelBn: 'চরম বিপজ্জনক',
    riskLevelEn: 'Extremely Hazardous',
    examplesBn: ['টিএনটি (TNT - Trinitrotoluene)', 'জৈব পারঅক্সাইড (Organic Peroxide)', 'নাইট্রোগ্লিসারিন (Nitroglycerin)'],
    examplesEn: ['TNT (Trinitrotoluene)', 'Organic Peroxides', 'Nitroglycerin'],
    hazardsBn: 'আঘাত, ঘর্ষণ বা তাপের সংস্পর্শে দ্রুত ও প্রচণ্ড বিস্ফোরণ ঘটিয়ে গবেষণাগার এবং শরীরের মারাত্মক ক্ষতি করতে পারে।',
    hazardsEn: 'Severe explosion risk upon shock, friction, or exposure to heat, causing devastating lab damage and injuries.',
    precautionsBn: 'খুব সতর্কতার সাথে নাড়াচাড়া করতে হবে; ঘর্ষণ, আঘাত এবং আগুনের স্ফুলিঙ্গ বা তাপ থেকে সম্পূর্ণ দূরে সংরক্ষণ করতে হবে।',
    precautionsEn: 'Handle with extreme delicacy; isolate completely from friction, shock, open sparks, and heat.',
    disposalBn: 'বিশেষ বোতলজাতকরণ ও বিশেষজ্ঞদের তত্ত্বাবধানে নিয়ন্ত্রিত নিউট্রালাইজেশন করতে হবে।',
    disposalEn: 'Controlled specialized neutralization under expert supervision.',
    colorClass: 'text-amber-500 border-amber-500/40 bg-amber-500/10',
    bgGlow: 'hover:border-amber-500 hover:shadow-amber-500/20',
  },
  {
    id: 'flammable',
    nameBn: 'দাহ্য পদার্থ',
    nameEn: 'Flammable Substance',
    code: 'GHS02',
    iconType: 'flammable',
    riskLevelBn: 'উচ্চ ঝুঁকি',
    riskLevelEn: 'High Risk',
    examplesBn: ['ইথাইল অ্যালকোহল (Ethanol)', 'ডাইইথাইল ইথার (Ether)', 'পেট্রোলিয়াম বা গ্যাসোলিন'],
    examplesEn: ['Ethanol (Alcohol)', 'Diethyl Ether', 'Petroleum / Gasoline'],
    hazardsBn: 'স্বাভাবিক তাপমাত্রায় অত্যন্ত দ্রুত বাষ্পীভূত হয় এবং বাতাসের অক্সিজেনে সামান্য আগুনের শিখা পেলেই জ্বলে ওঠে।',
    hazardsEn: 'Vaporizes rapidly at ambient temperatures and catches fire instantaneously when exposed to a spark or flame.',
    precautionsBn: 'সরাসরি তাপ বা বুনসেন বার্নারের আগুন থেকে সর্বদা দূরে রাখতে হবে; ওয়াটার বাথ বা হিটিং ম্যান্টল ব্যবহার করতে হবে।',
    precautionsEn: 'Keep strictly away from open burner flames; heat using water baths or heating mantles only.',
    disposalBn: 'ড্রেনে ফেলা নিষিদ্ধ; নির্দিষ্ট জ্বলনশীল বর্জ্য আধারে সিল করে জমা করতে হবে।',
    disposalEn: 'Never pour into laboratory sinks; dispose into designated sealed organic solvent drums.',
    colorClass: 'text-rose-500 border-rose-500/40 bg-rose-500/10',
    bgGlow: 'hover:border-rose-500 hover:shadow-rose-500/20',
  },
  {
    id: 'oxidizing',
    nameBn: 'জারক পদার্থ',
    nameEn: 'Oxidizing Substance',
    code: 'GHS03',
    iconType: 'oxidizing',
    riskLevelBn: 'উচ্চ ঝুঁকি',
    riskLevelEn: 'High Risk',
    examplesBn: ['ক্লোরিন গ্যাস (Cl₂)', 'অক্সিজেন গ্যাস (O₂)', 'পটাশিয়াম পারম্যাঙ্গানেট (KMnO₄)', 'নাইট্রিক এসিড (HNO₃)'],
    examplesEn: ['Chlorine Gas (Cl₂)', 'Oxygen Gas (O₂)', 'Potassium Permanganate (KMnO₄)', 'Nitric Acid (HNO₃)'],
    hazardsBn: 'নিজে দাহ্য না হলেও অন্য পদার্থকে জ্বলতে তীব্র সাহায্য করে এবং অগ্নিকাণ্ডের বিস্তার বহুগুণ বাড়িয়ে দেয়। শ্বাস নিলে শ্বাসতন্ত্রে প্রদাহ সৃষ্টি করে।',
    hazardsEn: 'Not necessarily flammable itself, but actively fuels and intensifies combustion in other substances; causes respiratory distress.',
    precautionsBn: 'দাহ্য পদার্থ ও জৈব যৌগ থেকে পৃথকভাবে শীতল ও শুষ্ক স্থানে রাখতে হবে। ফিউম হুডে হ্যান্ডল করতে হবে।',
    precautionsEn: 'Store isolated from combustible organic materials in cool, dry ventilated lockers. Use fume hoods.',
    disposalBn: 'হ্রাসকারী দ্রবণ দিয়ে প্রশমিত করে রাসায়নিক নিষ্কাশন নির্দেশিকা মানতে হবে।',
    disposalEn: 'Neutralize with safe reducing agents prior to regulated waste runoff.',
    colorClass: 'text-orange-500 border-orange-500/40 bg-orange-500/10',
    bgGlow: 'hover:border-orange-500 hover:shadow-orange-500/20',
  },
  {
    id: 'toxic',
    nameBn: 'বিষাক্ত পদার্থ',
    nameEn: 'Toxic Substance',
    code: 'GHS06',
    iconType: 'toxic',
    riskLevelBn: 'চরম বিপজ্জনক',
    riskLevelEn: 'Extremely Hazardous',
    examplesBn: ['বেনজিন (C₆H₆)', 'ক্লোরোবেনজিন', 'মিথানল (কাঠের স্পিরিট - CH₃OH)'],
    examplesEn: ['Benzene (C₆H₆)', 'Chlorobenzene', 'Methanol (CH₃OH)'],
    hazardsBn: 'ত্বকের সংস্পর্শে, শ্বাস-প্রশ্বাসের মাধ্যমে বা সামান্য গলাধঃকরণে অঙ্গহানি বা মৃত্যু ঘটতে পারে। মিথানল অন্ধত্ব সৃষ্টি করে।',
    hazardsEn: 'Ingestion, inhalation, or skin absorption can trigger acute poisoning, blindness, organ failure, or fatal toxicity.',
    precautionsBn: 'অ্যাপ্রন, হ্যান্ড গ্লাভস, সেফটি গগলস ও মাস্ক পরিধান বাধ্যতামূলক; সব কাজ ফিউম হুডের নিচে সম্পন্ন করতে হবে।',
    precautionsEn: 'Mandatory apron, nitrile gloves, goggles, and respirator mask; manipulate strictly under active fume hoods.',
    disposalBn: 'নির্দিষ্ট বিষাক্ত রাসায়নিক কন্টেইনারে সংরক্ষণ করে রাসায়নিক বিষাক্ত বর্জ্য প্রটোকলে ধ্বংস করতে হবে।',
    disposalEn: 'Trap into dedicated hazardous toxic vessels; never wash down conventional drains.',
    colorClass: 'text-purple-500 border-purple-500/40 bg-purple-500/10',
    bgGlow: 'hover:border-purple-500 hover:shadow-purple-500/20',
  },
  {
    id: 'health',
    nameBn: 'তীব্র স্বাস্থ্যঝুঁকিপূর্ণ / কার্সিনোজেনিক',
    nameEn: 'Health Hazard / Carcinogen',
    code: 'GHS08',
    iconType: 'health',
    riskLevelBn: 'চরম বিপজ্জনক',
    riskLevelEn: 'Extremely Hazardous',
    examplesBn: ['সীসা ও লেড যৌগ (Pb)', 'পারদ বা মার্কারি (Hg)', 'সায়ানাইড (KCN)', 'কার্বোলিক এসিড (ফেনল)'],
    examplesEn: ['Lead Compounds (Pb)', 'Mercury (Hg)', 'Potassium Cyanide (KCN)', 'Phenol / Carbolic Acid'],
    hazardsBn: 'দীর্ঘমেয়াদে শরীরে প্রবেশ করলে ক্যান্সার, প্রজনন ক্ষতি, জেনেটিক মিউটেশন কিংবা শ্বাসযন্ত্রের দীর্ঘস্থায়ী ক্ষতিসাধন করে।',
    hazardsEn: 'Chronic accumulation causes carcinogenicity, reproductive toxicity, genetic mutations, and irreversible internal organ damage.',
    precautionsBn: 'মুখের সংস্পর্শ ও বাষ্প গ্রহণ সম্পূর্ণ এড়িয়ে চলতে হবে। সর্বদা ডাবল গ্লাভস ও বিশেষ রেস্পিরেটর মাস্ক ব্যবহার্য।',
    precautionsEn: 'Avoid aerosol exposure and cutaneous contact; employ dual glove barrier and respiratory filtration.',
    disposalBn: 'ভারী ধাতু পুনরুদ্ধার প্রকোষ্ঠে জমা করে পরিবেশ সুরক্ষা আইন অনুসারে পরিশোধন।',
    disposalEn: 'Heavy-metal reclamation vaults under strict environmental oversight.',
    colorClass: 'text-blue-500 border-blue-500/40 bg-blue-500/10',
    bgGlow: 'hover:border-blue-500 hover:shadow-blue-500/20',
  },
  {
    id: 'irritant',
    nameBn: 'উত্তেজক পদার্থ',
    nameEn: 'Irritant / Moderate Hazard',
    code: 'GHS07',
    iconType: 'irritant',
    riskLevelBn: 'সতর্কতা প্রয়োজন',
    riskLevelEn: 'Caution Required',
    examplesBn: ['লঘু এসিড ও ক্ষার (Dilute HCl, NaOH)', 'সিমেন্ট ডাস্ট', 'ক্লোরিন ব্লিচিং ডাস্ট', 'নাইট্রাস অক্সাইড (N₂O)'],
    examplesEn: ['Dilute Acids & Alkalis', 'Cement Dust', 'Bleaching Powder Dust', 'Nitrous Oxide (N₂O)'],
    hazardsBn: 'ত্বক, চোখ এবং শ্বাসতন্ত্রে তীব্র চুলকানি, লালচে দাগ বা প্রদাহের সৃষ্টি করে। চোখে লাগলে কর্নিয়ার ক্ষতি হতে পারে।',
    hazardsEn: 'Causes skin sensitization, eye irritation, itching, rashes, and coughing or respiratory discomfort.',
    precautionsBn: 'হাতে গ্লাভস ও চোখে সেফটি গগলস পরে কাজ করতে হবে; সরাসরি গুঁড়ো বাতাসে ওড়ানো যাবে না।',
    precautionsEn: 'Wear protective safety glasses and barrier gloves; prevent airborne dusting in enclosed spaces.',
    disposalBn: 'প্রচুর পানিতে লঘুকরণ করে ড্রেনে নিউট্রালাইজড অবস্থায় নির্গমন করা যায়।',
    disposalEn: 'Dilute with excessive volumes of water and flush after pH balancing.',
    colorClass: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
    bgGlow: 'hover:border-amber-400 hover:shadow-amber-400/20',
  },
  {
    id: 'radioactive',
    nameBn: 'তেজস্ক্রিয় পদার্থ (ট্রেফয়েল প্রতীক)',
    nameEn: 'Radioactive Substance (Trefoil)',
    code: 'Trefoil',
    iconType: 'radioactive',
    riskLevelBn: 'চরম বিপজ্জনক',
    riskLevelEn: 'Extremely Hazardous',
    examplesBn: ['ইউরেনিয়াম (²³⁵U, ²³⁸U)', 'রেডিয়াম (²²⁶Ra)', 'কোবাল্ট-৬০ (⁶⁰Co)', 'থোরিয়াম (Th)'],
    examplesEn: ['Uranium (²³⁵U, ²³⁸U)', 'Radium (²²⁶Ra)', 'Cobalt-60 (⁶⁰Co)', 'Thorium (Th)'],
    hazardsBn: 'স্বতঃস্ফূর্তভাবে আলফা (α), বিটা (β) ও গামা (γ) ক্ষতিকর রশ্মি নির্গমন করে যা কোষের ডিএনএ ভেঙে ক্যান্সার বা বিকলাঙ্গতা ঘটায়।',
    hazardsEn: 'Spontaneously releases ionizing alpha, beta, and gamma radiation, destabilizing cell DNA and inducing fatal cancer or congenital defects.',
    precautionsBn: 'পুরু সীসার (Lead) প্রকোষ্ঠ বা পাত্রে রাখতে হবে। দূর নিয়ন্ত্রক চিমটা ও রেডিয়েশন ব্যাজ পরিধান অপরিহার্য।',
    precautionsEn: 'Shield strictly inside thick lead-lined containers; manipulate via remote pincers with personal dosimeters.',
    disposalBn: 'আন্তর্জাতিক পরমাণু শক্তি সংস্থা (IAEA) নির্দেশিত গভীর ভূগর্ভস্থ বা কংক্রিট ভল্টে বিশেষ সিলিং।',
    disposalEn: 'Deep geological containment or reinforced concrete vaults following IAEA protocols.',
    colorClass: 'text-yellow-500 border-yellow-500/40 bg-yellow-500/10',
    bgGlow: 'hover:border-yellow-500 hover:shadow-yellow-500/20',
  },
  {
    id: 'environmental',
    nameBn: 'পরিবেশের জন্য ক্ষতিকর',
    nameEn: 'Environmental Hazard',
    code: 'GHS09',
    iconType: 'environmental',
    riskLevelBn: 'উচ্চ ঝুঁকি',
    riskLevelEn: 'High Risk',
    examplesBn: ['লেড বা সীসা লবণ', 'মার্কারি ও ক্যাডমিয়াম যৌগ', 'অতিরিক্ত কীটনাশক (DDT, Malathion)'],
    examplesEn: ['Lead Salts', 'Mercury & Cadmium Compounds', 'Excess Agricultural Pesticides (DDT)'],
    hazardsBn: 'জলজ উদ্ভিদ ও প্রাণী ধ্বংস করে, মাটিতে দীর্ঘকাল জমে খাদ্যশৃঙ্খলে প্রবেশ করে মানুষের কিডনি ও লিভারের ক্ষতি করে।',
    hazardsEn: 'Devastates aquatic flora and fauna; biomagnifies through food chains, causing cumulative renal and hepatic damage.',
    precautionsBn: 'কখনোই উন্মুক্ত পরিবেশে বা ড্রেন ও জলাশয়ে ফেলা যাবে না; রিসাইক্লিং ও পরিশোধন নিশ্চিত করতে হবে।',
    precautionsEn: 'Never dump into public waterways, soils, or untreated drains; capture and regenerate through specialized processing.',
    disposalBn: 'নির্দিষ্ট কন্টেইনারে সংগ্রহ করে পুনরায় ব্যবহার (Recycle) বা পৃথক অপসারণ করতে হবে।',
    disposalEn: 'Isolate in labeled effluent barrels for industrial precipitation and closed-cycle recycling.',
    colorClass: 'text-emerald-500 border-emerald-500/40 bg-emerald-500/10',
    bgGlow: 'hover:border-emerald-500 hover:shadow-emerald-500/20',
  },
  {
    id: 'corrosive',
    nameBn: 'ক্ষত সৃষ্টিকারী / ক্ষয়কারী পদার্থ',
    nameEn: 'Corrosive Substance',
    code: 'GHS05',
    iconType: 'corrosive',
    riskLevelBn: 'চরম বিপজ্জনক',
    riskLevelEn: 'Extremely Hazardous',
    examplesBn: ['গাঢ় হাইড্রোক্লোরিক এসিড (Conc. HCl)', 'গাঢ় সালফিউরিক এসিড (Conc. H₂SO₄)', 'গাঢ় সোডিয়াম হাইড্রোক্সাইড (Conc. NaOH)'],
    examplesEn: ['Concentrated Hydrochloric Acid (Conc. HCl)', 'Concentrated Sulfuric Acid (Conc. H₂SO₄)', 'Concentrated Caustic Soda (Conc. NaOH)'],
    hazardsBn: 'ত্বকে লাগলে তীব্র রাসায়নিক ক্ষতের সৃষ্টি হয়, কাপড়ে পড়লে কাপড় পুড়ে নষ্ট হয় এবং ধাতু ক্ষয় করে দেয়। শ্বাস নিলে ফুসফুস ক্ষতিগ্রস্ত হয়।',
    hazardsEn: 'Causes severe skin burns and permanent eye damage; destroys clothing instantly and corrodes metals upon contact.',
    precautionsBn: 'অ্যাপ্রোন, ভারী পিভিসি গ্লাভস ও গগলস পরিধান করা। এসিড লঘুকরণে পানির ভেতরে ধীরে ধীরে এসিড ঢালতে হবে (কখনো এসিডে পানি নয়!)।',
    precautionsEn: 'Always wear chemical aprons, thick PVC gloves, and goggles. When diluting, slowly pour acid into water, never water into acid!',
    disposalBn: 'প্রচুর পানির সাথে দুর্বল ক্ষার (যেমন সোডিয়াম বাইকার্বনেট) মিশিয়ে প্রশমিত করে নিষ্কাশন।',
    disposalEn: 'Carefully neutralize with weak bases (e.g. sodium bicarbonate) and flush with ample water.',
    colorClass: 'text-teal-500 border-teal-500/40 bg-teal-500/10',
    bgGlow: 'hover:border-teal-500 hover:shadow-teal-500/20',
  },
];

// 6 Research steps for Lesson 4
interface ResearchStep {
  id: number;
  stepNumBn: string;
  stepNumEn: string;
  nameBn: string;
  nameEn: string;
  descBn: string;
  descEn: string;
  labApplicationBn: string;
  labApplicationEn: string;
}

const RESEARCH_STEPS: ResearchStep[] = [
  {
    id: 1,
    stepNumBn: '১',
    stepNumEn: '1',
    nameBn: 'বিষয় নির্বাচন',
    nameEn: 'Topic Selection',
    descBn: 'গবেষণার শুরুতে তুমি কী জানতে চাও বা কী আবিষ্কার করতে চাও তা সুনির্দিষ্টভাবে ঠিক করা।',
    descEn: 'Clearly identifying what specific phenomenon you want to discover or explore.',
    labApplicationBn: 'পরীক্ষার লক্ষ্য: পানিতে অ্যামোনিয়াম ক্লোরাইড (NH₄Cl) দ্রবীভূত করলে দ্রবণ তাপোৎপাদী নাকি তাপহারী হবে তা জানা।',
    labApplicationEn: 'Lab Objective: Finding whether dissolving ammonium chloride in water produces or absorbs thermal energy.',
  },
  {
    id: 2,
    stepNumBn: '২',
    stepNumEn: '2',
    nameBn: 'বিষয়বস্তু সম্পর্কে বিশদ তথ্য সংগ্রহ',
    nameEn: 'Acquiring Relevant Information',
    descBn: 'বইপত্র, বিজ্ঞান পত্রিকা ও ইন্টারনেট থেকে সমজাতীয় পরীক্ষা (যেমন চুন বা CaO এর দ্রবীভূতকরণ) কীভাবে হয়েছে তা জেনে ফলাফল সম্পর্কে পূর্বানুমান করা।',
    descEn: 'Surveying textbooks, journals, and previous scientific literature to form a testable hypothesis.',
    labApplicationBn: 'তথ্য সংগ্রহ: দেখা গেল চুন পানিতে দিলে তাপ উৎপন্ন হয়। আমরা অনুমান করলাম অ্যামোনিয়াম ক্লোরাইডেও তাপমাত্রা পরিবর্তিত হতে পারে।',
    labApplicationEn: 'Hypothesis building: Review showed calcium oxide releases heat; we hypothesize ammonium chloride will also shift water temperature.',
  },
  {
    id: 3,
    stepNumBn: '৩',
    stepNumEn: '3',
    nameBn: 'কাজের পরিকল্পনা ও পরীক্ষণের প্রণালি নির্ধারণ',
    nameEn: 'Planning of Experiment',
    descBn: 'পরীক্ষাটি সুচারুভাবে করতে কী কী যন্ত্রপাতি ও রাসায়নিক লাগবে এবং কী ধাপে পরিচালনা করতে হবে তার তালিকা তৈরি করা।',
    descEn: 'Drafting exact apparatus list, safety protocols, reagent weights, and step-by-step procedural flowchart.',
    labApplicationBn: 'প্রয়োজনীয় সরঞ্জাম: ২৫০ মিলি বিকার, পানি, থার্মোমিটার, কাচদণ্ড (Glass Rod), ব্যালেন্স (নিক্তি) ও অ্যামোনিয়াম ক্লোরাইড।',
    labApplicationEn: 'Apparatus inventory: 250 mL beaker, distilled water, sensitive thermometer, glass stirring rod, balance, and pure NH₄Cl.',
  },
  {
    id: 4,
    stepNumBn: '৪',
    stepNumEn: '4',
    nameBn: 'পরীক্ষণ পরিচালনা ও তথ্য সংগ্রহ',
    nameEn: 'Experimentation & Data Collection',
    descBn: 'সতর্কতার সাথে হাতে-কলমে পরীক্ষা সম্পাদন এবং প্রতিটি ধাপে প্রাপ্ত মান নির্ভুলভাবে খাতায় ছকবদ্ধ (Table) করা।',
    descEn: 'Conducting empirical lab trials and recording real-time experimental figures into an orderly observation ledger.',
    labApplicationBn: 'হাতে-কলমে পরীক্ষা: ২৫০ মিলি পানিতে প্রতিবার ৫ গ্রাম করে NH₄Cl যোগ করে কাচদণ্ড দিয়ে নেড়ে থার্মোমিটারে তাপমাত্রা লিপিবদ্ধ করা।',
    labApplicationEn: 'Empirical trial: Adding 5 g increments of NH₄Cl into 250 mL water, stirring, and recording temperature each step.',
  },
  {
    id: 5,
    stepNumBn: '৫',
    stepNumEn: '5',
    nameBn: 'তথ্য বিশ্লেষণ ও প্রক্রিয়া মূল্যায়ন',
    nameEn: 'Data Analysis & Evaluation',
    descBn: 'সংগৃহীত তথ্যের মধ্যে সম্পর্ক লক্ষ্য করা—দ্রব্যের পরিমাণ বাড়লে তাপমাত্রা বাড়ে নাকি কমে তা গাণিতিকভাবে বিবেচনা করা।',
    descEn: 'Evaluating numerical trends to discern mathematical or physical correlations across independent variables.',
    labApplicationBn: 'বিশ্লেষণ: ০ গ্রামে ২৫°C, ৫ গ্রামে ২০°C, ১০ গ্রামে ১৫°C, ১৫ গ্রামে ১০°C। দেখা যাচ্ছে দ্রবণের তাপমাত্রা ক্রমাগত ৫°C করে হ্রাস পাচ্ছে।',
    labApplicationEn: 'Ledger Analysis: 0 g = 25°C, 5 g = 20°C, 10 g = 15°C, 15 g = 10°C. Temperature drops consistently with increased salt.',
  },
  {
    id: 6,
    stepNumBn: '৬',
    stepNumEn: '6',
    nameBn: 'ফলাফল ও চূড়ান্ত সিদ্ধান্ত গ্রহণ',
    nameEn: 'Result & Final Resolution',
    descBn: 'তথ্য বিশ্লেষণের ভিত্তিতে বৈজ্ঞানিক সিদ্ধান্তে উপনীত হওয়া এবং প্রতিবেদন প্রস্তুত করা।',
    descEn: 'Drawing firm empirical conclusions grounded directly in analytical evidence and preparing the report.',
    labApplicationBn: 'চূড়ান্ত সিদ্ধান্ত: পানিতে অ্যামোনিয়াম ক্লোরাইড দ্রবীভূত হওয়া একটি তাপহারী (Endothermic) প্রক্রিয়া; এটি পানি থেকে তাপ শোষণ করে।',
    labApplicationEn: 'Conclusion: Dissolving ammonium chloride in water is an endothermic process; it actively absorbs heat energy from the water.',
  },
];

// Authentic Board MCQs for Chapter 1
interface BoardMcq {
  id: number;
  questionBn: string;
  questionEn: string;
  optionsBn: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationBn: string;
  explanationEn: string;
  boardSource: string;
}

const CHEMISTRY_BOARD_MCQS: BoardMcq[] = [
  {
    id: 1,
    questionBn: 'কাঁচা আমে কোন কোন জৈব এসিড থাকার কারণে এটি টক স্বাদযুক্ত হয়?',
    questionEn: 'Which organic acids cause unripe mangoes to taste sour?',
    optionsBn: [
      'সাইট্রিক এসিড ও অক্সালিক এসিড',
      'সাক্সিনিক এসিড ও ম্যালেয়িক এসিড',
      'টারটারিক এসিড ও অ্যাসিটিক এসিড',
      'ল্যাকটিক এসিড ও ফর্মিক এসিড',
    ],
    optionsEn: [
      'Citric acid and oxalic acid',
      'Succinic acid and maleic acid',
      'Tartaric acid and acetic acid',
      'Lactic acid and formic acid',
    ],
    correctIndex: 1,
    explanationBn:
      'কাঁচা আমে প্রধানত সাক্সিনিক এসিড ও ম্যালেয়িক এসিড থাকে, যা টক স্বাদের উৎস। আম পাকলে রাসায়নিক পরিবর্তনের মাধ্যমে এগুলো গ্লুকোজ ও ফ্রুক্টোজে রূপান্তরিত হয়ে মিষ্টি স্বাদের সৃষ্টি করে।',
    explanationEn:
      'Unripe mangoes contain succinic acid and maleic acid giving them a sour taste. As they ripen, these acids chemically transform into glucose and fructose, rendering them sweet.',
    boardSource: 'ঢাকা বোর্ড ২০১৮ / রাজশাহী বোর্ড ২০২২',
  },
  {
    id: 2,
    questionBn: 'তেজস্ক্রিয় পদার্থের আন্তর্জাতিক সার্বজনীন সাংকেতিক প্রতীকটির নাম কী?',
    questionEn: 'What is the universally recognized international symbol for radioactive substances?',
    optionsBn: ['স্কাল অ্যান্ড ক্রস বোনস', 'ট্রেফয়েল (Trefoil)', 'অগ্নিশিখা (Flame)', 'বায়োহ্যাজার্ড (Biohazard)'],
    optionsEn: ['Skull and crossbones', 'Trefoil', 'Flame', 'Biohazard'],
    correctIndex: 1,
    explanationBn:
      'তেজস্ক্রিয় পদার্থের প্রতীক হলো তিন পাতার পাখাবিশিষ্ট "ট্রেফয়েল" (Trefoil)। এটি ইউরেনিয়াম, রেডিয়াম ইত্যাদির স্বতঃস্ফূর্ত ক্ষতিকর আলফা, বিটা ও গামা রশ্মি নির্গমন নির্দেশ করে।',
    explanationEn:
      'The international radioactive warning emblem is the three-bladed "Trefoil", warning against spontaneous ionizing alpha, beta, and gamma radiation.',
    boardSource: 'যশোর বোর্ড ২০১৯ / চট্টগ্রাম বোর্ড ২০২১',
  },
  {
    id: 3,
    questionBn: 'রসায়ন গবেষণাগারে ব্যবহৃত নিরাপদ পোশাক বা অ্যাপ্রোনের ক্ষেত্রে কোনটি সঠিক?',
    questionEn: 'Which specification is accurate regarding a safety apron in a chemistry laboratory?',
    optionsBn: [
      'কালো রঙের এবং কনুই পর্যন্ত হাতা',
      'সাদা রঙের, কবজি পর্যন্ত হাতা এবং হাঁটুর নিচ পর্যন্ত লম্বা',
      'যেকোনো রঙের এবং হাফ হাতা বিশিষ্ট',
      'লাল রঙের ও প্লাস্টিকের বেল্ট যুক্ত',
    ],
    optionsEn: [
      'Black color with elbow-length sleeves',
      'White color, wrist-length sleeves, and knee-length long',
      'Any casual color with short sleeves',
      'Red color with plastic protective belts',
    ],
    correctIndex: 1,
    explanationBn:
      'এনসিটিবি পাঠ্যবই অনুসারে রসায়ন গবেষণাগারে ব্যবহৃত অ্যাপ্রোন সাধারণত সাদা রঙের হয়, এর হাতা হাতের কবজি পর্যন্ত এবং লম্বায় হাঁটুর নিচ পর্যন্ত হয়ে থাকে যাতে শরীর রাসায়নিক স্প্ল্যাশ থেকে সম্পূর্ণ সুরক্ষিত থাকে।',
    explanationEn:
      'According to NCTB, laboratory aprons are traditionally white, have sleeves extending to the wrists, and reach below the knees for optimal splash protection.',
    boardSource: 'কুমিল্লা বোর্ড ২০২০ / সিলেট বোর্ড ২০২৩',
  },
  {
    id: 4,
    questionBn: 'বেনজিন, মিথানল ও ক্লোরোবেনজিনের পাত্রের গায়ে কোন GHS সাংকেতিক চিহ্ন থাকে?',
    questionEn: 'Which GHS hazard symbol is affixed on containers of benzene, methanol, and chlorobenzene?',
    optionsBn: ['দাহ্য পদার্থ (Flammable)', 'বিষাক্ত পদার্থ (Toxic)', 'বিস্ফোরক দ্রব্য (Explosive)', 'উত্তেজক পদার্থ (Irritant)'],
    optionsEn: ['Flammable Substance', 'Toxic Substance', 'Explosive Substance', 'Irritant Substance'],
    correctIndex: 1,
    explanationBn:
      'বেনজিন, ক্লোরোবেনজিন ও মিথানল বিষাক্ত পদার্থ (Toxic)। শরীরে প্রবেশ করলে বা শ্বাস নিলে এগুলো মারাত্মক বিষক্রিয়া ও অঙ্গহানি সৃষ্টি করে, তাই এদের গায়ে বিষাক্ত সাংকেতিক চিহ্ন (মাথার খুলি ও আড়াআড়ি হাড়) থাকে।',
    explanationEn:
      'Benzene, chlorobenzene, and methanol are designated Toxic substances posing acute toxicity upon absorption or inhalation, labeled with the Toxic pictogram.',
    boardSource: 'দিনাজপুর বোর্ড ২০১৭ / বরিশাল বোর্ড ২০২২',
  },
  {
    id: 5,
    questionBn: 'পানিতে অ্যামোনিয়াম ক্লোরাইড (NH₄Cl) দ্রবীভূত করার পরীক্ষায় কী ঘটে?',
    questionEn: 'What is observed when ammonium chloride (NH₄Cl) dissolves in water during the inquiry lab?',
    optionsBn: [
      'দ্রবণের তাপমাত্রা বৃদ্ধি পায় (তাপোৎপাদী)',
      'দ্রবণের তাপমাত্রা হ্রাস পায় (তাপহারী)',
      'গ্যাস বুদ্বুদ সৃষ্টি হয়ে পাত্র উত্তপ্ত হয়',
      'তাপমাত্রার কোনো পরিবর্তন হয় না',
    ],
    optionsEn: [
      'Temperature increases (Exothermic)',
      'Temperature decreases (Endothermic)',
      'Gas bubbles evolve and vessel heats up',
      'Temperature remains invariant',
    ],
    correctIndex: 1,
    explanationBn:
      'অ্যামোনিয়াম ক্লোরাইড পানিতে দ্রবীভূত হলে পরিবেশ/পানি থেকে তাপ শোষিত হয়, ফলে দ্রবণের তাপমাত্রা কমে যায় (যেমন ২৫°C থেকে ১০°C এ নেমে আসে)। এটি একটি তাপহারী (Endothermic) প্রক্রিয়া।',
    explanationEn:
      'Dissolution of ammonium chloride absorbs ambient thermal energy from the water, lowering solution temperature (e.g., 25°C down to 10°C), classifying it as endothermic.',
    boardSource: 'সকল বোর্ড সম্মিলিত প্রশ্নব্যাংক',
  },
];

export function ChemistryConceptsGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // State Management
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);

  // AI Chat Drawer State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: isBn
        ? 'স্বাগতম রসায়ন ল্যাবে! আমি তোমার AI শিক্ষক। রসায়নের উৎপত্তি, দৈনন্দিন জীবনের বিক্রিয়া, গবেষণার ৬ ধাপ কিংবা ৮টি GHS ঝুঁকি প্রতীক নিয়ে যেকোনো প্রশ্ন করতে পারো!'
        : 'Welcome to the Chemistry Lab! I am your AI Chemistry Tutor. Ask me anything about chemistry history, everyday reactions, the 6 research steps, or GHS hazard symbols!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Lesson 2 Simulator State: Everyday Chemistry Transformations
  const [selectedPhenomenon, setSelectedPhenomenon] = useState<'mango' | 'rust' | 'combustion' | 'antacid'>('mango');
  const [mangoRipeness, setMangoRipeness] = useState<number>(20); // 0 to 100
  const [rustMoisture, setRustMoisture] = useState<number>(50); // 0 to 100
  const [rustDays, setRustDays] = useState<number>(7); // 1 to 30
  const [combustionOxygenSupply, setCombustionOxygenSupply] = useState<'sufficient' | 'insufficient'>('sufficient');
  const [antacidDoseMg, setAntacidDoseMg] = useState<number>(0); // 0 to 20 ml

  // Lesson 4 Simulator State: 6-Step Sequencer & NH4Cl Dissolution Lab
  const [selectedSequencerOrder, setSelectedSequencerOrder] = useState<number[]>([3, 1, 4, 2, 6, 5]);
  const [sequencerChecked, setSequencerChecked] = useState<boolean>(false);
  const [sequencerSuccess, setSequencerSuccess] = useState<boolean>(false);

  // NH4Cl dissolution interactive flask
  const [dissolvedNh4ClGrams, setDissolvedNh4ClGrams] = useState<number>(0);
  const [isStirring, setIsStirring] = useState<boolean>(false);

  // Lesson 5 Simulator State: GHS Symbol Scanner & Lab Safety Apparel
  const [selectedHazardId, setSelectedHazardId] = useState<string>('explosive');
  const [wornPpe, setWornPpe] = useState<{ apron: boolean; goggles: boolean; gloves: boolean; mask: boolean }>({
    apron: true,
    goggles: false,
    gloves: true,
    mask: false,
  });

  // Rapid Board Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  // Copy toast state
  const [copyToast, setCopyToast] = useState<boolean>(false);

  // Calculate live NH4Cl solution temperature
  // Table 1.03: 0g -> 25°C, 5g -> 20°C, 10g -> 15°C, 15g -> 10°C
  const currentFlaskTemp = Math.max(5, 25 - (dissolvedNh4ClGrams / 5) * 5);

  // Save Progress Handler
  const saveProgressToBackend = async (newCompleted: number[]) => {
    try {
      await fetch('/api/playground/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chapter: 1,
          subject: 'chemistry',
          completedLessons: newCompleted,
          currentLesson: activeLesson,
        }),
      });
    } catch (err) {
      console.error('Failed to save chemistry progress:', err);
    }
  };

  // Lesson Metadata
  const LESSONS_META: Record<
    number,
    {
      no: string;
      titleBn: string;
      titleEn: string;
      overviewBn: string;
      overviewEn: string;
      studyTipBn: string;
      studyTipEn: string;
      badgeText: string;
    }
  > = {
    1: {
      no: '০১',
      titleBn: 'রসায়নের পরিচিতি ও ঐতিহাসিক পটভূমি',
      titleEn: 'Introduction & History of Chemistry',
      overviewBn:
        'আলকেমি (Alchemy), কিমি (Chemi) থেকে Chemistry শব্দের উৎপত্তি, জাবির-ইবনে-হাইয়ান এবং আধুনিক রসায়নের জনক অ্যান্টনি ল্যাভয়সিয়ের ঐতিহাসিক অবদান।',
      overviewEn:
        'Evolution from ancient Alchemy and Al-Kimia to modern Chemistry, contributions of Jabir ibn Hayyan, Robert Boyle, and Lavoisier.',
      studyTipBn: 'মনে রাখবে: রসায়নের আদি চর্চাকারী জাবির-ইবনে-হাইয়ান, কিন্তু আধুনিক রসায়নের জনক অ্যান্টনি ল্যাভয়সিয়ে!',
      studyTipEn: 'Crucial distinction: Early pioneer is Jabir ibn Hayyan, but Father of Modern Chemistry is Antoine Lavoisier!',
      badgeText: 'আলকেমি ও ঐতিহাসিক পটভূমি',
    },
    2: {
      no: '০২',
      titleBn: 'প্রাত্যহিক জীবনে রসায়নের রূপান্তর ল্যাব',
      titleEn: 'Everyday Chemistry Transformation Lab',
      overviewBn:
        'কাঁচা আম পাকা (জৈব এসিড থেকে গ্লুকোজ), লোহার মরিচা পড়া, হাইড্রোকার্বনের দহন এবং পেটের এসিডিটিতে এন্টাসিডের প্রশমন বিক্রিয়ার লাইভ অনুসন্ধান।',
      overviewEn:
        'Live simulation of mango ripening (acids to sugars), iron rusting oxidation, hydrocarbon combustion, and antacid neutralization.',
      studyTipBn: 'মরিচার সঠিক রাসায়নিক সংকেত Fe₂O₃·xH₂O এবং এন্টাসিডে থাকে Mg(OH)₂ ও Al(OH)₃!',
      studyTipEn: 'Rust formula is hydrated iron(III) oxide Fe₂O₃·xH₂O, and antacids rely on Mg(OH)₂ & Al(OH)₃!',
      badgeText: 'আম পাকা, মরিচা ও এন্টাসিড',
    },
    3: {
      no: '০৩',
      titleBn: 'বিজ্ঞানের অন্যান্য শাখার মেলবন্ধন ও গুরুত্ব',
      titleEn: 'Interdisciplinary Chemistry & Environmental Impact',
      overviewBn:
        'জীববিজ্ঞানের সালোকসংশ্লেষণ ও শ্বসন, পদার্থবিজ্ঞানের ব্যাটারি ও শক্তি, গণিতের ঘনমাত্রা গণনা এবং পরিবেশ সংরক্ষণে রসায়নের অপরিহার্য ভূমিকা।',
      overviewEn:
        'Interactions with Biology (Photosynthesis), Physics (Batteries & Thermodynamics), Mathematics, and balancing industrial benefits with ecology.',
      studyTipBn: 'উদ্ভিদ সালোকসংশ্লেষণে সূর্যালোক ও ক্লোরোফিলের সাহায্যে CO₂ ও H₂O থেকে গ্লুকোজ (C₆H₁₂O₆) তৈরি করে—যা রসায়নেরই রূপান্তর।',
      studyTipEn: 'Photosynthesis is a quintessential chemical reaction synthesizing C₆H₁₂O₆ from CO₂ and H₂O using solar energy.',
      badgeText: 'সালোকসংশ্লেষণ ও অন্যান্য বিজ্ঞান',
    },
    4: {
      no: '০৪',
      titleBn: 'রসায়নে অনুসন্ধান ও গবেষণার ৬-ধাপ সিমুলেটর',
      titleEn: '6-Step Scientific Research Sequencer & Lab',
      overviewBn:
        'বিষয় নির্বাচন থেকে ফলাফল গ্রহণ পর্যন্ত ৬টি বৈজ্ঞানিক ধাপের সিকোয়েন্সার এবং পানিতে NH₄Cl দ্রবীভূত করার তাপহারী লাইভ ল্যাব টেস্ট।',
      overviewEn:
        'Interactive ordering of the 6 scientific inquiry stages, paired with empirical NH₄Cl endothermic dissolution thermometer simulation.',
      studyTipBn: 'পরীক্ষায় ৬টি ধাপ ধারাবাহিকভাবে লিখতে হয়: বিষয় নির্বাচন → তথ্য সংগ্রহ → পরিকল্পনা → পরীক্ষণ → তথ্য বিশ্লেষণ → সিদ্ধান্ত গ্রহণ!',
      studyTipEn: 'Memorize the strict sequence: Topic Selection → Literature Review → Planning → Experiment → Data Analysis → Conclusion!',
      badgeText: '৬-ধাপের গবেষণা প্রবাহচিত্র',
    },
    5: {
      no: '০৫',
      titleBn: 'গবেষণাগারে নিরাপত্তা ও ৮টি GHS ঝুঁকি প্রতীক স্ক্যানার',
      titleEn: 'Lab Safety Gear & 8 GHS Hazard Symbols',
      overviewBn:
        'অ্যাপ্রোন, গগলস ও গ্লাভসের সঠিক মাপ এবং জাতিসংঘের GHS আন্তর্জাতিক ৮টি সাংকেতিক প্রতীকের ঝুঁকি, সতর্কতা ও বর্জ্য অপসারণ নির্দেশিকা।',
      overviewEn:
        'Interactive PPE dressing room, alongside deep exploration of 8 universal GHS pictograms with authentic NCTB chemicals and warnings.',
      studyTipBn: 'ট্রেফয়েল হলো তেজস্ক্রিয় প্রতীক; গাঢ় এসিড ক্ষয়কারী (Corrosive); এবং এসিডে কখনো পানি ঢালতে নেই—পানিতে ধীরে ধীরে এসিড ঢালতে হয়!',
      studyTipEn: 'Trefoil signifies ionizing radiation; concentrated mineral acids are Corrosive; always add acid to water, never water to acid!',
      badgeText: '৮টি GHS প্রতীক ও সেফটি পোশাক',
    },
  };

  const currentLessonMeta = LESSONS_META[activeLesson] || LESSONS_META[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

  // AI Chat Submission
  const handleSendAiMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userQuery = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuery,
          subject: 'chemistry',
          chapter: '1 - রসায়নের ধারণা (Concepts of Chemistry)',
          context: `বর্তমান পাঠ: ${activeLesson}, ধাপ: ${activeStep}, নির্বাচিত GHS প্রতীক: ${selectedHazardId}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.response || data.message || (isBn ? 'উত্তর প্রস্তুত করা হয়েছে!' : 'Answer ready!'),
          },
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      // High-quality contextual fallback
      setTimeout(() => {
        let fallback = isBn
          ? 'রসায়ন হলো বিজ্ঞানের সেই মৌলিক শাখা যেখানে পদার্থের গঠন, বৈশিষ্ট্য এবং পারস্পরিক রূপান্তর নিয়ে আলোচনা করা হয়।'
          : 'Chemistry explores the composition, molecular architecture, properties, and dynamic transformations of matter.';

        if (userQuery.toLowerCase().includes('আম') || userQuery.toLowerCase().includes('mango')) {
          fallback = isBn
            ? 'কাঁচা আমে সাক্সিনিক এসিড ও ম্যালেয়িক এসিড থাকে যা টক। কিন্তু রোদে পাকার সময় রাসায়নিক বিক্রিয়ার মাধ্যমে এগুলো গ্লুকোজ ও ফ্রুক্টোজ নামক মিষ্টি শর্করায় রূপান্তরিত হয়।'
            : 'Unripe mangoes contain sour succinic and maleic acids. Solar ripening prompts metabolic reactions yielding sweet glucose and fructose.';
        } else if (userQuery.toLowerCase().includes('মরিচা') || userQuery.toLowerCase().includes('rust')) {
          fallback = isBn
            ? 'লোহার মরিচার রাসায়নিক সমীকরণ: $4\\text{Fe} + 3\\text{O}_2 + 2x\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$। এটি পানি ও অক্সিজেনের উপস্থিতিতে গঠিত আর্দ্র ফেরিক অক্সাইড।'
            : 'Rusting equation: $4\\text{Fe} + 3\\text{O}_2 + 2x\\text{H}_2\\text{O} \\rightarrow 2\\text{Fe}_2\\text{O}_3 \\cdot x\\text{H}_2\\text{O}$ — hydrated iron(III) oxide formed in damp oxygenated conditions.';
        } else if (userQuery.toLowerCase().includes('ট্রেফয়েল') || userQuery.toLowerCase().includes('তেজস্ক্রিয়') || userQuery.toLowerCase().includes('radiation')) {
          fallback = isBn
            ? 'ট্রেফয়েল (Trefoil) হলো তেজস্ক্রিয় পদার্থের আন্তর্জাতিক প্রতীক। ইউরেনিয়াম ও রেডিয়াম থেকে আলফা, বিটা ও গামা রশ্মি নির্গত হয় যা কোষের ডিএনএ বিনষ্ট করে ক্যান্সারের মতো মারাত্মক রোগ সৃষ্টি করে।'
            : 'The Trefoil is the universal symbol for radioactive elements (e.g. Uranium, Radium) emitting ionizing radiation capable of damaging biological DNA.';
        } else if (userQuery.toLowerCase().includes('গবেষণা') || userQuery.toLowerCase().includes('ধাপ') || userQuery.toLowerCase().includes('research')) {
          fallback = isBn
            ? 'রসায়নে গবেষণার ৬টি ধাপ: ১. বিষয় নির্বাচন → ২. তথ্য সংগ্রহ ও পূর্বানুমান → ৩. কাজের পরিকল্পনা ও প্রণালি নির্ধারণ → ৪. পরীক্ষণ ও তথ্য সংগ্রহ → ৫. তথ্য বিশ্লেষণ → ৬. ফলাফল ও চূড়ান্ত সিদ্ধান্ত।'
            : 'The 6 research steps: 1. Topic Selection → 2. Background Literature Survey → 3. Experimental Planning → 4. Testing & Data Collection → 5. Analysis → 6. Conclusion.';
        }

        setChatMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  // NH4Cl dissolve simulation
  const handleAddNh4Cl = (grams: number) => {
    setIsStirring(true);
    setTimeout(() => {
      setDissolvedNh4ClGrams((prev) => Math.min(15, prev + grams));
      setIsStirring(false);
    }, 600);
  };

  const handleResetNh4Cl = () => {
    setDissolvedNh4ClGrams(0);
  };

  // Sequencer check
  const handleVerifySequencer = () => {
    const isCorrect = selectedSequencerOrder.every((val, idx) => val === idx + 1);
    setSequencerChecked(true);
    setSequencerSuccess(isCorrect);
  };

  const handleMoveSequencer = (index: number, direction: 'up' | 'down') => {
    const newArr = [...selectedSequencerOrder];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newArr.length) return;
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    setSelectedSequencerOrder(newArr);
    setSequencerChecked(false);
  };

  // Quiz submission
  const handleSelectQuiz = (qId: number, optIdx: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateQuizScore = () => {
    let score = 0;
    CHEMISTRY_BOARD_MCQS.forEach((q) => {
      if (quizAnswers[q.id] === q.correctIndex) score += 1;
    });
    return score;
  };

  const handleSubmitQuiz = async () => {
    setQuizSubmitted(true);
    if (!completedLessons.includes(activeLesson)) {
      const updated = Array.from(new Set([...completedLessons, activeLesson]));
      setCompletedLessons(updated);
      await saveProgressToBackend(updated);
    }
  };

  // Study note copy
  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ১: রসায়নের ধারণা (রিভিশন হ্যান্ডনোট)
--------------------------------------------------
১. ঐতিহাসিক পটভূমি:
   - রসায়নের প্রাচীন চর্চা: আলকেমি (Alchemy), গবেষক: আলকেমিস্ট।
   - আরবি শব্দ 'আল-কিমিয়া' ও মূল শব্দ 'Chemi' থেকে Chemistry।
   - প্রাচীন রসায়নবিদ: জাবির-ইবনে-হাইয়ান (সর্বপ্রথম ল্যাবে চর্চা করেন)।
   - আধুনিক রসায়নের জনক: অ্যান্টনি ল্যাভয়সিয়ে (Antoine Lavoisier)।

২. প্রাত্যহিক জীবনের রূপান্তর:
   - কাঁচা আম টক: সাক্সিনিক ও ম্যালেয়িক এসিড।
   - পাকা আম মিষ্টি: এসিডগুলো গ্লুকোজ ও ফ্রুক্টোজে রূপান্তরিত হয়।
   - লোহার মরিচা: 4Fe + 3O₂ + 2xH₂O → 2Fe₂O₃·xH₂O (আর্দ্র ফেরিক অক্সাইড)।
   - পেটে এসিডিটি: অতিরিক্ত HCl নিঃসরণ; এন্টাসিডে থাকে Mg(OH)₂ ও Al(OH)₃ যা প্রশমিত করে।
   - হাইড্রোকার্বনের দহন: CH₄ + 2O₂ → CO₂ + 2H₂O + তাপ ও আলো।

৩. গবেষণার ৬টি ধাপ (ধারাবাহিক):
   ১. বিষয় নির্বাচন
   ২. বিষয়বস্তু সম্পর্কে বিশদ তথ্য সংগ্রহ
   ৩. কাজের পরিকল্পনা ও প্রণালি নির্ধারণ
   ৪. পরীক্ষণ পরিচালনা ও তথ্য সংগ্রহ
   ৫. তথ্য বিশ্লেষণ
   ৬. ফলাফল ও চূড়ান্ত সিদ্ধান্ত গ্রহণ (যেমন: পানিতে NH₄Cl দ্রবীভূত হওয়া তাপহারী)

৪. ৮টি সার্বজনীন GHS ঝুঁকি প্রতীক:
   - বিস্ফোরক (TNT, জৈব পারঅক্সাইড)
   - দাহ্য (অ্যালকোহল, ইথার)
   - জারক (ক্লোরিন, অক্সিজেন গ্যাস)
   - বিষাক্ত (বেনজিন, মিথানল)
   - তীব্র স্বাস্থ্যঝুঁকি (সীসা, পারদ, সায়ানাইড)
   - উত্তেজক (সিমেন্ট ডাস্ট, লঘু এসিড)
   - তেজস্ক্রিয় প্রতীক: ট্রেফয়েল (ইউরেনিয়াম, রেডিয়াম)
   - পরিবেশের জন্য ক্ষতিকর (লেড, মার্কারি)
   - ক্ষয়কারী (গাঢ় HCl, গাঢ় H₂SO₄, গাঢ় NaOH)

৫. ল্যাব নিরাপত্তা পোশাক:
   - অ্যাপ্রোন: সাদা রঙের, কবজি পর্যন্ত হাতা, হাঁটু পর্যন্ত লম্বা।
   - সেফটি গগলস, হ্যান্ড গ্লাভস এবং মাস্ক পরিধান অপরিহার্য।
--------------------------------------------------
শেরাটুটোর ভার্চুয়াল গাইডবুক (SheraTutor.com)`
      : `SSC Chemistry Chapter 1: Concepts of Chemistry (Revision Notes)
--------------------------------------------------
1. Historical Background:
   - Ancient alchemy practice; Arabic 'Al-Kimia' to 'Chemi' to 'Chemistry'.
   - Early chemical experimenter: Jabir ibn Hayyan.
   - Father of Modern Chemistry: Antoine Lavoisier.

2. Everyday Transformations:
   - Unripe mango: Succinic & maleic acids (sour).
   - Ripe mango: Transformed into glucose & fructose (sweet).
   - Rust: 4Fe + 3O₂ + 2xH₂O -> 2Fe₂O₃·xH₂O (Hydrated ferric oxide).
   - Antacid: Neutralizes stomach excess HCl via Mg(OH)₂ & Al(OH)₃.
   - Hydrocarbon combustion: CH₄ + 2O₂ -> CO₂ + 2H₂O + Heat & light.

3. 6 Scientific Research Steps:
   1. Topic Selection
   2. Surveying Literature & Information
   3. Experimental Planning & Design
   4. Testing & Data Collection
   5. Data Analysis
   6. Conclusion & Resolution (e.g. NH₄Cl dissolution is endothermic)

4. GHS Universal Hazard Pictograms:
   - Explosive (TNT), Flammable (Ether), Oxidizing (Cl₂), Toxic (Methanol)
   - Radioactive Trefoil (Uranium), Corrosive (Conc. H₂SO₄), Environmental (Lead).

5. Lab Safety Apparel:
   - White knee-length apron with wrist-length sleeves, goggles, gloves, mask.
--------------------------------------------------
SheraTutor Virtual Guidebook (SheraTutor.com)`;

    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  const selectedHazard = GHS_HAZARD_SYMBOLS.find((h) => h.id === selectedHazardId) || GHS_HAZARD_SYMBOLS[0];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-cyan-500/20">
      {/* High-Contrast Top Navigation Bar */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={1}
        chapterTitleBn="রসায়নের ধারণা (Concepts of Chemistry)"
        chapterTitleEn="Concepts of Chemistry"
        activeLesson={activeLesson}
        activeLessonTitle={isBn ? LESSONS_META[activeLesson]?.titleBn : LESSONS_META[activeLesson]?.titleEn}
        isSidebarOpen={isLeftSidebarOpen}
        onToggleSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onOpenAi={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto p-3 sm:p-4 lg:p-6 gap-5 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR (Hideable Chapter Rail & Syllabus) */}
        {/* ========================================================= */}
        {isLeftSidebarOpen && (
          <aside className="w-64 sm:w-72 shrink-0 space-y-4 animate-in fade-in duration-200">
            {/* Subject Selector Pill Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'শ্রেণি ও বিষয়' : 'Grade & Subject'}
                </span>
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <div className="text-foreground">Class 9–10 (SSC)</div>
                  <div className="text-[10px] text-muted-foreground font-normal">
                    {isBn ? 'রসায়ন (Chemistry) • কোড ১৩৭' : 'Chemistry • Code 137'}
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Progress & Lessons Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">CHAPTER 01</span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'রসায়নের ধারণা' : 'Concepts of Chemistry'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = LESSONS_META[lNum];
                  const isCurrent = activeLesson === lNum;
                  const isDone = completedLessons.includes(lNum);

                  return (
                    <button
                      key={lNum}
                      onClick={() => {
                        setActiveLesson(lNum);
                        setActiveStep('concept');
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-xs'
                          : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-mono ${
                              isCurrent
                                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                : 'border-muted-foreground/40 text-muted-foreground'
                            }`}
                          >
                            {lNum}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {isBn ? `পাঠ ${meta.no}` : `Lesson ${lNum}`}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                              {isBn ? 'সক্রিয়' : 'Active'}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-xs truncate mt-0.5 text-foreground">
                          {isBn ? meta.titleBn : meta.titleEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NCTB Authenticity Badge */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি নবম-দশম শ্রেণির রসায়ন বইয়ের অধ্যায় ১ (পৃষ্ঠা ১-১৬) এর প্রতিটি সূত্র, বিক্রিয়া ও GHS প্রতীক নিখুঁতভাবে যাচাইকৃত।'
                  : 'Grounded strictly in Class 9–10 Chemistry Chapter 1 (Printed pp. 1–16) with balanced equations and 8 GHS pictograms.'}
              </p>
            </div>
          </aside>
        )}

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER WORKSPACE (5-Step Pedagogical Engine)   */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Lesson Header Banner */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold border border-cyan-500/20">
                  <FlaskConical className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় ০১ • পাঠ ${currentLessonMeta.no}` : `Chapter 01 • Lesson ${activeLesson}`}
                  </span>
                  <span>•</span>
                  <span>{currentLessonMeta.badgeText}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {isBn ? currentLessonMeta.titleBn : currentLessonMeta.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                  {isBn ? currentLessonMeta.overviewBn : currentLessonMeta.overviewEn}
                </p>
              </div>

              {/* Study Tip Pill */}
              <div className="shrink-0 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-xs text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{isBn ? 'বোর্ড পরীক্ষার টিপ' : 'Exam Study Tip'}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {isBn ? currentLessonMeta.studyTipBn : currentLessonMeta.studyTipEn}
                </p>
              </div>
            </div>

            {/* 5-Step Horizontal Tab Navigation */}
            <div className="mt-6 pt-4 border-t border-border/70 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { key: 'concept', labelBn: '১. কনসেপ্ট ল্যাব', labelEn: '1. Concept Lab', icon: BookOpen },
                { key: 'example', labelBn: '২. বোর্ড উদাহরণ (CQ)', labelEn: '2. Board CQ', icon: Award },
                { key: 'try', labelBn: '৩. নিজে চেষ্টা করুন', labelEn: '3. Try Yourself', icon: Sliders },
                { key: 'check', labelBn: '৪. অনুধাবন যাচাই (MCQ)', labelEn: '4. Check MCQ', icon: HelpCircle },
                { key: 'summary', labelBn: '৫. সারসংক্ষেপ ও সূত্র', labelEn: '5. Summary Vault', icon: CheckCircle2 },
              ].map((step) => {
                const isStepActive = activeStep === step.key;
                const Icon = step.icon;
                return (
                  <button
                    key={step.key}
                    onClick={() => setActiveStep(step.key as LearningStep)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isStepActive
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{isBn ? step.labelBn : step.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ========================================================= */}
          {/* STEP 1: CONCEPT LAB                                       */}
          {/* ========================================================= */}
          {activeStep === 'concept' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Lesson 1 Concept: History & Scope */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  {/* Definition Card */}
                  <div className="rounded-3xl border border-cyan-500/30 bg-card p-6 shadow-xs relative overflow-hidden">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
                        <FlaskConical className="h-6 w-6" />
                      </div>
                      <div className="space-y-2">
                        <span className="text-[11px] font-black uppercase tracking-wider text-cyan-600 dark:text-cyan-400">
                          {isBn ? 'এনসিটিবি প্রামাণ্য সংজ্ঞা' : 'Standard NCTB Definition'}
                        </span>
                        <h3 className="text-lg font-black text-foreground">
                          {isBn ? 'রসায়ন কী? (What is Chemistry?)' : 'What is Chemistry?'}
                        </h3>
                        <blockquote className="p-4 rounded-2xl bg-muted/50 border-l-4 border-cyan-500 text-sm font-medium leading-relaxed italic text-foreground">
                          {isBn
                            ? '“বিজ্ঞানের যে শাখায় পদার্থের গঠন, পদার্থের ধর্ম এবং পদার্থের পারস্পরিক রূপান্তর ইত্যাদি নিয়ে আলোচনা করা হয় তাকে রসায়ন বলে।”'
                            : '“Chemistry is the branch of science that deals with the composition, structure, properties, and dynamic transformations of matter.”'}
                        </blockquote>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'যেখানে পদার্থ আছে সেখানেই রসায়ন আছে। বায়ুমণ্ডলে গ্যাসীয় উপাদানের চক্র থেকে শুরু করে আমাদের শরীরের প্রতিটি কোষের বিপাকীয় কাজ—সবই রসায়নের নিয়মে পরিচালিত।'
                            : 'Wherever there is matter, there is chemistry—from atmospheric biogeochemical cycles to cellular metabolism inside living organisms.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* History & Etymology 3-Column Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Card 1: Alchemy */}
                    <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 hover:border-cyan-500/40 transition-colors">
                      <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 w-fit">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-black text-foreground">
                        {isBn ? 'আলকেমি ও শব্দোৎপত্তি' : 'Alchemy & Etymology'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isBn
                          ? 'মধ্যযুগে আরবের দার্শনিকরা স্বল্পমূল্যের ধাতু (কপার, টিন, সিসা) থেকে সোনা তৈরি ও অমরত্বের মহৌষধ আবিষ্কারের চেষ্টা করতেন। এই চর্চাকে বলা হতো আলকেমি (Alchemy)।'
                          : 'Medieval Arabian philosophers sought to transmute base metals (copper, tin, lead) into gold and formulate the elixir of life. This discipline was called Alchemy.'}
                      </p>
                      <div className="p-2.5 rounded-xl bg-muted/50 text-[11px] font-mono text-muted-foreground">
                        {isBn ? 'আরবি আল-কিমিয়া → Chemi → Chemistry' : 'Arabic Al-Kimia → Chemi → Chemistry'}
                      </div>
                    </div>

                    {/* Card 2: Jabir ibn Hayyan */}
                    <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 hover:border-cyan-500/40 transition-colors">
                      <div className="p-2.5 rounded-2xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 w-fit">
                        <TestTube2 className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-black text-foreground">
                        {isBn ? 'জাবির-ইবনে-হাইয়ান' : 'Jabir ibn Hayyan'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isBn
                          ? 'আলকেমিস্ট জাবির-ইবনে-হাইয়ান সর্বপ্রথম গবেষণাগারে পদ্ধতিগতভাবে রসায়নের চর্চা করেন। তাই অনেক সময় তাঁকে রসায়নের প্রাথমিক জনক হিসেবে অভিহিত করা হয়।'
                          : 'Jabir ibn Hayyan pioneered practical laboratory experimentation, distillation, and crystallization, earning recognition as an early forefather of chemistry.'}
                      </p>
                      <div className="p-2.5 rounded-xl bg-muted/50 text-[11px] text-muted-foreground">
                        {isBn ? 'বিশ্বাস করতেন: সকল পদার্থ মাটি, পানি, আগুন ও বাতাসে গঠিত।' : 'Hypothesized matter was composed of earth, water, fire, and air.'}
                      </div>
                    </div>

                    {/* Card 3: Antoine Lavoisier */}
                    <div className="rounded-3xl border border-border/80 bg-card p-5 space-y-3 hover:border-cyan-500/40 transition-colors">
                      <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
                        <Award className="h-5 w-5" />
                      </div>
                      <h4 className="text-sm font-black text-foreground">
                        {isBn ? 'অ্যান্টনি ল্যাভয়সিয়ে (জনক)' : 'Antoine Lavoisier'}
                      </h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {isBn
                          ? 'রবার্ট বয়েল, জন ডালটন ও স্যার ফ্রান্সিস বেকনের সাথে সাথে ল্যাভয়সিয়ে আধুনিক রসায়নের ভিত্তি স্থাপন করেন। তিনিই দহন প্রক্রিয়ায় অক্সিজেনের ভূমিকা প্রমাণ করেন।'
                          : 'Alongside Robert Boyle and John Dalton, Antoine Lavoisier established quantitative chemistry and oxygen combustion, hailed as the Father of Modern Chemistry.'}
                      </p>
                      <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[11px] font-bold">
                        {isBn ? 'আধুনিক রসায়নের জনক (Father of Modern Chem)' : 'Father of Modern Chemistry'}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 2 Concept: Everyday Reactions */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                      <Apple className="h-5 w-5 text-emerald-500" />
                      <span>
                        {isBn ? 'প্রাত্যহিক জীবনের রসায়ন ও পরিবর্তন' : 'Everyday Chemical Phenomena'}
                      </span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'আমাদের চারপাশের পরিচিত ঘটনাগুলো যেমন ফল পাকা, লোহার মরিচা ধরা কিংবা গ্যাস্ট্রিকের ব্যথায় এন্টাসিড খাওয়া—সবকিছুই গভীর রাসায়নিক বিক্রিয়ার প্রত্যক্ষ ফল।'
                        : 'Familiar daily occurrences such as fruit ripening, iron corrosion, and drinking antacids are driven by fundamental chemical reactions.'}
                    </p>

                    {/* 4 Interactive Feature Rows */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Row 1: Mango */}
                      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                            {isBn ? '১. কাঁচা আম থেকে পাকা আম' : '1. Unripe to Ripe Mango'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold">
                            {isBn ? 'এসিড → শর্করা' : 'Acid → Sugars'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isBn
                            ? 'কাঁচা আমে থাকে সাক্সিনিক এসিড ও ম্যালেয়িক এসিড (টক স্বাদ)। আম পাকার সময় এগুলো রাসায়নিক পরিবর্তনের মাধ্যমে গ্লুকোজ ও ফ্রুক্টোজ শর্করায় রূপান্তরিত হয়ে মিষ্টি স্বাদের সৃষ্টি করে।'
                            : 'Unripe mangoes contain sour succinic and maleic organic acids. Enzymatic ripening converts them into sweet glucose and fructose carbohydrates.'}
                        </p>
                      </div>

                      {/* Row 2: Rusting */}
                      <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-amber-600 dark:text-amber-400">
                            {isBn ? '২. লোহার মরিচা পড়া' : '2. Rusting of Iron'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold">
                            {isBn ? 'জারণ বিক্রিয়া' : 'Oxidation'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isBn
                            ? 'বাতাসের অক্সিজেন ও জলীয় বাষ্পের উপস্থিতিতে লোহা জারিত হয়ে লালচে-বাদামি আর্দ্র ফেরিক অক্সাইড বা মরিচা তৈরি করে:'
                            : 'In the presence of atmospheric oxygen and moisture, metallic iron oxidizes into hydrated ferric oxide (rust):'}
                        </p>
                        <div className="p-2 rounded-xl bg-card border border-border text-xs font-mono text-center text-foreground">
                          <RenderMathText text="$4\text{Fe} + 3\text{O}_2 + 2x\text{H}_2\text{O} \rightarrow 2\text{Fe}_2\text{O}_3 \cdot x\text{H}_2\text{O}$" />
                        </div>
                      </div>

                      {/* Row 3: Combustion */}
                      <div className="p-4 rounded-2xl border border-rose-500/30 bg-rose-500/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-rose-600 dark:text-rose-400">
                            {isBn ? '৩. মোম ও প্রাকৃতিক গ্যাসের দহন' : '3. Hydrocarbon Combustion'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-bold">
                            {isBn ? 'তাপোৎপাদী' : 'Exothermic'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isBn
                            ? 'কেরোসিন, প্রাকৃতিক গ্যাস (মিথেন) ও মোম মূলত কার্বন ও হাইড্রোজেনের যৌগ (হাইড্রোকার্বন)। অক্সিজেনের উপস্থিতিতে পুড়ে কার্বন ডাই-অক্সাইড, জলীয় বাষ্প, আলো ও প্রচুর তাপশক্তি উৎপন্ন করে।'
                            : 'Methane and paraffin wax burn in atmospheric oxygen to liberate carbon dioxide, water vapor, light, and thermal energy.'}
                        </p>
                        <div className="p-2 rounded-xl bg-card border border-border text-xs font-mono text-center text-foreground">
                          <RenderMathText text="$\text{CH}_4 + 2\text{O}_2 \rightarrow \text{CO}_2 + 2\text{H}_2\text{O} + \text{তাপ ও আলো}$" />
                        </div>
                      </div>

                      {/* Row 4: Antacid */}
                      <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-black text-cyan-600 dark:text-cyan-400">
                            {isBn ? '৪. এসিডিটি ও এন্টাসিড প্রশমন' : '4. Stomach Antacid Neutralization'}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-bold">
                            {isBn ? 'প্রশমন বিক্রিয়া' : 'Neutralization'}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {isBn
                            ? 'পাকস্থলীতে অতিরিক্ত হাইড্রোক্লোরিক এসিড (HCl) নিঃসৃত হলে এসিডিটি হয়। এন্টাসিডের ম্যাগনেসিয়াম হাইড্রোক্সাইড বা অ্যালুমিনিয়াম হাইড্রোক্সাইড অতিরিক্ত এসিডকে প্রশমিত করে পানি ও লবণ তৈরি করে।'
                            : 'Stomach acid excess (HCl) triggers heartburn. Antacids contain Mg(OH)₂ and Al(OH)₃ bases that neutralize hydrochloric acid into benign salts and water.'}
                        </p>
                        <div className="p-2 rounded-xl bg-card border border-border text-xs font-mono text-center text-foreground">
                          <RenderMathText text="$\text{HCl} + \text{Mg(OH)}_2 \rightarrow \text{MgCl}_2 + 2\text{H}_2\text{O}$" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 3 Concept: Chemistry & Other Sciences */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'বিজ্ঞানের অন্যান্য শাখার সাথে রসায়নের সংযোগ' : 'Interdisciplinary Links with Science'}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'রসায়ন বিজ্ঞানের একটি কেন্দ্রীয় শাখা। এটি অন্যান্য বিজ্ঞান শাখার সাথে এমনভাবে সম্পৃক্ত যে একটিকে ছাড়া অপরটিকে ব্যাখ্যা করা প্রায় অসম্ভব।'
                        : 'Chemistry acts as the central science connecting biological, physical, and computational realms.'}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {/* Biology */}
                      <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit font-black text-xs">
                          {isBn ? 'জীববিজ্ঞান (Biology)' : 'Biology'}
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {isBn ? 'সালোকসংশ্লেষণ ও খাদ্য বিপাক' : 'Photosynthesis & Metabolism'}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'উদ্ভিদের সবুজ পাতায় কার্বন ডাই-অক্সাইড ও পানি থেকে সূর্যালোক ও ক্লোরোফিলের মাধ্যমে গ্লুকোজ তৈরি হওয়া রসায়নের এক অনন্য বিক্রিয়া:'
                            : 'Plants synthesize glucose from CO₂ and water catalyzed by chlorophyll and sunlight:'}
                        </p>
                        <div className="p-2 rounded-xl bg-muted/50 text-[11px] font-mono text-center text-foreground">
                          <RenderMathText text="$6\text{CO}_2 + 6\text{H}_2\text{O} \xrightarrow{\text{light}} \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2$" />
                        </div>
                      </div>

                      {/* Physics */}
                      <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                        <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 w-fit font-black text-xs">
                          {isBn ? 'পদার্থবিজ্ঞান (Physics)' : 'Physics'}
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {isBn ? 'শক্তি রূপান্তর ও তড়িৎকোষ' : 'Electrochemistry & Energy'}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'বৈদ্যুতিক ব্যাটারি, জ্বালানি কোষ (Fuel Cell) এবং পারমাণবিক শক্তির মূল তত্ত্বগুলো পদার্থবিজ্ঞান ও রসায়নের ভৌত সংযোগস্থলে প্রতিষ্ঠিত।'
                            : 'Electric cells, batteries, and nuclear thermodynamics sit directly at the physical-chemical interface.'}
                        </p>
                        <div className="p-2 rounded-xl bg-muted/50 text-[11px] text-muted-foreground">
                          {isBn ? 'রাসায়নিক শক্তি → বিদ্যুৎ শক্তি (ব্যাটারি)' : 'Chemical Energy → Electric Current'}
                        </div>
                      </div>

                      {/* Mathematics */}
                      <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                        <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 w-fit font-black text-xs">
                          {isBn ? 'গণিত (Mathematics)' : 'Mathematics'}
                        </div>
                        <h4 className="text-sm font-bold text-foreground">
                          {isBn ? 'ঘনমাত্রা ও স্টয়কিওমিতি' : 'Concentration & Stoichiometry'}
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'দ্রবণের মোলারিটি (S = 1000w / MV), গ্যাসীয় চাপ এবং বিক্রিয়ার হার নির্ণয়ে গণিতের উচ্চতর সূত্রের প্রয়োগ অপরিহার্য।'
                            : 'Calculating solution molarity, gas laws, and kinetics requires rigorous algebraic and calculus formulations.'}
                        </p>
                        <div className="p-2 rounded-xl bg-muted/50 text-[11px] font-mono text-center text-foreground">
                          <RenderMathText text="$S = \frac{1000 \cdot W}{M \cdot V} \quad (\text{Molarity})$" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 4 Concept: 6 Research Steps */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-foreground">
                        {isBn ? 'রসায়নে অনুসন্ধান ও গবেষণার ৬টি ধারাবাহিক ধাপ' : '6 Sequential Steps of Chemical Research'}
                      </h3>
                      <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold">
                        {isBn ? 'প্রবাহচিত্র ১.০২' : 'Flowchart 1.02'}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'সঠিক পদ্ধতিতে পরীক্ষা-নিরীক্ষার মাধ্যমে অজানা কোনো কিছু জানার নামই গবেষণা। এনসিটিবি পাঠ্যপুস্তক অনুযায়ী গবেষণা কাজের সুনির্দিষ্ট ৬টি ধারাবাহিক ধাপ রয়েছে:'
                        : 'Scientific research is the disciplined pursuit of knowledge via systematic experimentation. NCTB outlines 6 foundational steps:'}
                    </p>

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2">
                      {RESEARCH_STEPS.map((step) => (
                        <div
                          key={step.id}
                          className="p-4 rounded-2xl border border-border/70 bg-card hover:border-cyan-500/40 transition-colors space-y-2 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="h-6 w-6 rounded-full bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 flex items-center justify-center font-bold text-xs">
                              {step.id}
                            </span>
                            <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
                              STEP {step.id}
                            </span>
                          </div>
                          <h4 className="text-sm font-extrabold text-foreground">
                            {isBn ? step.nameBn : step.nameEn}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {isBn ? step.descBn : step.descEn}
                          </p>
                          <div className="p-2.5 rounded-xl bg-muted/40 text-[11px] text-foreground font-medium border border-border/50">
                            <span className="text-cyan-600 dark:text-cyan-400 font-bold block mb-0.5">
                              {isBn ? 'পাঠ্যবই উদাহরণ:' : 'Textbook Lab Application:'}
                            </span>
                            {isBn ? step.labApplicationBn : step.labApplicationEn}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Lesson 5 Concept: 8 GHS Hazard Symbols & PPE */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  {/* PPE Apparel Overview */}
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <h3 className="text-lg font-black text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                      <span>{isBn ? 'রসায়ন পরীক্ষাগারে ব্যক্তিগত নিরাপত্তা পোশাক (PPE)' : 'Laboratory Personal Protective Equipment (PPE)'}</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {isBn
                        ? 'রসায়ন ল্যাবরেটরিতে ঢোকা থেকে বের হওয়া পর্যন্ত অসতর্কতায় মারাত্মক দুর্ঘটনা ঘটতে পারে। তাই নিজের সুরক্ষায় ৪টি প্রধান সরঞ্জাম ব্যবহার করা আবশ্যক:'
                        : 'Entering a chemistry lab exposes researchers to corrosive reagents and toxic vapors. Four personal safety items are strictly mandatory:'}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
                      <div className="p-4 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
                        <span className="text-xs font-black text-cyan-600 dark:text-cyan-400 block">
                          {isBn ? '১. নিরাপদ অ্যাপ্রোন (Apron)' : '1. Lab Apron'}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'সাধারণত সাদা রঙের। হাতা হবে কবজি পর্যন্ত এবং লম্বায় হাঁটুর নিচ পর্যন্ত, যাতে পোশাক ও শরীর ক্ষতিকারক এসিড ও স্প্ল্যাশ থেকে বাঁচে।'
                            : 'Traditionally white; wrist-length sleeves and knee-length drop protecting skin and clothing against corrosive splashes.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl border border-blue-500/30 bg-blue-500/5 space-y-2">
                        <span className="text-xs font-black text-blue-600 dark:text-blue-400 block">
                          {isBn ? '২. সেফটি গগলস (Goggles)' : '2. Safety Goggles'}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'পরীক্ষার সময় ছিটকে আসা এসিড, ক্ষার বা বিষাক্ত বাষ্প থেকে চোখকে নিরাপদ রাখতে বায়ুরোধী গগলস পরা আবশ্যক।'
                            : 'Impact-resistant and splash-tight eye shields defending cornea against acidic splatter and volatile fumes.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/5 space-y-2">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 block">
                          {isBn ? '৩. হ্যান্ড গ্লাভস (Gloves)' : '3. Protective Gloves'}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'ক্ষয়কারী এসিড, ক্ষার বা বিষাক্ত জৈব যৌগ হাত দিয়ে স্পর্শ এড়াতে নাইট্রাইল বা পিভিসি গ্লাভস পরিধান অপরিহার্য।'
                            : 'Nitrile or PVC barrier gloves preventing chemical burns and transdermal poison absorption.'}
                        </p>
                      </div>

                      <div className="p-4 rounded-2xl border border-purple-500/30 bg-purple-500/5 space-y-2">
                        <span className="text-xs font-black text-purple-600 dark:text-purple-400 block">
                          {isBn ? '৪. রেস্পিরেটর মাস্ক (Mask)' : '4. Face Mask'}
                        </span>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {isBn
                            ? 'উত্তেজক গ্যাস, ধূলিকণা বা বিষাক্ত বাষ্প (যেমন বেনজিন, মিথানল, ক্লোরিন) সরাসরি ফুসফুসে প্রবেশ ঠেকাতে মাস্ক ব্যবহার্য।'
                            : 'Filters noxious fumes, acidic mists, and particulates, preserving respiratory tracts.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 8 GHS Hazard Pictograms Grid Overview */}
                  <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-black text-foreground">
                        {isBn ? 'জাতিসংঘের সার্বজনীন GHS সাংকেতিক চিহ্ন (৮টি প্রতীক)' : 'United Nations GHS Hazard Pictograms'}
                      </h3>
                      <span className="text-xs font-mono text-muted-foreground">Table 1.04</span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {isBn
                        ? 'জাতিসংঘের ‘পরিবেশ ও উন্নয়ন’ সম্মেলনের গৃহীত নীতি অনুযায়ী রাসায়নিক দ্রব্যের বোতল বা পাত্রে ঝুঁকি প্রকাশের জন্য এই সার্বজনীন প্রতীকগুলো ব্যবহৃত হয়:'
                        : 'Adopted at the UN Conference on Environment and Development, these harmonized signs alert researchers to chemical dangers:'}
                    </p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
                      {GHS_HAZARD_SYMBOLS.map((hz) => (
                        <div
                          key={hz.id}
                          className={`p-3.5 rounded-2xl border ${hz.colorClass} space-y-1.5 transition-all`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono font-bold uppercase">{hz.code}</span>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-card/80">
                              {isBn ? hz.riskLevelBn : hz.riskLevelEn}
                            </span>
                          </div>
                          <div className="font-black text-xs text-foreground">
                            {isBn ? hz.nameBn : hz.nameEn}
                          </div>
                          <div className="text-[11px] text-muted-foreground line-clamp-2">
                            {isBn ? hz.examplesBn.join(', ') : hz.examplesEn.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: BOARD EXAMPLE (CQ Breakdown & Rubric)             */}
          {/* ========================================================= */}
          {activeStep === 'example' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Board CQ 1 Card */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                      SSC BOARD CREATIVE QUESTION (CQ)
                    </span>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? 'সৃজনশীল প্রশ্ন ০১: দৈনন্দিন জীবনের রসায়ন ও কীটনাশকের প্রভাব' : 'Board CQ 01: Everyday Chemistry & Pesticide Hazards'}
                    </h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
                    ১০ নম্বর (10 Marks)
                  </span>
                </div>

                {/* Stimulus Box */}
                <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 space-y-2">
                  <span className="text-xs font-bold text-foreground uppercase tracking-wide block">
                    {isBn ? 'উদ্দীপক:' : 'Stimulus:'}
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-muted-foreground">
                    <div className="p-3 rounded-xl bg-card border border-border/50">
                      <strong className="text-foreground block mb-1">
                        {isBn ? 'চিত্র A: ওষুধ ও ফল সংরক্ষণ' : 'Figure A: Medicine & Fruit Ripening'}
                      </strong>
                      {isBn
                        ? 'সিফাত কাঁচা আম খাওয়ার সময় টক স্বাদ অনুভব করল। কয়েকদিন পর একই গাছ থেকে পাড়া পাকা আম খেয়ে মিষ্টি স্বাদ পেল। আবার তার বাবা পেটের ব্যথায় এন্টাসিড সিরাপ খেলেন।'
                        : 'Sifat tasted unripe mangoes and found them acidic/sour. After a week, mangoes from the same branch tasted sweetly pleasant. Meanwhile his father drank antacid syrup for heartburn.'}
                    </div>
                    <div className="p-3 rounded-xl bg-card border border-border/50">
                      <strong className="text-foreground block mb-1">
                        {isBn ? 'চিত্র B: জমিতে কীটনাশক প্রয়োগ' : 'Figure B: Field Pesticide Spraying'}
                      </strong>
                      {isBn
                        ? 'কৃষক জমিতে অতিরিক্ত ফলন পেতে অনবরত রাসায়নিক সার ও কীটনাশক স্প্রে করছেন, যা বৃষ্টির পানিতে ধুয়ে পাশের খালে গিয়ে মিশছে।'
                        : 'A farmer regularly sprays excessive synthetic fertilizers and pesticides to boost yield, with surface runoff flowing directly into neighboring canals.'}
                    </div>
                  </div>
                </div>

                {/* Questions & 4-Tier Rubric Answers */}
                <div className="space-y-4">
                  {/* (ক) জ্ঞানমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(ক) গবেষণা কী? [মান: ১]' : '(a) What is research? [Mark: 1]'}</span>
                      <span className="text-emerald-600 font-mono">1 Mark</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500">
                      {isBn
                        ? 'সঠিক ও সুনির্দিষ্ট পদ্ধতিতে পরীক্ষা-নিরীক্ষার মাধ্যমে অজানা কোনো কিছু জানার নামই গবেষণা।'
                        : 'Research is the disciplined, systematic process of discovering unknown phenomena through rigorous experimentation.'}
                    </div>
                  </div>

                  {/* (খ) অনুধাবনমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(খ) পাকা আম খেতে মিষ্টি লাগে কেন? ব্যাখ্যা করো। [মান: ২]' : '(b) Why does ripe mango taste sweet? Explain. [Mark: 2]'}</span>
                      <span className="text-emerald-600 font-mono">2 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1">
                      <p>
                        {isBn
                          ? 'কাঁচা আমে বিভিন্ন ধরনের জৈব এসিড যেমন: সাক্সিনিক এসিড, ম্যালেয়িক এসিড ইত্যাদি থাকার কারণে কাঁচা আম টক স্বাদযুক্ত হয়।'
                          : 'Unripe mangoes contain organic acids including succinic acid and maleic acid which confer a distinctly sour taste.'}
                      </p>
                      <p>
                        {isBn
                          ? 'কিন্তু আম যখন পাকে, তখন অভ্যন্তরীণ প্রাকৃতিক রাসায়নিক পরিবর্তনের মাধ্যমে এই এসিডগুলো ভেঙে গ্লুকোজ ও ফ্রুক্টোজ নামক মিষ্টি শর্করায় রূপান্তরিত হয়। তাই পাকা আম খেতে মিষ্টি লাগে।'
                          : 'Upon ripening, enzymatic biochemical processes convert these acids into sweet glucose and fructose sugars, resulting in sweet taste.'}
                      </p>
                    </div>
                  </div>

                  {/* (গ) প্রয়োগমূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(গ) উদ্দীপকের চিত্র A-তে সংঘটিত ঘটনাগুলোতে রসায়ন কীভাবে সম্পর্কিত—ব্যাখ্যা করো। [মান: ৩]' : '(c) Explain how chemistry underpins phenomena in Figure A. [Mark: 3]'}</span>
                      <span className="text-emerald-600 font-mono">3 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1.5">
                      <p>
                        {isBn
                          ? 'উদ্দীপকের চিত্র A-তে দুটি ঘটনা লক্ষ্য করা যায়: (১) আম পাকার জৈব রাসায়নিক রূপান্তর এবং (২) পাকস্থলীর এসিডিটি প্রশমন।'
                          : 'Figure A highlights two primary phenomena: fruit ripening biochemistry and acid-base neutralization inside the gastrointestinal tract.'}
                      </p>
                      <p>
                        {isBn
                          ? 'পাকস্থলীতে খাদ্য পরিপাকের জন্য স্বাভাবিকভাবে হাইড্রোক্লোরিক এসিড ($HCl$) নিঃসৃত হয়। কিন্তু অতিরিক্ত এসিড নিঃসৃত হলে পেটে তীব্র জ্বালাপোড়া বা এসিডিটি হয়। এন্টাসিড মূলত মৃদু ক্ষারকীয় ম্যাগনেসিয়াম হাইড্রোক্সাইড $Mg(OH)_2$ ও অ্যালুমিনিয়াম হাইড্রোক্সাইড $Al(OH)_3$ এর মিশ্রণ। এটি পাকস্থলীর অতিরিক্ত এসিডের সাথে বিক্রিয়া করে লবণ ও পানি উৎপাদনের মাধ্যমে এসিডকে প্রশমিত করে ($HCl + Mg(OH)_2 \rightarrow MgCl_2 + 2H_2O$)। উভয় ঘটনাই রসায়নের মৌলিক রূপান্তরের উৎকৃষ্ট উদাহরণ।'
                          : 'Excess hydrochloric acid ($HCl$) causes gastric discomfort. Antacids supply mild bases ($Mg(OH)_2$ & $Al(OH)_3$) that react in a classic neutralization reaction, yielding neutral salts and water. Both processes are direct demonstrations of chemical transformations.'}
                      </p>
                    </div>
                  </div>

                  {/* (ঘ) উচ্চতর দক্ষতামূলক */}
                  <div className="p-4 rounded-2xl bg-card border border-border/60 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold text-foreground">
                      <span>{isBn ? '(ঘ) উদ্দীপকের B নং চিত্রের দ্রব্যের অতিরিক্ত ব্যবহার পরিবেশের জন্য কতটা ঝুঁকিপূর্ণ—যুক্তিসহ বিশ্লেষণ করো। [মান: ৪]' : '(d) Analyze the environmental hazards of excessive chemical usage in Figure B. [Mark: 4]'}</span>
                      <span className="text-emerald-600 font-mono">4 Marks</span>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed pl-2 border-l-2 border-cyan-500 space-y-1.5">
                      <p>
                        {isBn
                          ? 'উদ্দীপকের B নং চিত্রে জমিতে অতিরিক্ত রাসায়নিক সার ও কীটনাশক ব্যবহারের ঘটনা দেখানো হয়েছে, যার অতিব্যবহার পরিবেশ ও মানবজাতির জন্য মারাত্মক হুমকিস্বরূপ।'
                          : 'Figure B represents the uncontrolled dispersion of agrochemicals and pesticides, which poses severe ecological and bio-accumulative threats.'}
                      </p>
                      <p>
                        {isBn
                          ? 'কীটনাশক মূলত বিষাক্ত রাসায়নিক পদার্থ। জমিতে অতিরিক্ত কীটনাশক প্রয়োগ করলে তা বৃষ্টির পানির সাথে নদী-নালা, খাল-বিলে ধুয়ে যায় এবং জলজ বাস্তুতন্ত্রের মাছ ও প্ল্যাংকটন ধ্বংস করে। এছাড়া মাটি দূষিত হয় এবং মাটির উপকারী অণুজীব মারা গিয়ে মাটির উর্বরতা বিনষ্ট হয়। খাদ্যশৃঙ্খলে (Food Chain) প্রবেশ করে এই রাসায়নিক মানুষের দেহে ক্যান্সার, কিডনি ফেইলিওর ও লিভার সিরোসিসের কারণ হয়। কাজেই পরিমিত ও নিয়ন্ত্রিত ব্যবহার ব্যতীত এর যথেচ্ছ প্রয়োগ বন্ধ করা অপরিহার্য।'
                          : 'Pesticides are toxic synthetic compounds. Runoff carries persistent residues into waterways, poisoning fish and aquatic organisms while disrupting soil biomes. Entering the human food chain through biomagnification, they trigger severe organ damage and cancer, necessitating biological alternatives and strict dosage control.'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Examiner Warning Trap */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25 space-y-1 text-xs">
                  <div className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400 font-bold">
                    <AlertCircle className="h-4 w-4" />
                    <span>{isBn ? 'পরীক্ষকের ফাঁদ ও সাবধানতা' : 'Examiner Warning & Grading Pitfall'}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    {isBn
                      ? 'এন্টাসিডের ভূমিকা লেখার সময় অবশ্যই $HCl$ এর সাথে $Mg(OH)_2$ বা $Al(OH)_3$ এর প্রশমন সমীকরণ উল্লেখ করতে হবে। সমীকরণ না লিখলে ৩ নম্বরের প্রয়োগমূলক অংশে পূর্ণ নম্বর পাওয়া যায় না!'
                      : 'Always specify the exact neutralization chemical equation ($HCl + Mg(OH)_2 \rightarrow MgCl_2 + 2H_2O$). Omitting balanced formulas results in automatic mark deductions!'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: TRY YOURSELF (Interactive Simulators)             */}
          {/* ========================================================= */}
          {activeStep === 'try' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Simulator Selector Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedPhenomenon('mango')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPhenomenon === 'mango'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  🥭 {isBn ? 'আম পাকা সিমুলেটর' : 'Mango Ripening'}
                </button>
                <button
                  onClick={() => setSelectedPhenomenon('rust')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPhenomenon === 'rust'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  ⚙️ {isBn ? 'লোহার মরিচা ল্যাব' : 'Iron Rusting'}
                </button>
                <button
                  onClick={() => setSelectedPhenomenon('antacid')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    selectedPhenomenon === 'antacid'
                      ? 'bg-cyan-600 text-white'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  🧪 {isBn ? 'এন্টাসিড প্রশমন টাইট্রেশন' : 'Antacid Titration'}
                </button>
              </div>

              {/* SIMULATOR 1: MANGO RIPENING */}
              {selectedPhenomenon === 'mango' && (
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-foreground">
                        {isBn ? 'আম পাকা রূপান্তর সিমুলেটর (জৈব এসিড → শর্করা)' : 'Mango Ripening Enzymatic Simulator'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isBn ? 'স্লাইডার টেনে আম পাকার রাসায়নিক স্তর ও রাসায়নিক উপাদানের রূপান্তর পর্যবেক্ষণ করো।' : 'Drag the slider to inspect the gradual conversion of organic acids into carbohydrates.'}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      {mangoRipeness < 30 ? (isBn ? 'কাঁচা আম (সবুজ)' : 'Unripe (Green)') : mangoRipeness < 70 ? (isBn ? 'আধা-পাকা (হলুদাভ)' : 'Semi-Ripe') : (isBn ? 'সম্পূর্ণ পাকা (রসালো মিষ্টি)' : 'Fully Ripe')}
                    </span>
                  </div>

                  {/* Interactive Mango Visualizer */}
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex flex-col items-center justify-center gap-4">
                    <div
                      className="w-32 h-36 rounded-full transition-all duration-500 flex items-center justify-center shadow-lg relative border-4"
                      style={{
                        backgroundColor:
                          mangoRipeness < 30
                            ? '#22c55e'
                            : mangoRipeness < 70
                            ? '#eab308'
                            : '#f97316',
                        borderColor:
                          mangoRipeness < 30
                            ? '#15803d'
                            : mangoRipeness < 70
                            ? '#ca8a04'
                            : '#c2410c',
                      }}
                    >
                      <span className="text-4xl select-none">🥭</span>
                      <div className="absolute bottom-2 px-2 py-0.5 rounded-full bg-black/60 text-white text-[10px] font-bold">
                        {mangoRipeness}% {isBn ? 'পক্কতা' : 'Ripeness'}
                      </div>
                    </div>

                    {/* Chemical Composition Breakdown */}
                    <div className="grid grid-cols-2 gap-4 w-full max-w-md pt-2">
                      <div className="p-3 rounded-xl bg-card border border-border text-center space-y-1">
                        <span className="text-[11px] text-muted-foreground font-semibold block">
                          {isBn ? 'জৈব এসিড (সাক্সিনিক/ম্যালেয়িক)' : 'Organic Acids'}
                        </span>
                        <div className="text-sm font-black text-rose-500">
                          {Math.max(5, 100 - mangoRipeness)}%
                        </div>
                        <span className="text-[10px] text-muted-foreground block">
                          {mangoRipeness < 40 ? (isBn ? 'তীব্র টক স্বাদ' : 'Intensely Sour') : (isBn ? 'হ্রাস পাচ্ছে' : 'Diminishing')}
                        </span>
                      </div>

                      <div className="p-3 rounded-xl bg-card border border-border text-center space-y-1">
                        <span className="text-[11px] text-muted-foreground font-semibold block">
                          {isBn ? 'শর্করা (গ্লুকোজ ও ফ্রুক্টোজ)' : 'Sugars (Glucose & Fructose)'}
                        </span>
                        <div className="text-sm font-black text-emerald-500">
                          {Math.min(95, mangoRipeness + 5)}%
                        </div>
                        <span className="text-[10px] text-muted-foreground block">
                          {mangoRipeness > 60 ? (isBn ? 'রসালো ও মিষ্টি স্বাদ' : 'Sweet Flavor') : (isBn ? 'উৎপন্ন হচ্ছে' : 'Synthesizing')}
                        </span>
                      </div>
                    </div>

                    {/* Ripeness Slider */}
                    <div className="w-full max-w-md space-y-1.5 pt-2">
                      <div className="flex justify-between text-xs font-bold text-muted-foreground">
                        <span>{isBn ? 'কাঁচা (০%)' : 'Raw (0%)'}</span>
                        <span>{isBn ? 'পাকা (১০০%)' : 'Ripe (100%)'}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={mangoRipeness}
                        onChange={(e) => setMangoRipeness(Number(e.target.value))}
                        className="w-full accent-cyan-600 h-2 bg-muted rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATOR 2: IRON RUSTING LAB */}
              {selectedPhenomenon === 'rust' && (
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-foreground">
                        {isBn ? 'লোহার মরিচা পড়া ল্যাব (আর্দ্র ফেরিক অক্সাইড গঠন)' : 'Iron Rusting Kinetic Simulator'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isBn ? 'আর্দ্রতা ও সময়ের প্রভাবে লোহার জারণ ও ওজন বৃদ্ধির মাত্রা পর্যবেক্ষণ করো।' : 'Observe iron oxidation and mass gain under varying atmospheric moisture levels.'}
                      </p>
                    </div>
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      {isBn ? `সময়: ${rustDays} দিন` : `Elapsed: ${rustDays} days`}
                    </span>
                  </div>

                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex flex-col md:flex-row items-center justify-between gap-6">
                    {/* Visual Iron Bar */}
                    <div className="space-y-3 text-center">
                      <div className="relative w-48 h-20 rounded-xl border-2 border-slate-500 overflow-hidden shadow-inner flex items-center justify-center">
                        <div className="absolute inset-0 bg-slate-400" />
                        <div
                          className="absolute inset-0 bg-amber-800 transition-all duration-300"
                          style={{
                            opacity: (rustMoisture / 100) * (rustDays / 30) * 0.9,
                          }}
                        />
                        <span className="relative z-10 text-xs font-mono font-bold text-white drop-shadow">
                          {((rustMoisture / 100) * (rustDays / 30) * 100).toFixed(0)}% {isBn ? 'মরিচাকৃত' : 'Corroded'}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground">
                        Fe Metal + O₂ + H₂O
                      </div>
                    </div>

                    {/* Calculated Metrics */}
                    <div className="flex-1 space-y-3 w-full">
                      <div className="p-3 rounded-xl bg-card border border-border text-xs space-y-1">
                        <span className="text-muted-foreground block font-semibold">
                          {isBn ? 'উৎপন্ন মরিচার সংকেত:' : 'Resulting Rust Composition:'}
                        </span>
                        <div className="font-mono text-foreground font-bold">
                          <RenderMathText text="$2\text{Fe}_2\text{O}_3 \cdot x\text{H}_2\text{O}$" />
                        </div>
                      </div>

                      {/* Sliders */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                            <span>{isBn ? 'বাতাসের আর্দ্রতা (Moisture):' : 'Moisture:'}</span>
                            <span className="font-mono">{rustMoisture}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={rustMoisture}
                            onChange={(e) => setRustMoisture(Number(e.target.value))}
                            className="w-full accent-amber-600 h-1.5 bg-muted rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] font-bold text-muted-foreground">
                            <span>{isBn ? 'উন্মুক্ত রাখার সময়:' : 'Exposure Time:'}</span>
                            <span className="font-mono">{rustDays} {isBn ? 'দিন' : 'Days'}</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="30"
                            value={rustDays}
                            onChange={(e) => setRustDays(Number(e.target.value))}
                            className="w-full accent-amber-600 h-1.5 bg-muted rounded-lg cursor-pointer"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* SIMULATOR 3: ANTACID TITRATION */}
              {selectedPhenomenon === 'antacid' && (
                <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-foreground">
                        {isBn ? 'এন্টাসিড প্রশমন লাইভ টাইট্রেশন' : 'Antacid Neutralization Titration'}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {isBn ? 'পাকস্থলীর তীব্র অম্লীয় pH কে এন্টাসিড যোগ করে আরামদায়ক স্বাভাবিক মানে ফিরিয়ে আনো।' : 'Titrate antacid dose to neutralize acute acidic gastric conditions.'}
                      </p>
                    </div>
                  </div>

                  {/* pH Indicator Visualizer */}
                  {(() => {
                    const currentPh = Number((1.5 + (antacidDoseMg / 20) * 5.5).toFixed(1));
                    const isComfortable = currentPh >= 6.0 && currentPh <= 7.4;

                    return (
                      <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="space-y-2 text-center">
                          <div
                            className="w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-md border-4"
                            style={{
                              backgroundColor:
                                currentPh < 3
                                  ? '#ef4444'
                                  : currentPh < 6
                                  ? '#f59e0b'
                                  : '#10b981',
                              borderColor:
                                currentPh < 3
                                  ? '#b91c1c'
                                  : currentPh < 6
                                  ? '#b45309'
                                  : '#047857',
                            }}
                          >
                            <span className="text-white text-xs font-bold uppercase">pH</span>
                            <span className="text-white text-2xl font-black font-mono">{currentPh}</span>
                          </div>
                          <span className="text-xs font-bold text-foreground">
                            {currentPh < 3
                              ? (isBn ? 'তীব্র এসিডিটি (অস্বস্তি)' : 'Severe Acidity')
                              : isComfortable
                              ? (isBn ? 'স্বাভাবিক ও আরামদায়ক' : 'Balanced & Relieved')
                              : (isBn ? 'হালকা অম্লীয়' : 'Mild Acidic')}
                          </span>
                        </div>

                        <div className="flex-1 space-y-4 w-full">
                          <div className="p-3.5 rounded-xl bg-card border border-border space-y-1.5 text-xs">
                            <span className="font-bold text-foreground block">
                              {isBn ? 'চলমান প্রশমন বিক্রিয়া:' : 'Active Neutralization Reaction:'}
                            </span>
                            <div className="font-mono text-cyan-600 dark:text-cyan-400">
                              <RenderMathText text="$\text{HCl (Gastric)} + \text{Mg(OH)}_2 \rightarrow \text{MgCl}_2 + 2\text{H}_2\text{O}$" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-bold text-muted-foreground">
                              <span>{isBn ? 'গৃহীত এন্টাসিডের মাত্রা (Dose):' : 'Antacid Dosage:'}</span>
                              <span className="font-mono text-cyan-600 font-bold">{antacidDoseMg} mL</span>
                            </div>
                            <input
                              type="range"
                              min="0"
                              max="20"
                              value={antacidDoseMg}
                              onChange={(e) => setAntacidDoseMg(Number(e.target.value))}
                              className="w-full accent-cyan-600 h-2 bg-muted rounded-lg cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-muted-foreground">
                              <span>0 mL (ব্যথাতুর)</span>
                              <span>10 mL (আংশিক)</span>
                              <span>20 mL (সম্পূর্ণ প্রশমিত)</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* SIMULATOR 4: 6-STEP RESEARCH SEQUENCER & NH4Cl LAB */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? 'বৈজ্ঞানিক অনুসন্ধান: অ্যামোনিয়াম ক্লোরাইড দ্রবীভূতকরণ ল্যাব' : 'Scientific Inquiry: Ammonium Chloride Dissolution Lab'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isBn
                        ? 'এনসিটিবি টেবিল ১.০৩: বিকারে NH₄Cl দ্রবীভূত করো এবং লাইভ থার্মোমিটারে তাপমাত্রা হ্রাস ও তাপহারী প্রকৃতি পরীক্ষা করো।'
                        : 'NCTB Table 1.03: Dissolve NH₄Cl in 250 mL water and track the real-time thermal absorption on the thermometer.'}
                    </p>
                  </div>
                  <button
                    onClick={handleResetNh4Cl}
                    className="p-2 rounded-xl bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground text-xs flex items-center gap-1.5 font-bold transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                  {/* Beaker & Thermometer Visual */}
                  <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 flex items-center justify-around">
                    {/* Beaker */}
                    <div className="relative w-36 h-44 rounded-b-3xl border-4 border-t-0 border-cyan-500/40 bg-card/60 overflow-hidden flex flex-col justify-end p-2 shadow-inner">
                      <div
                        className="w-full rounded-b-2xl bg-cyan-500/20 transition-all duration-700 flex flex-col items-center justify-center relative"
                        style={{ height: '70%' }}
                      >
                        <span className="text-[10px] font-mono font-bold text-cyan-600 dark:text-cyan-400">
                          250 mL H₂O
                        </span>
                        {dissolvedNh4ClGrams > 0 && (
                          <span className="text-[10px] font-bold text-foreground">
                            + {dissolvedNh4ClGrams}g NH₄Cl
                          </span>
                        )}
                        {isStirring && (
                          <div className="absolute inset-x-0 h-1 bg-cyan-400 animate-ping opacity-75" />
                        )}
                      </div>
                    </div>

                    {/* Thermometer */}
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative w-6 h-44 rounded-full border-2 border-slate-400 bg-slate-200 dark:bg-slate-800 p-0.5 overflow-hidden flex flex-col justify-end">
                        <div
                          className="w-full rounded-full bg-rose-500 transition-all duration-500"
                          style={{
                            height: `${(currentFlaskTemp / 30) * 100}%`,
                          }}
                        />
                      </div>
                      <div className="text-center">
                        <span className="text-base font-black font-mono text-rose-500 block">
                          {currentFlaskTemp}°C
                        </span>
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {isBn ? 'থার্মোমিটার পাঠ' : 'Temp Reading'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Observation Table */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-foreground block">
                        {isBn ? 'ল্যাবরেটরি অ্যাকশন:' : 'Laboratory Action:'}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          disabled={dissolvedNh4ClGrams >= 15 || isStirring}
                          onClick={() => handleAddNh4Cl(5)}
                          className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs disabled:opacity-50 transition-colors flex items-center gap-1.5"
                        >
                          <TestTube2 className="h-4 w-4" />
                          <span>{isBn ? '+৫ গ্রাম NH₄Cl যোগ ও নাড়ানো' : '+5g NH₄Cl & Stir'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Ledger */}
                    <div className="border border-border/70 rounded-2xl overflow-hidden text-xs">
                      <div className="grid grid-cols-2 bg-muted/60 p-2 font-bold text-foreground border-b border-border/70">
                        <span>{isBn ? 'NH₄Cl এর পরিমাণ' : 'Dissolved NH₄Cl'}</span>
                        <span>{isBn ? 'দ্রবণের তাপমাত্রা' : 'Temperature'}</span>
                      </div>
                      {[
                        { g: 0, t: 25 },
                        { g: 5, t: 20 },
                        { g: 10, t: 15 },
                        { g: 15, t: 10 },
                      ].map((row) => (
                        <div
                          key={row.g}
                          className={`grid grid-cols-2 p-2 border-b border-border/40 last:border-b-0 ${
                            dissolvedNh4ClGrams === row.g ? 'bg-cyan-500/10 font-bold text-cyan-700 dark:text-cyan-300' : 'text-muted-foreground'
                          }`}
                        >
                          <span>{row.g} g</span>
                          <span className="font-mono">{row.t}°C</span>
                        </div>
                      ))}
                    </div>

                    {dissolvedNh4ClGrams >= 15 && (
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-xs text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2 animate-in fade-in">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        <span>
                          {isBn
                            ? 'সিদ্ধান্ত প্রমাণিত: পানিতে অ্যামোনিয়াম ক্লোরাইড দ্রবীভূত হলে তাপ শোষিত হয় (তাপহারী প্রক্রিয়া, ΔH > 0)!'
                            : 'Conclusion Verified: Dissolution of ammonium chloride is an endothermic process absorbing heat!'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* SIMULATOR 5: 8 GHS HAZARD SYMBOL SCANNER */}
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div>
                  <h3 className="text-base font-black text-foreground">
                    {isBn ? '৮টি GHS সার্বজনীন ঝুঁকি প্রতীক স্ক্যানার' : 'Universal GHS Hazard Symbol Scanner'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? 'যেকোনো প্রতীকে ক্লিক করে তার ঝুঁকি মাত্রা, এনসিটিবি রাসায়নিক উদাহরণ, সাবধানতা ও নিষ্কাশন প্রটোকল বিস্তারিত দেখো।'
                      : 'Click any pictogram to inspect danger level, textbook reagent examples, and disposal mandates.'}
                  </p>
                </div>

                {/* 8 Symbol Selector Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                  {GHS_HAZARD_SYMBOLS.map((hz) => {
                    const isSelected = selectedHazardId === hz.id;
                    return (
                      <button
                        key={hz.id}
                        onClick={() => setSelectedHazardId(hz.id)}
                        className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                          isSelected
                            ? `${hz.colorClass} shadow-md scale-105 border-2`
                            : 'border-border/70 hover:border-border bg-card text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        <span className="text-[10px] font-mono font-bold">{hz.code}</span>
                        <span className="text-xs font-bold leading-tight truncate w-full">
                          {isBn ? hz.nameBn : hz.nameEn}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Detailed Hazard Inspector Card */}
                <div className={`p-6 rounded-3xl border ${selectedHazard.colorClass} space-y-4`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider">
                        {selectedHazard.code} • {isBn ? selectedHazard.riskLevelBn : selectedHazard.riskLevelEn}
                      </span>
                      <h4 className="text-lg font-black text-foreground">
                        {isBn ? selectedHazard.nameBn : selectedHazard.nameEn}
                      </h4>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="space-y-1.5">
                      <strong className="text-foreground block">
                        {isBn ? 'পাঠ্যবই উল্লিখিত রাসায়নিক উদাহরণ:' : 'Textbook Example Chemicals:'}
                      </strong>
                      <div className="flex flex-wrap gap-1.5">
                        {(isBn ? selectedHazard.examplesBn : selectedHazard.examplesEn).map((ex, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-xl bg-card border border-border font-medium text-foreground text-[11px]"
                          >
                            {ex}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <strong className="text-foreground block">
                        {isBn ? 'ঝুঁকি ও ক্ষতিকর প্রভাব:' : 'Hazards & Pathological Effects:'}
                      </strong>
                      <p className="text-muted-foreground leading-relaxed">
                        {isBn ? selectedHazard.hazardsBn : selectedHazard.hazardsEn}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <strong className="text-foreground block">
                        {isBn ? 'ব্যবহারিক সাবধানতা ও সুরক্ষা:' : 'Lab Handling Precautions:'}
                      </strong>
                      <p className="text-muted-foreground leading-relaxed">
                        {isBn ? selectedHazard.precautionsBn : selectedHazard.precautionsEn}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <strong className="text-foreground block">
                        {isBn ? 'নিরাপদ বর্জ্য নিষ্কাশন ও সংরক্ষণ:' : 'Waste Disposal & Containment:'}
                      </strong>
                      <p className="text-muted-foreground leading-relaxed">
                        {isBn ? selectedHazard.disposalBn : selectedHazard.disposalEn}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: CHECK MCQ (Interactive Board Quiz)                */}
          {/* ========================================================= */}
          {activeStep === 'check' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-border/70 pb-3">
                  <div>
                    <h3 className="text-base font-black text-foreground">
                      {isBn ? 'অনুধাবন যাচাই: ৫টি বোর্ড বহুনির্বাচনী প্রশ্ন (MCQ)' : 'Diagnostic Quiz: 5 Board Standard MCQs'}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      {isBn ? 'বিগত বছরের বোর্ড প্রশ্ন থেকে নির্বাচিত। উত্তর নির্বাচন করে তাৎক্ষণিক ফিডব্যাক যাচাই করো।' : 'Instant grading and official NCTB rationale explanations.'}
                    </p>
                  </div>
                  {quizSubmitted && (
                    <div className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-xs border border-cyan-500/20">
                      {isBn ? `স্কোর: ৫ এ ${calculateQuizScore()}` : `Score: ${calculateQuizScore()} / 5`}
                    </div>
                  )}
                </div>

                {/* 5 Questions */}
                <div className="space-y-6 pt-2">
                  {CHEMISTRY_BOARD_MCQS.map((q, idx) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;

                    return (
                      <div
                        key={q.id}
                        className="p-5 rounded-2xl border border-border/70 bg-card space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                              QUESTION 0{idx + 1} • {q.boardSource}
                            </span>
                            <h4 className="text-sm font-bold text-foreground">
                              {isBn ? q.questionBn : q.questionEn}
                            </h4>
                          </div>
                        </div>

                        {/* 4 Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {(isBn ? q.optionsBn : q.optionsEn).map((opt, optIdx) => {
                            const isChosen = selectedOpt === optIdx;
                            let btnStyle = 'border-border/70 bg-muted/30 text-muted-foreground hover:bg-muted/70 hover:text-foreground';

                            if (quizSubmitted) {
                              if (optIdx === q.correctIndex) {
                                btnStyle = 'border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold';
                              } else if (isChosen) {
                                btnStyle = 'border-rose-500 bg-rose-500/10 text-rose-700 dark:text-rose-300 font-bold';
                              }
                            } else if (isChosen) {
                              btnStyle = 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold';
                            }

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => handleSelectQuiz(q.id, optIdx)}
                                className={`p-3 rounded-xl border text-xs text-left transition-all flex items-center gap-2.5 ${btnStyle}`}
                              >
                                <span className="h-5 w-5 rounded-full border flex items-center justify-center text-[10px] shrink-0 font-bold">
                                  {String.fromCharCode(65 + optIdx)}
                                </span>
                                <span className="flex-1">{opt}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation on submit */}
                        {quizSubmitted && (
                          <div className="p-3 rounded-xl bg-muted/50 border border-border/60 text-xs text-muted-foreground space-y-1 animate-in fade-in">
                            <span className="font-bold text-foreground block">
                              {isBn ? 'সঠিক ব্যাখ্যার বিশ্লেষণ:' : 'Correct Explanation:'}
                            </span>
                            <p>{isBn ? q.explanationBn : q.explanationEn}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Submit Quiz Button */}
                <div className="pt-2 flex justify-end">
                  {!quizSubmitted ? (
                    <button
                      onClick={handleSubmitQuiz}
                      className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-md shadow-cyan-600/20 transition-all flex items-center gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>{isBn ? 'কুইজের উত্তর জমা দিন' : 'Submit Answers'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setQuizSubmitted(false);
                        setQuizAnswers({});
                      }}
                      className="px-5 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-bold text-xs transition-all flex items-center gap-2"
                    >
                      <RotateCcw className="h-4 w-4" />
                      <span>{isBn ? 'পুনরায় চেষ্টা করুন' : 'Retake Quiz'}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 5: SUMMARY VAULT & CHEAT SHEET                       */}
          {/* ========================================================= */}
          {activeStep === 'summary' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
                  <div className="space-y-0.5">
                    <span className="text-[11px] font-mono text-cyan-600 dark:text-cyan-400 font-bold uppercase">
                      ONE-CLICK REVISION VAULT
                    </span>
                    <h3 className="text-lg font-black text-foreground">
                      {isBn ? 'অধ্যায় ১: সম্পূর্ণ রিভিশন হ্যান্ডনোট ও সূত্রকোষ' : 'Chapter 1: Master Revision Notes & Formula Vault'}
                    </h3>
                  </div>
                  <button
                    onClick={handleCopySummary}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
                  >
                    <Copy className="h-3.5 w-3.5" />
                    <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
                  </button>
                </div>

                {/* 4 Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Card 1: Key Scientists & Roots */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                      <span>{isBn ? '১. ঐতিহাসিক ক্রমবিকাশ' : '1. Historical Milestones'}</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-2 list-disc list-inside leading-relaxed">
                      <li>
                        <strong>আলকেমি (Alchemy):</strong> আরবের প্রাথমিক রসায়ন চর্চা; গবেষকদের আলকেমিস্ট বলা হতো।
                      </li>
                      <li>
                        <strong>জাবির-ইবনে-হাইয়ান:</strong> সর্বপ্রথম গবেষণাগারে রসায়নের পদ্ধতিগত অনুসন্ধান শুরু করেন।
                      </li>
                      <li>
                        <strong>অ্যান্টনি ল্যাভয়সিয়ে:</strong> আধুনিক রসায়নের জনক (Father of Modern Chemistry)।
                      </li>
                    </ul>
                  </div>

                  {/* Card 2: Reactions */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Activity className="h-4 w-4 text-emerald-500" />
                      <span>{isBn ? '২. গুরুত্বপূর্ণ রাসায়নিক সমীকরণ' : '2. Key Chemical Equations'}</span>
                    </h4>
                    <div className="space-y-2 text-xs">
                      <div className="p-2 rounded-xl bg-muted/40 font-mono text-foreground text-center">
                        <RenderMathText text="$4\text{Fe} + 3\text{O}_2 + 2x\text{H}_2\text{O} \rightarrow 2\text{Fe}_2\text{O}_3 \cdot x\text{H}_2\text{O}$" />
                      </div>
                      <div className="p-2 rounded-xl bg-muted/40 font-mono text-foreground text-center">
                        <RenderMathText text="$\text{HCl} + \text{Mg(OH)}_2 \rightarrow \text{MgCl}_2 + 2\text{H}_2\text{O}$" />
                      </div>
                      <div className="p-2 rounded-xl bg-muted/40 font-mono text-foreground text-center">
                        <RenderMathText text="$6\text{CO}_2 + 6\text{H}_2\text{O} \xrightarrow{\text{light}} \text{C}_6\text{H}_{12}\text{O}_6 + 6\text{O}_2$" />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: 6 Research Steps */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <Layers className="h-4 w-4 text-purple-500" />
                      <span>{isBn ? '৩. গবেষণার ৬টি ধারাবাহিক ধাপ' : '3. 6 Sequential Inquiry Steps'}</span>
                    </h4>
                    <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
                      <li>বিষয় নির্বাচন (Topic Selection)</li>
                      <li>তথ্য সংগ্রহ ও পূর্বানুমান (Literature Survey)</li>
                      <li>কাজের পরিকল্পনা ও পরীক্ষণের নকশা প্রণয়ন (Planning)</li>
                      <li>পরীক্ষণ পরিচালনা ও তথ্য সংগ্রহ (Experimentation)</li>
                      <li>তথ্য বিশ্লেষণ (Data Analysis)</li>
                      <li>ফলাফল ও চূড়ান্ত সিদ্ধান্ত গ্রহণ (Conclusion)</li>
                    </ol>
                  </div>

                  {/* Card 4: GHS & Safety Rules */}
                  <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                    <h4 className="text-sm font-black text-foreground flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-rose-500" />
                      <span>{isBn ? '৪. ল্যাব নিরাপত্তা ও GHS প্রতীক' : '4. Lab Safety & GHS Symbols'}</span>
                    </h4>
                    <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside leading-relaxed">
                      <li>অ্যাপ্রোন: সাদা রঙের, কবজি পর্যন্ত হাতা, হাঁটু পর্যন্ত লম্বা।</li>
                      <li>ট্রেফয়েল প্রতীক: তেজস্ক্রিয় পদার্থ (ইউরেনিয়াম, রেডিয়াম)।</li>
                      <li>মাথার খুলি ও আড়াআড়ি হাড়: বিষাক্ত পদার্থ (মিথানল, বেনজিন)।</li>
                      <li>আগুন শিখা: দাহ্য পদার্থ (অ্যালকোহল, ইথার)।</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Bottom 5-Step Unified Footer */}
          <StepNavigationFooter
            currentStep={activeStep}
            onStepChange={(step) => setActiveStep(step as LearningStep)}
            chapterNumberBn="অধ্যায় ০১"
            chapterNumberEn="Chapter 01"
            chapterTitleBn="রসায়নের ধারণা"
            chapterTitleEn="Concepts of Chemistry"
            subjectHref="/dashboard/playground/v2?subject=chemistry"
          />
        </main>

        {/* ========================================================= */}
        {/* COLUMN 3: RIGHT SIDEBAR (AI Chemistry Tutor Drawer)       */}
        {/* ========================================================= */}
        {isRightSidebarOpen && (
          <aside className="w-80 shrink-0 rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4 animate-in slide-in-from-right duration-200 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">
                    {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
                  </h3>
                  <span className="text-[10px] text-muted-foreground">
                    {isBn ? 'অধ্যায় ১ বিশেষজ্ঞ' : 'Chapter 1 Specialist'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsRightSidebarOpen(false)}
                className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Transcript Container */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-cyan-600 text-white ml-6 rounded-tr-xs'
                      : 'bg-muted/50 text-foreground mr-6 rounded-tl-xs border border-border/60'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              ))}
              {isAiLoading && (
                <div className="p-3 rounded-2xl bg-muted/40 text-muted-foreground text-xs animate-pulse">
                  {isBn ? 'উত্তরের বিশ্লেষণ তৈরি হচ্ছে...' : 'Formulating response...'}
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="pt-2 border-t border-border/70 space-y-2">
              <div className="flex items-center gap-1.5">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
                  placeholder={isBn ? 'আম পাকা বা GHS প্রতীক নিয়ে প্রশ্ন করো...' : 'Ask about reactions or GHS...'}
                  className="flex-1 px-3 py-2 rounded-xl bg-muted/50 border border-border text-xs text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
                <button
                  disabled={!chatInput.trim() || isAiLoading}
                  onClick={handleSendAiMessage}
                  className="p-2 rounded-xl bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-40 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
