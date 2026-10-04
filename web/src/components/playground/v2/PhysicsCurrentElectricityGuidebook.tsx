'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  X,
  Send,
  Eye,
  Sun,
  Maximize2,
  Compass,
  Sliders,
  Search,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Zap,
  BatteryCharging,
  Flame,
  Activity,
  Atom,
  Lightbulb,
  Fan,
  Tv,
  Home,
  TrendingUp,
  AlertTriangle,
  Info,
  Power,
  Gauge,
  Battery,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';

// ---------------------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// ---------------------------------------------------------------------------

interface LessonInfo {
  id: number;
  title: string;
  subtitle: string;
  nctbPage: string;
  badge: string;
  intro: string;
}

const LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'ওহমের সূত্র ও রোধক ল্যাব',
    subtitle: "Ohm's Law (V = IR), Resistor Color Bands & I-V Characteristics",
    nctbPage: '৩০০-৩০৬',
    badge: 'মৌলিক ভিত্তি',
    intro:
      'স্থির তাপমাত্রায় কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎপ্রবাহ তার দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক: I ∝ V বা I = V/R। ভোল্টেজ দ্বিগুণ হলে কারেন্ট দ্বিগুণ হয়, কিন্তু রোধ বাড়লে কারেন্ট কমে যায়।',
  },
  {
    id: 2,
    title: 'আপেক্ষিক রোধ ও তারের জ্যামিতি ল্যাব',
    subtitle: 'Resistivity (R = ρL/A), Wire Geometry & Temperature Effect',
    nctbPage: '৩০৬-৩০৯',
    badge: 'পদার্থের ধর্ম',
    intro:
      'একটি তারের রোধ তার দৈর্ঘ্যের সমানুপাতিক (R ∝ L) এবং প্রস্থচ্ছেদের ক্ষেত্রফলের ব্যস্তানুপাতিক (R ∝ 1/A)। উপাদানের বৈশিষ্ট্য আপেক্ষিক রোধ ρ এবং পরিবাহকত্ব σ = 1/ρ। পরিবাহীতে তাপমাত্রা বাড়লে রোধ বাড়ে, তবে অর্ধপরিবাহীতে উল্টো কমে।',
  },
  {
    id: 3,
    title: 'শ্রেণি ও সমান্তরাল বর্তনী সিমুলেটর',
    subtitle: 'Series (Rs = ΣR), Parallel (1/Rp = Σ1/R) & Lost Volts (v = Ir)',
    nctbPage: '৩১০-৩১৭',
    badge: 'সার্কিট অ্যানালাইসিস',
    intro:
      'শ্রেণি সমবায়ে প্রতিটি রোধের মধ্য দিয়ে একই তড়িৎপ্রবাহ যায় এবং বিভব ভাগ হয়। সমান্তরাল সমবায়ে প্রতিটি রোধের দুই প্রান্তে একই ভোল্টেজ থাকে এবং প্রবাহ ভাগ হয়। ব্যাটারির অভ্যন্তরীণ রোধ r এর জন্য নষ্ট ভোল্টেজ v = Ir ঘটে।',
  },
  {
    id: 4,
    title: 'তড়িৎ ক্ষমতা ও বিদ্যুৎ বিল ক্যালকুলেটর',
    subtitle: 'Electric Power (P = VI), kWh Billing & High-Voltage Transmission',
    nctbPage: '৩১৭-৩২০',
    badge: 'দৈনন্দিন জীবন ও গ্রিড',
    intro:
      'তড়িৎ ক্ষমতা P = VI = I²R = V²/R। বিদ্যুৎ বিলের একক হলো BOT ইউনিট বা কিলোওয়াট-ঘণ্টা (kWh = Pt/1000)। দীর্ঘ সঞ্চালন লাইনে সিস্টেম লস (I²R) কমানোর জন্য ভোল্টেজ শতগুণ বাড়িয়ে বিদ্যুৎ প্রেরণ করা হয়।',
  },
  {
    id: 5,
    title: 'গৃহস্থালি নিরাপদ বর্তনী ও শর্ট-সার্কিট ল্যাব',
    subtitle: 'Household Wiring, Fuses, MCB, Earthing & Hazard Prevention',
    nctbPage: '৩২০-৩২৫',
    badge: 'বাস্তব নিরাপত্তা',
    intro:
      'বাসাবাড়িতে ২২০ ভোল্ট এসি বিদ্যুৎ সরবরাহ করা হয়। লাইভ তারে সুইচ লাগানো এবং ধাতব কাঠামোতে আর্থিং তার যুক্ত করা জীবন বাঁচায়। শর্ট-সার্কিটে অতিরিক্ত প্রবাহ রোধে ফিউজ ও সার্কিট ব্রেকার স্বয়ংক্রিয়ভাবে সংযোগ বিচ্ছিন্ন করে।',
  },
];

export default function PhysicsCurrentElectricityGuidebook() {
  // Navigation State
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeLesson, setActiveLesson] = useState<number>(1);

  // Socratic AI Tutor State
  const [isTutorOpen, setIsTutorOpen] = useState<boolean>(false);
  const [tutorQuery, setTutorQuery] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([
    {
      sender: 'tutor',
      text: 'আসসালামু আলাইকুম! আমি শেরু, তোমার পদার্থবিজ্ঞান এআই টিউটর। চল তড়িৎ অধ্যায়ের ওহমের সূত্র, রোধের সমবায়, বিদ্যুৎ বিল হিসাব বা সার্কিট নিরাপত্তা নিয়ে যেকোনো প্রশ্ন করো!',
    },
  ]);

  // Copy Notes State
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // -------------------------------------------------------------------------
  // LAB 1 STATE: OHM'S LAW & I-V GRAPH
  // -------------------------------------------------------------------------
  const [lab1Voltage, setLab1Voltage] = useState<number>(12); // -24 to +24 V or 0 to 24 V
  const [lab1Polarity, setLab1Polarity] = useState<number>(1); // +1 normal, -1 inverted
  const [lab1Resistance, setLab1Resistance] = useState<number>(10); // 1 to 50 ohms
  const [lab1CoveredSymbol, setLab1CoveredSymbol] = useState<'V' | 'I' | 'R' | null>(null);

  const effectiveV = lab1Voltage * lab1Polarity;
  const lab1Current = effectiveV / lab1Resistance; // I = V/R
  const lab1Power = Math.abs(effectiveV * lab1Current); // P = VI

  // -------------------------------------------------------------------------
  // LAB 2 STATE: RESISTIVITY & WIRE GEOMETRY
  // -------------------------------------------------------------------------
  interface Material {
    nameBn: string;
    nameEn: string;
    rho: number; // ohm*m
    alpha: number; // per deg C
    type: 'conductor' | 'semiconductor' | 'alloy';
    desc: string;
  }

  const MATERIALS: Record<string, Material> = {
    silver: {
      nameBn: 'রুপা (Silver)',
      nameEn: 'Silver',
      rho: 1.59e-8,
      alpha: 0.0038,
      type: 'conductor',
      desc: 'সর্বোত্তম পরিবাহী ধাতু, অত্যন্ত কম রোধকত্ব।',
    },
    copper: {
      nameBn: 'তামা (Copper)',
      nameEn: 'Copper',
      rho: 1.68e-8,
      alpha: 0.0039,
      type: 'conductor',
      desc: 'গৃহস্থালি ও বাণিজ্যিক তারের স্ট্যান্ডার্ড উপাদান।',
    },
    gold: {
      nameBn: 'সোনা (Gold)',
      nameEn: 'Gold',
      rho: 2.44e-8,
      alpha: 0.0034,
      type: 'conductor',
      desc: 'উচ্চ পরিবাহিতা এবং কোনো ক্ষয় বা জারণ হয় না।',
    },
    tungsten: {
      nameBn: 'টাংস্টেন (Tungsten)',
      nameEn: 'Tungsten',
      rho: 5.5e-8,
      alpha: 0.0045,
      type: 'conductor',
      desc: 'উচ্চ গলনাঙ্ক (৩৪২২°C), ফিলামেন্ট বাতিতে ব্যবহৃত।',
    },
    nichrome: {
      nameBn: 'নাইক্রোম (Nichrome সংকর)',
      nameEn: 'Nichrome',
      rho: 100.0e-8,
      alpha: 0.0004,
      type: 'alloy',
      desc: 'উচ্চ আপেক্ষিক রোধ ও তাপ সহনশীলতা, হিটারে ব্যবহৃত।',
    },
    graphite: {
      nameBn: 'গ্রাফাইট (Graphite)',
      nameEn: 'Graphite',
      rho: 2.5e-6,
      alpha: -0.0005,
      type: 'conductor',
      desc: 'অধাতু পরিবাহী কার্বন রূপভেদ।',
    },
    silicon: {
      nameBn: 'সিলিকন (Silicon)',
      nameEn: 'Silicon',
      rho: 640.0,
      alpha: -0.07,
      type: 'semiconductor',
      desc: 'অর্ধপরিবাহী; তাপমাত্রা বাড়লে রোধ কমে যায়!',
    },
  };

  const [lab2MaterialKey, setLab2MaterialKey] = useState<string>('copper');
  const [lab2Length, setLab2Length] = useState<number>(10); // meters (0.5 to 50)
  const [lab2RadiusMm, setLab2RadiusMm] = useState<number>(0.5); // mm (0.05 to 2.0 mm)
  const [lab2Temperature, setLab2Temperature] = useState<number>(20); // deg C (0 to 200)

  const selectedMaterial = MATERIALS[lab2MaterialKey];
  const radiusMeters = lab2RadiusMm * 1e-3;
  const crossSectionArea = Math.PI * radiusMeters * radiusMeters;
  // Temperature adjusted resistivity: rho_T = rho_0 * (1 + alpha * (T - 20))
  const tempDelta = lab2Temperature - 20;
  const tempFactor =
    selectedMaterial.type === 'semiconductor'
      ? Math.max(0.01, 1 / (1 + Math.abs(selectedMaterial.alpha) * tempDelta * 1.5))
      : Math.max(0.1, 1 + selectedMaterial.alpha * tempDelta);
  const adjustedRho = selectedMaterial.rho * tempFactor;
  const wireResistance = (adjustedRho * lab2Length) / crossSectionArea;
  const wireConductivity = 1 / adjustedRho;

  // -------------------------------------------------------------------------
  // LAB 3 STATE: SERIES, PARALLEL & LOST VOLTS
  // -------------------------------------------------------------------------
  const [circuitType, setCircuitType] = useState<'series' | 'parallel' | 'mixed'>('series');
  const [emfVoltage, setEmfVoltage] = useState<number>(12); // Emf (V)
  const [internalR, setInternalR] = useState<number>(0.5); // r (ohm)
  const [r1, setR1] = useState<number>(4); // ohm
  const [r2, setR2] = useState<number>(6); // ohm
  const [r3, setR3] = useState<number>(12); // ohm
  const [isBrokenBulb, setIsBrokenBulb] = useState<number | null>(null); // null or 1/2/3

  // Circuit calculations
  let req = 0;
  let totalCurrent = 0;
  let lostVolts = 0;
  let terminalVoltage = 0;
  let i1 = 0,
    i2 = 0,
    i3 = 0;
  let v1 = 0,
    v2 = 0,
    v3 = 0;

  if (circuitType === 'series') {
    if (isBrokenBulb !== null) {
      req = Infinity;
      totalCurrent = 0;
      lostVolts = 0;
      terminalVoltage = emfVoltage;
    } else {
      req = r1 + r2 + r3;
      totalCurrent = emfVoltage / (req + internalR);
      lostVolts = totalCurrent * internalR;
      terminalVoltage = emfVoltage - lostVolts;
      i1 = totalCurrent;
      i2 = totalCurrent;
      i3 = totalCurrent;
      v1 = i1 * r1;
      v2 = i2 * r2;
      v3 = i3 * r3;
    }
  } else if (circuitType === 'parallel') {
    const actR1 = isBrokenBulb === 1 ? Infinity : r1;
    const actR2 = isBrokenBulb === 2 ? Infinity : r2;
    const actR3 = isBrokenBulb === 3 ? Infinity : r3;

    const invReq = (actR1 === Infinity ? 0 : 1 / actR1) + (actR2 === Infinity ? 0 : 1 / actR2) + (actR3 === Infinity ? 0 : 1 / actR3);
    if (invReq === 0) {
      req = Infinity;
      totalCurrent = 0;
      lostVolts = 0;
      terminalVoltage = emfVoltage;
    } else {
      req = 1 / invReq;
      totalCurrent = emfVoltage / (req + internalR);
      lostVolts = totalCurrent * internalR;
      terminalVoltage = emfVoltage - lostVolts;
      i1 = actR1 === Infinity ? 0 : terminalVoltage / actR1;
      i2 = actR2 === Infinity ? 0 : terminalVoltage / actR2;
      i3 = actR3 === Infinity ? 0 : terminalVoltage / actR3;
      v1 = actR1 === Infinity ? 0 : terminalVoltage;
      v2 = actR2 === Infinity ? 0 : terminalVoltage;
      v3 = actR3 === Infinity ? 0 : terminalVoltage;
    }
  } else {
    // Mixed: R1 in series with (R2 || R3)
    const actR2 = isBrokenBulb === 2 ? Infinity : r2;
    const actR3 = isBrokenBulb === 3 ? Infinity : r3;
    const invRp = (actR2 === Infinity ? 0 : 1 / actR2) + (actR3 === Infinity ? 0 : 1 / actR3);
    const rp = invRp === 0 ? Infinity : 1 / invRp;

    if (isBrokenBulb === 1 || (actR2 === Infinity && actR3 === Infinity)) {
      req = Infinity;
      totalCurrent = 0;
      lostVolts = 0;
      terminalVoltage = emfVoltage;
    } else {
      req = r1 + rp;
      totalCurrent = emfVoltage / (req + internalR);
      lostVolts = totalCurrent * internalR;
      terminalVoltage = emfVoltage - lostVolts;
      i1 = totalCurrent;
      v1 = i1 * r1;
      const vp = terminalVoltage - v1;
      i2 = actR2 === Infinity ? 0 : vp / actR2;
      i3 = actR3 === Infinity ? 0 : vp / actR3;
      v2 = actR2 === Infinity ? 0 : vp;
      v3 = actR3 === Infinity ? 0 : vp;
    }
  }

  // -------------------------------------------------------------------------
  // LAB 4 STATE: POWER, ELECTRICITY BILL & GRID TRANSMISSION
  // -------------------------------------------------------------------------
  interface ApplianceUsage {
    id: string;
    nameBn: string;
    watts: number;
    count: number;
    hoursPerDay: number;
    icon: typeof Lightbulb;
  }

  const [appliances, setAppliances] = useState<ApplianceUsage[]>([
    { id: 'bulb_led', nameBn: 'এলইডি বাতি (LED)', watts: 15, count: 5, hoursPerDay: 6, icon: Lightbulb },
    { id: 'fan', nameBn: 'সিলিং ফ্যান (Ceiling Fan)', watts: 75, count: 3, hoursPerDay: 12, icon: Fan },
    { id: 'fridge', nameBn: 'রেফ্রিজারেটর (Fridge)', watts: 150, count: 1, hoursPerDay: 18, icon: Tv },
    { id: 'iron', nameBn: 'ইলেকট্রিক ইস্ত্রি (Iron)', watts: 1000, count: 1, hoursPerDay: 0.5, icon: Flame },
    { id: 'pump', nameBn: 'পানির মোটর পাম্প (Pump)', watts: 750, count: 1, hoursPerDay: 1.5, icon: Gauge },
  ]);

  const [ratePerUnit, setRatePerUnit] = useState<number>(6.5); // BDT per kWh
  const [daysCount, setDaysCount] = useState<number>(30); // 30 days

  // Grid transmission simulation state
  const [gridPowerKw, setGridPowerKw] = useState<number>(100); // 100 kW
  const [gridVoltage, setGridVoltage] = useState<number>(11000); // 220V, 11kV, 33kV, 132kV
  const [lineResistance, setLineResistance] = useState<number>(5); // 5 ohms line

  const gridCurrent = (gridPowerKw * 1000) / gridVoltage;
  const gridPowerLossW = gridCurrent * gridCurrent * lineResistance;
  const gridPowerLossKw = gridPowerLossW / 1000;
  const gridLossPercent = Math.min(100, (gridPowerLossKw / gridPowerKw) * 100);

  // Total household daily kWh
  const totalDailyKwh = appliances.reduce((acc, app) => acc + (app.watts * app.count * app.hoursPerDay) / 1000, 0);
  const totalMonthlyKwh = totalDailyKwh * daysCount;
  const totalMonthlyCost = totalMonthlyKwh * ratePerUnit;

  // -------------------------------------------------------------------------
  // LAB 5 STATE: HOUSEHOLD SAFETY, MCB, FUSE & EARTHING
  // -------------------------------------------------------------------------
  const [isMainSwitchOn, setIsMainSwitchOn] = useState<boolean>(true);
  const [fuseRatingAmps, setFuseRatingAmps] = useState<number>(5); // 5A, 15A, 30A
  const [switchPosition, setSwitchPosition] = useState<'live' | 'neutral'>('live'); // Correct on Live, Dangerous on Neutral
  const [isEarthConnected, setIsEarthConnected] = useState<boolean>(true);
  const [isShortCircuited, setIsShortCircuited] = useState<boolean>(false);
  const [isChassisLeakage, setIsChassisLeakage] = useState<boolean>(false);
  const [isHumanTouching, setIsHumanTouching] = useState<boolean>(false);
  const [isWetHands, setIsWetHands] = useState<boolean>(false);

  // Live safety metrics
  const applianceLoadPowerW = 800; // e.g. electric iron/heater
  const applianceNormalR = (220 * 220) / applianceLoadPowerW; // ~60.5 ohms
  const actualEffectiveR = isShortCircuited ? 0.2 : applianceNormalR;
  const circuitCurrentAmps = isMainSwitchOn ? 220 / actualEffectiveR : 0;
  const isFuseBlown = circuitCurrentAmps > fuseRatingAmps;

  // Human shock calculation
  const humanBodyR = isWetHands ? 1000 : 100000; // Wet hand: 1000 ohms; Dry hand: 100k ohms
  let humanCurrentMa = 0;
  if (isMainSwitchOn && isHumanTouching) {
    if (isChassisLeakage) {
      if (isEarthConnected) {
        // Safe: Fault drains into earth (< 5 ohms), human gets negligible current
        humanCurrentMa = (220 / humanBodyR) * (5 / (5 + humanBodyR)) * 1000;
      } else {
        // Lethal risk: Chassis is at 220V relative to ground
        humanCurrentMa = (220 / humanBodyR) * 1000;
      }
    } else if (switchPosition === 'neutral' && !isMainSwitchOn) {
      // If switch on neutral, appliance off but live voltage is still present inside!
      humanCurrentMa = (220 / humanBodyR) * 1000;
    }
  }

  // -------------------------------------------------------------------------
  // STEP 2: WORKED CQ ACCORDION STATE
  // -------------------------------------------------------------------------
  const [openCqId, setOpenCqId] = useState<number | null>(1);

  // -------------------------------------------------------------------------
  // STEP 3: TRY YOURSELF STATE
  // -------------------------------------------------------------------------
  const [ch1Answer, setCh1Answer] = useState<string>('');
  const [ch1Result, setCh1Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch2Answer, setCh2Answer] = useState<string>('');
  const [ch2Result, setCh2Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [ch3Answer, setCh3Answer] = useState<string>('');
  const [ch3Result, setCh3Result] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // -------------------------------------------------------------------------
  // STEP 4: MCQS STATE
  // -------------------------------------------------------------------------
  const [selectedMcqAnswers, setSelectedMcqAnswers] = useState<Record<number, number>>({});
  const [showMcqResults, setShowMcqResults] = useState<boolean>(false);

  const MCQ_DATA = [
    {
      id: 1,
      question:
        'স্থির তাপমাত্রায় কোনো পরিবাহীর দুই প্রান্তের বিভব পার্থক্য দ্বিগুণ করা হলে এর মধ্য দিয়ে প্রবাহিত তড়িৎপ্রবাহের কী পরিবর্তন হবে?',
      options: ['অর্ধেক হবে', 'দ্বিগুণ হবে', 'চারগুণ হবে', 'একই থাকবে'],
      correct: 1,
      explanation:
        "ওহমের সূত্রানুযায়ী স্থির তাপমাত্রায় তড়িৎপ্রবাহ দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক: $I \\propto V$। সুতরাং বিভব পার্থক্য দ্বিগুণ হলে প্রবাহও দ্বিগুণ হবে।",
    },
    {
      id: 2,
      question:
        '২ ওহম, ৩ ওহম এবং ৬ ওহম মানের তিনটি রোধ সমান্তরাল সমবায়ে যুক্ত থাকলে এদের তুল্য রোধ কত হবে?',
      options: ['১১ ওহম', '১ ওহম', '০.৯ ওহম', '৩ ওহম'],
      correct: 1,
      explanation:
        "সমান্তরাল তুল্য রোধের সূত্র: $\\frac{1}{R_p} = \\frac{1}{2} + \\frac{1}{3} + \\frac{1}{6} = \\frac{3 + 2 + 1}{6} = \\frac{6}{6} = 1 \\implies R_p = 1\\ \\Omega$।",
    },
    {
      id: 3,
      question:
        'একটি তারের দৈর্ঘ্য টেনে দ্বিগুণ এবং প্রস্থচ্ছেদের ক্ষেত্রফল অর্ধেক করা হলে এর নতুন রোধ আদি রোধের কতগুণ হবে?',
      options: ['২ গুণ', '৪ গুণ', 'অর্ধেক', '৮ গুণ'],
      correct: 1,
      explanation:
        "রোধের সূত্র $R = \\rho \\frac{L}{A}$। দৈর্ঘ্য $L' = 2L$ এবং ক্ষেত্রফল $A' = A/2$ হলে, $R' = \\rho \\frac{2L}{A/2} = 4 \\left(\\rho \\frac{L}{A}\\right) = 4R$। অর্থাৎ ৪ গুণ হবে।",
    },
    {
      id: 4,
      question:
        'বিদ্যুৎ সরবরাহ লাইনে সিস্টেম লস কমানোর বৈজ্ঞানিক উপায় কোনটি?',
      options: [
        'ভোল্টেজ কমিয়ে কারেন্ট বাড়ানো',
        'উচ্চ ভোল্টেজে কম কারেন্টে বিদ্যুৎ সঞ্চালন করা',
        'তারের রোধ কৃত্রিমভাবে বৃদ্ধি করা',
        'এসি কারেন্টের পরিবর্তে ডিসি ব্যবহার করা',
      ],
      correct: 1,
      explanation:
        "সঞ্চালন তারে তাপজনিত ক্ষয় $P_{\\text{loss}} = I^2 R$। উচ্চ ভোল্টেজে ($V$) বিদ্যুৎ পাঠালে সমপরিমাণ ক্ষমতা প্রেরণে কারেন্ট ($I = P/V$) অনেক কমে যায়, ফলে $I^2 R$ লস শতগুণ কমে যায়।",
    },
    {
      id: 5,
      question:
        'বাসাবাড়ির বৈদ্যুতিক বর্তনীতে সুইচ সর্বদা কোন তারের সাথে সংযোগ দেওয়া উচিত?',
      options: ['নিউট্রাল তার', 'আর্থিং তার', 'লাইভ (উচ্চ বিভব) তার', 'যেকোনো তারে দিলেই হয়'],
      correct: 2,
      explanation:
        "সুইচ লাইভ তারে দিলে সুইচ বন্ধ করার সাথে সাথে যন্ত্রের অভ্যন্তরীণ সব অংশে উচ্চ বিভব (২২০ ভোল্ট) বিচ্ছিন্ন হয়ে যায়। নিউট্রাল তারে সুইচ দিলে যন্ত্র বন্ধ হলেও ভেতরে ২২০ ভোল্ট বজায় থাকে, যা মেরামতকালে প্রাণঘাতী শক দিতে পারে।",
    },
  ];

  const handleMcqSelect = (qId: number, optIdx: number) => {
    setSelectedMcqAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateMcqScore = () => {
    let score = 0;
    MCQ_DATA.forEach((q) => {
      if (selectedMcqAnswers[q.id] === q.correct) score++;
    });
    return score;
  };

  // -------------------------------------------------------------------------
  // TUTOR SEND HANDLER
  // -------------------------------------------------------------------------
  const handleTutorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tutorQuery.trim()) return;

    const userText = tutorQuery;
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setTutorQuery('');

    // Socratic response logic
    setTimeout(() => {
      let botReply =
        'চমৎকার প্রশ্ন! মনে রাখবে, তড়িৎ প্রবাহ হলো প্রতি সেকেন্ডে চার্জের প্রবাহ (I = Q/t)। বর্তনীতে ভোল্টেজ হলো চার্জকে ধাক্কা দেওয়ার চাপ, আর রোধ হলো সেই প্রবাহের বাধা (V = IR)। তুমি যে সার্কিটটি নিয়ে ভাবছ, তাতে রোধগুলো কি পাশাপাশি এক লাইনে (শ্রেণি) নাকি আলাদা শাখায় (সমান্তরাল) যুক্ত?';

      if (userText.includes('সমান্তরাল') || userText.includes('parallel')) {
        botReply =
          'সমান্তরাল সমবায়ের মূল বৈশিষ্ট্য হলো প্রতিটি রোধের দুই প্রান্তেই সরাসরি একই ভোল্টেজ প্রযুক্ত থাকে! তাই কোনো একটি বাতি নষ্ট হলেও বাকিগুলোর ভোল্টেজ বা প্রবাহে ব্যাঘাত ঘটে না। এজন্যই বাসাবাড়ির সব যন্ত্রপাতি সমান্তরালে লাগানো হয়।';
      } else if (userText.includes('বিল') || userText.includes('unit') || userText.includes('ইউনিট')) {
        botReply =
          'বিদ্যুৎ বিলের একক হলো BOT ইউনিট বা কিলোওয়াট-ঘণ্টা (kWh)। সূত্রটি খুব সহজ: ব্যয়িত শক্তি W = (ওয়াট ক্ষমতা × মোট ঘণ্টা) / ১০০০। যেমন ৬০ ওয়াটের বাতি প্রতিদিন ৫ ঘণ্টা জ্বললে ৩০ দিনে খরচ = (৬০ × ১৫০) / ১০০০ = ৯ ইউনিট!';
      } else if (userText.includes('শক') || userText.includes('safety') || userText.includes('আর্থিং')) {
        botReply =
          'মানুষের ত্বক শুকনো থাকলে রোধ প্রায় ১,০০,০০০ ওহম, কিন্তু ভেজা অবস্থায় তা মাত্র ১,০০০ ওহমে নেমে আসে! সরাসরি হৃৎপিণ্ডের ভেতর দিয়ে মাত্র ১০ মিলিঅ্যাম্পিয়ার কারেন্ট গেলেই হৃদস্পন্দন বন্ধ হতে পারে। তাই ধাতব যন্ত্রপাতিতে আর্থিং সংযোগ থাকলে অতিরিক্ত কারেন্ট মানুষে না গিয়ে সরাসরি মাটিতে চলে যায়।';
      }

      setChatMessages((prev) => [...prev, { sender: 'tutor', text: botReply }]);
    }, 600);
  };

  const handleCopyNotes = () => {
    const noteText = `=== পদার্থবিজ্ঞান অধ্যায় ১১: চল তড়িৎ সামারি নোট ===
১. তড়িৎ প্রবাহ: I = Q / t (একক: অ্যাম্পিয়ার A = C/s)
২. ওহমের সূত্র: I = V / R => V = IR (স্থির তাপমাত্রায় I ∝ V)
৩. আপেক্ষিক রোধ: R = ρ (L / A), পরিবাহকত্ব σ = 1 / ρ
৪. শ্রেণি তুল্য রোধ: Rs = R1 + R2 + ... + Rn
৫. সমান্তরাল তুল্য রোধ: 1/Rp = 1/R1 + 1/R2 + ... + 1/Rn
৬. কোষের অভ্যন্তরীণ রোধ ও নষ্ট ভোল্টেজ: I = E / (R + r), নষ্ট ভোল্টেজ v = Ir, প্রান্তীয় বিভব V = E - Ir
৭. তড়িৎ ক্ষমতা: P = VI = I²R = V² / R (একক: ওয়াট W)
৮. ব্যয়িত শক্তি ও বিল: W = (P × t) / 1000 kWh (BOT ইউনিট)
৯. সিস্টেম লস: Ploss = I² Rline (উচ্চ ভোল্টেজে বিদ্যুৎ সঞ্চালনে ক্ষয় কমে)
১০. নিরাপত্তা: সুইচ সর্বদা লাইভ তারে এবং ধাতব খোলে আর্থিং নিশ্চিত করা।`;

    navigator.clipboard.writeText(noteText);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {/* ------------------------------------------------------------------- */}
      {/* TOP HEADER & BREADCRUMB                                             */}
      {/* ------------------------------------------------------------------- */}
      {/* Modern High-Contrast Top Navigation & Breadcrumb Bar */}
      <GuidebookHeaderNav
        subjectKey="physics"
        subjectNameBn="পদার্থবিজ্ঞান"
        chapterNum={11}
        chapterTitleBn="চল তড়িৎ (Current Electricity)"
        activeLesson={activeLesson}
        activeLessonTitle={LESSONS[activeLesson - 1]?.title}
        onOpenAi={() => setIsTutorOpen(true)}
        aiButtonLabel="শেরু এআই টিউটর"
      />

      {/* ------------------------------------------------------------------- */}
      {/* 5-STEP WORKFLOW STEP BAR                                            */}
      {/* ------------------------------------------------------------------- */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 lg:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto gap-2">
          {[
            { step: 1, title: '১. মূল ধারণা ও ল্যাব', en: '1 Learn Concept', icon: Lightbulb },
            { step: 2, title: '২. বোর্ড সমাধান ও রুব্রিক', en: '2 See Example', icon: Award },
            { step: 3, title: '৩. নিজে অনুশীলন', en: '3 Try Yourself', icon: Sliders },
            { step: 4, title: '৪. যাচাই ও কুইজ', en: '4 Check Understanding', icon: CheckCircle2 },
            { step: 5, title: '৫. সারসংক্ষেপ ও চিট-শিট', en: '5 Summary', icon: BookOpen },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeStep === item.step;
            return (
              <button
                key={item.step}
                onClick={() => setActiveStep(item.step)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-emerald-500 text-slate-950 font-semibold shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTENT CONTAINER                                              */}
      {/* ------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 lg:p-8">
        {/* ================================================================= */}
        {/* STEP 1: LEARN CONCEPT (5 LABS)                                    */}
        {/* ================================================================= */}
        {activeStep === 1 && (
          <div className="space-y-6">
            {/* Lesson Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 border-b border-slate-800">
              {LESSONS.map((l) => (
                <button
                  key={l.id}
                  onClick={() => setActiveLesson(l.id)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap flex items-center gap-2 border transition-all ${
                    activeLesson === l.id
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-sm shadow-emerald-500/10'
                      : 'border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center text-[10px] font-bold">
                    {l.id}
                  </span>
                  <span>{l.title.split(' ')[0]} {l.title.split(' ')[1]}</span>
                  <span className="text-[10px] px-1 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700">
                    পৃষ্ঠা {l.nctbPage}
                  </span>
                </button>
              ))}
            </div>

            {/* Lesson Header Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 lg:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {LESSONS[activeLesson - 1].badge}
                </span>
                <span className="text-xs text-slate-400">
                  এনসিটিবি পাঠ্যবই পৃষ্ঠা: <strong className="text-slate-200">{LESSONS[activeLesson - 1].nctbPage}</strong>
                </span>
              </div>
              <h2 className="text-lg lg:text-xl font-bold text-slate-100 flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-400" />
                <span>{LESSONS[activeLesson - 1].title}</span>
              </h2>
              <p className="text-xs lg:text-sm text-slate-400 mt-1 leading-relaxed">
                {LESSONS[activeLesson - 1].intro}
              </p>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LAB 1: OHM'S LAW & I-V GRAPH                                    */}
            {/* --------------------------------------------------------------- */}
            {activeLesson === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-5 space-y-5 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-emerald-400" />
                    <span>ওহমের সূত্র ভোল্টেজ ও রোধক নিয়ন্ত্রণ</span>
                  </h3>

                  {/* Voltage Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">প্রযুক্ত ভোল্টেজ (V):</span>
                      <span className="text-emerald-400 font-mono font-bold">
                        {effectiveV > 0 ? `+${effectiveV}` : effectiveV} V
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="24"
                      step="1"
                      value={lab1Voltage}
                      onChange={(e) => setLab1Voltage(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>১ V (ড্রাই সেল)</span>
                      <span>৬ V</span>
                      <span>১২ V (কার ব্যাটারি)</span>
                      <span>২৪ V</span>
                    </div>
                  </div>

                  {/* Polarity Toggle */}
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-800/40 border border-slate-700/60">
                    <span className="text-xs text-slate-300">ব্যাটারির পোলারিটি (দিক পরিবর্তন):</span>
                    <button
                      onClick={() => setLab1Polarity((p) => p * -1)}
                      className="px-2.5 py-1 rounded text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 transition-colors"
                    >
                      {lab1Polarity > 0 ? 'স্বাভাবিক (+/-)' : 'বিপরীত (-/+)'}
                    </button>
                  </div>

                  {/* Resistance Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">রোধকের মান (R):</span>
                      <span className="text-amber-400 font-mono font-bold">{lab1Resistance} Ω</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="50"
                      step="1"
                      value={lab1Resistance}
                      onChange={(e) => setLab1Resistance(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>১ Ω</span>
                      <span>১০ Ω</span>
                      <span>২৫ Ω</span>
                      <span>৫০ Ω</span>
                    </div>
                  </div>

                  {/* Formula Triangle Interactive Tool (NCTB Page 306) */}
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-300">ওহমের ত্রিভুজ (NCTB পৃষ্ঠা ৩০৬):</span>
                      <span className="text-[10px] text-slate-500">যেকোনো একটি রাশির ওপর ক্লিক করো</span>
                    </div>

                    <div className="flex justify-center py-2">
                      <div className="relative w-36 h-28 border border-amber-500/40 rounded-lg flex flex-col overflow-hidden bg-slate-900">
                        {/* Top half: V */}
                        <button
                          onClick={() => setLab1CoveredSymbol(lab1CoveredSymbol === 'V' ? null : 'V')}
                          className={`h-1/2 w-full flex items-center justify-center font-bold text-base transition-colors border-b border-amber-500/40 ${
                            lab1CoveredSymbol === 'V'
                              ? 'bg-slate-800 text-slate-600 line-through'
                              : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                          }`}
                        >
                          V (ভোল্টেজ)
                        </button>
                        {/* Bottom half: I & R */}
                        <div className="h-1/2 w-full flex">
                          <button
                            onClick={() => setLab1CoveredSymbol(lab1CoveredSymbol === 'I' ? null : 'I')}
                            className={`w-1/2 h-full flex items-center justify-center font-bold text-sm border-r border-amber-500/40 transition-colors ${
                              lab1CoveredSymbol === 'I'
                                ? 'bg-slate-800 text-slate-600 line-through'
                                : 'bg-cyan-500/10 text-cyan-300 hover:bg-cyan-500/20'
                            }`}
                          >
                            I (কারেন্ট)
                          </button>
                          <button
                            onClick={() => setLab1CoveredSymbol(lab1CoveredSymbol === 'R' ? null : 'R')}
                            className={`w-1/2 h-full flex items-center justify-center font-bold text-sm transition-colors ${
                              lab1CoveredSymbol === 'R'
                                ? 'bg-slate-800 text-slate-600 line-through'
                                : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
                            }`}
                          >
                            R (রোধ)
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-center text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                      {lab1CoveredSymbol === 'V' && (
                        <span>
                          ঢেকে দেওয়া রাশি <strong className="text-emerald-400">V</strong> ={' '}
                          <RenderMathText text="$I \times R$" /> = {lab1Current.toFixed(2)} A × {lab1Resistance} Ω ={' '}
                          {effectiveV.toFixed(1)} V
                        </span>
                      )}
                      {lab1CoveredSymbol === 'I' && (
                        <span>
                          ঢেকে দেওয়া রাশি <strong className="text-cyan-400">I</strong> ={' '}
                          <RenderMathText text="$\frac{V}{R}$" /> = {effectiveV.toFixed(1)} V / {lab1Resistance} Ω ={' '}
                          {lab1Current.toFixed(2)} A
                        </span>
                      )}
                      {lab1CoveredSymbol === 'R' && (
                        <span>
                          ঢেকে দেওয়া রাশি <strong className="text-amber-400">R</strong> ={' '}
                          <RenderMathText text="$\frac{V}{I}$" /> = {effectiveV.toFixed(1)} V / {lab1Current.toFixed(2)} A ={' '}
                          {lab1Resistance} Ω
                        </span>
                      )}
                      {!lab1CoveredSymbol && (
                        <span className="text-slate-400">
                          ত্রিভুজের যেকোনো অক্ষরে আঙুল দিলে বাকি দুটি রাশি সমীকরণ আকারে দেখা যায়!
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Calculated Metrics Summary */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">তড়িৎ প্রবাহ (I)</span>
                      <span className="text-sm font-bold font-mono text-cyan-400">
                        {lab1Current.toFixed(2)} A
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">ব্যয়িত ক্ষমতা (P)</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {lab1Power.toFixed(1)} W
                      </span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-400 block">পরিবাহিতা (G = 1/R)</span>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        {(1 / lab1Resistance).toFixed(3)} S
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive SVG Circuit Diagram & Live I-V Graph */}
                <div className="lg:col-span-7 space-y-4">
                  {/* SVG Circuit Visualizer */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <Activity className="w-4 h-4 text-emerald-400" />
                        <span>লাইভ সার্কিট ডায়াগ্রাম ও ইলেকট্রন প্রবাহ অ্যানিমেশন</span>
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        Conventional I (Clockwise) vs Electrons (Counter-clockwise)
                      </span>
                    </div>

                    <div className="relative w-full h-56 bg-slate-950 rounded-lg border border-slate-800/80 overflow-hidden flex items-center justify-center">
                      <svg viewBox="0 0 500 240" className="w-full h-full max-h-56">
                        {/* Circuit Wires */}
                        {/* Top Wire */}
                        <line x1="80" y1="50" x2="420" y2="50" stroke="#334155" strokeWidth="4" />
                        {/* Right Wire with Resistor */}
                        <line x1="420" y1="50" x2="420" y2="80" stroke="#334155" strokeWidth="4" />
                        {/* Resistor zig-zag */}
                        <path
                          d="M 420 80 L 405 90 L 435 100 L 405 110 L 435 120 L 405 130 L 435 140 L 420 150"
                          fill="none"
                          stroke="#f59e0b"
                          strokeWidth="3.5"
                          strokeLinecap="round"
                        />
                        <line x1="420" y1="150" x2="420" y2="190" stroke="#334155" strokeWidth="4" />
                        {/* Bottom Wire */}
                        <line x1="420" y1="190" x2="80" y2="190" stroke="#334155" strokeWidth="4" />
                        {/* Left Wire with Battery */}
                        <line x1="80" y1="190" x2="80" y2="135" stroke="#334155" strokeWidth="4" />
                        <line x1="80" y1="105" x2="80" y2="50" stroke="#334155" strokeWidth="4" />

                        {/* Battery Cells */}
                        {/* Long plate (+) */}
                        <line
                          x1={lab1Polarity > 0 ? '60' : '65'}
                          y1={lab1Polarity > 0 ? '110' : '130'}
                          x2={lab1Polarity > 0 ? '100' : '95'}
                          y2={lab1Polarity > 0 ? '110' : '130'}
                          stroke="#10b981"
                          strokeWidth="4"
                        />
                        {/* Short plate (-) */}
                        <line
                          x1={lab1Polarity > 0 ? '68' : '60'}
                          y1={lab1Polarity > 0 ? '125' : '110'}
                          x2={lab1Polarity > 0 ? '92' : '100'}
                          y2={lab1Polarity > 0 ? '125' : '110'}
                          stroke="#ef4444"
                          strokeWidth="5"
                        />

                        {/* Battery Label */}
                        <text x="35" y="125" fill="#10b981" fontSize="11" fontWeight="bold">
                          {effectiveV > 0 ? `+${effectiveV}V` : `${effectiveV}V`}
                        </text>

                        {/* Ammeter inline top */}
                        <circle cx="250" cy="50" r="16" fill="#0f172a" stroke="#06b6d4" strokeWidth="2.5" />
                        <text x="250" y="54" fill="#06b6d4" fontSize="11" fontWeight="bold" textAnchor="middle">
                          A
                        </text>
                        <text x="250" y="30" fill="#38bdf8" fontSize="10" textAnchor="middle">
                          {Math.abs(lab1Current).toFixed(2)} A
                        </text>

                        {/* Voltmeter parallel across resistor */}
                        <line x1="420" y1="70" x2="470" y2="70" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                        <line x1="470" y1="70" x2="470" y2="160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                        <line x1="470" y1="160" x2="420" y2="160" stroke="#64748b" strokeWidth="1.5" strokeDasharray="3,3" />
                        <circle cx="470" cy="115" r="14" fill="#0f172a" stroke="#a855f7" strokeWidth="2" />
                        <text x="470" y="119" fill="#a855f7" fontSize="10" fontWeight="bold" textAnchor="middle">
                          V
                        </text>
                        <text x="470" y="145" fill="#c084fc" fontSize="9" textAnchor="middle">
                          {Math.abs(effectiveV)} V
                        </text>

                        {/* Resistor Label */}
                        <text x="360" y="118" fill="#f59e0b" fontSize="11" fontWeight="bold">
                          R = {lab1Resistance} Ω
                        </text>

                        {/* Animated Current Arrows on Wires */}
                        {lab1Polarity > 0 ? (
                          <>
                            {/* Conventional Current: Clockwise */}
                            <polygon points="170,47 180,50 170,53" fill="#10b981" />
                            <polygon points="340,47 350,50 340,53" fill="#10b981" />
                            <polygon points="417,170 420,180 423,170" fill="#10b981" />
                            <polygon points="260,187 250,190 260,193" fill="#10b981" />
                            <polygon points="83,75 80,65 77,75" fill="#10b981" />
                          </>
                        ) : (
                          <>
                            {/* Reversed: Counter-Clockwise */}
                            <polygon points="180,47 170,50 180,53" fill="#ef4444" />
                            <polygon points="350,47 340,50 350,53" fill="#ef4444" />
                            <polygon points="417,70 420,60 423,70" fill="#ef4444" />
                            <polygon points="250,187 260,190 250,193" fill="#ef4444" />
                            <polygon points="83,165 80,175 77,165" fill="#ef4444" />
                          </>
                        )}

                        {/* Moving electrons legend */}
                        <g transform="translate(140, 115)">
                          <rect x="0" y="0" width="160" height="32" rx="4" fill="#1e293b" opacity="0.9" />
                          <circle cx="15" cy="16" r="4" fill="#38bdf8" />
                          <text x="26" y="20" fill="#94a3b8" fontSize="9">
                            ইলেকট্রন প্রবাহ (তড়িৎ প্রবাহের বিপরীত)
                          </text>
                        </g>
                      </svg>
                    </div>
                  </div>

                  {/* Live I-V Characteristic Graph (NCTB Figure 11.04) */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">
                        I বনাম V লেখচিত্র (ঢাল = 1/R = {(1 / lab1Resistance).toFixed(3)} Ω⁻¹)
                      </span>
                      <span className="text-[10px] text-slate-400">
                        NCTB চিত্র ১১.০৪: মূলবিন্দুগামী সরলরেখা
                      </span>
                    </div>

                    <div className="relative w-full h-44 bg-slate-950 rounded-lg border border-slate-800 p-2 flex items-center justify-center">
                      <svg viewBox="-120 -80 240 160" className="w-full h-full max-h-40">
                        {/* Axes */}
                        <line x1="-110" y1="0" x2="110" y2="0" stroke="#475569" strokeWidth="1.5" />
                        <line x1="0" y1="-75" x2="0" y2="75" stroke="#475569" strokeWidth="1.5" />

                        {/* Arrows */}
                        <polygon points="110,-3 115,0 110,3" fill="#475569" />
                        <polygon points="-3,-75 0,-80 3,-75" fill="#475569" />

                        {/* Axis Labels */}
                        <text x="100" y="-8" fill="#94a3b8" fontSize="8" textAnchor="end">
                          +V (ভোল্টেজ)
                        </text>
                        <text x="-95" y="-8" fill="#94a3b8" fontSize="8">
                          -V
                        </text>
                        <text x="5" y="-70" fill="#94a3b8" fontSize="8">
                          +I (অ্যাম্পিয়ার)
                        </text>
                        <text x="5" y="70" fill="#94a3b8" fontSize="8">
                          -I
                        </text>

                        {/* Ohm's Law Line: slope = 1/R */}
                        <line
                          x1="-90"
                          y1={(-90 / lab1Resistance) * 22}
                          x2="90"
                          y2={(90 / lab1Resistance) * -22}
                          stroke="#10b981"
                          strokeWidth="2.5"
                        />

                        {/* Current Operating Point */}
                        <circle
                          cx={(effectiveV / 24) * 90}
                          cy={(-lab1Current * 22 * 90) / (24 * (lab1Resistance / 10))}
                          r="5"
                          fill="#f59e0b"
                          stroke="#ffffff"
                          strokeWidth="1.5"
                        />

                        {/* Point coordinate label */}
                        <text
                          x={(effectiveV / 24) * 90 + 8}
                          y={(-lab1Current * 22 * 90) / (24 * (lab1Resistance / 10)) - 6}
                          fill="#f59e0b"
                          fontSize="9"
                          fontWeight="bold"
                        >
                          ({effectiveV}V, {lab1Current.toFixed(2)}A)
                        </text>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 2: RESISTIVITY & WIRE GEOMETRY                              */}
            {/* --------------------------------------------------------------- */}
            {activeLesson === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-5 space-y-5 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                    <Atom className="w-4 h-4 text-emerald-400" />
                    <span>উপাদান ও তারের জ্যামিতিক বৈশিষ্ট্য</span>
                  </h3>

                  {/* Material Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400">তারের উপাদান নির্বাচন (NCTB সারণি ১১.০১):</label>
                    <select
                      value={lab2MaterialKey}
                      onChange={(e) => setLab2MaterialKey(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
                    >
                      {Object.entries(MATERIALS).map(([key, mat]) => (
                        <option key={key} value={key}>
                          {mat.nameBn} — ρ = {mat.rho.toExponential(2)} Ω·m
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-slate-400 italic bg-slate-950 p-2 rounded border border-slate-800">
                      {selectedMaterial.desc}
                    </p>
                  </div>

                  {/* Length Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">তারের দৈর্ঘ্য (L):</span>
                      <span className="text-emerald-400 font-mono font-bold">{lab2Length} m</span>
                    </div>
                    <input
                      type="range"
                      min="0.5"
                      max="50"
                      step="0.5"
                      value={lab2Length}
                      onChange={(e) => setLab2Length(Number(e.target.value))}
                      className="w-full accent-emerald-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>০.৫ m</span>
                      <span>১০ m</span>
                      <span>২৫ m</span>
                      <span>৫০ m</span>
                    </div>
                  </div>

                  {/* Radius Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">তারের ব্যাসার্ধ (r):</span>
                      <span className="text-cyan-400 font-mono font-bold">{lab2RadiusMm} mm</span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="2.0"
                      step="0.05"
                      value={lab2RadiusMm}
                      onChange={(e) => setLab2RadiusMm(Number(e.target.value))}
                      className="w-full accent-cyan-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>০.১ mm (সরু ফিলামেন্ট)</span>
                      <span>০.৫ mm</span>
                      <span>১.০ mm</span>
                      <span>২.০ mm (পাওয়ার ক্যাবল)</span>
                    </div>
                  </div>

                  {/* Temperature Slider */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">তাপমাত্রা (T):</span>
                      <span className="text-amber-400 font-mono font-bold">{lab2Temperature} °C</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={lab2Temperature}
                      onChange={(e) => setLab2Temperature(Number(e.target.value))}
                      className="w-full accent-amber-500 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>০ °C (বরফ)</span>
                      <span>২০ °C (কক্ষ তাপমাত্রা)</span>
                      <span>১০০ °C (ফুটন্ত পানি)</span>
                      <span>২০০ °C (হিটার)</span>
                    </div>
                  </div>

                  {/* Textbook Preset Button */}
                  <button
                    onClick={() => {
                      setLab2MaterialKey('nichrome');
                      setLab2RadiusMm(0.1);
                      setLab2Length(0.0314);
                      setLab2Temperature(20);
                    }}
                    className="w-full py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-amber-300 font-medium border border-slate-700 flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>পাঠ্যবই পৃষ্ঠা ৩০৯ প্রিসেট: ১ ওহম রোধে ৩ সেমি নাইক্রোম তার</span>
                  </button>
                </div>

                {/* 3D Wire Geometry Simulation & Math Calculation Card */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Visual Wire Cylinder */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-200">
                        তারের ভৌত মডেল ও অভ্যন্তরীণ পরমাণু কম্পন
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {selectedMaterial.type === 'semiconductor'
                          ? 'অর্ধপরিবাহী: T বৃদ্ধিতে মুক্ত ইলেকট্রন বাড়ে'
                          : 'পরিবাহী: T বৃদ্ধিতে পরমাণু কম্পন বাড়ে'}
                      </span>
                    </div>

                    {/* SVG 3D Wire Cylinder Representation */}
                    <div className="relative w-full h-44 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 450 160" className="w-full h-full max-h-40">
                        {(() => {
                          const wLen = 100 + (lab2Length / 50) * 240;
                          const wRadius = 8 + (lab2RadiusMm / 2.0) * 32;
                          const startX = 225 - wLen / 2;
                          const centerY = 80;

                          return (
                            <g>
                              {/* Left circular face */}
                              <ellipse
                                cx={startX}
                                cy={centerY}
                                rx={wRadius * 0.4}
                                ry={wRadius}
                                fill="#d97706"
                                stroke="#f59e0b"
                                strokeWidth="2"
                              />

                              {/* Wire Body Cylinder */}
                              <rect
                                x={startX}
                                y={centerY - wRadius}
                                width={wLen}
                                height={wRadius * 2}
                                fill="url(#wireGradient)"
                                stroke="#f59e0b"
                                strokeWidth="1.5"
                              />

                              {/* Right circular face */}
                              <ellipse
                                cx={startX + wLen}
                                cy={centerY}
                                rx={wRadius * 0.4}
                                ry={wRadius}
                                fill="#b45309"
                                stroke="#f59e0b"
                                strokeWidth="2"
                              />

                              {/* Dimension Annotations */}
                              <line
                                x1={startX}
                                y1={centerY + wRadius + 18}
                                x2={startX + wLen}
                                y2={centerY + wRadius + 18}
                                stroke="#10b981"
                                strokeWidth="1.5"
                              />
                              <text
                                x={225}
                                y={centerY + wRadius + 32}
                                fill="#10b981"
                                fontSize="11"
                                fontWeight="bold"
                                textAnchor="middle"
                              >
                                দৈর্ঘ্য L = {lab2Length} m
                              </text>

                              {/* Area / Radius annotation */}
                              <line
                                x1={startX + wLen + wRadius * 0.4 + 5}
                                y1={centerY - wRadius}
                                x2={startX + wLen + wRadius * 0.4 + 5}
                                y2={centerY + wRadius}
                                stroke="#06b6d4"
                                strokeWidth="1.5"
                              />
                              <text
                                x={startX + wLen + wRadius * 0.4 + 12}
                                y={centerY + 4}
                                fill="#06b6d4"
                                fontSize="10"
                                fontWeight="bold"
                              >
                                r = {lab2RadiusMm} mm
                              </text>
                            </g>
                          );
                        })()}

                        <defs>
                          <linearGradient id="wireGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#b45309" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#78350f" stopOpacity="0.9" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                  </div>

                  {/* Rigorous Calculation Card */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
                    <span className="text-xs font-semibold text-slate-200 block">
                      গাণিতিক সমীকরণ ও ফলাফল (Mathematical Verification)
                    </span>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs space-y-2 font-mono">
                      <div className="flex justify-between items-center text-slate-300">
                        <span>প্রস্থচ্ছেদের ক্ষেত্রফল: A = π r²</span>
                        <span className="text-cyan-400 font-bold">{crossSectionArea.toExponential(3)} m²</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>আপেক্ষিক রোধ ({lab2Temperature}°C): ρ_T</span>
                        <span className="text-amber-400 font-bold">{adjustedRho.toExponential(3)} Ω·m</span>
                      </div>
                      <div className="flex justify-between items-center text-slate-300">
                        <span>পরিবাহকত্ব: σ = 1 / ρ</span>
                        <span className="text-slate-400">{wireConductivity.toExponential(3)} (Ω·m)⁻¹</span>
                      </div>
                      <div className="border-t border-slate-800 pt-2 flex justify-between items-center text-sm font-sans font-bold">
                        <span className="text-emerald-400">তারের মোট রোধ R = ρL / A:</span>
                        <span className="text-emerald-300 text-base font-mono">
                          {wireResistance < 1
                            ? `${wireResistance.toFixed(4)} Ω`
                            : wireResistance > 1000
                            ? `${(wireResistance / 1000).toFixed(2)} kΩ`
                            : `${wireResistance.toFixed(2)} Ω`}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-slate-400 bg-slate-800/40 p-3 rounded-lg border border-slate-700/60 leading-relaxed">
                      💡 <strong>বোর্ড পরীক্ষার মূল সূত্র:</strong> তারের দৈর্ঘ্য দ্বিগুণ করলে রোধ দ্বিগুণ হবে। কিন্তু
                      তারের ব্যাসার্ধ দ্বিগুণ করলে প্রস্থচ্ছেদের ক্ষেত্রফল ৪ গুণ বেড়ে রোধ <strong className="text-amber-300">৪ গুণ কমে যাবে</strong>!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 3: SERIES, PARALLEL & LOST VOLTS                            */}
            {/* --------------------------------------------------------------- */}
            {activeLesson === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Control Panel */}
                <div className="lg:col-span-5 space-y-5 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-emerald-400" />
                      <span>বর্তনী সমবায় ও প্যারামিটার কনফিগ</span>
                    </h3>
                  </div>

                  {/* Circuit Topology Mode */}
                  <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-lg border border-slate-800">
                    <button
                      onClick={() => {
                        setCircuitType('series');
                        setIsBrokenBulb(null);
                      }}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        circuitType === 'series'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      শ্রেণি সমবায়
                    </button>
                    <button
                      onClick={() => {
                        setCircuitType('parallel');
                        setIsBrokenBulb(null);
                      }}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        circuitType === 'parallel'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      সমান্তরাল সমবায়
                    </button>
                    <button
                      onClick={() => {
                        setCircuitType('mixed');
                        setIsBrokenBulb(null);
                      }}
                      className={`py-1.5 text-xs font-medium rounded transition-all ${
                        circuitType === 'mixed'
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      মিশ্র সমবায়
                    </button>
                  </div>

                  {/* EMF & Internal Resistance */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">তড়িচ্চালক শক্তি (E):</span>
                        <span className="text-emerald-400 font-mono font-bold">{emfVoltage} V</span>
                      </div>
                      <input
                        type="range"
                        min="3"
                        max="24"
                        step="1"
                        value={emfVoltage}
                        onChange={(e) => setEmfVoltage(Number(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">অভ্যন্তরীণ রোধ (r):</span>
                        <span className="text-rose-400 font-mono font-bold">{internalR} Ω</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="0.1"
                        value={internalR}
                        onChange={(e) => setInternalR(Number(e.target.value))}
                        className="w-full accent-rose-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Resistors R1, R2, R3 sliders */}
                  <div className="space-y-3 p-3 bg-slate-950/80 rounded-lg border border-slate-800">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">রোধক R₁:</span>
                        <span className="text-cyan-400 font-mono font-bold">{r1} Ω</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={r1}
                        onChange={(e) => setR1(Number(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">রোধক R₂:</span>
                        <span className="text-amber-400 font-mono font-bold">{r2} Ω</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={r2}
                        onChange={(e) => setR2(Number(e.target.value))}
                        className="w-full accent-amber-500 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">রোধক R₃:</span>
                        <span className="text-purple-400 font-mono font-bold">{r3} Ω</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="1"
                        value={r3}
                        onChange={(e) => setR3(Number(e.target.value))}
                        className="w-full accent-purple-500 cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Fault Injection: Disconnect/Cut a bulb */}
                  <div className="space-y-2">
                    <span className="text-xs font-semibold text-slate-300 block">
                      ত্রুটি পরীক্ষা: কোনো একটি বাল্ব কেটে গেলে কী ঘটে?
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      <button
                        onClick={() => setIsBrokenBulb(null)}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          isBrokenBulb === null
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        সব সচল
                      </button>
                      <button
                        onClick={() => setIsBrokenBulb(isBrokenBulb === 1 ? null : 1)}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          isBrokenBulb === 1
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        R₁ বিচ্ছিন্ন
                      </button>
                      <button
                        onClick={() => setIsBrokenBulb(isBrokenBulb === 2 ? null : 2)}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          isBrokenBulb === 2
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        R₂ বিচ্ছিন্ন
                      </button>
                      <button
                        onClick={() => setIsBrokenBulb(isBrokenBulb === 3 ? null : 3)}
                        className={`py-1 rounded text-[11px] font-medium border ${
                          isBrokenBulb === 3
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        R₃ বিচ্ছিন্ন
                      </button>
                    </div>
                  </div>
                </div>

                {/* Circuit Live Visualizer & Electrical State Analysis */}
                <div className="lg:col-span-7 space-y-4">
                  {/* Schematic & Nodal Voltage Display */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-slate-200">
                        {circuitType === 'series'
                          ? 'শ্রেণি বর্তনী (Series Circuit)'
                          : circuitType === 'parallel'
                          ? 'সমান্তরাল বর্তনী (Parallel Circuit)'
                          : 'মিশ্র বর্তনী (Mixed Circuit)'}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        তুল্য রোধ R_eq = {req === Infinity ? 'অসীম (Open)' : `${req.toFixed(2)} Ω`}
                      </span>
                    </div>

                    {/* SVG Circuit Schematic */}
                    <div className="relative w-full h-56 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center overflow-hidden">
                      <svg viewBox="0 0 520 220" className="w-full h-full max-h-56">
                        {/* Battery on left */}
                        <line x1="60" y1="50" x2="60" y2="95" stroke="#334155" strokeWidth="3" />
                        <line x1="60" y1="125" x2="60" y2="180" stroke="#334155" strokeWidth="3" />
                        {/* Battery Plates */}
                        <line x1="45" y1="95" x2="75" y2="95" stroke="#10b981" strokeWidth="3.5" />
                        <line x1="50" y1="105" x2="70" y2="105" stroke="#ef4444" strokeWidth="4.5" />
                        <line x1="45" y1="115" x2="75" y2="115" stroke="#10b981" strokeWidth="3.5" />
                        <line x1="50" y1="125" x2="70" y2="125" stroke="#ef4444" strokeWidth="4.5" />

                        {/* Battery label */}
                        <text x="25" y="114" fill="#10b981" fontSize="10" fontWeight="bold">
                          E={emfVoltage}V
                        </text>
                        {internalR > 0 && (
                          <text x="22" y="130" fill="#f43f5e" fontSize="9">
                            r={internalR}Ω
                          </text>
                        )}

                        {/* SERIES LAYOUT */}
                        {circuitType === 'series' && (
                          <g>
                            {/* Top wire */}
                            <line x1="60" y1="50" x2="460" y2="50" stroke="#334155" strokeWidth="3" />
                            {/* Right wire */}
                            <line x1="460" y1="50" x2="460" y2="180" stroke="#334155" strokeWidth="3" />
                            {/* Bottom wire with 3 series resistors */}
                            <line x1="60" y1="180" x2="120" y2="180" stroke="#334155" strokeWidth="3" />

                            {/* Resistor 1 */}
                            <rect
                              x="120"
                              y="170"
                              width="60"
                              height="20"
                              fill={isBrokenBulb === 1 ? '#7f1d1d' : '#0e7490'}
                              stroke={isBrokenBulb === 1 ? '#ef4444' : '#06b6d4'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="150" y="184" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                              {isBrokenBulb === 1 ? 'CUT' : `R₁ ${r1}Ω`}
                            </text>

                            <line x1="180" y1="180" x2="230" y2="180" stroke="#334155" strokeWidth="3" />

                            {/* Resistor 2 */}
                            <rect
                              x="230"
                              y="170"
                              width="60"
                              height="20"
                              fill={isBrokenBulb === 2 ? '#7f1d1d' : '#b45309'}
                              stroke={isBrokenBulb === 2 ? '#ef4444' : '#f59e0b'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="260" y="184" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                              {isBrokenBulb === 2 ? 'CUT' : `R₂ ${r2}Ω`}
                            </text>

                            <line x1="290" y1="180" x2="340" y2="180" stroke="#334155" strokeWidth="3" />

                            {/* Resistor 3 */}
                            <rect
                              x="340"
                              y="170"
                              width="60"
                              height="20"
                              fill={isBrokenBulb === 3 ? '#7f1d1d' : '#6b21a8'}
                              stroke={isBrokenBulb === 3 ? '#ef4444' : '#a855f7'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="370" y="184" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                              {isBrokenBulb === 3 ? 'CUT' : `R₃ ${r3}Ω`}
                            </text>

                            <line x1="400" y1="180" x2="460" y2="180" stroke="#334155" strokeWidth="3" />

                            {/* Series Voltages text */}
                            <text x="150" y="206" fill="#06b6d4" fontSize="9" textAnchor="middle">
                              V₁={v1.toFixed(1)}V
                            </text>
                            <text x="260" y="206" fill="#f59e0b" fontSize="9" textAnchor="middle">
                              V₂={v2.toFixed(1)}V
                            </text>
                            <text x="370" y="206" fill="#a855f7" fontSize="9" textAnchor="middle">
                              V₃={v3.toFixed(1)}V
                            </text>
                          </g>
                        )}

                        {/* PARALLEL LAYOUT */}
                        {circuitType === 'parallel' && (
                          <g>
                            {/* Busbars */}
                            <line x1="60" y1="50" x2="450" y2="50" stroke="#334155" strokeWidth="3.5" />
                            <line x1="60" y1="180" x2="450" y2="180" stroke="#334155" strokeWidth="3.5" />

                            {/* Branch 1 */}
                            <line x1="160" y1="50" x2="160" y2="85" stroke="#334155" strokeWidth="2.5" />
                            <rect
                              x="140"
                              y="85"
                              width="40"
                              height="40"
                              fill={isBrokenBulb === 1 ? '#7f1d1d' : '#0e7490'}
                              stroke={isBrokenBulb === 1 ? '#ef4444' : '#06b6d4'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="160" y="102" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                              R₁
                            </text>
                            <text x="160" y="115" fill="#ffffff" fontSize="9" textAnchor="middle">
                              {r1}Ω
                            </text>
                            <line x1="160" y1="125" x2="160" y2="180" stroke="#334155" strokeWidth="2.5" />
                            <text x="160" y="140" fill="#06b6d4" fontSize="9" textAnchor="middle">
                              I₁={i1.toFixed(2)}A
                            </text>

                            {/* Branch 2 */}
                            <line x1="280" y1="50" x2="280" y2="85" stroke="#334155" strokeWidth="2.5" />
                            <rect
                              x="260"
                              y="85"
                              width="40"
                              height="40"
                              fill={isBrokenBulb === 2 ? '#7f1d1d' : '#b45309'}
                              stroke={isBrokenBulb === 2 ? '#ef4444' : '#f59e0b'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="280" y="102" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                              R₂
                            </text>
                            <text x="280" y="115" fill="#ffffff" fontSize="9" textAnchor="middle">
                              {r2}Ω
                            </text>
                            <line x1="280" y1="125" x2="280" y2="180" stroke="#334155" strokeWidth="2.5" />
                            <text x="280" y="140" fill="#f59e0b" fontSize="9" textAnchor="middle">
                              I₂={i2.toFixed(2)}A
                            </text>

                            {/* Branch 3 */}
                            <line x1="400" y1="50" x2="400" y2="85" stroke="#334155" strokeWidth="2.5" />
                            <rect
                              x="380"
                              y="85"
                              width="40"
                              height="40"
                              fill={isBrokenBulb === 3 ? '#7f1d1d' : '#6b21a8'}
                              stroke={isBrokenBulb === 3 ? '#ef4444' : '#a855f7'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="400" y="102" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                              R₃
                            </text>
                            <text x="400" y="115" fill="#ffffff" fontSize="9" textAnchor="middle">
                              {r3}Ω
                            </text>
                            <line x1="400" y1="125" x2="400" y2="180" stroke="#334155" strokeWidth="2.5" />
                            <text x="400" y="140" fill="#a855f7" fontSize="9" textAnchor="middle">
                              I₃={i3.toFixed(2)}A
                            </text>
                          </g>
                        )}

                        {/* MIXED LAYOUT */}
                        {circuitType === 'mixed' && (
                          <g>
                            {/* Top Wire with R1 in series */}
                            <line x1="60" y1="50" x2="160" y2="50" stroke="#334155" strokeWidth="3" />
                            <rect
                              x="160"
                              y="40"
                              width="60"
                              height="20"
                              fill={isBrokenBulb === 1 ? '#7f1d1d' : '#0e7490'}
                              stroke={isBrokenBulb === 1 ? '#ef4444' : '#06b6d4'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="190" y="54" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                              R₁ ({r1}Ω)
                            </text>
                            <line x1="220" y1="50" x2="280" y2="50" stroke="#334155" strokeWidth="3" />

                            {/* Parallel block (R2 & R3) */}
                            <line x1="280" y1="30" x2="280" y2="90" stroke="#334155" strokeWidth="2.5" />
                            <line x1="280" y1="30" x2="320" y2="30" stroke="#334155" strokeWidth="2.5" />
                            <rect
                              x="320"
                              y="20"
                              width="50"
                              height="20"
                              fill={isBrokenBulb === 2 ? '#7f1d1d' : '#b45309'}
                              stroke={isBrokenBulb === 2 ? '#ef4444' : '#f59e0b'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="345" y="34" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                              R₂ ({r2}Ω)
                            </text>
                            <line x1="370" y1="30" x2="410" y2="30" stroke="#334155" strokeWidth="2.5" />

                            <line x1="280" y1="90" x2="320" y2="90" stroke="#334155" strokeWidth="2.5" />
                            <rect
                              x="320"
                              y="80"
                              width="50"
                              height="20"
                              fill={isBrokenBulb === 3 ? '#7f1d1d' : '#6b21a8'}
                              stroke={isBrokenBulb === 3 ? '#ef4444' : '#a855f7'}
                              strokeWidth="2"
                              rx="3"
                            />
                            <text x="345" y="94" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">
                              R₃ ({r3}Ω)
                            </text>
                            <line x1="370" y1="90" x2="410" y2="90" stroke="#334155" strokeWidth="2.5" />

                            <line x1="410" y1="30" x2="410" y2="90" stroke="#334155" strokeWidth="2.5" />
                            <line x1="410" y1="60" x2="460" y2="60" stroke="#334155" strokeWidth="3" />
                            <line x1="460" y1="60" x2="460" y2="180" stroke="#334155" strokeWidth="3" />
                            <line x1="460" y1="180" x2="60" y2="180" stroke="#334155" strokeWidth="3" />
                          </g>
                        )}
                      </svg>
                    </div>
                  </div>

                  {/* Calculations & Lost Volts Table */}
                  <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">মোট কারেন্ট (I)</span>
                        <span className="text-sm font-bold font-mono text-cyan-400">
                          {totalCurrent.toFixed(2)} A
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">নষ্ট ভোল্টেজ (v = Ir)</span>
                        <span className="text-sm font-bold font-mono text-rose-400">
                          {lostVolts.toFixed(2)} V
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">প্রান্তীয় বিভব (V)</span>
                        <span className="text-sm font-bold font-mono text-emerald-400">
                          {terminalVoltage.toFixed(2)} V
                        </span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="text-[10px] text-slate-400 block">বহিস্থ তুল্য রোধ (Req)</span>
                        <span className="text-sm font-bold font-mono text-amber-400">
                          {req === Infinity ? 'Open' : `${req.toFixed(2)} Ω`}
                        </span>
                      </div>
                    </div>

                    {/* Circuit Failure Analysis Notice */}
                    {isBrokenBulb !== null && (
                      <div className="mt-3 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                        <div>
                          {circuitType === 'series' && (
                            <span>
                              <strong>শ্রেণি বর্তনী বিচ্ছিন্ন:</strong> একটি বাল্ব নষ্ট হওয়ায় সম্পূর্ণ সার্কিট ওপেন
                              হয়ে গেছে! কারেন্ট = ০ অ্যাম্পিয়ার। সব বাতি নিভে গেছে।
                            </span>
                          )}
                          {circuitType === 'parallel' && (
                            <span>
                              <strong>সমান্তরাল সমবায়ের সুবিধা:</strong> R{isBrokenBulb} বিচ্ছিন্ন হলেও বাকি
                              শাখাগুলোতে পুরো ২২০ ভোল্ট কার্যকর রয়েছে এবং স্বাভাবিকভাবে আলো দিচ্ছে!
                            </span>
                          )}
                          {circuitType === 'mixed' && (
                            <span>
                              <strong>মিশ্র বর্তনী ফলাফল:</strong> ব্রাঞ্চ পরিবর্তিত হয়েছে, তুল্য রোধ পুনঃগণনা করা
                              হয়েছে।
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 4: POWER & ELECTRICITY BILL CALCULATOR                      */}
            {/* --------------------------------------------------------------- */}
            {activeLesson === 4 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Household Appliance Usage Table */}
                  <div className="lg:col-span-7 space-y-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Home className="w-4 h-4 text-emerald-400" />
                        <span>বাসাবাড়ির বৈদ্যুতিক যন্ত্রপাতির শক্তি হিসাব (kWh / Unit)</span>
                      </h3>
                      <span className="text-xs text-slate-400">
                        ১ ইউনিট = ১ kWh = ৩৬,০০,০০০ জুল
                      </span>
                    </div>

                    <div className="space-y-3">
                      {appliances.map((app, idx) => {
                        const Icon = app.icon;
                        const dailyKwh = (app.watts * app.count * app.hoursPerDay) / 1000;
                        return (
                          <div
                            key={app.id}
                            className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-[140px]">
                              <Icon className="w-4 h-4 text-amber-400" />
                              <div>
                                <span className="font-semibold text-slate-200 block">{app.nameBn}</span>
                                <span className="text-[10px] text-slate-500 font-mono">{app.watts} W প্রতি ইউনিট</span>
                              </div>
                            </div>

                            {/* Quantity and Hours */}
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-400 text-[11px]">সংখ্যা:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="20"
                                  value={app.count}
                                  onChange={(e) => {
                                    const val = Math.max(1, Number(e.target.value));
                                    setAppliances((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, count: val } : item))
                                    );
                                  }}
                                  className="w-12 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs text-slate-100"
                                />
                              </div>

                              <div className="flex items-center gap-1.5">
                                <span className="text-slate-400 text-[11px]">দৈনিক ঘণ্টা:</span>
                                <input
                                  type="number"
                                  min="0.1"
                                  max="24"
                                  step="0.5"
                                  value={app.hoursPerDay}
                                  onChange={(e) => {
                                    const val = Math.max(0.1, Number(e.target.value));
                                    setAppliances((prev) =>
                                      prev.map((item, i) => (i === idx ? { ...item, hoursPerDay: val } : item))
                                    );
                                  }}
                                  className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-center text-xs text-slate-100"
                                />
                              </div>
                            </div>

                            {/* Daily Consumption */}
                            <div className="text-right sm:min-w-[90px]">
                              <span className="text-emerald-400 font-mono font-bold block">
                                {dailyKwh.toFixed(2)} ইউনিট
                              </span>
                              <span className="text-[10px] text-slate-500">প্রতিদিন</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tariff configuration */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">প্রতি ইউনিট বিদ্যুৎ মূল্য:</span>
                        <input
                          type="number"
                          step="0.5"
                          min="1"
                          max="25"
                          value={ratePerUnit}
                          onChange={(e) => setRatePerUnit(Number(e.target.value))}
                          className="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-center font-bold text-amber-400"
                        />
                        <span className="text-slate-400">টাকা/ইউনিট</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">মাসের দিন সংখ্যা:</span>
                        <select
                          value={daysCount}
                          onChange={(e) => setDaysCount(Number(e.target.value))}
                          className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                        >
                          <option value="28">২৮ দিন</option>
                          <option value="30">৩০ দিন (স্ট্যান্ডার্ড)</option>
                          <option value="31">৩১ দিন</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Monthly Energy & Bill Summary Receipt */}
                  <div className="lg:col-span-5 space-y-4">
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                      <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2 border-b border-slate-800 pb-2">
                        <ReceiptIcon className="w-4 h-4 text-emerald-400" />
                        <span>মাসিক বিদ্যুৎ বিল মেমো (Monthly Electric Bill)</span>
                      </h4>

                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between text-slate-400">
                          <span>দৈনিক মোট শক্তি ব্যয়:</span>
                          <span className="text-slate-200 font-mono font-semibold">{totalDailyKwh.toFixed(2)} kWh</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>মাসে মোট শক্তি ব্যয় ({daysCount} দিনে):</span>
                          <span className="text-emerald-400 font-mono font-bold text-sm">
                            {totalMonthlyKwh.toFixed(1)} BOT ইউনিট
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>শক্তি রূপান্তর (জুল এককে):</span>
                          <span className="text-cyan-400 font-mono text-[11px]">
                            {(totalMonthlyKwh * 3.6e6).toExponential(2)} J
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>ইউনিট প্রতি দর:</span>
                          <span className="text-amber-400 font-mono">{ratePerUnit.toFixed(2)} টাকা</span>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                        <div>
                          <span className="text-xs text-slate-400 block">মোট প্রদেয় বিদ্যুৎ বিল:</span>
                          <span className="text-lg font-bold text-emerald-300 font-mono">
                            ৳ {totalMonthlyCost.toFixed(2)} টাকা
                          </span>
                        </div>
                        <Award className="w-8 h-8 text-emerald-400/40" />
                      </div>

                      <div className="text-[11px] text-slate-400 bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
                        <strong className="text-slate-200">বোর্ড পরীক্ষায় ইউনিট হিসাবের নিয়ম:</strong>
                        <p>
                          <RenderMathText text="$W = \frac{P \times t}{1000} \text{ kWh (ইউনিট)}$" />
                        </p>
                        <p className="text-slate-400">
                          এখানে ক্ষমতা $P$ অবশ্যই ওয়াটে ($W$) এবং সময় $t$ মোট ঘণ্টায় বসাতে হবে।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sub-Lab: High Voltage Grid Transmission & System Loss (NCTB Page 319-320) */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-400" />
                        <span>উচ্চ ভোল্টেজে বিদ্যুৎ সঞ্চালন ও সিস্টেম লস (NCTB পৃষ্ঠা ৩১৯)</span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <RenderMathText text="সঞ্চালন তারে তাপ হিসেবে শক্তি ক্ষয় $P_{\text{loss}} = I^2 R$। ভোল্টেজ বাড়ালে কারেন্ট কমে, ফলে ক্ষয় শতগুণ হ্রাস পায়।" />
                      </p>
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                      গ্রিড ক্ষমতা = {gridPowerKw} kW | তারের রোধ = {lineResistance} Ω
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    {[
                      { v: 220, label: '২২০ ভোল্ট (লোকাল লাইন)' },
                      { v: 11000, label: '১১,০০০ ভোল্ট (১১ kV)' },
                      { v: 33000, label: '৩৩,০০০ ভোল্ট (৩৩ kV)' },
                      { v: 132000, label: '১,৩২,০০০ ভোল্ট (১৩২ kV গ্রিড)' },
                    ].map((opt) => (
                      <button
                        key={opt.v}
                        onClick={() => setGridVoltage(opt.v)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          gridVoltage === opt.v
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300 shadow-sm'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-xs font-bold block">{opt.label}</span>
                        <span className="text-[10px] text-slate-500 font-mono">V = {opt.v} V</span>
                      </button>
                    ))}
                  </div>

                  {/* Transmission Metrics */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 bg-slate-950 rounded-lg border border-slate-800 text-center">
                    <div>
                      <span className="text-[10px] text-slate-400 block">সঞ্চালন কারেন্ট (I = P/V)</span>
                      <span className="text-sm font-bold font-mono text-cyan-400">
                        {gridCurrent > 10 ? gridCurrent.toFixed(1) : gridCurrent.toFixed(3)} A
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">সিস্টেম লস (P_loss = I²R)</span>
                      <span className="text-sm font-bold font-mono text-rose-400">
                        {gridPowerLossKw > 1 ? `${gridPowerLossKw.toFixed(1)} kW` : `${gridPowerLossW.toFixed(1)} W`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">লস শতাংশ (Loss %)</span>
                      <span className="text-sm font-bold font-mono text-amber-400">
                        {gridLossPercent.toFixed(2)} %
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">গ্রিড দক্ষতা (Efficiency)</span>
                      <span className="text-sm font-bold font-mono text-emerald-400">
                        {(100 - gridLossPercent).toFixed(2)} %
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 bg-slate-900 p-3 rounded-lg border border-slate-800">
                    ⚠️ <strong>পাঠ্যবইয়ের গভীর ব্যাখ্যা:</strong>{' '}
                    <RenderMathText text="অনেকে ভাবতে পারে $P = V^2/R$ হওয়ায় ভোল্টেজ বাড়ালে লস বাড়ার কথা! কিন্তু মনে রাখতে হবে, এখানে $V$ হলো সঞ্চালন তারের দুই মাথার বিভব নয়, এটি হলো উৎসের বিভব। তারের দুই মাথার বিভব পার্থক্য হলো $I \times R_{\text{line}}$। তাই লস গণনায় সর্বদা $I^2 R$ ব্যবহার করতে হবে।" />
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 5: HOUSEHOLD ELECTRICAL SAFETY & SHORT-CIRCUITS             */}
            {/* --------------------------------------------------------------- */}
            {activeLesson === 5 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  {/* Safety Controls Panel */}
                  <div className="lg:col-span-5 space-y-4 bg-slate-900/40 border border-slate-800 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>গৃহস্থালি সংযোগ ও সুরক্ষা ব্যবস্থা</span>
                    </h3>

                    {/* Main Switch Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">মেইন সুইচ (Main Switch)</span>
                        <span className="text-[10px] text-slate-500">সমগ্র বাড়ির প্রধান বিদ্যুৎ সংযোগ</span>
                      </div>
                      <button
                        onClick={() => setIsMainSwitchOn(!isMainSwitchOn)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                          isMainSwitchOn
                            ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        {isMainSwitchOn ? 'চালু (ON)' : 'বন্ধ (OFF)'}
                      </button>
                    </div>

                    {/* Fuse Rating Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400">সার্কিট ফিউজ রেটিং (Fuse/MCB Rating):</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { rating: 5, label: '৫ A (বাতি/ফ্যান)' },
                          { rating: 15, label: '১৫ A (হিটার/পাম্প)' },
                          { rating: 30, label: '৩০ A (রিং মেইন)' },
                        ].map((f) => (
                          <button
                            key={f.rating}
                            onClick={() => setFuseRatingAmps(f.rating)}
                            className={`p-2 rounded-lg border text-center text-xs transition-all ${
                              fuseRatingAmps === f.rating
                                ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span>{f.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Switch Placement Toggle (Live vs Neutral Wire) */}
                    <div className="space-y-1.5">
                      <span className="text-xs text-slate-400 block">সুইচের সংযোগস্থল (NCTB চিত্র ১১.১৫):</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setSwitchPosition('live')}
                          className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                            switchPosition === 'live'
                              ? 'bg-emerald-500/10 border-emerald-500 text-emerald-300 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="block font-bold">লাইভ তারে (সঠিক)</span>
                          <span className="text-[10px] text-slate-500">যন্ত্রে ২২০V বিচ্ছিন্ন হয়</span>
                        </button>
                        <button
                          onClick={() => setSwitchPosition('neutral')}
                          className={`p-2.5 rounded-lg border text-xs text-left transition-all ${
                            switchPosition === 'neutral'
                              ? 'bg-rose-500/10 border-rose-500 text-rose-300 font-semibold'
                              : 'bg-slate-950 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="block font-bold">নিউট্রালে (বিপজ্জনক!)</span>
                          <span className="text-[10px] text-slate-500">যন্ত্রের ভেতর ২২০V থাকে</span>
                        </button>
                      </div>
                    </div>

                    {/* Earth Wire Toggle */}
                    <div className="flex items-center justify-between p-3 rounded-lg bg-slate-950 border border-slate-800">
                      <div>
                        <span className="text-xs font-semibold text-slate-200 block">ভূমি সংযোগ (Earth / Grounding)</span>
                        <span className="text-[10px] text-slate-500">ধাতব কাঠামোর সাথে মাটির সংযোগ</span>
                      </div>
                      <button
                        onClick={() => setIsEarthConnected(!isEarthConnected)}
                        className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                          isEarthConnected
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}
                      >
                        {isEarthConnected ? 'আর্থিং সক্রিয়' : 'আর্থিং বিচ্ছিন্ন'}
                      </button>
                    </div>

                    {/* Hazard Simulation Toggles */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <span className="text-xs font-semibold text-slate-300 block">দুর্ঘটনা সিমুলেশন ট্রিগার:</span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setIsShortCircuited(!isShortCircuited)}
                          className={`p-2 rounded text-xs font-medium border transition-colors ${
                            isShortCircuited
                              ? 'bg-rose-600 text-white border-rose-500 animate-pulse'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {isShortCircuited ? 'শর্ট-সার্কিট সক্রিয়!' : 'শর্ট-সার্কিট তৈরি করো'}
                        </button>

                        <button
                          onClick={() => setIsChassisLeakage(!isChassisLeakage)}
                          className={`p-2 rounded text-xs font-medium border transition-colors ${
                            isChassisLeakage
                              ? 'bg-amber-600 text-white border-amber-500'
                              : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                          }`}
                        >
                          {isChassisLeakage ? 'বডি বিদ্যুতায়িত!' : 'যন্ত্রের বডি লিকেজ'}
                        </button>
                      </div>
                    </div>

                    {/* Human Touch & Wet Hand Options */}
                    <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">মানুষ যন্ত্রটি স্পর্শ করছে:</span>
                        <input
                          type="checkbox"
                          checked={isHumanTouching}
                          onChange={(e) => setIsHumanTouching(e.target.checked)}
                          className="w-4 h-4 accent-amber-500 cursor-pointer"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-300">হাত/পা ভেজা (১,০০০ Ω বনাম ১,০০,০০০ Ω):</span>
                        <input
                          type="checkbox"
                          checked={isWetHands}
                          onChange={(e) => setIsWetHands(e.target.checked)}
                          className="w-4 h-4 accent-cyan-500 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* SVG Household Wiring Visualizer & Status Feed */}
                  <div className="lg:col-span-7 space-y-4">
                    {/* SVG Diagram modeled on Figure 11.17 */}
                    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-200">
                          বাসাবাড়ির বিদ্যুৎ সরবরাহ বর্তনী (NCTB চিত্র ১১.১৭)
                        </span>
                        <span className="text-[10px] text-slate-400">
                          লাল = লাইভ (২২০V) | নীল = নিউট্রাল (০V) | সবুজ = আর্থিং
                        </span>
                      </div>

                      <div className="relative w-full h-64 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden flex items-center justify-center">
                        <svg viewBox="0 0 520 250" className="w-full h-full max-h-64">
                          {/* Live wire (Red) */}
                          <line x1="20" y1="40" x2="100" y2="40" stroke="#ef4444" strokeWidth="3" />
                          {/* Neutral wire (Blue) */}
                          <line x1="20" y1="70" x2="100" y2="70" stroke="#3b82f6" strokeWidth="3" />

                          {/* Meter Box */}
                          <rect x="100" y="25" width="55" height="65" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4" />
                          <text x="127" y="45" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                            METER
                          </text>
                          <text x="127" y="65" fill="#10b981" fontSize="9" fontWeight="bold" textAnchor="middle">
                            kWh
                          </text>

                          {/* Consumer unit / Main Switch */}
                          <line x1="155" y1="40" x2="200" y2="40" stroke="#ef4444" strokeWidth="3" />
                          <line x1="155" y1="70" x2="200" y2="70" stroke="#3b82f6" strokeWidth="3" />

                          <rect x="200" y="20" width="70" height="75" fill="#0f172a" stroke="#cbd5e1" strokeWidth="2" rx="4" />
                          <text x="235" y="38" fill="#f8fafc" fontSize="8" fontWeight="bold" textAnchor="middle">
                            MAIN BOX
                          </text>

                          {/* Main Switch Contacts inside box */}
                          <circle cx="215" cy="55" r="3" fill="#ef4444" />
                          <circle cx="245" cy="55" r="3" fill="#ef4444" />
                          {isMainSwitchOn ? (
                            <line x1="215" y1="55" x2="245" y2="55" stroke="#ef4444" strokeWidth="2.5" />
                          ) : (
                            <line x1="215" y1="55" x2="235" y2="45" stroke="#ef4444" strokeWidth="2.5" />
                          )}

                          {/* Fuse representation */}
                          <g transform="translate(290, 30)">
                            <rect
                              x="0"
                              y="0"
                              width="50"
                              height="22"
                              fill="#1e293b"
                              stroke={isFuseBlown ? '#ef4444' : '#f59e0b'}
                              strokeWidth="2"
                              rx="3"
                            />
                            {isFuseBlown ? (
                              <path d="M 10 11 L 20 6 L 25 15 L 40 11" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" fill="none" />
                            ) : (
                              <line x1="10" y1="11" x2="40" y2="11" stroke="#f59e0b" strokeWidth="2" />
                            )}
                            <text x="25" y="19" fill={isFuseBlown ? '#ef4444' : '#f59e0b'} fontSize="7" fontWeight="bold" textAnchor="middle">
                              {fuseRatingAmps}A {isFuseBlown ? 'BLOWN' : 'FUSE'}
                            </text>
                          </g>

                          {/* Wires to Appliance */}
                          <line x1="270" y1="40" x2="290" y2="40" stroke="#ef4444" strokeWidth="3" />
                          <line
                            x1="340"
                            y1="40"
                            x2="400"
                            y2="40"
                            stroke={isFuseBlown || !isMainSwitchOn ? '#64748b' : '#ef4444'}
                            strokeWidth="3"
                          />
                          <line x1="270" y1="70" x2="400" y2="70" stroke="#3b82f6" strokeWidth="3" />

                          {/* Switch on appliance line */}
                          <g transform="translate(385, 30)">
                            <circle cx="10" cy="10" r="3" fill="#ef4444" />
                            <circle cx="30" cy="10" r="3" fill="#ef4444" />
                            {switchPosition === 'live' ? (
                              <line x1="10" y1="10" x2="30" y2="10" stroke="#ef4444" strokeWidth="2.5" />
                            ) : (
                              <line x1="10" y1="10" x2="25" y2="0" stroke="#ef4444" strokeWidth="2.5" />
                            )}
                          </g>

                          {/* Appliance Metal Body Chassis (Heater / Washing machine) */}
                          <rect
                            x="430"
                            y="25"
                            width="75"
                            height="120"
                            fill="#1e293b"
                            stroke={isChassisLeakage ? '#f43f5e' : '#64748b'}
                            strokeWidth={isChassisLeakage ? '3' : '2'}
                            rx="5"
                          />
                          <text x="467" y="45" fill="#f8fafc" fontSize="9" fontWeight="bold" textAnchor="middle">
                            HEATER
                          </text>

                          {/* Heating coil inside */}
                          <path
                            d="M 445 70 Q 467 60 467 75 Q 467 90 445 95 Q 467 100 467 115"
                            fill="none"
                            stroke={
                              isMainSwitchOn && !isFuseBlown && switchPosition === 'live'
                                ? '#f59e0b'
                                : '#475569'
                            }
                            strokeWidth="2.5"
                          />

                          {/* Earth Wire (Green) */}
                          <line
                            x1="430"
                            y1="130"
                            x2="320"
                            y2="130"
                            stroke={isEarthConnected ? '#10b981' : '#475569'}
                            strokeWidth="2.5"
                            strokeDasharray={isEarthConnected ? 'none' : '4,4'}
                          />
                          <line
                            x1="320"
                            y1="130"
                            x2="320"
                            y2="180"
                            stroke={isEarthConnected ? '#10b981' : '#475569'}
                            strokeWidth="2.5"
                          />
                          {/* Ground spikes symbol */}
                          <line x1="305" y1="180" x2="335" y2="180" stroke="#10b981" strokeWidth="2" />
                          <line x1="310" y1="186" x2="330" y2="186" stroke="#10b981" strokeWidth="2" />
                          <line x1="315" y1="192" x2="325" y2="192" stroke="#10b981" strokeWidth="2" />
                          <text x="320" y="206" fill="#10b981" fontSize="9" textAnchor="middle">
                            EARTH
                          </text>

                          {/* Human touching appliance */}
                          {isHumanTouching && (
                            <g transform="translate(470, 150)">
                              <circle cx="20" cy="15" r="10" fill="#f59e0b" />
                              <line x1="20" y1="25" x2="20" y2="55" stroke="#f59e0b" strokeWidth="3" />
                              <line x1="20" y1="35" x2="0" y2="15" stroke="#f59e0b" strokeWidth="3" />
                              <line x1="20" y1="55" x2="10" y2="85" stroke="#f59e0b" strokeWidth="3" />
                              <line x1="20" y1="55" x2="30" y2="85" stroke="#f59e0b" strokeWidth="3" />
                            </g>
                          )}
                        </svg>
                      </div>
                    </div>

                    {/* Live Safety Status Alert Banner */}
                    <div className="space-y-3">
                      {isFuseBlown && (
                        <div className="p-3 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                          <Flame className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>
                            <strong>ফিউজ তার গলে গেছে!</strong> বর্তনীতে {circuitCurrentAmps.toFixed(1)} অ্যাম্পিয়ার
                            প্রবাহ ঢোকার কারণে ফিউজের নিরাপদ সীমা ({fuseRatingAmps} A) অতিক্রম করায় তাপজনিত কারণে তারটি
                            গলে সংযোগ বিচ্ছিন্ন করেছে। আগুন থেকে বাড়ি রক্ষা পেল!
                          </span>
                        </div>
                      )}

                      {humanCurrentMa > 0 && (
                        <div
                          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                            humanCurrentMa >= 10
                              ? 'bg-rose-600/30 border-rose-500 text-rose-200 animate-pulse font-bold'
                              : 'bg-amber-500/20 border-amber-500/40 text-amber-200'
                          }`}
                        >
                          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-400" />
                          <div>
                            <span>
                              মানবদেহের ভেতর প্রবাহ: <strong>{humanCurrentMa.toFixed(1)} mA</strong>!{' '}
                              {humanCurrentMa >= 10
                                ? '⚠️ প্রাণঘাতী শক! হৃদপিণ্ডের ভেতর দিয়ে ১০ mA এর বেশি বিদ্যুৎ প্রবাহিত হলে পেশী সংকোচন ঘটে ও মৃত্যুঝুঁকি তৈরি হয়।'
                                : 'ঝিনঝিন অনুভূতি, মারাত্মক বিপদ নেই।'}
                            </span>
                          </div>
                        </div>
                      )}

                      {isEarthConnected && isChassisLeakage && (
                        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>
                            <strong>আর্থিং সুরক্ষার জয়:</strong> যন্ত্রের বডিতে লিকেজ থাকলেও আর্থিং তারের অত্যন্ত কম
                            রোধের কারণে সমুদয় বিপজ্জনক কারেন্ট সরাসরি মাটিতে নেমে গেছে! স্পর্শকারী মানুষ সম্পূর্ণ নিরাপদ।
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sub-Lab: Bird on High Voltage Wire vs Bat Wing Span */}
                <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-emerald-400" />
                      <span>বৈদ্যুতিক তারে পাখি বনাম বাদুড়ের রহস্য (NCTB অনুশীলনী প্রশ্ন ৫)</span>
                    </h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-emerald-400 block">
                        ১. পাখি কেন মরে না? (Bird on Single Wire)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        একটি পাখি যখন বৈদ্যুতিক উচ্চ বিভবের (যেমন ১১,০০০ ভোল্ট) তারের ওপর বসে, তখন তার দুটি পা-ই একই তারের
                        খুব কাছাকাছি দুটি বিন্দু স্পর্শ করে। পাখির দুই পায়ের মধ্যবর্তী তারের রোধ প্রায় শূন্য হওয়ায় তাদের মাঝে{' '}
                        <strong className="text-emerald-300">কোনো বিভব পার্থক্য থাকে না (ΔV = 0 V)</strong>। বিভব পার্থক্য
                        না থাকলে পাখির দেহের ভেতর কোনো কারেন্ট প্রবাহিত হতে পারে না ($I = 0$ A)। ফলে পাখিটি সম্পূর্ণ নিরাপদ
                        থাকে!
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                      <span className="text-xs font-bold text-rose-400 block">
                        ২. বাদুড় কেন বিদ্যুৎস্পৃষ্ট হয়ে মারা যায়? (Bat Electrocution)
                      </span>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        বাদুড়ের ডানা অনেক বড় ও প্রশস্ত। ওড়ার সময় বা ঝুলতে গিয়ে তার একটি ডানা লাইভ তার এবং অন্য ডানা পার্শ্ববর্তী
                        অন্য কোনো লাইভ তার বা আর্থিং খুঁটির সংস্পর্শে চলে আসে। এর ফলে তার শরীরের দুই প্রান্তের মাঝে{' '}
                        <strong className="text-rose-300">বিপুল বিভব পার্থক্য (ΔV = ২২০V বা ১১,০০০V)</strong> তৈরি হয়। উচ্চ
                        বিভবের কারণে বাদুড়ের শরীরের ভেতর দিয়ে মুহূর্তেই প্রাণঘাতী উচ্চ কারেন্ট প্রবাহিত হয়ে তাকে অঙ্গার করে দেয়!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 2: WORKED BOARD CQS WITH EXAMINER SECRET RUBRICS            */}
        {/* ================================================================= */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্নব্যাংক
              </span>
              <h2 className="text-lg lg:text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-400" />
                <span>বোর্ড সৃজনশীল প্রশ্ন ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক</span>
              </h2>
              <p className="text-xs lg:text-sm text-slate-400 mt-1">
                এনসিটিবি পাঠ্যবই ও শীর্ষ শিক্ষা বোর্ডের বিগত বছরের সৃজনশীল প্রশ্নসমূহের হুবহু সমাধান এবং পরীক্ষক কীভাবে
                নম্বর বণ্টন করেন তার বিস্তারিত গাইড।
              </p>
            </div>

            {/* CQ List Accordion */}
            <div className="space-y-4">
              {/* CQ 1: Textbook Page 328 CQ 1 (Nichrome vs Copper in Heater) */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenCqId(openCqId === 1 ? null : 1)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400">সৃজনশীল ১ · পাঠ্যবই পৃষ্ঠা ৩২৮</span>
                    <h3 className="text-sm font-semibold text-slate-200">
                      বৈদ্যুতিক হিটারে নাইক্রোম তার বনাম তামার তারের রোধ ও উপযোগিতা বিশ্লেষণ
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openCqId === 1 ? 'rotate-180' : ''}`}
                  />
                </button>

                {openCqId === 1 && (
                  <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs leading-relaxed">
                    <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                      <strong className="text-slate-100 block">উদ্দীপক:</strong>
                      <RenderMathText text="একটি বৈদ্যুতিক হিটারে ব্যবহৃত নাইক্রোম তারের দৈর্ঘ্য ও প্রস্থচ্ছেদের ক্ষেত্রফল যথাক্রমে $20\text{ cm}$ এবং $2 \times 10^{-7}\text{ m}^2$। নাইক্রোমের আপেক্ষিক রোধ $100 \times 10^{-8}\ \Omega\text{ m}$। নাইক্রোম তারটিকে একই দৈর্ঘ্য ও প্রস্থচ্ছেদের ক্ষেত্রফল বিশিষ্ট তামার তার দ্বারা প্রতিস্থাপন করা হলো। তামার তারের আপেক্ষিক রোধ $1.7 \times 10^{-8}\ \Omega\text{ m}$।" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="font-bold text-slate-200 block">(ক) রোধ কাকে বলে? [১ নম্বর]</span>
                        <p className="text-slate-400 mt-1">
                          <strong>উত্তর:</strong> পরিবাহীর যে ধর্মের জন্য এর মধ্য দিয়ে তড়িৎপ্রবাহ বাধাগ্রস্ত হয়, তাকে
                          রোধ (Resistance) বলে।
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (খ) বৈদ্যুতিক হিটারে নাইক্রোম তার ব্যবহার করা হয় কেন? [২ নম্বর]
                        </span>
                        <div className="text-slate-400 mt-1">
                          <strong>উত্তর:</strong>{' '}
                          <RenderMathText text="নাইক্রোম হলো নিকেল, ক্রোমিয়াম ও লোহার একটি সংকর ধাতু। এর আপেক্ষিক রোধ সাধারণ পরিবাহী তামার চেয়ে প্রায় ৬০ গুণ বেশি ($100 \times 10^{-8}\ \Omega\text{ m}$) এবং এর গলনাঙ্ক অত্যন্ত উচ্চ (প্রায় ১৪০০°C)। ফলে এর মধ্য দিয়ে বিদ্যুৎ প্রবাহিত হলে প্রচুর তাপশক্তি ($H = I^2Rt$) উৎপন্ন হয় এবং লোহিত তপ্ত অবস্থায়ও এটি বাতাসের অক্সিজেনের সাথে জারিত হয়ে ক্ষয়প্রাপ্ত বা পুড়ে যায় না। তাই হিটারে নাইক্রোম তার ব্যবহৃত হয়।" />
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (গ) ব্যবহৃত তামার তারের রোধ নির্ণয় করো। [৩ নম্বর]
                        </span>
                        <div className="text-slate-300 font-mono mt-1 space-y-1 bg-slate-900 p-3 rounded border border-slate-800">
                          <div><RenderMathText text="আমরা জানি, পরিবাহীর রোধ $R = \rho \frac{L}{A}$" /></div>
                          <div><RenderMathText text="এখানে, দৈর্ঘ্য $L = 20\text{ cm} = 0.2\text{ m}$" /></div>
                          <div><RenderMathText text="প্রস্থচ্ছেদ $A = 2 \times 10^{-7}\text{ m}^2$" /></div>
                          <div><RenderMathText text="তামার আপেক্ষিক রোধ $\rho = 1.7 \times 10^{-8}\ \Omega\text{ m}$" /></div>
                          <div className="text-emerald-400 font-bold">
                            <RenderMathText text="$R_{\text{copper}} = \frac{1.7 \times 10^{-8} \times 0.2}{2 \times 10^{-7}} = 0.017\ \Omega$ (উত্তর)" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (ঘ) তামার তার ব্যবহারের যৌক্তিকতা বিশ্লেষণ করো। [৪ নম্বর]
                        </span>
                        <div className="text-slate-300 mt-1 space-y-2">
                          <p>নাইক্রোম তারের রোধ নির্ণয় করি:</p>
                          <div className="font-mono bg-slate-900 p-2 rounded border border-slate-800 text-amber-300">
                            <RenderMathText text="$R_{\text{nichrome}} = \frac{\rho L}{A} = \frac{100 \times 10^{-8} \times 0.2}{2 \times 10^{-7}} = 1.0\ \Omega$" />
                          </div>
                          <div>
                            <RenderMathText text="দেখা যাচ্ছে, নাইক্রোম তারের রোধ $1.0\ \Omega$ অথচ তামার তারের রোধ মাত্র $0.017\ \Omega$, যা নাইক্রোমের প্রায় ৫৮.৮ গুণ কম!" />
                          </div>
                          <div>
                            <RenderMathText text="হিটারে ২২০ ভোল্ট লাইনে তামার তার লাগালে ওহমের সূত্রানুযায়ী প্রবাহ হবে $I = V / R = 220 / 0.017 \approx 12,941\text{ A}$! এত বিপুল প্রবাহ কার্যত শর্ট-সার্কিট ঘটাবে, সঙ্গে সঙ্গে মেইন ফিউজ বা সার্কিট ব্রেকার ট্রিপ করবে এবং ঘরের তার জ্বলে অগ্নিকাণ্ড ঘটতে পারে। তাছাড়া তামার গলনাঙ্ক কম হওয়ায় তা গলে যাবে এবং কাম্য উত্তাপ সরবরাহ করতে পারবে না। অতএব, হিটারে তামার তার ব্যবহার মোটেই যুক্তিসঙ্গত নয়।" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Examiner Secret Rubric Card */}
                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1.5">
                      <span className="font-bold flex items-center gap-1.5 text-xs">
                        <Award className="w-4 h-4 text-emerald-400" />
                        <span>পরীক্ষকের গোপন কথা (Examiner Marking Rubric):</span>
                      </span>
                      <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-300">
                        <li><RenderMathText text="(গ) অংশে দৈর্ঘ্য $L$ কে মিটারে রূপান্তর ($0.2\text{ m}$) না করলে পুরো ৩ নম্বর কাটা যাবে!" /></li>
                        <li><RenderMathText text="(ঘ) অংশে শুধু তামা ব্যবহার অনুচিত লিখলে ১ নম্বর পাবে; নাইক্রোমের রোধ $1\ \Omega$ ও তামার রোধ $0.017\ \Omega$ এর গাণিতিক তুলনা দেখালে পূর্ণ ৪ নম্বর নিশ্চিত।" /></li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 2: Textbook Page 328 CQ 2 (Alvi vs Alif Electric Bill) */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenCqId(openCqId === 2 ? null : 2)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400">সৃজনশীল ২ · পাঠ্যবই পৃষ্ঠা ৩২৮</span>
                    <h3 className="text-sm font-semibold text-slate-200">
                      আলভি ও আলিফের বিদ্যুৎ শক্তি খরচ ও আর্থিক মিতব্যয়িতা বিশ্লেষণ
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openCqId === 2 ? 'rotate-180' : ''}`}
                  />
                </button>

                {openCqId === 2 && (
                  <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs leading-relaxed">
                    <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                      <strong className="text-slate-100 block">উদ্দীপক:</strong>
                      <RenderMathText text="পড়ার সময় আলভি $220\text{ V} - 100\text{ W}$ এর একটি বাতি দৈনিক ৩ ঘণ্টা করে ব্যবহার করে। অন্যদিকে তার ভাই আলিফ $220\text{ V} - 40\text{ W}$ এর একটি টেবিল ল্যাম্প দৈনিক ৪ ঘণ্টা করে ব্যবহার করে। প্রতি ইউনিট বিদ্যুৎ শক্তির মূল্য ৩.৫০ টাকা।" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="font-bold text-slate-200 block">(ক) ওহমের সূত্রটি লেখ। [১ নম্বর]</span>
                        <p className="text-slate-400 mt-1">
                          <strong>উত্তর:</strong> তাপমাত্রা স্থির থাকলে কোনো পরিবাহীর মধ্য দিয়ে প্রবাহিত তড়িৎপ্রবাহ
                          পরিবাহীর দুই প্রান্তের বিভব পার্থক্যের সমানুপাতিক।
                        </p>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (খ) পরিবাহকের দৈর্ঘ্য ৫ গুণ বৃদ্ধি করলে রোধের কী পরিবর্তন হবে? [২ নম্বর]
                        </span>
                        <div className="text-slate-400 mt-1">
                          <strong>উত্তর:</strong>{' '}
                          <RenderMathText text="পরিবাহকের উপাদান, তাপমাত্রা ও প্রস্থচ্ছেদের ক্ষেত্রফল স্থির থাকলে রোধ তার দৈর্ঘ্যের সমানুপাতিক ($R \propto L$)। সুতরাং পরিবাহকের দৈর্ঘ্য ৫ গুণ করা হলে তার রোধও আদি রোধের ৫ গুণ বৃদ্ধি পাবে।" />
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (গ) আলিফের বাতির প্রবাহমাত্রা নির্ণয় করো। [৩ নম্বর]
                        </span>
                        <div className="text-slate-300 font-mono mt-1 space-y-1 bg-slate-900 p-3 rounded border border-slate-800">
                          <div><RenderMathText text="আমরা জানি, ক্ষমতা $P = VI \implies I = \frac{P}{V}$" /></div>
                          <div><RenderMathText text="আলিফের বাতির ক্ষমতা $P = 40\text{ W}$, ভোল্টেজ $V = 220\text{ V}$" /></div>
                          <div className="text-emerald-400 font-bold">
                            <RenderMathText text="$I = \frac{40}{220} = 0.1818\text{ A} \approx 0.182\text{ A}$ (উত্তর)" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (ঘ) আর্থিক দিক বিবেচনায় আলভি ও আলিফের মধ্যে কে মিতব্যয়ী? [৪ নম্বর]
                        </span>
                        <div className="text-slate-300 mt-1 space-y-2">
                          <p>১ মাসে (৩০ দিনে) ব্যয়িত বিদ্যুৎ শক্তি নির্ণয় করি:</p>
                          <div className="font-mono bg-slate-900 p-3 rounded border border-slate-800 space-y-2">
                            <div>
                              <span className="text-slate-400">আলভির ব্যয়িত শক্তি:</span>
                              <div className="text-cyan-300">
                                <RenderMathText text="$W_1 = \frac{P_1 \times t_1}{1000} = \frac{100 \times (3 \times 30)}{1000} = 9\text{ kWh (ইউনিট)}$" />
                              </div>
                              <div className="text-cyan-300">
                                <RenderMathText text="আলভির মাসিক খরচ $= 9 \times 3.5 = 31.50\text{ টাকা}$" />
                              </div>
                            </div>
                            <div className="border-t border-slate-800 pt-2">
                              <span className="text-slate-400">আলিফের ব্যয়িত শক্তি:</span>
                              <div className="text-amber-300">
                                <RenderMathText text="$W_2 = \frac{P_2 \times t_2}{1000} = \frac{40 \times (4 \times 30)}{1000} = 4.8\text{ kWh (ইউনিট)}$" />
                              </div>
                              <div className="text-amber-300">
                                <RenderMathText text="আলিফের মাসিক খরচ $= 4.8 \times 3.5 = 16.80\text{ টাকা}$" />
                              </div>
                            </div>
                          </div>
                          <p>
                            আলভির মাসিক বিল ৩১.৫০ টাকা এবং আলিফের মাত্র ১৬.৮০ টাকা। আলিফের মাসিক সাশ্রয় = ৩১.৫০ - ১৬.৮০ ={' '}
                            <strong>১৪.৭০ টাকা</strong>। অতএব, আলিফ দৈনিক ১ ঘণ্টা বেশি সময় ব্যবহার করলেও কম ওয়াটের বাতি
                            ব্যবহার করায় আর্থিক দিক থেকে আলিফ অনেক বেশি মিতব্যয়ী।
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 space-y-1 text-[11px]">
                      <strong className="block text-emerald-400">পরীক্ষকের মূল্যায়ন নোট:</strong>
                      <span>
                        মাসিক হিসেবে ৩০ দিন গুণ করতে ভুললে ১ নম্বর কাটা যাবে। উত্তরপত্রে দুই ভাইয়ের খরচের পার্থক্য
                        (১৪.৭০ টাকা) স্পষ্টভাবে উল্লেখ করা বাঞ্ছনীয়।
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 3: Dhaka Board CQ (Mixed Circuit with Internal Resistance & Lost Volts) */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenCqId(openCqId === 3 ? null : 3)}
                  className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-1">
                    <span className="text-xs font-bold text-emerald-400">সৃজনশীল ৩ · ঢাকা বোর্ড স্ট্যান্ডার্ড</span>
                    <h3 className="text-sm font-semibold text-slate-200">
                      মিশ্র বর্তনীতে তুল্য রোধ, অভ্যন্তরীণ রোধ, নষ্ট ভোল্টেজ ও শাখা প্রবাহ
                    </h3>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${openCqId === 3 ? 'rotate-180' : ''}`}
                  />
                </button>

                {openCqId === 3 && (
                  <div className="p-5 border-t border-slate-800 bg-slate-950/60 space-y-4 text-xs leading-relaxed">
                    <div className="p-3.5 bg-slate-900 rounded-lg border border-slate-800 space-y-1 text-slate-300">
                      <strong className="text-slate-100 block">উদ্দীপক:</strong>
                      <RenderMathText text="একটি কোষের তড়িচ্চালক শক্তি $E = 12\text{ V}$ এবং অভ্যন্তরীণ রোধ $r = 1\ \Omega$। কোষটির সাথে $R_1 = 6\ \Omega$ এবং $R_2 = 12\ \Omega$ রোধক দুটি সমান্তরালে এবং তাদের সমবায়ের সাথে $R_3 = 4\ \Omega$ মানের আরেকটি রোধক শ্রেণিতে যুক্ত করে একটি পূর্ণ বর্তনী তৈরি করা হলো।" />
                    </div>

                    <div className="space-y-3">
                      <div>
                        <span className="font-bold text-slate-200 block">(গ) বর্তনীর মূল প্রবাহ ও নষ্ট ভোল্টেজ নির্ণয় করো। [৩ নম্বর]</span>
                        <div className="text-slate-300 font-mono mt-1 space-y-1.5 bg-slate-900 p-3 rounded border border-slate-800">
                          <div><RenderMathText text="সমান্তরাল অংশের তুল্য রোধ: $R_p = \frac{R_1 R_2}{R_1 + R_2} = \frac{6 \times 12}{6 + 12} = \frac{72}{18} = 4\ \Omega$" /></div>
                          <div><RenderMathText text="সম্পূর্ণ বর্তনীর বহিস্থ রোধ: $R = R_p + R_3 = 4 + 4 = 8\ \Omega$" /></div>
                          <div><RenderMathText text="বর্তমানের মোট প্রবাহ: $I = \frac{E}{R + r} = \frac{12}{8 + 1} = \frac{12}{9} = 1.333\text{ A}$" /></div>
                          <div className="text-emerald-400 font-bold">
                            <RenderMathText text="নষ্ট ভোল্টেজ $v = Ir = 1.333 \times 1 = 1.333\text{ V}$ (উত্তর)" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <span className="font-bold text-slate-200 block">
                          (ঘ) $R_1$ ও $R_2$ এর মধ্য দিয়ে প্রবাহিত তড়িৎপ্রবাহের মান গাণিতিকভাবে যাচাই করো। [৪ নম্বর]
                        </span>
                        <div className="text-slate-300 mt-1 space-y-2">
                          <p>কোষের প্রান্তীয় বিভব বা কার্যকরী বিভব:</p>
                          <div className="font-mono bg-slate-900 p-2 rounded border border-slate-800 text-cyan-300">
                            <RenderMathText text="$V = E - Ir = 12 - 1.333 = 10.667\text{ V}$" />
                          </div>
                          <p>সমান্তরাল অংশের দুই প্রান্তের বিভব পার্থক্য:</p>
                          <div className="font-mono bg-slate-900 p-2 rounded border border-slate-800 text-amber-300">
                            <RenderMathText text="$V_p = I \times R_p = 1.333 \times 4 = 5.333\text{ V}$" />
                          </div>
                          <p>ওহমের সূত্রানুযায়ী শাখা প্রবাহদ্বয়:</p>
                          <div className="font-mono bg-slate-900 p-2.5 rounded border border-slate-800 space-y-1 text-emerald-400">
                            <div><RenderMathText text="$I_1 = \frac{V_p}{R_1} = \frac{5.333}{6} = 0.889\text{ A}$" /></div>
                            <div><RenderMathText text="$I_2 = \frac{V_p}{R_2} = \frac{5.333}{12} = 0.444\text{ A}$" /></div>
                          </div>
                          <div>
                            <RenderMathText text="যাচাই: $I_1 + I_2 = 0.889 + 0.444 = 1.333\text{ A} = I$ (মূল প্রবাহ)। সুতরাং চার্জের সংরক্ষণশীলতা ও ওহমের সূত্র পুরোপুরি সত্য প্রমাণিত হলো।" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 3: TRY YOURSELF (3 INTERACTIVE CHALLENGES)                   */}
        {/* ================================================================= */}
        {activeStep === 3 && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                ইন্টারেক্টিভ গাণিতিক চ্যালেঞ্জ
              </span>
              <h2 className="text-lg lg:text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                <span>নিজে চেষ্টা করো: ৩টি বোর্ড চ্যালেঞ্জ উইথ ইনস্ট্যান্ট ভ্যালিডেশন</span>
              </h2>
              <p className="text-xs lg:text-sm text-slate-400 mt-1">
                খাতা-কলমে হিসাব করে সঠিক সংখ্যাটি টাইপ করো এবং &quot;যাচাই করো&quot; বোতামে চাপ দাও।
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Challenge 1 */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block mb-1">চ্যালেঞ্জ ১ · ওহমের সূত্র</span>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <RenderMathText text="একটি বৈদ্যুতিক হিটারের দুই প্রান্তের বিভব পার্থক্য $220\text{ V}$ এবং এর রোধ $55\ \Omega$। হিটারটির মধ্য দিয়ে কত অ্যাম্পিয়ার তড়িৎ প্রবাহিত হবে?" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="I এর মান (A)..."
                      value={ch1Answer}
                      onChange={(e) => {
                        setCh1Answer(e.target.value);
                        setCh1Result('idle');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch1Answer);
                        if (Math.abs(val - 4.0) < 0.1) setCh1Result('correct');
                        else setCh1Result('wrong');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold whitespace-nowrap"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch1Result === 'correct' && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সঠিক উত্তর! I = V/R = 220/55 = 4 A</span>
                    </div>
                  )}
                  {ch1Result === 'wrong' && (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ভুল হয়েছে। সূত্র: I = V / R = ২২০ / ৫৫।</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 2 */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-amber-400 block mb-1">চ্যালেঞ্জ ২ · তারের রোধ</span>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <RenderMathText text="একটি তামার তারের দৈর্ঘ্য $10\text{ m}$, প্রস্থচ্ছেদ $1.7 \times 10^{-7}\text{ m}^2$ এবং আপেক্ষিক রোধ $1.7 \times 10^{-8}\ \Omega\text{ m}$। তারটির রোধ কত ওহম ($\Omega$)?" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      step="0.1"
                      placeholder="R এর মান (Ω)..."
                      value={ch2Answer}
                      onChange={(e) => {
                        setCh2Answer(e.target.value);
                        setCh2Result('idle');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch2Answer);
                        if (Math.abs(val - 1.0) < 0.1) setCh2Result('correct');
                        else setCh2Result('wrong');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold whitespace-nowrap"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch2Result === 'correct' && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সঠিক উত্তর! R = (1.7e-8 × 10) / 1.7e-7 = 1.0 Ω</span>
                    </div>
                  )}
                  {ch2Result === 'wrong' && (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ভুল হয়েছে। R = ρL / A সূত্রে মান বসাও।</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Challenge 3 */}
              <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-cyan-400 block mb-1">চ্যালেঞ্জ ৩ · বিদ্যুৎ বিল</span>
                  <div className="text-xs text-slate-300 leading-relaxed">
                    <RenderMathText text="$200\text{ W}$ ক্ষমতার একটি ফ্যান প্রতিদিন ৫ ঘণ্টা করে ৩০ দিন চললে মোট কত BOT ইউনিট বিদ্যুৎ শক্তি ব্যয় হবে?" />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="ইউনিট সংখ্যা (kWh)..."
                      value={ch3Answer}
                      onChange={(e) => {
                        setCh3Answer(e.target.value);
                        setCh3Result('idle');
                      }}
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-mono"
                    />
                    <button
                      onClick={() => {
                        const val = parseFloat(ch3Answer);
                        if (Math.abs(val - 30.0) < 0.5) setCh3Result('correct');
                        else setCh3Result('wrong');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold whitespace-nowrap"
                    >
                      যাচাই
                    </button>
                  </div>

                  {ch3Result === 'correct' && (
                    <div className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>সঠিক! W = (200 × 5 × 30) / 1000 = 30 ইউনিট</span>
                    </div>
                  )}
                  {ch3Result === 'wrong' && (
                    <div className="text-xs text-rose-400 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" />
                      <span>ভুল হয়েছে। W = (P × t) / ১০০০ = (২০০ × ১৫০) / ১০০০।</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 4: CHECK UNDERSTANDING (5 MCQS)                             */}
        {/* ================================================================= */}
        {activeStep === 4 && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  আত্মমূল্যায়ন ও কুইজ
                </span>
                <h2 className="text-lg lg:text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span>অধ্যায় ১১: বহুনির্বাচনি প্রশ্নাবলি (MCQs)</span>
                </h2>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  বোর্ড পরীক্ষার স্ট্যান্ডার্ড অনুযায়ী ৫টি বহুনিবার্চনি প্রশ্নের উত্তর দাও।
                </p>
              </div>

              <button
                onClick={() => setShowMcqResults(!showMcqResults)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 transition-all"
              >
                {showMcqResults ? 'ফলাফল লুকান' : 'ফলাফল ও ব্যাখ্যা দেখুন'}
              </button>
            </div>

            {/* MCQ Score Card */}
            {showMcqResults && (
              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-emerald-400" />
                  <div>
                    <span className="text-xs text-slate-400 block">তোমার মোট স্কোর:</span>
                    <span className="text-lg font-bold text-emerald-300 font-mono">
                      {calculateMcqScore()} / {MCQ_DATA.length}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-medium text-slate-300">
                  {calculateMcqScore() >= 4 ? '🎉 অসাধারণ প্রস্তুতি!' : 'পুনরায় রিভিশন প্রয়োজন'}
                </span>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-4">
              {MCQ_DATA.map((q, qIdx) => {
                const selected = selectedMcqAnswers[q.id];
                return (
                  <div key={q.id} className="p-5 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-300 text-xs flex items-center justify-center shrink-0 font-bold mt-0.5">
                        {qIdx + 1}
                      </span>
                      <h4 className="text-xs lg:text-sm font-semibold text-slate-200 leading-relaxed">
                        {q.question}
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        let optClass = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800/60';
                        if (selected === optIdx) {
                          optClass = 'bg-amber-500/20 border-amber-500 text-amber-200 font-semibold';
                        }
                        if (showMcqResults) {
                          if (optIdx === q.correct) {
                            optClass = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-semibold';
                          } else if (selected === optIdx && selected !== q.correct) {
                            optClass = 'bg-rose-500/20 border-rose-500 text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleMcqSelect(q.id, optIdx)}
                            className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex items-center justify-between ${optClass}`}
                          >
                            <span>{opt}</span>
                            {showMcqResults && optIdx === q.correct && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showMcqResults && (
                      <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-400 space-y-1">
                        <strong className="text-emerald-400 block">ব্যাখ্যা:</strong>
                        <RenderMathText text={q.explanation} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* STEP 5: SUMMARY & CHEAT SHEET                                     */}
        {/* ================================================================= */}
        {activeStep === 5 && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  এক নজরে সারসংক্ষেপ
                </span>
                <h2 className="text-lg lg:text-xl font-bold text-slate-100 mt-2 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>চল তড়িৎ সম্পূর্ণ সূত্রব্যাংক ও পরীক্ষার গুরুত্বপূর্ণ ফাঁদ</span>
                </h2>
                <p className="text-xs lg:text-sm text-slate-400 mt-1">
                  বোর্ড পরীক্ষার আগের রাতে ১০ মিনিটে দ্রুত রিভিশন দেওয়ার চিট-শিট।
                </p>
              </div>

              <button
                onClick={handleCopyNotes}
                className="px-3.5 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                {copiedNote ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedNote ? 'নোট কপি হয়েছে!' : '১-ক্লিকে নোট কপি করো'}</span>
              </button>
            </div>

            {/* Formula Bank Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">১. তড়িৎ প্রবাহ ও ওহমের সূত্র</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div><RenderMathText text="$I = \frac{Q}{t}$ (একক: অ্যাম্পিয়ার A = C/s)" /></div>
                  <div><RenderMathText text="$V = IR \implies I = \frac{V}{R} \implies R = \frac{V}{I}$" /></div>
                  <div><RenderMathText text="পরিবাহিতা: $G = \frac{1}{R}$ (সিমেন্স S)" /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-amber-400 block">২. রোধ ও আপেক্ষিক রোধ</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div><RenderMathText text="$R = \rho \frac{L}{A} = \rho \frac{L}{\pi r^2}$" /></div>
                  <div><RenderMathText text="আপেক্ষিক রোধ: $\rho = \frac{RA}{L}$ ($\Omega\cdot\text{m}$)" /></div>
                  <div><RenderMathText text="পরিবাহকত্ব: $\sigma = \frac{1}{\rho}$ ($\Omega^{-1}\cdot\text{m}^{-1}$)" /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-cyan-400 block">৩. তুল্য রোধের সমবায়</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div><RenderMathText text="শ্রেণি: $R_s = R_1 + R_2 + ... + R_n$" /></div>
                  <div><RenderMathText text="সমান্তরাল: $\frac{1}{R_p} = \frac{1}{R_1} + \frac{1}{R_2} + ... + \frac{1}{R_n}$" /></div>
                  <div><RenderMathText text="দুটি রোধ সমান্তরালে: $R_p = \frac{R_1 R_2}{R_1 + R_2}$" /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-rose-400 block">৪. কোষ ও নষ্ট ভোল্টেজ</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div><RenderMathText text="মূল প্রবাহ: $I = \frac{E}{R + r}$" /></div>
                  <div><RenderMathText text="নষ্ট ভোল্টেজ: $v = Ir$" /></div>
                  <div><RenderMathText text="প্রান্তীয় বিভব: $V = E - Ir = IR$" /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-purple-400 block">৫. তড়িৎ ক্ষমতা ও অপচয়</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div><RenderMathText text="$P = VI = I^2 R = \frac{V^2}{R}$ (ওয়াট W)" /></div>
                  <div><RenderMathText text="তাপ শক্তি: $H = I^2 R t$ (জুল J)" /></div>
                  <div><RenderMathText text="সিস্টেম লস: $P_{\text{loss}} = I^2 R_{\text{line}}$" /></div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-2">
                <span className="text-xs font-bold text-emerald-400 block">৬. বিদ্যুৎ বিল (BOT ইউনিট)</span>
                <div className="p-2.5 rounded bg-slate-950 border border-slate-800 font-mono text-xs space-y-1 text-slate-300">
                  <div><RenderMathText text="$W = \frac{P \times t}{1000}\text{ kWh (ইউনিট)}$" /></div>
                  <div><RenderMathText text="১ ইউনিট = $1\text{ kWh} = 3.6 \times 10^6\text{ J}$" /></div>
                  <div><RenderMathText text="মোট খরচ = মোট ইউনিট × ইউনিট প্রতি দর" /></div>
                </div>
              </div>
            </div>

            {/* 4 Critical Examiner Traps Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
              <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>বোর্ড পরীক্ষায় পরীক্ষকদের পছন্দের ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">ফাঁদ ১: তার টেনে লম্বা করা বনাম জোড়া লাগানো</strong>
                  <p className="text-slate-400">
                    তার টেনে দৈর্ঘ্য দ্বিগুণ ($2L$) করলে প্রস্থচ্ছেদ অর্ধেক ($A/2$) হয়ে যায়! ফলে রোধ $R \propto L^2$
                    হিসেবে ৪ গুণ বাড়ে। কিন্তু অন্য আরেকটি সমান তার জোড়া দিলে ক্ষেত্রফল একই থাকে, তখন রোধ কেবল ২ গুণ বাড়ে।
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">ফাঁদ ২: গ্রিডে সিস্টেম লস গণনায় V²/R ভুল</strong>
                  <div className="text-slate-400">
                    <RenderMathText text="সঞ্চালন তারের লস গণনায় $P = V^2/R$ বসালে ভুল হবে, কারণ $V$ লাইনের দুই মাথার বিভব নয়। সর্বদা কারেন্ট $I = P_{\text{grid}} / V$ বের করে $I^2 R$ দিয়ে লস বের করতে হবে।" />
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">ফাঁদ ৩: বিদ্যুৎ বিলে ঘণ্টা বনাম সেকেন্ড</strong>
                  <p className="text-slate-400">
                    কিলোওয়াট-ঘণ্টা সূত্রে সময় অবশ্যই মোট ঘণ্টায় ($h$) বসাতে হবে। মিনিটে বা সেকেন্ডে রেখে ১০০০ দিয়ে ভাগ
                    দিলে পুরো গণিত ভুল হবে।
                  </p>
                </div>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                  <strong className="text-amber-300 block">ফাঁদ ৪: তড়িচ্চালক শক্তি E বনাম প্রান্তীয় বিভব V</strong>
                  <p className="text-slate-400">
                    কোষের অভ্যন্তরীণ রোধ $r$ থাকলে প্রান্তীয় বিভব $V = E - Ir$ সর্বদা $E$ এর চেয়ে কম হয়। খোলা বর্তনীতে
                    ($I = 0$) কেবল $V = E$ হয়।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ------------------------------------------------------------------- */}
      {/* SOCRATIC AI TUTOR DRAWER (SHERU)                                    */}
      {/* ------------------------------------------------------------------- */}
      {isTutorOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">শেরু · এআই ফিজিক্স টিউটর</h3>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    সক্রেটিক মোড · চল তড়িৎ বিশেষজ্ঞ
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsTutorOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Questions Suggestions */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/30 overflow-x-auto flex gap-2">
              {[
                'পাখি তারে বসে শক খায় না কেন?',
                'সমান্তরাল সমবায়ের সুবিধা কী?',
                '১ ইউনিট বিদ্যুৎ মানে কত জুল?',
                'আর্থিং কীভাবে মানুষ বাঁচায়?',
              ].map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setTutorQuery(q);
                  }}
                  className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap border border-slate-700/60"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-xl ${
                      msg.sender === 'user'
                        ? 'bg-emerald-600 text-slate-100 rounded-tr-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleTutorSubmit} className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
              <input
                type="text"
                placeholder="চল তড়িৎ নিয়ে প্রশ্ন করো..."
                value={tutorQuery}
                onChange={(e) => setTutorQuery(e.target.value)}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ReceiptIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
      <path d="M12 17.5v-11" />
    </svg>
  );
}
