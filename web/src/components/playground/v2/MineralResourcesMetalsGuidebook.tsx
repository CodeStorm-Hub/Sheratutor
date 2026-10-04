'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  PanelLeftClose, PanelLeftOpen, FlaskConical, HelpCircle, Lightbulb, X,
  Hammer,
  Flame,
  Layers,
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
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';
import { RenderMathText } from '@/components/render-math-text';

type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// 5 Authentic Board MCQs for Chapter 10
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
    questionBn: 'কাঁসা (Bronze) সংকর ধাতুতে টিনের (Sn) পরিমাণ শতকরা কত?',
    questionEn: 'What is the percentage of tin (Sn) in bronze alloy?',
    boardInfoBn: 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৬৫, ঢাকা বোর্ড ২০২৩, রাজশাহী ২০২২',
    boardInfoEn: 'NCTB Textbook p. 265, Dhaka Board 2023, Rajshahi 2022',
    options: [
      { key: 'A', textBn: '৯০%', textEn: '90%' },
      { key: 'B', textBn: '৬৫%', textEn: '65%' },
      { key: 'C', textBn: '৩৫%', textEn: '35%' },
      { key: 'D', textBn: '১০%', textEn: '10%' },
    ],
    correctKey: 'D',
    explanationBn:
      'কাঁসা (Bronze) হলো কপার (Cu) ও টিনের (Sn) একটি সংকর ধাতু। এতে কপার থাকে ৯০% এবং টিন থাকে ১০%। অন্যদিকে পিতল (Brass) তৈরি হয় ৬৫% কপার এবং ৩৫% জিংক দিয়ে।',
    explanationEn:
      'Bronze is an alloy of copper and tin containing 90% Copper and 10% Tin. In contrast, brass contains 65% Copper and 35% Zinc.',
  },
  {
    id: 2,
    questionBn: 'জিংক ব্লেন্ড (ZnS) সালফাইড আকরিক থেকে ধাতু নিষ্কাশনে কোন পদ্ধতিতে অক্সাইডে রূপান্তর করা হয়?',
    questionEn: 'Which process converts zinc blende (ZnS) sulphide ore into its oxide?',
    boardInfoBn: 'চট্টগ্রাম বোর্ড ২০২৩, দিনাজপুর ২০২১',
    boardInfoEn: 'Chattogram Board 2023, Dinajpur 2021',
    options: [
      { key: 'A', textBn: 'ভস্মীকরণ (Calcination)', textEn: 'Calcination' },
      { key: 'B', textBn: 'ভর্জন (Roasting)', textEn: 'Roasting' },
      { key: 'C', textBn: 'তড়িৎ বিশোধন', textEn: 'Electrolytic refining' },
      { key: 'D', textBn: 'তেল ফেনা ভাসমান', textEn: 'Froth flotation' },
    ],
    correctKey: 'B',
    explanationBn:
      'সালফাইড আকরিককে বায়ুর উপস্থিতিতে বা অতিরিক্ত বাতাসে গলনাঙ্কের চেয়ে কম তাপমাত্রায় উত্তপ্ত করে ধাতব অক্সাইডে রূপান্তর করার প্রক্রিয়াকে ভর্জন (Roasting) বলে: 2ZnS + 3O₂ → 2ZnO + 2SO₂। ভস্মীকরণ করা হয় বায়ুর অনুপস্থিতিতে কার্বনেট বা হাইড্রোক্সাইড আকরিকের জন্য।',
    explanationEn:
      'Roasting is the heating of sulphide ores in the presence of excess air below melting point: 2ZnS + 3O₂ → 2ZnO + 2SO₂.',
  },
  {
    id: 3,
    questionBn: 'স্পর্শ পদ্ধতিতে SO₃ গ্যাসকে সরাসরি পানিতে না গুলিয়ে ৯৮% H₂SO₄ এ শোষণ করার কারণ কী?',
    questionEn: 'Why is SO₃ gas absorbed in 98% H₂SO₄ instead of water in the Contact Process?',
    boardInfoBn: 'যশোর বোর্ড ২০২২, ময়মনসিংহ ২০২০ (পাঠ্যবই পৃষ্ঠা ২৬৪)',
    boardInfoEn: 'Jashore Board 2022, Mymensingh 2020 (Textbook p. 264)',
    options: [
      { key: 'A', textBn: 'SO₃ পানিতে সম্পূর্ণ অদ্রবণীয়', textEn: 'SO₃ is insoluble in water' },
      { key: 'B', textBn: 'প্রচুর তাপ উৎপন্ন হয়ে এসিডের ঘন কুয়াশা সৃষ্টি হয় যা ঘনীভূত করা কঠিন', textEn: 'Extreme heat creates dense acid mist that is difficult to condense' },
      { key: 'C', textBn: 'সালফিউরিক এসিড বিয়োজিত হয়ে যায়', textEn: 'Sulfuric acid dissociates' },
      { key: 'D', textBn: 'বিক্রিয়াটি উভমুখী হয়ে থেমে যায়', textEn: 'Reaction stops in equilibrium' },
    ],
    correctKey: 'B',
    explanationBn:
      'SO₃ গ্যাস সরাসরি পানিতে দ্রবীভূত করলে অতিমাত্রায় তাপ নির্গত হয় এবং এসিড বাষ্পীভূত হয়ে তীব্র কুয়াশার মতো ঘন ধোঁয়া তৈরি করে। এই কুয়াশাকে সাধারণ কুলিং সিস্টেমে ঘনীভূত করা অত্যন্ত কঠিন ও ঝুঁকিপূর্ণ। তাই প্রথমে ৯৮% H₂SO₄ এ শোষণ করিয়ে ওলিয়াম (H₂S₂O₇) তৈরি করা হয়, তারপর পরিমিত পানি যোগ করে লঘু করা হয়।',
    explanationEn:
      'Direct dissolution of SO₃ in water is violently exothermic, producing a dense mist of fine H₂SO₄ droplets that resist condensation. Oleum (H₂S₂O₇) avoids this hazardous mist.',
  },
  {
    id: 4,
    questionBn: 'নিচের কোন ধাতুটি কার্বন বিজারণ পদ্ধতিতে নিষ্কাশন করা যায় না?',
    questionEn: 'Which of the following metals CANNOT be extracted by carbon reduction?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২৩, কুমিল্লা ২০২২',
    boardInfoEn: 'Barishal Board 2023, Cumilla 2022',
    options: [
      { key: 'A', textBn: 'জিংক (Zn)', textEn: 'Zinc (Zn)' },
      { key: 'B', textBn: 'আয়রন (Fe)', textEn: 'Iron (Fe)' },
      { key: 'C', textBn: 'অ্যালুমিনিয়াম (Al)', textEn: 'Aluminium (Al)' },
      { key: 'D', textBn: 'লেড (Pb)', textEn: 'Lead (Pb)' },
    ],
    correctKey: 'C',
    explanationBn:
      'ধাতুর সক্রিয়তা সিরিজে অ্যালুমিনিয়াম (Al) কার্বনের (C) উপরে অবস্থিত। অক্সিজেনের প্রতি অ্যালুমিনিয়ামের আকর্ষণ কার্বনের চেয়ে বহুগুণ বেশি হওয়ায় কোক বা কার্বন দ্বারা Al₂O₃ কে বিজারিত করা যায় না। অ্যালুমিনিয়ামকে গলিত বক্সাইট ও ক্রায়োলাইটের মিশ্রণ থেকে তড়িৎ বিশ্লেষণ পদ্ধতিতে নিষ্কাশন করতে হয়।',
    explanationEn:
      'Aluminium is highly electropositive and sits above carbon in the reactivity series. Carbon cannot reduce Al₂O₃; it requires molten electrolysis (Hall-Héroult process).',
  },
  {
    id: 5,
    questionBn: 'মরিচার (Rust) সঠিক রাসায়নিক সংকেত কোনটি?',
    questionEn: 'What is the correct chemical formula of rust?',
    boardInfoBn: 'ঢাকা বোর্ড ২০২১, সিলেট ২০২০',
    boardInfoEn: 'Dhaka Board 2021, Sylhet 2020',
    options: [
      { key: 'A', textBn: 'Fe₃O₄', textEn: 'Fe₃O₄' },
      { key: 'B', textBn: 'Fe₂O₃ · nH₂O', textEn: 'Fe₂O₃ · nH₂O' },
      { key: 'C', textBn: 'FeO · nH₂O', textEn: 'FeO · nH₂O' },
      { key: 'D', textBn: 'FeSO₄ · 7H₂O', textEn: 'FeSO₄ · 7H₂O' },
    ],
    correctKey: 'B',
    explanationBn:
      'লোহা বাতাস ও জলীয় বাষ্পের সংস্পর্শে আসলে জারিত হয়ে পানিযুক্ত ফেরিক অক্সাইড তৈরি করে, যা মরিচা (Rust) নামে পরিচিত। এর সংকেত Fe₂O₃ · nH₂O।',
    explanationEn:
      'Rust is hydrated iron(III) oxide formed by oxidation of metallic iron in moist air: Fe₂O₃ · nH₂O.',
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

export const CHAPTER_10_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: "০১",
    titleBn: "শিলা, খনিজ ও আকরিক",
    titleEn: "Rocks, Minerals & Ores",
    overviewBn: "ভূ-ত্বকের খনিজ উপাদান, আকরিক (যে খনিজ থেকে লাভজনকভাবে ধাতু নিষ্কাশন করা যায়) এবং বক্সাইট, হেমাটাইট, ক্যালামাইন।",
    overviewEn: "Geological minerals vs ores, profitable metallurgy, and authentic ores: Bauxite, Hematite, Calamine.",
    studyTipBn: "সব আকরিকই খনিজ, কিন্তু সব খনিজ আকরিক নয়!",
    studyTipEn: "All ores are minerals, but not all minerals are commercially viable ores!",
    badgeText: "খনিজ ও আকরিক",
  },
  2: {
    no: "০২",
    titleBn: "ধাতু নিষ্কাশনের ধাপ ও কার্বন বিজারণ ল্যাব",
    titleEn: "Metallurgical Stages & Carbon Reduction Lab",
    overviewBn: "আকরিক বিচূর্ণন, ঘনীভবন, তাপজারণ/ভস্মীকরণ এবং কোক কার্বন (C) দিয়ে ZnO ও Fe₂O₃ বিজারণ।",
    overviewEn: "Crushing, ore concentration, calcination, roasting, and carbon coke smelting reduction.",
    studyTipBn: "ক্যালামাইন (ZnCO₃) তাপ দিলে ZnO হয়; এরপর কার্বন দিয়ে বিজারিত করলে বিশুদ্ধ জিংক ধাতু পাওয়া যায়!",
    studyTipEn: "Calcinating calamine yields zinc oxide, which carbon coke reduces to elemental zinc metal!",
    badgeText: "কার্বন বিজারণ ব্লাস্ট ফার্নেস",
  },
  3: {
    no: "০৩",
    titleBn: "ধাতুর সক্রিয়তা সিরিজ ও তড়িৎ নিষ্কাশন",
    titleEn: "Reactivity Series & Electrolytic Smelting",
    overviewBn: "পটাশিয়াম থেকে সোনা পর্যন্ত ১৪টি ধাতুর ক্রম এবং অত্যন্ত সক্রিয় ধাতু (Al, Na, Ca) তড়িৎ বিশ্লেষণে নিষ্কাশন।",
    overviewEn: "14-metal activity series ladder, highly reactive alkali/alkaline earth metals, and Hall-Héroult Bauxite smelting.",
    studyTipBn: "অ্যালুমিনিয়াম নিষ্কাশনে গলিত ক্রায়োলাইট (Na₃AlF₆) যোগ করা হয় বক্সাইটের গলনাঙ্ক ২০৫০°C থেকে ৯৫০°C এ নামিয়ে আনতে!",
    studyTipEn: "Molten cryolite (Na₃AlF₆) lowers Bauxite’s melting point drastically from 2050°C down to 950°C!",
    badgeText: "সক্রিয়তা সিরিজ ও তড়িৎ নিষ্কাশন",
  },
  4: {
    no: "০৪",
    titleBn: "সংকর ধাতু ও ক্ষয়রোধী বৈশিষ্ট্য ল্যাব",
    titleEn: "Alloys & Corrosion Resistance Lab",
    overviewBn: "ইস্পাত (Fe+C), স্টেইনলেস স্টিল (Fe+Cr+Ni), পিতল (Cu+Zn), ব্রোঞ্জ (Cu+Sn) এবং ডুরালুমিন।",
    overviewEn: "Steel, stainless steel with passive chromium oxide layer, brass, bronze, and duralumin.",
    studyTipBn: "স্টেইনলেস স্টিলে ১৮% ক্রোমিয়াম ও ৮% নিকেল থাকায় এর ওপর ক্রোমিয়াম অক্সাইডের অদৃশ্য প্রতিরক্ষামূলক স্তর মরিচা রোধ করে!",
    studyTipEn: "Stainless steel contains 18% Cr and 8% Ni forming a resilient chromium oxide film preventing rust!",
    badgeText: "সংকর ধাতু ও মরিচারোধী ইস্পাত",
  },
  5: {
    no: "০৫",
    titleBn: "সালফার ও স্পর্শ পদ্ধতিতে H₂SO₄ কারখানা",
    titleEn: "Sulfur & Contact Process H₂SO₄ Plant",
    overviewBn: "ফ্রাশ পদ্ধতিতে সালফার উত্তোলন, স্পর্শ পদ্ধতিতে সালফিউরিক এসিড উৎপাদন (V₂O₅ প্রভাবক) ও চিনির নিরুদন।",
    overviewEn: "Frasch sulfur extraction, Contact process H2SO4 synthesis using V2O5 catalyst, and sugar dehydration.",
    studyTipBn: "গাঢ় H₂SO₄ তীব্র নিরুদক; চিনির সাথে যোগ করলে পানি শোষণ করে কালো কার্বনের স্ফীতি তৈরি করে!",
    studyTipEn: "Concentrated sulfuric acid is a powerful dehydrating agent, turning white cane sugar into black carbon!",
    badgeText: "স্পর্শ পদ্ধতি ও সালফিউরিক এসিড",
  },
};

export function MineralResourcesMetalsGuidebook() {
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
        ? 'স্বাগতম খনিজ সম্পদ: ধাতু ও অধাতু ল্যাবে! আমি তোমার AI শিক্ষক। এই অধ্যায়ের যেকোনো ধারণা, বোর্ড প্রশ্ন বা সূত্র নিয়ে প্রশ্ন করতে পারো!'
        : 'Welcome to Mineral Resources: Metals & Non-metals Lab! I am your AI Chemistry Tutor. Ask me anything about this chapter, board questions, or formulas!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_10_LESSONS[activeLesson] || CHAPTER_10_LESSONS[1];
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
          chapter: '10 - খনিজ সম্পদ: ধাতু ও অধাতু (Mineral Resources: Metals & Non-metals)',
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
          { role: 'ai', text: isBn ? 'খনিজ থেকে সহজে ও লাভজনকভাবে ধাতু নিষ্কাশন করা যায় তাকে আকরিক বলে। সক্রিয় ধাতু তড়িৎ বিশ্লেষণে এবং মধ্যম সক্রিয় ধাতু কার্বন বিজারণে নিষ্কাশিত হয়।' : 'Here is the key scientific concept for this chapter.' },
        ]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ১০: খনিজ সম্পদ: ধাতু ও অধাতু (রিভিশন হ্যান্ডনোট)\n--------------------------------------------------\n১. গুরুত্বপূর্ণ আকরিক:\n   - বক্সাইট: Al₂O₃·2H₂O (অ্যালুমিনিয়াম)\n   - হেমাটাইট: Fe₂O₃ (লোহা)\n   - ক্যালামাইন: ZnCO₃ (জিংক)\n   - গ্যালেনা: PbS (সীসা)\n২. ধাতু নিষ্কাশন:\n   - অতি সক্রিয় ধাতু (K, Na, Ca, Mg, Al): তড়িৎ বিশ্লেষণ।\n   - মধ্যম সক্রিয় ধাতু (Zn, Fe, Pb): কার্বন বিজারণ।\n৩. সংকর ধাতু:\n   - স্টেইনলেস স্টিল: Fe (৭৪%), Cr (১৮%), Ni (৮%)\n   - পিতল (Brass): Cu (৬৫%), Zn (৩৫%)\n   - ব্রোঞ্জ (Bronze): Cu (৯০%), Sn (১০%)\n৪. স্পর্শ পদ্ধতি:\n   - 2SO₂ + O₂ ⇌ 2SO₃ (প্রভাবক: V₂O₅, তাপমাত্রা: ৪৫০°C)।`
      : `SSC Chemistry Chapter 10: Mineral Resources: Metals & Non-metals Revision Notes\n--------------------------------------------------\nSheraTutor Virtual Guidebook (SheraTutor.com)`;
    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1: Blast Furnace & Carbon Reduction Retort
  const [selectedOre, setSelectedOre] = useState<'calamine' | 'hematite' | 'bauxite'>('calamine');
  const [furnaceHeating, setFurnaceHeating] = useState<boolean>(false);
  const [reductionStep, setReductionStep] = useState<number>(0);

  // Simulator 2: Reactivity Series Metallurgy Navigator
  const [selectedMetal, setSelectedMetal] = useState<string>('zn');

  // Simulator 3: Alloy Blender & Corrosion Test
  const [selectedAlloyPreset, setSelectedAlloyPreset] = useState<'steel' | 'stainless' | 'brass' | 'bronze' | 'duralumin'>('stainless');
  const [rustSprayActive, setRustSprayActive] = useState<boolean>(false);
  const [rustState, setRustState] = useState<'clean' | 'rusted' | 'protected'>('protected');

  // Simulator 4: Contact Process Plant
  const [contactStep, setContactStep] = useState<number>(1);
  const [sugarCharred, setSugarCharred] = useState<boolean>(false);

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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-amber-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={10}
        chapterTitleBn="খনিজ সম্পদ: ধাতু ও অধাতু"
        chapterTitleEn="Mineral Resources: Metals & Non-metals"
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
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-amber-600 dark:text-amber-400" />
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
                  <span className="text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                    CHAPTER 10
                  </span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'খনিজ সম্পদ: ধাতু ও অধাতু' : 'Mineral Resources: Metals & Non-metals'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_10_LESSONS[lNum];
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
                          ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs'
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
                                ? 'border-amber-500 text-amber-600 dark:text-amber-400'
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
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300">
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
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় 10 (পৃষ্ঠা ২৩৪ - ২৬০) এর প্রতিটি সূত্র, বিক্রিয়া ও বোর্ডের নির্দেশিকা অনুমোদিত।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 10 (Printed pp. ২৩৪ - ২৬০) aligned with NCTB syllabus.'}
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
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-300 text-[11px] font-bold border border-amber-500/20">
                  <Hammer className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় 10 • পাঠ ${currentLessonMeta.no}` : `Chapter 10 • Lesson ${activeLesson}`}
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
                        ? 'bg-amber-600 text-white shadow-sm shadow-amber-600/30'
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
                {isBn ? 'অধ্যায় ১০: তাত্ত্বিক ভিত্তি' : 'Chapter 10: Theoretical Foundation'}
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                {isBn ? 'খনিজ সম্পদ: ধাতু-অধাতু ও ধাতু নিষ্কাশন' : 'Mineral Resources: Metals, Non-metals & Metallurgy'}
              </h1>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'খনিজ ও আকরিক, সক্রিয়তা সিরিজ অনুসারে ধাতু নিষ্কাশনের মূল ধাপসমূহ, সংকর ধাতু, মরিচা নিবারণ এবং স্পর্শ পদ্ধতিতে সালফিউরিক এসিড প্রস্তুত।'
                  : 'Minerals vs ores, reactivity-driven metallurgical extraction, industrial blast furnace, alloy compositions, and Contact process for sulfuric acid.'}
              </p>
            </div>

            {/* Concept Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Concept 1: খনিজ ও আকরিক */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <Boxes className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '১. খনিজ বনাম আকরিক' : '1. Minerals vs Ores'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? '"সকল আকরিকই খনিজ, কিন্তু সকল খনিজ আকরিক নয়"' : '"All ores are minerals, but not all minerals are ores"'}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isBn
                    ? 'মাটির নিচে বা ভূত্বকে প্রাকৃতিকভাবে সৃষ্ট অজৈব যৌগসমূহ খনিজ (Mineral)। যেসকল খনিজ থেকে সহজে ও লাভজনকভাবে ধাতু নিষ্কাশন করা যায়, তাদের আকরিক (Ore) বলে।'
                    : 'Naturally occurring inorganic compounds in the Earth crust are minerals. Minerals from which metals can be extracted profitably and easily are called ores.'}
                </p>
                <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs space-y-1">
                  <div className="font-semibold text-amber-800 dark:text-amber-300">
                    বোর্ড ক্লাসিক তুলনা (বক্সাইট বনাম কাদা):
                  </div>
                  <div>• <strong>বক্সাইট (Al₂O₃ · 2H₂O):</strong> অ্যালুমিনিয়ামের আকরিক (সহজে নিষ্কাশনযোগ্য)।</div>
                  <div>• <strong>কাদা (Al₂O₃ · 2SiO₂ · 2H₂O):</strong> অ্যালুমিনিয়ামের খনিজ, কিন্তু আকরিক নয়।</div>
                </div>
              </div>

              {/* Concept 2: ধাতু নিষ্কাশনের ৫ ধাপ */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
                    <Hammer className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '২. ধাতু নিষ্কাশনের ৫টি প্রধান ধাপ' : '2. 5 Metallurgy Extraction Steps'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'আকরিক থেকে বিশুদ্ধ ধাতুতে রূপান্তর' : 'Ore to 99.99% refined metal'}
                    </p>
                  </div>
                </div>
                <div className="text-xs space-y-2 font-mono text-slate-700 dark:text-slate-300">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>১. বিচূর্ণকরণ:</strong> Jaw crusher & Ball mill এ পাউডার তৈরি।
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>২. ঘনীকরণ:</strong> তেল ফেনা ভাসমান (Froth flotation for ZnS, PbS), চৌম্বকীয় বা রাসায়নিক পৃথকীকরণ।
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>৩. অক্সাইডে রূপান্তর:</strong> ভস্মীকরণ (বায়ুহীন, ZnCO₃) বনাম ভর্জন (বায়ুযুক্ত, 2ZnS + 3O₂)।
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>৪. মুক্ত ধাতুতে বিজারণ:</strong> কার্বন বিজারণ (ZnO + C → Zn + CO) বা তড়িৎ বিজারণ।
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <strong>৫. ধাতুর বিশোধন:</strong> তড়িৎ বিশ্লেষণ পদ্ধতিতে ৯৯.৯৯% বিশুদ্ধ ধাতু ক্যাথোড প্রাপ্তি।
                  </div>
                </div>
              </div>

              {/* Concept 3: সক্রিয়তা সিরিজ ও নিষ্কাশন পদ্ধতি */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৩. ধাতুর সক্রিয়তা ক্রম ও নিষ্কাশন নীতি' : '3. Reactivity Series & Extraction Rules'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'তড়িৎ বিজারণ বনাম কার্বন বিজারণ' : 'Electrolysis vs Carbon Reduction'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-mono space-y-2 border border-slate-200 dark:border-slate-700">
                  <div className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    • K, Na, Ca, Mg, Al (তীব্র সক্রিয়):
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    গলিত ক্লোরাইড বা অক্সাইডের তড়িৎ বিশ্লেষণ (গলিত NaCl → Na + Cl₂)।
                  </div>
                  <div className="text-blue-600 dark:text-blue-400 font-semibold pt-1">
                    • Zn, Fe, Sn, Pb (মধ্যম সক্রিয়):
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    কোক বা কার্বন দ্বারা বিজারণ (Fe₂O₃ + 3CO → 2Fe + 3CO₂)।
                  </div>
                  <div className="text-amber-600 dark:text-amber-400 font-semibold pt-1">
                    • Cu, Hg (নিম্ন সক্রিয়):
                  </div>
                  <div className="text-slate-600 dark:text-slate-300">
                    স্ব-বিজারণ বা হালকা ভর্জন (2HgO + HgS → 3Hg + SO₂)।
                  </div>
                </div>
              </div>

              {/* Concept 4: সংকর ধাতু ও মরিচা প্রতিরোধ */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-cyan-500/50 transition-all space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">
                      {isBn ? '৪. সংকর ধাতু ও মরিচা নিবারণ' : '4. Alloys & Rust Prevention'}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {isBn ? 'স্টিল, কাঁসা, পিতল ও গ্যালভানাইজিং' : 'Steel, bronze, brass & galvanizing'}
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-900/50 text-xs space-y-1.5">
                  <div className="font-semibold text-purple-800 dark:text-purple-300">
                    সংকর ধাতুর গঠন অনুপাত (বোর্ড স্ট্যান্ডার্ড):
                  </div>
                  <div>• <strong>স্টিল (Steel):</strong> Fe (৯৯%) + C (১%)</div>
                  <div>• <strong>স্টেইনলেস স্টিল:</strong> Fe (৭৪%) + Cr (১৮%) + Ni (৮%) [মরিচারোধী]</div>
                  <div>• <strong>পিতল (Brass):</strong> Cu (৬৫%) + Zn (৩৫%)</div>
                  <div>• <strong>কাঁসা (Bronze):</strong> Cu (৯০%) + Sn (১০%)</div>
                  <div>• <strong>ডুরালুমিন:</strong> Al (৯৫%) + Cu (৪%) + Mg (০.৫%) + Mn (০.৫%) [বিমানের বডি]</div>
                </div>
              </div>
            </div>

            {/* Earth Crust Elemental Distribution Banner */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                {isBn ? 'ভূত্বকের প্রধান উপাদানসমূহের শতকরা বণ্টন (পাঠ্যবই পৃষ্ঠা ২৩৫)' : 'Earth Crust Elemental Distribution (% by mass)'}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
                <div className="p-3 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-900/50">
                  <div className="font-bold text-cyan-700 dark:text-cyan-300">অক্সিজেন (O)</div>
                  <div className="text-lg font-black font-mono">৪৬.৬%</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-700 dark:text-slate-300">সিলিকন (Si)</div>
                  <div className="text-lg font-black font-mono">২৭.৭%</div>
                </div>
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50">
                  <div className="font-bold text-blue-700 dark:text-blue-300">অ্যালুমিনিয়াম (Al)</div>
                  <div className="text-lg font-black font-mono">৮.১%</div>
                </div>
                <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50">
                  <div className="font-bold text-amber-700 dark:text-amber-300">লোহা (Fe)</div>
                  <div className="text-lg font-black font-mono">৫.০%</div>
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
                {isBn ? 'বোর্ড স্ট্যান্ডার্ড উদাহরণ ও ধাতু নিষ্কাশন সমীকরণ' : 'Standard Metallurgy Chemical Solved Examples'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'ধাপ-ভিত্তিক ধাতু নিষ্কাশন ও শিল্প রসায়ন সমাধান' : 'Step-by-Step Metallurgy & Industrial Equations'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ঢাকা, রাজশাহী, দিনাজপুর ও চট্টগ্রাম বোর্ডে বিগত বছরগুলোতে আসা সবচেয়ে গুরুত্বপূর্ণ ৫টি সমাধান।'
                  : '5 authentic solved examples covering zinc retort extraction, blast furnace iron reduction, contact process oleum, and bauxite Bayer process.'}
              </p>
            </div>

            <div className="space-y-6">
              {/* Example 1: জিংক নিষ্কাশনের মূল বিক্রিয়া */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০১
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'ক্যালামাইন (ZnCO₃) থেকে জিংক নিষ্কাশনের ধারাবাহিক সমীকরণ' : 'Extraction of Zinc from Calamine (ZnCO₃)'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৬৫, ঢাকা বোর্ড ২০২৩' : 'Textbook Page 265 CQ'}
                  </span>
                </div>

                <div className="text-sm space-y-3">
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-3 text-xs md:text-sm">
                    <div>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        ধাপ ১: ভস্মীকরণ (বায়ুহীন উত্তাপ):
                      </span>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono my-1">
                        <RenderMathText text="\text{ZnCO}_3(\text{s}) \xrightarrow{\Delta} \text{ZnO}(\text{s}) + \text{CO}_2(\text{g})\uparrow" />
                      </div>
                    </div>
                    <div>
                      <span className="font-semibold text-cyan-600 dark:text-cyan-400">
                        ধাপ ২: রিটর্টে কোক (C) দ্বারা কার্বন বিজারণ:
                      </span>
                      <div className="p-2 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 text-center font-mono my-1">
                        <RenderMathText text="\text{ZnO}(\text{s}) + \text{C}(\text{s}) \xrightarrow{1400^\circ\text{C}} \text{Zn}(\text{g})\uparrow + \text{CO}(\text{g})\uparrow" />
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 text-xs">
                        জিংক বাষ্পীভূত হয়ে কনডেন্সারে গিয়ে তরল ও পরে কঠিন জিংক ধাতুতে জমা হয়।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Example 2: স্পর্শ পদ্ধতিতে H2SO4 ও ওলিয়াম */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০২
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'স্পর্শ পদ্ধতিতে সালফিউরিক এসিড উৎপাদনের মূল ৪টি সমীকরণ' : 'Contact Process 4-Stage Reactions for H₂SO₄'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'রাজশাহী বোর্ড ২০২২, চট্টগ্রাম ২০২০' : 'Rajshahi Board 2022'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm font-mono">
                  <div>১. সালফার দহন: S + O₂ → SO₂</div>
                  <div>২. অনুঘটকীয় জারণ (V₂O₅, ৪৫০°C): 2SO₂ + O₂ ⇌ 2SO₃ (ΔH = -197 kJ)</div>
                  <div>৩. ওলিয়াম উৎপাদন: SO₃ + H₂SO₄(৯৮%) → H₂S₂O₇ (ধূমায়মান সালফিউরিক এসিড)</div>
                  <div>৪. পরিমিত পানি যোগে লঘুকরণ: H₂S₂O₇ + H₂O → 2H₂SO₄</div>
                </div>
              </div>

              {/* Example 3: ব্লাস্ট ফার্নেসে লোহা নিষ্কাশন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৩
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'ব্লাস্ট ফার্নেসে হেমাটাইট (Fe₂O₃) থেকে লোহা বিজারণ ও ধাতুমল অপসারণ' : 'Blast Furnace Iron Reduction & Slag Formation'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'দিনাজপুর বোর্ড ২০২২, কুমিল্লা ২০২১' : 'Dinajpur Board 2022'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p className="font-semibold text-cyan-600 dark:text-cyan-400 font-mono">
                    (ক) কার্বন মনোক্সাইড দ্বারা মূল বিজারণ:
                  </p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="\text{Fe}_2\text{O}_3(\text{s}) + 3\text{CO}(\text{g}) \rightarrow 2\text{Fe}(\text{l}) + 3\text{CO}_2(\text{g})" />
                  </div>
                  <p className="font-semibold text-cyan-600 dark:text-cyan-400 font-mono pt-2">
                    (খ) সিলিকা অপদ্রব্য দূরীকরণে ধাতুমল (Slag) গঠন:
                  </p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="\text{CaO}(\text{s}) + \text{SiO}_2(\text{s}) \rightarrow \text{CaSiO}_3(\text{l}) \text{ (ধাতুমল)}" />
                  </div>
                </div>
              </div>

              {/* Example 4: ফ্রাশ পদ্ধতিতে সালফার উত্তোলন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৪
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'ফ্রাশ পদ্ধতিতে ৩টি সমকেন্দ্রিক নলের কাজ' : 'Frasch Process 3-Concentric Pipes'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'পাঠ্যবই পৃষ্ঠা ২৫৫, ময়মনসিংহ বোর্ড ২০২৩' : 'Textbook Page 255'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-1.5 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                  <div>• <strong>বাইরের নল:</strong> ১৭০°C তাপমাত্রার অতিউত্তপ্ত জলীয় বাষ্প প্রবেশ করিয়ে ভূগর্ভস্থ সালফার গলানো হয়।</div>
                  <div>• <strong>ভেতরের কেন্দ্রস্থ নল:</strong> উচ্চচাপের গরম বাতাস প্রবেশ করানো হয় যা গলিত সালফারকে ফেনায়িত করে।</div>
                  <div>• <strong>মাঝখানের মধ্যবর্তী নল:</strong> হালকা ফেনায়িত তরল সালফার ভূ-পৃষ্ঠে উঠে আসে।</div>
                </div>
              </div>

              {/* Example 5: চিনির উপর গাঢ় H2SO4 এর নিরুদন */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-cyan-500 text-white font-bold text-xs flex items-center justify-center">
                      ০৫
                    </span>
                    <h3 className="font-bold text-base">
                      {isBn ? 'চিনির নিরুদন ও কালো কার্বন স্তম্ভ সৃষ্টি' : 'Sugar Dehydration by Concentrated H₂SO₄'}
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    {isBn ? 'বরিশাল বোর্ড ২০২২' : 'Barishal Board 2022'}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs md:text-sm">
                  <p>গাঢ় সালফিউরিক এসিড একটি তীব্র নিরুদক পদার্থ হওয়ায় সুক্রোজ (চিনি) থেকে পানি শোষণ করে কালো কার্বনে পরিণত করে:</p>
                  <div className="p-2 bg-white dark:bg-slate-900 rounded font-mono text-center text-xs">
                    <RenderMathText text="\text{C}_{12}\text{H}_{22}\text{O}_{11}(\text{s}) \xrightarrow{\text{conc. } \text{H}_2\text{SO}_4} 12\text{C}(\text{s}) \text{ (কালো কার্বন)} + 11\text{H}_2\text{O}(\text{g})\uparrow" />
                  </div>
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
                {isBn ? 'হাতে-কলমে খনিজ ও ধাতু ল্যাব' : 'Interactive Metallurgy & Mineral Labs'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? '৪টি ভার্চুয়াল নিষ্কাশন ও শিল্প রাসায়নিক চেম্বার' : '4 Virtual Extraction & Industrial Chambers'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'ব্লাস্ট ফার্নেস ও রিটর্ট কার্বন বিজারণ, সক্রিয়তা ক্রম নেভিগেটর, সংকর ধাতু ব্লেন্ডার ও মরিচা পরীক্ষা এবং স্পর্শ পদ্ধতি সালফিউরিক এসিড প্লান্ট।'
                  : 'Blast furnace carbon reduction, reactivity series navigator, alloy blender & corrosion lab, and Contact process H₂SO₄ simulator.'}
              </p>
            </div>

            {/* =========================================================================
                SIMULATOR 1: BLAST FURNACE & RETORT CARBON REDUCTION
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-cyan-600 text-white font-bold text-xs">ল্যাব ০১</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'ধাতু নিষ্কাশন ব্লাস্ট ফার্নেস ও রিটর্ট চেম্বার' : 'Blast Furnace & Carbon Reduction Retort'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'ক্যালামাইন (Zn), হেমাটাইট (Fe) অথবা বক্সাইট (Al) নির্বাচন করে বিজারণ প্রক্রিয়া ও তাপমাত্রা স্তর পর্যবেক্ষণ করুন।'
                      : 'Choose Calamine (Zn), Hematite (Fe), or Bauxite (Al) to observe reduction temperature zones and metal tapping.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setFurnaceHeating(false);
                    setReductionStep(0);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Ore Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => {
                    setSelectedOre('calamine');
                    setFurnaceHeating(false);
                    setReductionStep(0);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedOre === 'calamine'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">আকরিক ক</div>
                  <div className="text-sm font-bold">ক্যালামাইন (ZnCO₃) রিটর্ট</div>
                  <div className="text-[11px] text-slate-400">কার্বন বিজারণ (১৪০০°C)</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedOre('hematite');
                    setFurnaceHeating(false);
                    setReductionStep(0);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedOre === 'hematite'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">আকরিক খ</div>
                  <div className="text-sm font-bold">হেমাটাইট (Fe₂O₃) ফার্নেস</div>
                  <div className="text-[11px] text-slate-400">CO গ্যাস বিজারণ + ধাতুমল</div>
                </button>

                <button
                  onClick={() => {
                    setSelectedOre('bauxite');
                    setFurnaceHeating(false);
                    setReductionStep(0);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    selectedOre === 'bauxite'
                      ? 'bg-cyan-500/10 border-cyan-500 text-cyan-700 dark:text-cyan-300 font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  <div className="text-xs uppercase font-mono">আকরিক গ</div>
                  <div className="text-sm font-bold">বক্সাইট (Al₂O₃) সেল</div>
                  <div className="text-[11px] text-slate-400">গলিত তড়িৎ বিশ্লেষণ (হল-হেরল্ট)</div>
                </button>
              </div>

              {/* Visual Furnace Chamber */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Visual Furnace Tower */}
                <div className="w-52 h-72 relative bg-slate-200/90 dark:bg-slate-900 rounded-3xl border-4 border-slate-400 dark:border-slate-700 flex flex-col justify-between items-center p-3 shadow-2xl overflow-hidden">
                  {/* Top Feed */}
                  <div className="w-full text-center border-b border-slate-300 dark:border-slate-800 pb-1">
                    <span className="text-[10px] font-mono text-slate-500 font-bold">আকরিক + কোক চার্জিং মুখ</span>
                  </div>

                  {/* Heated Zone */}
                  <div
                    className={`w-full h-36 rounded-2xl transition-all duration-700 flex flex-col items-center justify-center p-2 text-center ${
                      furnaceHeating
                        ? 'bg-gradient-to-t from-red-600 via-orange-500 to-amber-400 text-white animate-pulse shadow-lg'
                        : 'bg-slate-300 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Flame className={`w-8 h-8 ${furnaceHeating ? 'text-yellow-200 animate-bounce' : 'opacity-30'}`} />
                    <span className="text-xs font-black mt-1">
                      {furnaceHeating
                        ? selectedOre === 'calamine'
                          ? '১৪০০°C বিজারণ জোন'
                          : selectedOre === 'hematite'
                          ? '১৬০০°C গলিত ফার্নেস'
                          : '৯৫০০°C তড়িৎ সেল'
                        : 'কক্ষ তাপমাত্রা (২৫°C)'}
                    </span>
                  </div>

                  {/* Molten Metal Tapping Port at Bottom */}
                  <div className="w-full text-center border-t border-slate-300 dark:border-slate-800 pt-1">
                    <div
                      className={`h-6 rounded-lg text-[10px] font-mono flex items-center justify-center font-bold transition-all ${
                        reductionStep >= 2
                          ? 'bg-amber-400 text-slate-900 shadow-md animate-pulse'
                          : 'bg-slate-300 dark:bg-slate-800 text-slate-500'
                      }`}
                    >
                      {reductionStep >= 2
                        ? selectedOre === 'calamine'
                          ? 'গলিত Zn ধাতু আহরণ'
                          : selectedOre === 'hematite'
                          ? 'গলিত কাস্ট আয়রন (Fe)'
                          : 'গলিত বিশুদ্ধ Al ধাতু'
                        : 'ধাতু নির্গমন মুখ (বন্ধ)'}
                    </div>
                  </div>
                </div>

                {/* Step Controls & Equation Box */}
                <div className="space-y-4 max-w-md w-full">
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        setFurnaceHeating(true);
                        setReductionStep(1);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Flame className="w-4 h-4" />
                      {isBn ? '১. ফার্নেস উত্তপ্ত করো ও অক্সাইডে রূপান্তর' : '1. Heat Furnace & Convert to Oxide'}
                    </button>

                    <button
                      onClick={() => setReductionStep(2)}
                      disabled={!furnaceHeating}
                      className="w-full px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center gap-2 transition"
                    >
                      <Zap className="w-4 h-4" />
                      {isBn ? '২. কোক দ্বারা কার্বন বিজারণ ঘটাও' : '2. Trigger Carbon / Electrolytic Reduction'}
                    </button>
                  </div>

                  {/* Reaction Equations Display */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-2">
                    <div className="text-cyan-600 dark:text-cyan-400 font-bold">সংঘটিত মূল বিক্রিয়াসমূহ:</div>
                    {selectedOre === 'calamine' && (
                      <>
                        <div>• ভস্মীকরণ: ZnCO₃ → ZnO + CO₂↑</div>
                        <div>• রিটর্ট বিজারণ: ZnO + C → Zn(g)↑ + CO↑ (১৪০০°C)</div>
                      </>
                    )}
                    {selectedOre === 'hematite' && (
                      <>
                        <div>• ব্লাস্ট বিজারণ: Fe₂O₃ + 3CO → 2Fe + 3CO₂↑</div>
                        <div>• ধাতুমল গঠন: CaO + SiO₂ → CaSiO₃ (স্ল্যাগ)</div>
                      </>
                    )}
                    {selectedOre === 'bauxite' && (
                      <>
                        <div>• অ্যালুমিনাকে কার্বন বিজারিত করতে পারে না!</div>
                        <div>• গলিত তড়িৎ বিশ্লেষণ: 2Al₂O₃ → 4Al (ক্যাথোড) + 3O₂ (অ্যানোড)</div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 2: REACTIVITY SERIES METALLURGY NAVIGATOR
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-emerald-600 text-white font-bold text-xs">ল্যাব ০২</span>
                  <h3 className="text-xl font-bold">
                    {isBn ? 'ধাতুর সক্রিয়তা ক্রম ও নিষ্কাশন প্রযুক্তি নেভিগেটর' : 'Reactivity Series Metallurgy Navigator'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isBn
                    ? 'মৌল নির্বাচন করে এর প্রাকৃতিক আকরিক, সক্রিয়তা মাত্রা ও উপযুক্ত নিষ্কাশন পদ্ধতি জানুন।'
                    : 'Tap elements along the reactivity ladder to examine extraction mechanics.'}
                </p>
              </div>

              {/* Reactivity Buttons Ladder */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'k', name: 'K', type: 'তীব্র সক্রিয়' },
                  { id: 'na', name: 'Na', type: 'তীব্র সক্রিয়' },
                  { id: 'ca', name: 'Ca', type: 'তীব্র সক্রিয়' },
                  { id: 'mg', name: 'Mg', type: 'তীব্র সক্রিয়' },
                  { id: 'al', name: 'Al', type: 'তীব্র সক্রিয়' },
                  { id: 'zn', name: 'Zn', type: 'মধ্যম সক্রিয়' },
                  { id: 'fe', name: 'Fe', type: 'মধ্যম সক্রিয়' },
                  { id: 'pb', name: 'Pb', type: 'মধ্যম সক্রিয়' },
                  { id: 'cu', name: 'Cu', type: 'নিম্ন সক্রিয়' },
                  { id: 'ag', name: 'Ag', type: 'নিষ্ক্রিয়' },
                  { id: 'au', name: 'Au', type: 'মুক্ত ধাতু' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedMetal(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedMetal === item.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500'
                    }`}
                  >
                    {item.name} ({item.type})
                  </button>
                ))}
              </div>

              {/* Selected Metal Metallurgy Card */}
              <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                {selectedMetal === 'k' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      পটাশিয়াম (K) - তীব্র ধনাত্মক ধাতু
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • <strong>নিষ্কাশন প্রযুক্তি:</strong> গলিত KCl এর তড়িৎ বিশ্লেষণ।<br />
                      • <strong>কারণ:</strong> অক্সিজেনের প্রতি তীব্র আকর্ষণের কারণে কোনো রাসায়নিক বিজারক একে মুক্ত করতে পারে না।
                    </p>
                  </div>
                )}
                {selectedMetal === 'na' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      সোডিয়াম (Na) - রক সল্ট (NaCl)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • <strong>নিষ্কাশন প্রযুক্তি:</strong> ডাউনস পদ্ধতিতে গলিত NaCl এর তড়িৎ বিশ্লেষণ (ক্যাথোডে Na ধাতু জমা হয়, অ্যানোডে Cl₂ গ্যাস নির্গত হয়)।
                    </p>
                  </div>
                )}
                {selectedMetal === 'al' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      অ্যালুমিনিয়াম (Al) - বক্সাইট (Al₂O₃ · 2H₂O)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • <strong>নিষ্কাশন প্রযুক্তি:</strong> হল-হেরল্ট পদ্ধতিতে ক্রায়োলাইট (Na₃AlF₆) সহযোগে গলিত Al₂O₃ এর তড়িৎ বিশ্লেষণ। ক্রায়োলাইট বক্সাইটের গলনাঙ্ক ২০৫০°C থেকে কমিয়ে প্রায় ৯৫০°C এ নামিয়ে আনে।
                    </p>
                  </div>
                )}
                {selectedMetal === 'zn' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      জিংক (Zn) - ক্যালামাইন (ZnCO₃) ও জিংক ব্লেন্ড (ZnS)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • <strong>নিষ্কাশন প্রযুক্তি:</strong> কার্বন বিজারণ পদ্ধতি (কোক সহযোগে ১৪০০°C তাপমাত্রায় রিটর্টে উত্তপ্তকরণ)।
                    </p>
                  </div>
                )}
                {selectedMetal === 'fe' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      আয়রন (Fe) - হেমাটাইট (Fe₂O₃)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • <strong>নিষ্কাশন প্রযুক্তি:</strong> ব্লাস্ট ফার্নেসে কোক ও চুনাপাথর সহযোগে CO গ্যাস দ্বারা বিজারণ।
                    </p>
                  </div>
                )}
                {selectedMetal === 'cu' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      কপার (Cu) - চ্যালকোসাইট (Cu₂S) ও কপার পাইরাইটস
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • <strong>নিষ্কাশন প্রযুক্তি:</strong> স্ব-বিজারণ বা মৃদু ভর্জন পদ্ধতি (2Cu₂O + Cu₂S → 6Cu + SO₂)। তড়িৎ বিশোধনে অ্যানোড মাড হিসেবে সোনা ও রূপা পাওয়া যায়।
                    </p>
                  </div>
                )}
                {selectedMetal === 'au' && (
                  <div>
                    <h4 className="font-bold text-base text-emerald-900 dark:text-emerald-300">
                      সোনা (Au) - মুক্ত অভিজাত ধাতু (Noble Native Metal)
                    </h4>
                    <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 mt-1">
                      • সক্রিয়তা সিরিজের সর্বনিম্নে অবস্থান করায় এটি বাতাস বা পানির সাথে কখনোই বিক্রিয়া করে না। প্রকৃতিতে নদীর বালুকণা বা শিলায় মুক্ত সোনা হিসেবেই পাওয়া যায়।
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 3: ALLOY BLENDER & RUST DEFENSE LAB
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-purple-600 text-white font-bold text-xs">ল্যাব ০৩</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'সংকর ধাতু ব্লেন্ডার ও মরিচা প্রতিরোধ ল্যাব' : 'Alloy Blender & Rust Defense Chamber'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'সংকর ধাতু তৈরি করুন এবং আর্দ্র বায়ুতে রেখে মরিচা প্রতিরোধী ক্ষমতা পরীক্ষা করুন।'
                      : 'Blend metal compositions and test corrosion resistance in humid air.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setRustSprayActive(false);
                    setRustState(selectedAlloyPreset === 'steel' ? 'rusted' : 'protected');
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Alloy Presets */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'steel', name: 'সাধারণ স্টিল (Steel)', desc: 'Fe 99% + C 1%' },
                  { id: 'stainless', name: 'স্টেইনলেস স্টিল', desc: 'Fe 74% + Cr 18% + Ni 8%' },
                  { id: 'brass', name: 'পিতল (Brass)', desc: 'Cu 65% + Zn 35%' },
                  { id: 'bronze', name: 'কাঁসা (Bronze)', desc: 'Cu 90% + Sn 10%' },
                  { id: 'duralumin', name: 'ডুরালুমিন', desc: 'Al 95% + Cu 4% + Mg/Mn 1%' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedAlloyPreset(item.id as any);
                      setRustSprayActive(false);
                      setRustState(item.id === 'steel' ? 'clean' : 'protected');
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedAlloyPreset === item.id
                        ? 'bg-purple-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-500'
                    }`}
                  >
                    {item.name} ({item.desc})
                  </button>
                ))}
              </div>

              {/* Visual Corrosion Chamber */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Visual Metal Ingot Sample */}
                <div className="w-56 h-40 relative bg-slate-200 dark:bg-slate-900 rounded-2xl border-4 border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center p-4 shadow-inner overflow-hidden">
                  {/* Metal Bar Texture */}
                  <div
                    className={`w-full h-20 rounded-xl transition-all duration-700 flex items-center justify-center font-bold text-xs shadow-md ${
                      rustState === 'rusted'
                        ? 'bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-amber-200 border-2 border-amber-600'
                        : 'bg-gradient-to-r from-slate-300 via-slate-100 to-slate-400 text-slate-800 border-2 border-slate-200'
                    }`}
                  >
                    {rustState === 'rusted' ? 'বাদামি ভঙ্গুর মরিচা (Fe₂O₃·nH₂O)' : 'চকচকে নিষ্ক্রিয় ধাতব পৃষ্ঠ'}
                  </div>

                  <span className="text-[10px] font-mono text-slate-400 mt-2">
                    {selectedAlloyPreset === 'steel'
                      ? 'Fe (৯৯%) + C (১%)'
                      : selectedAlloyPreset === 'stainless'
                      ? 'Cr ও Ni এর প্রতিরক্ষামূলক অক্সাইড স্তর'
                      : 'অ-লৌহঘটিত সংকর ধাতু'}
                  </span>
                </div>

                {/* Weather Spray & Outcome */}
                <div className="space-y-4 max-w-sm w-full">
                  <button
                    onClick={() => {
                      setRustSprayActive(true);
                      if (selectedAlloyPreset === 'steel') {
                        setRustState('rusted');
                      } else {
                        setRustState('protected');
                      }
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                  >
                    <Flame className="w-4 h-4" />
                    {isBn ? 'আর্দ্র বাতাস ও পানির স্প্রে পরীক্ষা চালান' : 'Trigger Wet Air & Oxygen Exposure'}
                  </button>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs space-y-1">
                    <span className="font-semibold text-purple-600 dark:text-purple-400">পরীক্ষার সিদ্ধান্ত:</span>
                    {selectedAlloyPreset === 'steel' ? (
                      <p className="text-slate-600 dark:text-slate-300">
                        সাধারণ স্টিলে ক্রোমিয়াম না থাকায় পানি ও অক্সিজেনের সংস্পর্শে লোহা জারিত হয়ে দ্রুত বাদামি রঙের ভঙ্গুর মরিচা (Fe₂O₃ · nH₂O) গঠন করে।
                      </p>
                    ) : (
                      <p className="text-emerald-600 dark:text-emerald-400">
                        {selectedAlloyPreset === 'stainless'
                          ? 'স্টেইনলেস স্টিলে থাকা ১৮% ক্রোমিয়াম বাতাসের অক্সিজেনের সাথে বিক্রিয়া করে ধাতুর উপরে একটি অদৃশ্য, অত্যন্ত পাতলা ও দৃঢ় Cr₂O₃ অক্সাইড স্তর তৈরি করে যা মরিচা রোধ করে।'
                          : 'এই সংকর ধাতুতে কোনো লোহা না থাকায় বা প্রতিরক্ষামূলক পৃষ্ঠ থাকায় এটি কখনোই মরিচা ধরে না।'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* =========================================================================
                SIMULATOR 4: CONTACT PROCESS & SUGAR CHAR LAB
               ========================================================================= */}
            <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white font-bold text-xs">ল্যাব ০৪</span>
                    <h3 className="text-xl font-bold">
                      {isBn ? 'স্পর্শ পদ্ধতিতে সালফিউরিক এসিড ও চিনির নিরুদন' : 'Contact Process Plant & Sugar Dehydration Lab'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {isBn
                      ? 'স্পর্শ পদ্ধতিতে ওলিয়াম ও H₂SO₄ উৎপাদন করুন এবং চিনির উপর গাঢ় এসিড ফেলে নিরুদন ধর্ম পরীক্ষা করুন।'
                      : 'Synthesize Oleum via Contact Process and demonstrate sugar dehydration into carbon foam.'}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setContactStep(1);
                    setSugarCharred(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </button>
              </div>

              {/* Plant Step Progress */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-xs font-bold">
                <div
                  className={`p-3 rounded-xl border transition ${
                    contactStep >= 1 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  ধাপ ১: সালফার দহন (SO₂)
                </div>
                <div
                  className={`p-3 rounded-xl border transition ${
                    contactStep >= 2 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  ধাপ ২: V₂O₅ অনুঘটক (SO₃)
                </div>
                <div
                  className={`p-3 rounded-xl border transition ${
                    contactStep >= 3 ? 'bg-blue-600 text-white border-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  ধাপ ৩: ওলিয়াম (H₂S₂O₇)
                </div>
                <div
                  className={`p-3 rounded-xl border transition ${
                    contactStep >= 4 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  ধাপ ৪: ৯৮% বিশুদ্ধ H₂SO₄
                </div>
              </div>

              {/* Sugar Dehydration Chamber */}
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex flex-col md:flex-row items-center justify-around gap-6">
                {/* Visual Beaker with Sugar Column */}
                <div className="w-48 h-60 relative bg-slate-200 dark:bg-slate-900 rounded-b-3xl border-4 border-slate-300 dark:border-slate-700 flex flex-col justify-end items-center p-3 shadow-inner overflow-hidden">
                  <div
                    className={`w-full transition-all duration-1000 rounded-b-2xl flex flex-col items-center justify-end ${
                      sugarCharred
                        ? 'h-48 bg-slate-950 text-slate-100 border-2 border-slate-800 shadow-2xl animate-pulse'
                        : 'h-16 bg-white text-slate-800 border border-slate-200'
                    }`}
                  >
                    <span className="text-[10px] font-bold p-1 text-center">
                      {sugarCharred ? 'কালো কার্বনের স্তম্ভ (১২C) + বাষ্প' : 'সাদা চিনির কিউব (সুক্রোজ)'}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 max-w-sm w-full">
                  <div className="space-y-2">
                    <button
                      onClick={() => setContactStep((prev) => Math.min(4, prev + 1))}
                      className="w-full px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <Factory className="w-4 h-4" />
                      {isBn ? 'পরবর্তী উৎপাদন ধাপে অগ্রসর হও' : 'Advance Contact Process Step'}
                    </button>

                    <button
                      onClick={() => setSugarCharred(true)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition shadow"
                    >
                      <Beaker className="w-4 h-4" />
                      {isBn ? 'চিনিতে গাঢ় H₂SO₄ ঢালো (নিরুদন টেস্ট)' : 'Pour Conc. H₂SO₄ onto Sugar (Dehydration)'}
                    </button>
                  </div>

                  <div className="p-3.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-mono space-y-1">
                    <div className="text-blue-600 dark:text-blue-400 font-bold">নিরুদন সমীকরণ:</div>
                    <div>C₁₂H₂₂O₁₁(s) → 12C(s) [কালো কাঠকয়লা] + 11H₂O(g)↑</div>
                  </div>
                </div>
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
                  ? 'ঢাকা, রাজশাহী, চট্টগ্রাম ও দিনাজপুর বোর্ডের প্রশ্নাবলী এবং এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৬৫ এর মূল সৃজনশীল সমাধান।'
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
                  <RotateCcw className="w-3 h-3" />
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
                      ? 'ক্যালামাইনের তাপজারণ ও জিংক আহরণ সম্পর্কিত সৃজনশীল প্রশ্ন'
                      : 'Creative Question: Zinc Metallurgy from Calamine'}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {isBn ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ২৬৫ এর মূল বোর্ড সৃজনশীল' : 'Textbook Page 265 Official Model CQ'}
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
                  ক্যালামাইনের ভস্মীকরণে উৎপন্ন ধাতব অক্সাইড ZnO কে কোক (C) সহ রিটর্টে নিয়ে উচ্চ তাপমাত্রায় জিংক ধাতু আহরণ করা হয়। উৎপন্ন অশুদ্ধ ধাতুকে পরবর্তীতে তড়িৎ বিশ্লেষণের সাহায্যে ৯৯.৯৯% বিশুদ্ধ জিংকে রূপান্তর করা হয়।
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
                      (ক) ক্যালামাইনের রাসায়নিক সংকেত লেখো। <span className="text-xs text-slate-400 ml-2">[১ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ka ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ka && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>ক্যালামাইনের রাসায়নিক সংকেত হলো ZnCO₃ (জিংক কার্বনেট)।</p>
                    </div>
                  )}
                </div>

                <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                  <button
                    onClick={() => toggleCqPart('kha')}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 flex items-center justify-between text-left transition"
                  >
                    <span className="font-bold text-sm">
                      (খ) ভস্মীকরণ (Calcination) ও ভর্জনের (Roasting) পার্থক্য ব্যাখ্যা করো। <span className="text-xs text-slate-400 ml-2">[২ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.kha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.kha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-1.5">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        • <strong>ভস্মীকরণ (Calcination):</strong> বায়ুর অনুপস্থিতিতে আকরিককে তার গলনাঙ্কের নিচে উত্তপ্ত করে আর্দ্রতা ও CO₂ দূর করে অক্সাইডে রূপান্তর করা হয় (যেমন: কার্বনেট আকরিক ZnCO₃ → ZnO + CO₂)।<br />
                        • <strong>ভর্জন (Roasting):</strong> বায়ুর উপস্থিতিতে বা অতিরিক্ত বাতাসে সালফাইড আকরিককে উত্তপ্ত করে SO₂ দূর করার মাধ্যমে অক্সাইডে রূপান্তর করা হয় (যেমন: 2ZnS + 3O₂ → 2ZnO + 2SO₂)।
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
                      (গ) উদ্দীপকের রিটর্টে সংঘটিত মূল বিজারণ বিক্রিয়াটি ব্যাখ্যা করো। <span className="text-xs text-slate-400 ml-2">[৩ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.ga ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.ga && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        উদ্দীপকে ক্যালামাইনের ভস্মীকরণে প্রাপ্ত জিংক অক্সাইডকে (ZnO) রিটর্টের মধ্যে কোক গুঁড়ার (C) সাথে মিশিয়ে প্রায় ১৪০০°C তাপমাত্রায় উত্তপ্ত করা হয়। এই তাপমাত্রায় কার্বন বিজারক হিসেবে কাজ করে জিংক অক্সাইড থেকে অক্সিজেন কেড়ে নেয়:
                      </p>
                      <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded font-mono text-center text-xs">
                        ZnO(s) + C(s) → Zn(g)↑ + CO(g)↑
                      </div>
                      <p>
                        জিংকের স্ফুটনাঙ্ক ৯০৭°C হওয়ায় উৎপন্ন জিংক বাষ্প হিসেবে রিটর্ট থেকে নির্গত হয়ে কনডেন্সারে যায় এবং শীতল হয়ে তরল ও পরে কঠিন জিংক হিসেবে জমা হয়।
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
                      (ঘ) উদ্দীপকের ধাতু কেবল সরাসরি তড়িৎ বিশ্লেষণে নিষ্কাশন না করে তিন ধাপে করার কারণ মূল্যায়ন করো। <span className="text-xs text-slate-400 ml-2">[৪ নম্বর]</span>
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform ${openCqParts.gha ? 'rotate-180' : ''}`}
                    />
                  </button>
                  {openCqParts.gha && (
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 text-xs md:text-sm text-slate-700 dark:text-slate-300 space-y-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">আদর্শ উত্তর:</span>
                      <p>
                        ১. <strong>অর্থনৈতিক লাভজনকতা:</strong> সক্রিয়তা সিরিজে তীব্র সক্রিয় ধাতুগুলোর (K, Na, Al) মতো জিংক তীব্র ধনাত্মক নয়, বরং মধ্যম সক্রিয়। এদের আকরিক সরাসরি গলিয়ে তড়িৎ বিশ্লেষণ করতে বিপুল পরিমাণ বিদ্যুৎ শক্তি ও ব্যয়ের প্রয়োজন হয়।<br />
                        ২. <strong>কার্বনের বিজারণ ক্ষমতা:</strong> জিংক সক্রিয়তা সিরিজে কার্বনের (C) নিচে অবস্থান করায় সস্তা কয়লা বা কোক ব্যবহার করে সহজে এবং অত্যন্ত কম খরচে রিটর্টে ZnO কে ধাতুতে বিজারিত করা সম্ভব।<br />
                        ৩. <strong>বিশুদ্ধতা বৃদ্ধি:</strong> কার্বন বিজারণে প্রাপ্ত জিংকে সামান্য অপদ্রব্য থাকে, যা পরবর্তীতে স্বল্প খরচে তড়িৎ বিশোধনের মাধ্যমে ৯৯.৯৯% খাঁটি রূপান্তর করা হয়। সুতরাং সার্বিক খরচ ও ব্যবহারিক বাস্তবতার বিবেচনায় তিন ধাপে নিষ্কাশন করাই যুক্তিযুক্ত।
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
                {isBn ? 'অধ্যায় ১০ সারসংক্ষেপ' : 'Chapter 10 Revision Summary'}
              </span>
              <h2 className="text-3xl font-extrabold">
                {isBn ? 'পরীক্ষার আগের রাতের রিভিশন চিটশিট' : 'Exam Revision & Formula Cheat Sheet'}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {isBn
                  ? 'গুরুত্বপূর্ণ সংকর ধাতু, আকরিকের নাম এবং নিষ্কাশন প্রযুক্তির এক নজরে সারসংক্ষেপ।'
                  : 'Key alloys composition, mineral ores formulas, and metallurgy steps at a glance.'}
              </p>
            <div className="pt-2 flex justify-center">
              <button
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-2"
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
                  <Boxes className="w-4 h-4" />
                  <span>প্রধান প্রধান আকরিকের সংকেত</span>
                </div>
                <div className="text-xs space-y-1.5 font-mono text-slate-700 dark:text-slate-300">
                  <div>• বক্সাইট: Al₂O₃ · 2H₂O</div>
                  <div>• হেমাটাইট: Fe₂O₃</div>
                  <div>• ম্যাগনেটাইট: Fe₃O₄</div>
                  <div>• ক্যালামাইন: ZnCO₃</div>
                  <div>• জিংক ব্লেন্ড: ZnS</div>
                  <div>• গ্যালেনা: PbS</div>
                  <div>• সিন্নাবার: HgS</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-sm">
                  <ShieldCheck className="w-4 h-4" />
                  <span>সংকর ধাতু শতকরা সংযুতি</span>
                </div>
                <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <div>• <strong>পিতল:</strong> Cu (৬৫%) + Zn (৩৫%)</div>
                  <div>• <strong>কাঁসা:</strong> Cu (৯০%) + Sn (১০%)</div>
                  <div>• <strong>স্টিল:</strong> Fe (৯৯%) + C (১%)</div>
                  <div>• <strong>স্টেইনলেস:</strong> Fe (৭৪%) + Cr (১৮%) + Ni (৮%)</div>
                  <div>• <strong>ডুরালুমিন:</strong> Al (৯৫%) + Cu (৪%) + Mg (০.৫%) + Mn (০.৫%)</div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm">
                  <Factory className="w-4 h-4" />
                  <span>স্পর্শ পদ্ধতিতে H₂SO₄ মূল বিক্রিয়া</span>
                </div>
                <div className="text-xs space-y-1 font-mono text-slate-700 dark:text-slate-300">
                  <div>• S + O₂ → SO₂</div>
                  <div>• 2SO₂ + O₂ ⇌ 2SO₃ (V₂O₅, ৪৫০°C)</div>
                  <div>• SO₃ + H₂SO₄ → H₂S₂O₇ (ওলিয়াম)</div>
                  <div>• H₂S₂O₇ + H₂O → 2H₂SO₄</div>
                </div>
              </div>
            </div>

            {/* Completion Banner */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-600 to-blue-700 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-black">
                  {isBn ? 'অভিনন্দন! অধ্যায় ১০ সম্পূর্ণ প্রস্তুত!' : 'Congratulations! Chapter 10 Completed!'}
                </h3>
                <p className="text-sm text-cyan-100 max-w-lg">
                  {isBn
                    ? 'আপনি খনিজ সম্পদ, ধাতু নিষ্কাশনের ধাপসমূহ, সক্রিয়তা ক্রম, সংকর ধাতু ও স্পর্শ পদ্ধতির প্রতিটি মেকানিজম আয়ত্ত করেছেন।'
                    : 'You have mastered minerals and ores, extraction metallurgy, reactivity series, alloys, and sulfuric acid manufacturing.'}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/dashboard/playground/v2/chemistry/9"
                  className="px-5 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition flex items-center gap-1.5"
                >
                  <ChevronRight className="w-4 h-4 rotate-180" />
                  {isBn ? 'পূর্ববর্তী অধ্যায় (০৯)' : 'Previous Chapter (09)'}
                </Link>
                <Link
                  href={"/dashboard/playground/v2/chemistry/11" as any}
                  className="px-5 py-2.5 rounded-xl bg-white text-cyan-900 hover:bg-cyan-50 text-xs font-bold transition flex items-center gap-1.5 shadow"
                >
                  {isBn ? 'পরবর্তী অধ্যায়: ১১ (খনিজ সম্পদ: জীবাশ্ম)' : 'Next: Chapter 11 (Fossils)'}
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        )}
            {/* 3. Footer Step Navigation */}
      <StepNavigationFooter
        currentStep={activeStep as StepKey}
        onStepChange={(step) => setActiveStep(step as LearningStep)}
        chapterNumberBn="অধ্যায় 10"
        chapterNumberEn="Chapter 10"
        chapterTitleBn="খনিজ সম্পদ: ধাতু ও অধাতু"
        chapterTitleEn="Mineral Resources: Metals & Non-metals"
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
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় 10 বিশেষজ্ঞ' : 'Chapter 10 Specialist'}
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
                  ? 'bg-amber-600 text-white ml-6 rounded-tr-xs'
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
              placeholder={isBn ? 'খনিজ সম্পদ: ধাতু ও অধাতু নিয়ে প্রশ্ন করো...' : 'Ask about Mineral Resources: Metals & Non-metals...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-amber-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white transition-all disabled:opacity-50 shrink-0"
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
