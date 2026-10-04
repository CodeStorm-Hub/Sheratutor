'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PanelLeftClose, PanelLeftOpen, FlaskConical, HelpCircle, Lightbulb, X,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Award,
  AlertCircle,
  Copy,
  Send,
  Sliders,
  ChevronDown,
  ChevronRight,
  Eye,
  Info,
  Check,
  Zap,
  Activity,
  Boxes,
  Compass,
  Factory,
  Beaker,
  TestTube,
  Pipette,
  Atom,
  Flame,
  Layers,
  Heart,
  Droplets,
  Sun,
  Smile,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';
import { RenderMathText } from '@/components/render-math-text';

type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// 5 Authentic Board MCQs for Chapter 12
interface BoardMCQ {
  id: number;
  questionBn: string;
  questionEn: string;
  boardInfoBn: string;
  boardInfoEn: string;
  options: {
    key: string;
    textBn: string;
    textEn: string;
  }[];
  correctKey: string;
  explanationBn: string;
  explanationEn: string;
}

const BOARD_MCQS: BoardMCQ[] = [
  {
    id: 1,
    questionBn: 'ব্লিচিং পাউডারের সঠিক রাসায়নিক সংকেত কোনটি?',
    questionEn: 'What is the correct chemical formula of bleaching powder?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২৩, রাজশাহী ২০২২ (পাঠ্যবই পৃষ্ঠা ২৯৩)',
    boardInfoEn: 'Dhaka Board 2023, Rajshahi 2022 (Textbook p. 293)',
    options: [
      { key: 'A', textBn: 'CaCl₂', textEn: 'CaCl₂' },
      { key: 'B', textBn: 'Ca(OCl)Cl', textEn: 'Ca(OCl)Cl' },
      { key: 'C', textBn: 'Ca(OH)₂', textEn: 'Ca(OH)₂' },
      { key: 'D', textBn: 'CaCO₃', textEn: 'CaCO₃' },
    ],
    correctKey: 'B',
    explanationBn:
      'ব্লিচিং পাউডার হলো ক্যালসিয়াম ক্লোরো-হাইপোক্লোরাইট, যার রাসায়নিক সংকেত Ca(OCl)Cl। এটি শুকনো কলিচুনের ওপর ৪০°C তাপমাত্রায় ক্লোরিন গ্যাস চালনা করে তৈরি করা হয়: Ca(OH)₂ + Cl₂ → Ca(OCl)Cl + H₂O।',
    explanationEn:
      'Bleaching powder is calcium chloro-hypochlorite with formula Ca(OCl)Cl, prepared by reacting dry slaked lime with chlorine gas at 40°C.',
  },
  {
    id: 2,
    questionBn: 'গ্লাস ক্লিনারের মূল সক্রিয় পরিষ্কারক উপাদান কোনটি?',
    questionEn: 'What is the main active cleaning ingredient in glass cleaner?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২৩, কুমিল্লা ২০২১ (পাঠ্যবই পৃষ্ঠা ২৯২)',
    boardInfoEn: 'Dinajpur Board 2023, Cumilla 2021 (Textbook p. 292)',
    options: [
      { key: 'A', textBn: 'গাঢ় NaOH দ্রবণ', textEn: 'Concentrated NaOH' },
      { key: 'B', textBn: 'অ্যামোনিয়াম হাইড্রোক্সাইড (NH₄OH) ও অ্যালকোহল', textEn: 'Ammonium hydroxide (NH₄OH) & Alcohol' },
      { key: 'C', textBn: 'সালফিউরিক এসিড (H₂SO₄)', textEn: 'Sulfuric acid (H₂SO₄)' },
      { key: 'D', textBn: 'সোডিয়াম হাইপোক্লোরাইট', textEn: 'Sodium hypochlorite' },
    ],
    correctKey: 'B',
    explanationBn:
      'গ্লাস ক্লিনারের প্রধান উপাদান অ্যামোনিয়ার জলীয় দ্রবণ বা অ্যামোনিয়াম হাইড্রোক্সাইড (NH₄OH) এবং আইসোপ্রোপাইল অ্যালকোহল। এটি কাচের তেল ও গ্রিজ দ্রবীভূত করে পরিষ্কার করে এবং কাচে কোনো দাগ না রেখে দ্রুত বাতাসে উবে যায়।',
    explanationEn:
      'Glass cleaner uses aqueous ammonia (NH₄OH) and isopropyl alcohol which dissolve grease and evaporate quickly leaving no streaks on glass.',
  },
  {
    id: 3,
    questionBn: 'বেকিং পাউডারে বেকিং সোডার সাথে কোন মৃদু এসিড মেশানো হয়?',
    questionEn: 'Which mild acid is mixed with baking soda in baking powder?',
    boardInfoBn: 'চট্টগ্রাম বোর্ড ২০২২, যশোর ২০২০',
    boardInfoEn: 'Chattogram Board 2022, Jashore 2020',
    options: [
      { key: 'A', textBn: 'হাইড্রোক্লোরিক এসিড (HCl)', textEn: 'Hydrochloric acid' },
      { key: 'B', textBn: 'টারটারিক এসিড (C₄H₆O₆)', textEn: 'Tartaric acid (C₄H₆O₆)' },
      { key: 'C', textBn: 'সালফিউরিক এসিড (H₂SO₄)', textEn: 'Sulfuric acid' },
      { key: 'D', textBn: 'নাইট্রিক এসিড (HNO₃)', textEn: 'Nitric acid' },
    ],
    correctKey: 'B',
    explanationBn:
      'বেকিং পাউডার হলো বেকিং সোডা (NaHCO₃) এবং টারটারিক এসিডের (C₄H₆O₆) একটি শুষ্ক মিশ্রণ। উত্তাপে NaHCO₃ ভেঙে ক্ষারীয় Na₂CO₃ তৈরি হয় যা তেতো স্বাদ দেয়; টারটারিক এসিড এই Na₂CO₃ কে প্রশমিত করে সুস্বাদু সোডিয়াম টারটারেট লবণে পরিণত করে এবং প্রচুর CO₂ গ্যাস নির্গত করে কেককে নরম ও ফুলকো করে।',
    explanationEn:
      'Baking powder contains baking soda (NaHCO₃) and tartaric acid (C₄H₆O₆). The tartaric acid neutralizes alkaline Na₂CO₃ and releases CO₂ to make cakes fluffy without bitterness.',
  },
  {
    id: 4,
    questionBn: 'মানুষের সুস্থ ত্বকের স্বাভাবিক pH মান কত?',
    questionEn: 'What is the normal physiological pH of healthy human skin?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২৩, ময়মনসিংহ ২০২২ (পাঠ্যবই পৃষ্ঠা ২৯৭)',
    boardInfoEn: 'Barishal Board 2023, Mymensingh 2022 (Textbook p. 297)',
    options: [
      { key: 'A', textBn: '২.০ - ৩.০', textEn: '2.0 - 3.0' },
      { key: 'B', textBn: '৫.৫ (মৃদু অম্লীয়)', textEn: '5.5 (Mildly acidic)' },
      { key: 'C', textBn: '৭.০ (নিরপেক্ষ)', textEn: '7.0 (Neutral)' },
      { key: 'D', textBn: '৯.০ - ১০.০', textEn: '9.0 - 10.0' },
    ],
    correctKey: 'B',
    explanationBn:
      'মানুষের ত্বকের স্বাভাবিক pH মান হলো প্রায় ৫.৫ (মৃদু অম্লীয়)। এই মৃদু অম্লীয় আবরণকে &quot;এসিড ম্যান্টল (Acid Mantle)&quot; বলে, যা পরিবেশের ক্ষতিকর ব্যাক্টেরিয়া ও জীবাণুর সংক্রমণ থেকে ত্বককে রক্ষা করে।',
    explanationEn:
      'Healthy human skin has a slightly acidic pH of about 5.5, known as the acid mantle, which prevents bacterial invasion and protects skin flora.',
  },
  {
    id: 5,
    questionBn: 'টয়লেট ক্লিনারের মূল সক্রিয় উপাদান নিচের কোনটি?',
    questionEn: 'What is the active chemical ingredient in heavy-duty toilet cleaners?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২২, সিলেট ২০২১',
    boardInfoEn: 'Dhaka Board 2022, Sylhet 2021',
    options: [
      { key: 'A', textBn: 'কস্টিক সোডা (NaOH)', textEn: 'Caustic soda (NaOH)' },
      { key: 'B', textBn: 'অ্যামোনিয়া (NH₃)', textEn: 'Ammonia (NH₃)' },
      { key: 'C', textBn: 'ইথানল (C₂H₅OH)', textEn: 'Ethanol' },
      { key: 'D', textBn: 'গ্লুকোজ', textEn: 'Glucose' },
    ],
    correctKey: 'A',
    explanationBn:
      'টয়লেট ক্লিনারের প্রধান সক্রিয় উপাদান হলো তীব্র ক্ষার কস্টিক সোডা বা সোডিয়াম হাইড্রোক্সাইড (NaOH) এবং সোডিয়াম হাইপোক্লোরাইট। এটি কমোড ও পাইপে জমে থাকা চর্বি, প্রোটিন, চুল ও অজৈব ময়লাকে গলিয়ে ফেলে পরিষ্কার করে।',
    explanationEn:
      'Heavy-duty toilet cleaners primarily use strong caustic soda (NaOH) which hydrolyzes organic waste, grease, proteins, and hairs.',
  },
];

export interface LessonMeta {
  no: string;
  titleBn: string;
  titleEn: string;
  overviewBn: string;
  overviewEn: string;
  studyTipBn: string;
  studyTipEn: string;
  badgeText: string;
}

export const CHAPTER_12_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "গৃহস্থালি রসায়ন: বেকিং সোডা ও ভিনেগার",
    titleEn: "Household Chemistry: Baking Soda & Vinegar",
    overviewBn: "বেকিং সোডা (NaHCO₃), বেকিং পাউডার (টারটারিক এসিড মিশ্রণ), কেক ফোলানো এবং ৪-১০% অ্যাসিটিক এসিডের ভিনেগার।",
    overviewEn: "Sodium bicarbonate, baking powder with tartaric acid for cake rising, and 4-10% acetic acid vinegar.",
    studyTipBn: "বেকিং সোডায় তাপ দিলে তিতা Na₂CO₃ তৈরি হয়; তাই টারটারিক এসিডযুক্ত বেকিং পাউডার ব্যবহার করতে হয়!",
    studyTipEn: "Pure baking powder contains tartaric acid to eliminate bitter washing soda byproducts!",
    badgeText: "বেকিং সোডা ও ভিনেগার",
  },
  2: {
    no: "০২",
    titleBn: "সাবানায়ন বিক্রিয়া ও ৩ডি মাইসেল ক্লিনজিং ল্যাব",
    titleEn: "Saponification & 3D Micelle Dirt Cleaning Lab",
    overviewBn: "তেল বা চর্বির ক্ষারীয় আর্দ্র বিশ্লেষণ, গ্লিসারিন ও সাবান (সোডিয়াম স্টিয়ারেট) প্রস্তুতি এবং হাইড্রোফোবিক মাইসেল মেকানিজম।",
    overviewEn: "Alkaline fat saponification, sodium stearate soap synthesis, and amphiphilic micelle dirt emulsification.",
    studyTipBn: "সাবানের হাইড্রোকার্বন লেজ হাইড্রোফোবিক (তেল-আকর্ষী) এবং আয়নিক মাথা হাইড্রোফিলিক (পানি-আকর্ষী)!",
    studyTipEn: "The soap tail is lipophilic/hydrophobic attracting grease; the carboxylate head is hydrophilic!",
    badgeText: "সাবান ও মাইসেল পরিষ্কারক",
  },
  3: {
    no: "০৩",
    titleBn: "ডিটারজেন্ট ও ব্লিচিং পাউডারের জীবাণুনাশক ল্যাব",
    titleEn: "Detergents & Bleaching Powder Disinfection Lab",
    overviewBn: "সোডিয়াম লরাইল সালফেট ডিটারজেন্ট, ব্লিচিং পাউডার [Ca(OCl)Cl] এবং জায়মান অক্সিজেন [O] এর দাগ ও জীবাণু ধ্বংস।",
    overviewEn: "Synthetic detergents, bleaching powder preparation, and nascent oxygen [O] stain and germ oxidation.",
    studyTipBn: "ব্লিচিং পাউডার পানির সংস্পর্শে জায়মান অক্সিজেন [O] উৎপন্ন করে, যা রঙিন বস্তুকে বর্ণহীন ও জীবাণুকে ধ্বংস করে!",
    studyTipEn: "Bleaching powder releases nascent oxygen [O] which oxidizes stains into colorless forms and kills germs!",
    badgeText: "ব্লিচিং পাউডার ও জায়মান অক্সিজেন",
  },
  4: {
    no: "০৪",
    titleBn: "টয়লেট ক্লিনার ও গ্লাস ক্লিনার রাসায়নিক ক্রিয়া",
    titleEn: "Toilet Cleaner & Glass Cleaner Chemistry",
    overviewBn: "গাঢ় কস্টিক সোডা ও সোডিয়াম হাইপোক্লোরাইট টয়লেট ক্লিনার এবং তরল অ্যামোনিয়া ও আইসোপ্রোপাইল অ্যালকোহল গ্লাস ক্লিনার।",
    overviewEn: "Toilet cleaner active caustic ingredients vs non-streaking aqueous ammonia glass cleaning solutions.",
    studyTipBn: "গ্লাস ক্লিনারে ক্ষারীয় উদ্বায়ী লিকার অ্যামোনিয়া (NH₄OH) কাচ থেকে তেল ও চর্বির দাগ দূর করে কিন্তু দাগ ফেলে না!",
    studyTipEn: "Glass cleaners use volatile liquor ammonia (NH4OH) which cleans greasy films without leaving streaks!",
    badgeText: "টয়লেট ও গ্লাস ক্লিনার",
  },
  5: {
    no: "০৫",
    titleBn: "প্রসাধন সামগ্রী ও ত্বকের এসিড ম্যান্টল (pH ৫.৫) সুরক্ষা",
    titleEn: "Cosmetics & Skin Acid Mantle (pH 5.5) Guard",
    overviewBn: "ট্যালকম পাউডার, কোল্ড ক্রিম, ত্বকের প্রাকৃতিক পিএইচ (pH ৫.৫) এবং অতিরিক্ত ক্ষারীয় সাবানের প্রভাব।",
    overviewEn: "Talcum powder, cold creams, human skin acid mantle maintenance at pH 5.5, and balanced face washes.",
    studyTipBn: "ত্বকের স্বাভাবিক pH ৫.৫ ক্ষতিকর ব্যাকটেরিয়া ধ্বংস করে; ক্ষারীয় সাবান (pH ৯-১০) ব্যবহারে ত্বক শুষ্ক ও ফেটে যায়!",
    studyTipEn: "Skin’s natural pH 5.5 acid mantle repels pathogens; harsh alkaline soaps (pH 9-10) strip this barrier!",
    badgeText: "ত্বকের pH ৫.৫ ও প্রসাধন সামগ্রী",
  },
};

export function ChemistryInOurLivesGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation State
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);

  // Alias for backward compatibility with existing step tabs
  const currentStep = activeStep;
  const setCurrentStep = setActiveStep;

  // AI Chat Drawer State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: isBn
        ? 'স্বাগতম আমাদের জীবনে রসায়ন ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Chemistry in Our Lives Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_12_LESSONS[activeLesson] || CHAPTER_12_LESSONS[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

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
          chapter: '12 - আমাদের জীবনে রসায়ন (Chemistry in Our Lives)',
          context: `বর্তমান পাঠ: ${activeLesson}, ধাপ: ${activeStep}`,
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
      setTimeout(() => {
        setChatMessages((prev) => [
          ...prev,
          { role: 'ai', text: isBn ? 'আমাদের দৈনন্দিন জীবনে খাবার সংরক্ষণ, পরিচ্ছন্নতা এবং প্রসাধনীতে রসায়নের প্রত্যক্ষ প্রয়োগ রয়েছে। সাবান ও ব্লিচিং পাউডার অন্যতম প্রধান পরিষ্কারক।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ১২: আমাদের জীবনে রসায়ন (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. গৃহস্থালি সামগ্রী:\n   - বেকিং সোডা: NaHCO₃\n   - বেকিং পাউডার: NaHCO₃ + পটাশিয়াম হাইড্রোজেন টারটারেট।\n   - ভিনেগার: অ্যাসিটিক এসিডের ৪-১০% জলীয় দ্রবণ (খাদ্য সংরক্ষক)।\n২. পরিষ্কারক সামগ্রী:\n   - সাবান: উচ্চতর ফ্যাটি এসিডের সোডিয়াম/পটাশিয়াম লবণ (যেমন C₁₇H₃₅COONa)।\n   - ব্লিচিং পাউডার: Ca(OCl)Cl (জায়মান অক্সিজেন [O] দ্বারা দাগ ও জীবাণু ধ্বংস করে)।\n   - গ্লাস ক্লিনার: অ্যামোনিয়াম হাইড্রোক্সাইড (NH₄OH) ও আইসোপ্রোপাইল অ্যালকোহল।\n৩. প্রসাধন ও স্বাস্থ্য:\n   - ত্বকের স্বাভাবিক pH: ৫.৫ (এসিড ম্যান্টল)।`
      : `SSC Chemistry Chapter 12: Chemistry in Our Lives Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1: Baking Oven
  const [bakingIngredient, setBakingIngredient] = useState<'soda_only' | 'powder_tartaric'>('powder_tartaric');
  const [ovenTemp, setOvenTemp] = useState<number>(180);
  const [isBakingActive, setIsBakingActive] = useState<boolean>(false);

  // Simulator 2: Soap Saponification & Micelle Dirt Lab
  const [saponificationStep, setSaponificationStep] = useState<number>(0);
  const [dirtStatus, setDirtStatus] = useState<'dirty' | 'micelle_formed' | 'clean'>('dirty');

  // Simulator 3: Bleaching Powder Stain Remover
  const [bleachAdded, setBleachAdded] = useState<boolean>(false);
  const [bacteriaDestroyed, setBacteriaDestroyed] = useState<boolean>(false);

  // Simulator 4: Skin pH & Cosmetics Buffer
  const [testedProduct, setTestedProduct] = useState<'soap' | 'facewash' | 'mehendi'>('facewash');

  // Board MCQ State
  const [selectedAnswers, setSelectedAnswers] = useState<{ [id: number]: string }>({});
  const [submittedAnswers, setSubmittedAnswers] = useState<{ [id: number]: boolean }>({});

  // CQ Accordion State
  const [openCqParts, setOpenCqParts] = useState<{ [key: string]: boolean }>({
    ka: true,
    kha: true,
    ga: false,
    gha: false,
  });

  const toggleCqPart = (key: string) => {
    setOpenCqParts((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAnswer = (mcqId: number, optionKey: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [mcqId]: optionKey }));
    setSubmittedAnswers((prev) => ({ ...prev, [mcqId]: true }));
  };

  const resetMcqs = () => {
    setSelectedAnswers({});
    setSubmittedAnswers({});
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-purple-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={12}
        chapterTitleBn="আমাদের জীবনে রসায়ন"
        chapterTitleEn="Chemistry in Our Lives"
        activeLesson={activeLesson}
        activeLessonTitle={isBn ? currentLessonMeta.titleBn : currentLessonMeta.titleEn}
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
                <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-purple-600 dark:text-purple-400" />
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
                  <span className="text-purple-600 dark:text-purple-400 uppercase tracking-wide">
                    CHAPTER 12
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'আমাদের জীবনে রসায়ন' : 'Chemistry in Our Lives'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_12_LESSONS[lNum];
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
                          ? 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-xs'
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
                                ? 'border-purple-500 text-purple-600 dark:text-purple-400'
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
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300">
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
            <div className="rounded-2xl border border-purple-500/20 bg-purple-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় 12 (পৃষ্ঠা ২৯৪ - ৩২০) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 12 (Printed pp. ২৯৪ - ৩২০) aligned with NCTB syllabus.'}
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
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-700 dark:text-purple-300 text-[11px] font-bold border border-purple-500/20">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 12 • পাঠ ${currentLessonMeta.no}` : `Chapter 12 • Lesson ${activeLesson}`}
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
                { key: 'example', labelBn: '২. board CQ', labelEn: '2. Board CQ', icon: Award },
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
                        ? 'bg-purple-600 text-white shadow-sm shadow-purple-600/30'
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

          {currentStep === 'concept' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Badge & Title */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                {isBn ? 'অধ্যায় ১২: তাত্ত্বিক ভিত্তি' : 'Chapter 12: Theoretical Foundation'}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {isBn ? 'আমাদের জীবনে রসায়ন ও পরিষ্কারক বিজ্ঞান' : 'Chemistry in Our Daily Lives & Cleaning Science'}
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'খাদ্য সংরক্ষণ, বেকিং পাউডারের বিক্রিয়া, সাবান ও ডিটারজেন্টের মিসেল মেকানিজম, ব্লিচিং পাউডারের বিরঞ্জন ক্রিয়া এবং প্রসাধনী রসায়ন।'
                  : 'Food preservation, baking powder reactions, soap & detergent micelle mechanics, bleaching action, and cosmetics pH balance.'}
              </p>
            </div>

            {/* Concept Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Concept 1: খাদ্য ও গৃহস্থালির রসায়ন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Heart className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '১. খাদ্য ও গৃহস্থালির রসায়ন' : '1. Domestic Food Chemistry'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'খাদ্যলবণ, বেকিং পাউডার ও ভিনেগার' : 'Salt, baking powder & vinegar'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'খাদ্যলবণ (NaCl) খাদ্য সংরক্ষণ ও খাবার স্যালাইনে গুরুত্বপূর্ণ। বেকিং পাউডার (NaHCO₃ + টারটারিক এসিড) উত্তাপে CO₂ গ্যাস তৈরি করে কেককে ফাঁপা ও নরম করে। ভিনেগার (৪-১০% অ্যাসিটিক এসিড) ব্যাকটেরিয়ার এনজাইম ধ্বংস করে খাদ্য পচন রোধ করে।'
                    : 'Common salt preserves food and is vital in ORS saline. Baking powder releases CO₂ to make bread porous and soft. Vinegar (4-10% ethanoic acid) prevents bacterial spoilage.'}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs font-mono space-y-1">
                  <div className="font-semibold text-amber-800 dark:text-amber-300">মূল বিক্রিয়া:</div>
                  <div>• 2NaHCO₃ → Na₂CO₃ + H₂O + CO₂↑ (উত্তাপে)</div>
                  <div>• Na₂CO₃ + C₄H₆O₆ → সোডিয়াম টারটারেট + H₂O + CO₂↑</div>
                </div>
              </div>

              {/* Concept 2: সাবান ও স্যাপোনিফিকেশন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Droplets className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '২. সাবান ও সাবানায়ন বিক্রিয়া (Saponification)' : '2. Soap & Saponification'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'উচ্চতর ফ্যাটি এসিডের সোডিয়াম/পটাশিয়াম লবণ' : 'Sodium stearate & salting out'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'তেল বা চর্বিকে কস্টিক সোডা (NaOH) সহ উত্তপ্ত করলে সাবান (সোডিয়াম স্টিয়ারেট, C₁₇H₃₅COONa) এবং উপজাত হিসেবে গ্লিসারিন উৎপন্ন হয়। খাবার লবণ (NaCl) যোগ করে সাবানকে ভাসিয়ে তোলাকে সল্টিং আউট বলে।'
                    : 'Alkaline hydrolysis of fats/oils with NaOH produces soap (sodium stearate) and glycerin byproduct. Adding NaCl precipitates soap via salting out.'}
                </p>
                <div className="p-3.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-xs font-mono space-y-1">
                  <div className="font-semibold text-blue-800 dark:text-blue-300">সাবানায়ন সমীকরণ:</div>
                  <div>তেল/চর্বি + 3NaOH → 3 C₁₇H₃₅COONa (সাবান) + গ্লিসারিন</div>
                </div>
              </div>

              {/* Concept 3: মিসেল গঠন ও ময়লা পরিষ্কারের মেকানিজম */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৩. মিসেল (Micelle) ও ময়লা পরিষ্কারক কৌশল' : '3. Micelle Cleaning Mechanics'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'হাইড্রোফোবিক লেজ বনাম হাইড্রোফিলিক মাথা' : 'Hydrophobic tail & hydrophilic head'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>• <strong>হাইড্রোফোবিক লেজ (C₁₇H₃₅-):</strong> পানি-বিদ্বেষী অধ্রুবীয় অংশ যা কাপড়ের তেল বা চর্বিযুক্ত ময়লার ভেতরে ঢুকে আটকে যায়।</div>
                  <div>• <strong>হাইড্রোফিলিক মাথা (-COO⁻Na⁺):</strong> পানি-আকর্ষী আয়নিক অংশ যা পানির অণুর দিকে মুখ করে থাকে।</div>
                  <div>• কাপড়ে ঘষলে তেলের ফোঁটাগুলো গোলকাকার <strong>মিসেল (Micelle)</strong> তৈরি করে পানির সাথে ভেসে গিয়ে অপসারিত হয়।</div>
                </div>
              </div>

              {/* Concept 4: ব্লিচিং পাউডার ও প্রসাধনী রসায়ন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৪. ব্লিচিং পাউডার ও প্রসাধনী রসায়ন' : '4. Bleaching & Cosmetics'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'জায়মান অক্সিজেন [O] ও ত্বকের pH ৫.৫' : 'Nascent oxygen & skin acid mantle'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>• <strong>ব্লিচিং বিরঞ্জন:</strong> HOCl → HCl + [O] (জায়মান অক্সিজেন)। রঙিন পদার্থ + [O] → বর্ণহীন যৌগ।</div>
                  <div>• <strong>ত্বকের এসিড ম্যান্টল:</strong> মানব ত্বকের স্বাভাবিক pH হলো ৫.৫ (মৃদু অম্লীয়), যা ক্ষতিকর ব্যাকটেরিয়ার আক্রমণ রোধ করে। তাই প্রসাধনীর pH ত্বকের অনুকূলে হওয়া আবশ্যক।</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 2: EXAMPLE (বোর্ড গাণিতিক ও বিক্রিয়া সমস্যা)
           ========================================================================= */}
        {currentStep === 'example' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <BookOpen className="w-3.5 h-3.5" />
                {isBn ? 'বোর্ড স্ট্যান্ডার্ড উদাহরণ ও সমীকরণ' : 'Standard Everyday Chemistry Board Solved Examples'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'ধাপ-ভিত্তিক পরিষ্কারক ও গৃহস্থালির সমীকরণ' : 'Step-by-Step Chemical Cleaning & Reaction Solutions'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ঢাকা, রাজশাহী, দিনাজপুর ও চট্টগ্রাম বোর্ডে বিগত বছরগুলোতে আসা সবচেয়ে গুরুত্বপূর্ণ ৫টি সমাধান।'
                  : '5 authentic solved examples covering bleaching action, baking chemistry, glass cleaner mechanics, and soap vs detergent in hard water.'}
              </p>
            </div>

            <div className="space-y-6">
              {/* Example 1: ব্লিচিং পাউডারের বিরঞ্জন ক্রিয়া */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০১
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'ব্লিচিং পাউডারের বিরঞ্জন ও জীবাণু ধ্বংসের রাসায়নিক সমীকরণ' : 'Bleaching & Disinfection Action of Ca(OCl)Cl'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'ঢাকা বোর্ড ২০২৩, রাজশাহী ২০২১' : 'Dhaka Board 2023'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm font-mono">
                  <div>১. হাইপোক্লোরাস এসিড গঠন: Ca(OCl)Cl + H₂O + CO₂ → CaCO₃↓ + CaCl₂ + 2HOCl</div>
                  <div>২. জায়মান অক্সিজেন বিযুক্তি: HOCl → HCl + [O] (জায়মান অক্সিজেন)</div>
                  <div>৩. বিরঞ্জন: রঙিন পদার্থ + [O] → বর্ণহীন পদার্থ</div>
                  <div>৪. জীবাণুনাশক ক্রিয়া: জীবাণু + [O] → মৃত জীবাণু</div>
                </div>
              </div>

              {/* Example 2: বেকিং পাউডারের কার্যপদ্ধতি */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০২
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'বেকিং পাউডার দ্বারা কেক ফোলানো ও তেতো স্বাদ দূরীকরণ' : 'Cake Rising Mechanism & Neutralizing Bitterness'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'দিনাজপুর বোর্ড ২০২২, চট্টগ্রাম ২০২০' : 'Dinajpur Board 2022'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>বেকিং সোডা উত্তাপে বিয়োজিত হয়ে তীব্র ক্ষারীয় সোডিয়াম কার্বনেট তৈরি করে যা কেককে তেতো করে:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="2\text{NaHCO}_3(\text{s}) \xrightarrow{\Delta} \text{Na}_2\text{CO}_3(\text{s}) + \text{H}_2\text{O}(\text{g}) + \text{CO}_2(\text{g})\uparrow" />
                  </div>
                  <p>টারটারিক এসিড (C₄H₆O₆) এই ক্ষারকে প্রশমিত করে সুস্বাদু সোডিয়াম টারটারেট তৈরি করে:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="\text{Na}_2\text{CO}_3 + \text{C}_4\text{H}_6\text{O}_6 \rightarrow \text{Na}_2\text{C}_4\text{H}_4\text{O}_6 + \text{H}_2\text{O} + \text{CO}_2(\text{g})\uparrow" />
                  </div>
                </div>
              </div>

              {/* Example 3: খর পানিতে সাবান বনাম ডিটারজেন্ট */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৩
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'খর পানিতে সাবান অকার্যকর কিন্তু ডিটারজেন্ট কার্যকর কেন?' : 'Soap vs Detergent in Hard Water'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ৩০৪ সৃজনশীল ০১' : 'Textbook Page 304 CQ 1'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>• <strong>সাবানের ক্ষেত্রে:</strong> পানির Ca²⁺ ও Mg²⁺ এর সাথে অদ্রবণীয় ক্যালসিয়াম স্টিয়ারেট গাদ তৈরি করে সাবানের অপচয় ঘটায়:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="2\text{C}_{17}\text{H}_{35}\text{COONa} + \text{Ca}^{2+} \rightarrow (\text{C}_{17}\text{H}_{35}\text{COO})_2\text{Ca}\downarrow \text{ (অদ্রবণীয় গাদ)} + 2\text{Na}^+" />
                  </div>
                  <p>• <strong>ডিটারজেন্টের ক্ষেত্রে:</strong> ক্যালসিয়াম বা ম্যাগনেসিয়াম অ্যালকাইল সালফেট লবণ পানিতে সম্পূর্ণ দ্রবণীয় হওয়ায় কোনো গাদ তৈরি হয় না এবং সহজেই প্রচুর ফেনা উৎপন্ন হয়।</p>
                </div>
              </div>

              {/* Example 4: ইউরিয়া সার প্রস্তুতি */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৪
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'শিল্পক্ষেত্রে ইউরিয়া সার উৎপাদনের বিক্রিয়া ও শর্ত' : 'Industrial Synthesis of Urea Fertilizer'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'বরিশাল বোর্ড ২০২২, কুমিল্লা ২০২১' : 'Barishal Board 2022'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>অ্যামোনিয়া ও কার্বন ডাই-অক্সাইড গ্যাসকে ১৫০-২০০ atm চাপে এবং ১৩০-১৫০°C তাপমাত্রায় বিক্রিয়া ঘটিয়ে ইউরিয়া প্রস্তুত করা হয়:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="2\text{NH}_3(\text{g}) + \text{CO}_2(\text{g}) \xrightarrow{130-150^\circ\text{C}, 150-200\text{ atm}} \text{H}_2\text{N}-\text{CO}-\text{NH}_2(\text{s}) + \text{H}_2\text{O}(\text{l})" />
                  </div>
                  <p className="text-xs text-slate-500">ইউরিয়াতে শতকরা ৪৬% নাইট্রোজেন থাকে যা ফসলের দ্রুত বৃদ্ধিতে সহায়তা করে।</p>
                </div>
              </div>

              {/* Example 5: টয়লেট ক্লিনারের কস্টিক সোডা মেকানিজম */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৫
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'টয়লেট ক্লিনারের চর্বি ও চুল গলানোর মেকানিজম' : 'Toilet Cleaner Caustic Dissolution Mechanism'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'পাঠ্যবই পৃষ্ঠা ২৯৩' : 'Textbook Page 293'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>তীব্র ক্ষার NaOH প্রোটিনের পেপটাইড বন্ধন ভেঙে চুল ও ত্বকের কোষ আর্দ্র-বিশ্লেষিত করে তরলে পরিণত করে এবং চর্বিকে সাবানে রূপান্তরিত করে সহজে পানির সাথে ভাসিয়ে নিয়ে যায়।</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 3: TRY (হাতে-কলমে ৪টি ভার্চুয়াল ইন্টারঅ্যাক্টিভ ল্যাব)
           ========================================================================= */}
        {currentStep === 'try' && (
          <div className="space-y-10 animate-fadeIn">
            {/* Header */}
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Play className="w-3.5 h-3.5" />
                {isBn ? 'হাতে-কলমে প্রাত্যহিক রসায়ন ল্যাব' : 'Interactive Everyday Chemistry Labs'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? '৪টি ভার্চুয়াল গৃহস্থালি ও পরিষ্কারক চেম্বার' : '4 Virtual Domestic & Cleaning Chambers'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'বেকিং ওভেন ও কেক ফোলা ল্যাব, সাবানায়ন ও মিসেল ময়লা পরিষ্কারক, ব্লিচিং পাউডার বিরঞ্জন এবং ত্বকের pH ব্যালান্সার।'
                  : 'Baking oven & cake expansion, soap saponification & 3D micelle cleaner, bleaching stain remover, and skin pH acid mantle guard.'}
              </p>
            </div>

            {/* =========================================================================
                SIMULATOR 1: BAKING OVEN & CAKE EXPANSION
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-amber-600 text-white font-bold text-xs">ল্যাব ০১</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'বেকিং ওভেন ও পাউরুটি ফোলা ল্যাব' : 'Baking Oven & Cake Rising Chamber'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'বেকিং সোডা মাত্র বনাম বেকিং পাউডার (টারটারিক এসিডসহ) বেক করে কেকের ফোলাত্ব ও স্বাদ পর্যবেক্ষণ করুন।'
                      : 'Compare baking soda alone vs baking powder (with tartaric acid) on cake fluffiness and taste.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setIsBakingActive(false);
                    setOvenTemp(180);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Recipe Selector */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setBakingIngredient('soda_only');
                    setIsBakingActive(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    bakingIngredient === 'soda_only'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">রেসিপি ১</div>
                  <div className="text-sm font-bold">শুধু বেকিং সোডা (NaHCO₃)</div>
                  <div className="text-[11px] text-slate-400">Na₂CO₃ এর কারণে কেক তেতো হয়</div>
                </button>

                <button
                  onClick={() => {
                    setBakingIngredient('powder_tartaric');
                    setIsBakingActive(false);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition ${
                    bakingIngredient === 'powder_tartaric'
                      ? 'bg-amber-500/10 border-amber-500 text-amber-700 dark:text-amber-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">রেসিপি ২</div>
                  <div className="text-sm font-bold">বেকিং পাউডার (NaHCO₃ + টারটারিক এসিড)</div>
                  <div className="text-[11px] text-slate-400">প্রচুর CO₂ বুদবুদে তুলতুলে নরম কেক</div>
                </button>
              </div>

              {/* Visual Oven Graphics */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Visual Oven Display */}
                <div className="w-60 h-48 bg-slate-800 rounded-3xl border-4 border-slate-600 flex flex-col justify-between items-center p-4 shadow-2xl relative overflow-hidden">
                  <div className="flex justify-between w-full text-[10px] text-amber-400 font-mono">
                    <span>ওভেন তাপমাত্রা: {ovenTemp}°C</span>
                    <span>{isBakingActive ? 'বেকিং চলছে...' : 'প্রস্তুত'}</span>
                  </div>

                  {/* Visual Cake Dough */}
                  <div
                    className={`w-40 rounded-2xl transition-all duration-1000 flex items-center justify-center font-bold text-xs shadow-lg ${
                      !isBakingActive
                        ? 'h-12 bg-amber-100 text-slate-700'
                        : bakingIngredient === 'soda_only'
                        ? 'h-16 bg-amber-300 text-amber-900 border-2 border-amber-500'
                        : 'h-28 bg-gradient-to-t from-amber-600 to-amber-400 text-white border-2 border-amber-300 animate-pulse'
                    }`}
                  >
                    {!isBakingActive
                      ? 'কাঁচা ময়দার খামির'
                      : bakingIngredient === 'soda_only'
                      ? 'অল্প ফোলা ও তেতো'
                      : 'দারুণ ফোলা ও নরম তুলতুলে কেক!'}
                  </div>

                  <span className="text-[9px] font-mono text-slate-400">
                    {bakingIngredient === 'powder_tartaric' && isBakingActive
                      ? 'CO₂ গ্যাস বের হয়ে ক্ষুদ্র ছিদ্র তৈরি করেছে'
                      : 'হিটিং প্লেট ১৮০°C'}
                  </span>
                </div>

                <div className="space-y-4 max-w-sm w-full">
                  <button
                    onClick={() => setIsBakingActive(true)}
                    className="w-full px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                  >
                    <Flame className="w-4 h-4" />
                    {isBn ? 'ওভেন চালু করো ও বেক করো' : 'Start Oven & Bake Cake'}
                  </button>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-amber-600">বেকিং রসায়ন:</span>
                    {bakingIngredient === 'powder_tartaric' ? (
                      <p className="text-slate-600 dark:text-slate-300">
                        টারটারিক এসিড Na₂CO₃ এর তীব্র ক্ষারীয় স্বাদ ধ্বংস করে সুস্বাদু সোডিয়াম টারটারেট লবণ তৈরি করে এবং উৎপন্ন CO₂ বুদবুদ কেককে স্পঞ্জের মতো ফাঁপা করে।
                      </p>
                    ) : (
                      <p className="text-rose-600 dark:text-rose-400">
                        শুধুমাত্র NaHCO₃ দিলে উৎপন্ন Na₂CO₃ ক্ষারধর্মী হওয়ায় কেকের স্বাদ তেতো এবং রং হলুদাভ হয়ে যায়।
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 2: SOAP SAPONIFICATION & 3D MICELLE CLEANER
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">ল্যাব ০২</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'সাবানায়ন ও মিসেল ময়লা পরিষ্কারক ল্যাব' : 'Saponification & Micelle Dirt Cleaner'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'তেল ও ক্ষার মিশিয়ে সাবান প্রস্তুত করুন এবং কাপড়ের তেলের দাগে মিসেল গঠন পর্যবেক্ষণ করুন।'
                      : 'Simulate fat saponification and observe micelle grease lifting off fabric.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setSaponificationStep(0);
                    setDirtStatus('dirty');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Saponification & Micelle Interactive Display */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                {/* Visual Saponification Tube */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3 shadow-inner">
                  <span className="text-xs font-bold text-slate-500">সাবানায়ন বিকার (Saponification Reactor)</span>
                  <div className="w-40 h-44 mx-auto relative bg-slate-100 dark:bg-slate-800 rounded-b-3xl border-2 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-2 overflow-hidden shadow-inner">
                    <div
                      className={`w-full rounded-b-2xl transition-all duration-700 flex flex-col items-center justify-center font-bold text-[10px] ${
                        saponificationStep === 0
                          ? 'h-20 bg-amber-400/30 text-amber-800'
                          : saponificationStep === 1
                          ? 'h-28 bg-blue-400/40 text-blue-900'
                          : 'h-32 bg-white text-slate-800 shadow-md border-t-4 border-blue-500'
                      }`}
                    >
                      {saponificationStep === 0 && 'তেল/চর্বি দ্রবণ'}
                      {saponificationStep === 1 && 'NaOH সহ ফুটানো হচ্ছে'}
                      {saponificationStep === 2 && 'কঠিন সাবান ভাসমান (সল্টিং আউট)'}
                    </div>
                  </div>
                  <button
                    onClick={() => setSaponificationStep((prev) => Math.min(2, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition"
                  >
                    {saponificationStep === 0 ? 'NaOH যোগ করে ফুটাও' : 'NaCl যোগ করো (সল্টিং আউট)'}
                  </button>
                </div>

                {/* Visual Micelle Mechanism on Fabric */}
                <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-inner">
                  <span className="text-xs font-bold text-slate-500 block text-center">
                    কাপড়ে তেলের দাগ ও মিসেল মেকানিজম
                  </span>
                  <div className="h-44 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-3 relative overflow-hidden">
                    {dirtStatus === 'dirty' && (
                      <div className="w-20 h-20 rounded-full bg-amber-600/90 shadow-lg flex items-center justify-center text-[10px] font-bold text-white text-center p-1">
                        তেল ও গ্রিজের ময়লা
                      </div>
                    )}
                    {dirtStatus === 'micelle_formed' && (
                      <div className="w-28 h-28 rounded-full border-4 border-dashed border-cyan-400 bg-amber-600/70 flex flex-col items-center justify-center text-[10px] font-bold text-white text-center p-1 animate-spin">
                        <div>মিসেল গঠিত</div>
                        <span className="text-[8px] font-mono">লেজ ভিতরে, মাথা বাইরে</span>
                      </div>
                    )}
                    {dirtStatus === 'clean' && (
                      <div className="text-center space-y-1 animate-pulse">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                        <span className="text-xs font-bold text-emerald-600">কাপড় সম্পূর্ণ পরিষ্কার!</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setDirtStatus('micelle_formed')}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition"
                    >
                      সাবান ঘষো (মিসেল তৈরি)
                    </button>
                    <button
                      onClick={() => setDirtStatus('clean')}
                      disabled={dirtStatus !== 'micelle_formed'}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white text-xs font-bold transition"
                    >
                      পানি দিয়ে ধুয়ে ফেলো
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 3: BLEACHING POWDER STAIN & GERM REMOVER
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-600 text-white font-bold text-xs">ল্যাব ০৩</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'ব্লিচিং পাউডার বিরঞ্জন ও জীবাণুনাশক চেম্বার' : 'Bleaching Stain & Germ Destroyer'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'কাপড়ে কালির দাগ ও জীবাণুতে ব্লিচিং দ্রবণ প্রয়োগ করে জায়মান অক্সিজেনের বিরঞ্জন দেখুন।'
                      : 'Apply bleaching powder to ink stains and observe nascent oxygen bleaching colored pigments.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setBleachAdded(false);
                    setBacteriaDestroyed(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Visual Stain Fabric */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                <div className="w-56 h-40 bg-white dark:bg-slate-900 rounded-2xl border-4 border-slate-300 dark:border-slate-700 flex items-center justify-center p-3 shadow-inner relative overflow-hidden">
                  <div
                    className={`w-28 h-28 rounded-full transition-all duration-1000 flex items-center justify-center font-bold text-xs text-white ${
                      !bleachAdded
                        ? 'bg-rose-600 shadow-lg'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 border border-dashed border-slate-300'
                    }`}
                  >
                    {!bleachAdded ? 'লাল রঙের কালির দাগ' : 'দাগ বর্ণহীন হয়ে গেছে!'}
                  </div>
                </div>

                <div className="space-y-4 max-w-sm w-full">
                  <button
                    onClick={() => {
                      setBleachAdded(true);
                      setBacteriaDestroyed(true);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                  >
                    <Pipette className="w-4 h-4" />
                    {isBn ? 'ব্লিচিং পাউডার দ্রবণ যোগ করো [O]' : 'Apply Ca(OCl)Cl Bleach Solution'}
                  </button>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1 font-mono">
                    <div className="text-cyan-600 font-bold">জায়মান অক্সিজেন বিরঞ্জন সমীকরণ:</div>
                    <div>HOCl → HCl + [O]</div>
                    <div>রঙিন দাগ + [O] → বর্ণহীন যৌগ</div>
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 4: SKIN pH & COSMETICS BUFFER GUARD
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">ল্যাব ০৪</span>
                  <h3 className="text-xl font-bold">
                    {isBn ? 'ত্বকের pH ও প্রসাধনী ব্যালান্সার' : 'Skin pH & Cosmetics Acid Mantle Guard'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'প্রসাধনীর pH পরীক্ষা করে ত্বকের স্বাভাবিক অম্লীয় আবরণের (pH ৫.৫) সুরক্ষা যাচাই করুন।'
                    : 'Test product pH to examine preservation of the natural skin acid mantle (pH 5.5).'}
                </p>
              </div>

              {/* Product Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'soap', name: 'তীব্র ক্ষারীয় সাবান (pH ৯-১০)' },
                  { id: 'facewash', name: 'ব্যালান্সড ফেসওয়াশ (pH ৫.৫)' },
                  { id: 'mehendi', name: 'প্রাকৃতিক মেহেদি (Lawsone)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setTestedProduct(item.id as any)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      testedProduct === item.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500'
                    }`}
                  >
                    {item.name}
                  </button>
                ))}
              </div>

              {/* Product Assessment Card */}
              <div className="p-6 rounded-2xl bg-purple-500/5 border border-purple-500/20 space-y-3">
                {testedProduct === 'soap' && (
                  <div>
                    <h4 className="font-bold text-base text-rose-600 dark:text-rose-400">
                      তীব্র ক্ষারীয় সাবান (pH ৯.০ - ১০.০)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • ত্বকের স্বাভাবিক এসিড ম্যান্টল (pH ৫.৫) নষ্ট করে ত্বককে শুষ্ক ও রুক্ষ করে ফেলে এবং ক্ষতিকর ব্যাকটেরিয়ার আক্রমণ সহজতর করে।
                    </p>
                  </div>
                )}

                {testedProduct === 'facewash' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                      pH ৫.৫ ব্যালান্সড ফেসওয়াশ
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • ত্বকের স্বাভাবিক অম্লত্ব অক্ষুণ্ণ রাখে, ময়লা দূর করে এবং প্রোটিন ও লিপিড আবরণের আর্দ্রতা বজায় রাখে।
                    </p>
                  </div>
                )}

                {testedProduct === 'mehendi' && (
                  <div>
                    <h4 className="font-bold text-base text-purple-900 dark:text-purple-300">
                      মেহেদি পেস্ট (Lawsone রঞ্জক)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • মেহেদির পাতার ২-হাইড্রোক্সি-১,৪-ন্যাফথোকুইনোন (লসন) পিগমেন্ট ত্বকের কেরাটিন প্রোটিনের সাথে স্থায়ী রাসায়নিক বন্ধন তৈরি করে লালচে বাদামি বর্ণ দেয়।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 4: CHECK (বোর্ড মূল্যায়ন)
           ========================================================================= */}
        {currentStep === 'check' && (
          <div className="space-y-10 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <Award className="w-3.5 h-3.5" />
                {isBn ? 'বোর্ড পরীক্ষা মূল্যায়ন' : 'Board Examination Assessment'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? '৫টি বোর্ড MCQ এবং ১টি সম্পূর্ণ বোর্ড সৃজনশীল (CQ)' : '5 Authentic MCQs & 1 Complete Board CQ'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ঢাকা, রাজশাহী, দিনাজপুর ও চট্টগ্রাম বোর্ডের বিগত প্রশ্নাবলী এবং এনসিটিবি পাঠ্যবই পৃষ্ঠা ৩০৪ এর মূল সৃজনশীল সমাধান।'
                  : 'Practice standard board questions with instant validation and official marking rubrics.'}
              </p>
            </div>

            {/* MCQs List */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-cyan-600" />
                  {isBn ? 'পর্ব ক: ৫টি বোর্ড বহুনিবার্চনী প্রশ্ন (MCQ)' : 'Part A: 5 Authentic Board MCQs'}
                </h3>
                <button
                  onClick={resetMcqs}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'পুনরায় পরীক্ষা' : 'Reset MCQs'}
                </button>
              </div>

              <div className="space-y-6">
                {BOARD_MCQS.map((mcq, idx) => {
                  const isSubmitted = submittedAnswers[mcq.id];
                  const chosenKey = selectedAnswers[mcq.id];
                  const isCorrect = chosenKey === mcq.correctKey;

                  return (
                    <div
                      key={mcq.id}
                      className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <span className="text-xs px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold">
                            প্রশ্ন ০{idx + 1}
                          </span>
                          <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">
                            {isBn ? mcq.questionBn : mcq.questionEn}
                          </h4>
                        </div>
                        <span className="text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 font-medium whitespace-nowrap">
                          {isBn ? mcq.boardInfoBn : mcq.boardInfoEn}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {mcq.options.map((opt) => {
                          const isOptionChosen = chosenKey === opt.key;
                          const isThisCorrect = opt.key === mcq.correctKey;

                          let btnClasses =
                            'p-3 rounded-xl border text-left text-xs md:text-sm font-medium transition flex items-center justify-between ';
                          if (!isSubmitted) {
                            btnClasses +=
                              'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-cyan-500 text-slate-800 dark:text-slate-200';
                          } else if (isThisCorrect) {
                            btnClasses +=
                              'bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold';
                          } else if (isOptionChosen && !isThisCorrect) {
                            btnClasses +=
                              'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-300 line-through';
                          } else {
                            btnClasses +=
                              'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-400';
                          }

                          return (
                            <button
                              key={opt.key}
                              disabled={isSubmitted}
                              onClick={() => handleSelectAnswer(mcq.id, opt.key)}
                              className={btnClasses}
                            >
                              <span>
                                <strong className="mr-2">{opt.key}.</strong>
                                {isBn ? opt.textBn : opt.textEn}
                              </span>
                              {isSubmitted && isThisCorrect && (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {isSubmitted && (
                        <div
                          className={`p-4 rounded-xl text-xs md:text-sm space-y-1.5 animate-fadeIn ${
                            isCorrect
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-emerald-900 dark:text-emerald-200'
                              : 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-900 dark:text-rose-200'
                          }`}
                        >
                          <div className="font-bold flex items-center gap-1.5">
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>{isBn ? 'সঠিক উত্তর!' : 'Correct!'}</span>
                              </>
                            ) : (
                              <>
                                <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                <span>
                                  {isBn
                                    ? `ভুল হয়েছে! সঠিক উত্তর হলো: ${mcq.correctKey}`
                                    : `Incorrect! Correct answer is: ${mcq.correctKey}`}
                                </span>
                              </>
                            )}
                          </div>
                          <p className="leading-relaxed">
                            {isBn ? mcq.explanationBn : mcq.explanationEn}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Creative Question (CQ) */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">সৃজনশীল প্রশ্ন</span>
                  <h3 className="text-xl font-bold mt-1">
                    {isBn
                      ? 'খর পানিতে সাবান বনাম ডিটারজেন্ট এবং মিসেল কৌশল'
                      : 'Creative Question: Soap vs Detergent in Hard Water'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isBn ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ৩০৪ এর মূল বোর্ড সৃজনশীল ০১' : 'Textbook Page 304 Official Model CQ 1'}
                  </span>
                </div>
                <span className="text-sm font-black text-purple-600 dark:text-purple-400">১০ নম্বর (১+২+৩+৪)</span>
              </div>

              {/* Stem */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  উদ্দীপক (Stem):
                </span>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                  দশম শ্রেণির ছাত্র শাওন গভীর নলকূপের পানিতে সাবান দিয়ে কাপড় ধুতে গিয়ে দেখল তেমন কোনো ফেনা হচ্ছে না এবং কাপড়ও পরিষ্কার হচ্ছে না, বরং কাপড়ে আঠালো তলানি জমা হচ্ছে। তার সহপাঠী রিয়াদ তাকে সাবানের পরিবর্তে ডিটারজেন্ট ব্যবহার করার পরামর্শ দিল এবং দেখল সাথে সাথেই প্রচুর ফেনা তৈরি হয়ে কাপড়টি ঝকঝকে পরিষ্কার হয়ে গেল।
                </p>
              </div>

              {/* CQ Questions Accordion */}
              <div className="space-y-4">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('ka')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (ক) সাবান কী? <span className="text-xs text-slate-400 ml-2">[১ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ka ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ka && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>সাবান হলো উচ্চতর ফ্যাটি এসিডের সোডিয়াম বা পটাশিয়াম লবণ (যেমন: সোডিয়াম স্টিয়ারেট, C₁₇H₃₅COONa)।</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('kha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (খ) গ্লাস ক্লিনার কাচে কোনো দাগ ফেলে না কেন? ব্যাখ্যা করো। <span className="text-xs text-slate-400 ml-2">[২ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.kha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.kha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        গ্লাস ক্লিনারের প্রধান উপাদান হলো অ্যামোনিয়াম হাইড্রোক্সাইড দ্রবণ (NH₄OH) এবং সহজে উদ্বায়ী আইসোপ্রোপাইল অ্যালকোহল। এগুলো কাচের গায়ে লেগে থাকা তেল, গ্রিজ ও ধুলাবালি দ্রবীভূত করার পর অত্যন্ত দ্রুত বাতাসে বাষ্পীভূত হয়ে শুকিয়ে যায়। কোনো কঠিন অবশিষ্ট না থাকায় কাচে কোনো দাগ সৃষ্টি হয় না।
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('ga')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (গ) শাওন প্রথমে যে পদার্থ (সাবান) ব্যবহার করেছিল তার ময়লা পরিষ্কারক কৌশল (মিসেল) বর্ণনা করো। <span className="text-xs text-slate-400 ml-2">[৩ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ga ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ga && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        সাবানের অণুর দুটি প্রান্ত থাকে: একটি হাইড্রোকার্বন লেজ (C₁₇H₃₅-) যা অপোলার ও পানি-বিদ্বেষী (হাইড্রোফোবিক) এবং একটি আয়নিক মাথা (-COO⁻Na⁺) যা পোলার ও পানি-আকর্ষী (হাইড্রোফিলিক)।<br />
                        যখন সাবানযুক্ত কাপড়ে ঘষা হয়, তখন হাইড্রোফোবিক লেজগুলো তেলের দাগের ভেতরে ঢুকে যায় এবং হাইড্রোফিলিক মাথাগুলো বাইরের পানির অণুর দিকে মুখ করে থাকে। ফলে ময়লার চারপাশে একটি ঋণাত্মক চার্জযুক্ত ক্ষুদ্র গোলকাকার <strong>মিসেল (Micelle)</strong> গঠিত হয়। পানিতে ধুয়ে নিলে এই মিসেলগুলো পানির স্রোতের সাথে ভেসে কাপড়কে পরিষ্কার করে।
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('gha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (ঘ) রিয়াদের পরামর্শকৃত ডিটারজেন্ট নলকূপের খর পানিতে কার্যকর হওয়ার কারণ যুক্তিসহ মূল্যায়ন করো। <span className="text-xs text-slate-400 ml-2">[৪ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.gha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.gha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        ১. উদ্দীপকের গভীর নলকূপের পানিতে দ্রবীভূত Ca²⁺ ও Mg²⁺ লবণ থাকায় তা খর পানি।<br />
                        ২. সাবান এই Ca²⁺ আয়নের সাথে বিক্রিয়া করে অদ্রবণীয় ক্যালসিয়াম স্টিয়ারেটের আঠালো গাদ তৈরি করে সাবানের অপচয় ঘটায় এবং ফেনা হতে বাধা দেয়।<br />
                        ৩. পক্ষান্তরে, ডিটারজেন্ট হলো সোডিয়াম অ্যালকাইল সালফেট বা সালফোনেট লবণ। খর পানিতে থাকা Ca²⁺ বা Mg²⁺ আয়নের সাথে ডিটারজেন্ট যে ক্যালসিয়াম লবণ তৈরি করে তা পানিতে সম্পূর্ণ দ্রবণীয়। কোনো অদ্রবণীয় গাদ সৃষ্টি হয় না বলে ডিটারজেন্ট সরাসরি ফেনা তৈরি করে ময়লা দূর করতে পারে। সুতরাং খর পানির জন্য ডিটারজেন্ট ব্যবহার করার পরামর্শটি সম্পূর্ণ বৈজ্ঞানিক ও কার্যকর।
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            STEP 5: SUMMARY (অধ্যায়ের চূড়ান্ত সারসংক্ষেপ ও চিটশিট)
           ========================================================================= */}
        {currentStep === 'summary' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="text-center space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isBn ? 'অধ্যায় ১২ সারসংক্ষেপ' : 'Chapter 12 Revision Summary'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'পরীক্ষার আগের রাতের রিভিশন চিটশিট' : 'Exam Revision & Formula Cheat Sheet'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'গৃহস্থালির রাসায়নিক দ্রব্য, সংকেত এবং কার্যপদ্ধতি এক নজরে।'
                  : 'Domestic chemicals, formulas, cleaning agents, and cosmetics science at a glance.'}
              </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
              >
                <Copy className="h-3.5 w-3.5" />
                <span>{copyToast ? (isBn ? 'কপি সম্পন্ন!' : 'Copied!') : (isBn ? 'হ্যান্ডনোট কপি করুন' : 'Copy Notes')}</span>
              </button>
            </div>
            </div>

            {/* Quick Flashcards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400 font-bold text-sm">
                  <Beaker className="w-4 h-4" />
                  <span>গৃহস্থালির রাসায়নিক সংকেত</span>
                </div>
                <div className="text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
                  <div>• খাদ্যলবণ: NaCl</div>
                  <div>• বেকিং সোডা: NaHCO₃</div>
                  <div>• কাপড় কাঁচা সোডা: Na₂CO₃ · 10H₂O</div>
                  <div>• ব্লিচিং পাউডার: Ca(OCl)Cl</div>
                  <div>• ইউরিয়া: H₂N-CO-NH₂</div>
                  <div>• ভিনেগার: ৪-১০% CH₃COOH</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4" />
                  <span>পরিষ্কারক সামগ্রীর সক্রিয় উপাদান</span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>• <strong>টয়লেট ক্লিনার:</strong> কস্টিক সোডা (NaOH)</div>
                  <div>• <strong>গ্লাস ক্লিনার:</strong> অ্যামোনিয়া (NH₄OH) + অ্যালকোহল</div>
                  <div>• <strong>সাবান:</strong> সোডিয়াম স্টিয়ারেট (C₁₇H₃₅COONa)</div>
                  <div>• <strong>ডিটারজেন্ট:</strong> সোডিয়াম লরাইল সালফেট</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>প্রসাধনী ও জৈব সুরক্ষা</span>
                </div>
                <div className="text-xs space-y-1 text-slate-700 dark:text-slate-300">
                  <div>• <strong>ত্বকের pH:</strong> ৫.৫ (এসিড ম্যান্টল)</div>
                  <div>• <strong>মেহেদি রঞ্জক:</strong> লসন (Lawsone)</div>
                  <div>• <strong>ট্যালকম পাউডার:</strong> ট্যালক 3MgO·4SiO₂·H₂O</div>
                </div>
              </div>
            </div>

            {/* Grand Completion Banner for Entire Chemistry Course */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-700 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <span className="px-3 py-1 rounded-full bg-white/20 text-xs font-bold uppercase tracking-wider inline-block">
                  ১২/১২টি অধ্যায় সম্পূর্ণ
                </span>
                <h3 className="text-2xl md:text-3xl font-black">
                  {isBn
                    ? 'অভিনন্দন! এনসিটিবি নবম-দশম শ্রেণির সম্পূর্ণ রসায়ন প্রস্তুত!'
                    : 'Congratulations! Complete Class 9-10 Chemistry Course Completed!'}
                </h3>
                <p className="text-sm text-cyan-100 max-w-lg">
                  {isBn
                    ? 'আপনি অধ্যায় ০১ থেকে ১২ পর্যন্ত প্রতিটি অধ্যায়ের ৫-ধাপের সম্পূর্ণ ইন্টারঅ্যাক্টিভ ভার্চুয়াল ল্যাব, বোর্ড MCQ ও সৃজনশীল আয়ত্ত করেছেন।'
                    : 'You have mastered all 12 chapters of NCTB Chemistry with 100% interactive simulators, board MCQs, and authentic CQs.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/playground/v2/chemistry/11"
                  className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {isBn ? 'পূর্ববর্তী অধ্যায় (১১)' : 'Previous Chapter (11)'}
                </Link>
                <Link
                  href={"/dashboard/playground/v2?subject=chemistry" as any}
                  className="px-5 py-2.5 rounded-xl bg-white text-cyan-900 hover:bg-cyan-50 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  <Award className="w-4 h-4 text-emerald-600" />
                  {isBn ? 'গাইডবুক লাইব্রেরিতে ফিরুন' : 'Back to Guidebook Library'}
                </Link>
              </div>
            </div>
          </div>
        )}
            {/* 3. Footer Step Navigation */}
      <StepNavigationFooter
        currentStep={activeStep as StepKey}
        onStepChange={(step) => setActiveStep(step as LearningStep)}
        chapterNumberBn="অধ্যায় 12"
        chapterNumberEn="Chapter 12"
        chapterTitleBn="আমাদের জীবনে রসায়ন"
        chapterTitleEn="Chemistry in Our Lives"
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
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় 12 বিশেষজ্ঞ' : 'Chapter 12 Specialist'}
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
                  ? 'bg-purple-600 text-white ml-6 rounded-tr-xs'
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
              placeholder={isBn ? 'আমাদের জীবনে রসায়ন নিয়ে প্রশ্ন করো...' : 'Ask about Chemistry in Our Lives...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-purple-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white transition-all disabled:opacity-50 shrink-0"
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
