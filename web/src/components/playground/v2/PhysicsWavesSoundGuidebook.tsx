'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Waves,
  Volume2,
  VolumeX,
  Radio,
  Timer,
  Activity,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Info,
  Award,
  Layers,
  Copy,
  Check,
  Send,
  MessageSquare,
  ShieldAlert,
  Play,
  Pause,
  Compass,
  Radar,
  Maximize2,
  Flame,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';

// ---------------------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// ---------------------------------------------------------------------------

interface LessonInfo {
  id: number;
  title: string;
  subtitle: string;
  nctbPage: string;
}

const LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'সরল স্পন্দন গতি ও পর্যায়বৃত্ত স্পন্দন',
    subtitle: 'Simple Harmonic Motion, Pendulum & Spring-Mass ($T = 2\\pi\\sqrt{l/g}$)',
    nctbPage: '১৮৮-১৯২',
  },
  {
    id: 2,
    title: 'অনুপ্রস্থ ও অনুদৈর্ঘ্য তরঙ্গ এবং তরঙ্গ রাশি',
    subtitle: 'Transverse vs Longitudinal Waves, $v = f\\lambda$',
    nctbPage: '১৯৩-১৯৭',
  },
  {
    id: 3,
    title: 'শব্দ তরঙ্গের বৈশিষ্ট্য ও বিভিন্ন মাধ্যমে বেগ',
    subtitle: 'Sound in Solids, Liquids & Gases, $v \\propto \\sqrt{T}$',
    nctbPage: '১৯৮-২০২',
  },
  {
    id: 4,
    title: 'প্রতিধ্বনি ও প্রতিফলন ল্যাব',
    subtitle: 'Echo, Persistence of Hearing ($0.1\\text{ s}$) & Well Depth ($2d = vt$)',
    nctbPage: '২০১-২০৩',
  },
  {
    id: 5,
    title: 'শ্রাব্যতার সীমা, আল্ট্রাসাউন্ড ও সোনার (SONAR)',
    subtitle: 'Infrasound, Ultrasound ($>20\\text{ kHz}$), 3D Seismic Survey & SONAR',
    nctbPage: '২০৩-২০৫',
  },
];

type StepType = 'learn' | 'example' | 'practice' | 'quiz' | 'summary';

// ---------------------------------------------------------------------------
// MAIN COMPONENT: PhysicsWavesSoundGuidebook
// ---------------------------------------------------------------------------

export default function PhysicsWavesSoundGuidebook() {
  const [activeStep, setActiveStep] = useState<StepType>('learn');
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [copiedNote, setCopiedNote] = useState<boolean>(false);

  // Socratic AI Tutor Drawer state
  const [isAiTutorOpen, setIsAiTutorOpen] = useState<boolean>(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'tutor'; text: string }>>([
    {
      sender: 'tutor',
      text: 'নমস্কার! আমি সেরাটিউটর পদার্থবিজ্ঞান সহকারী। অধ্যায় ৭: "তরঙ্গ ও শব্দ" এর সরল স্পন্দন, তরঙ্গ সমীকরণ $v = f\\lambda$, প্রতিধ্বনির শর্ত বা আল্ট্রাসাউন্ড সম্পর্কিত যেকোনো প্রশ্ন আমাকে করতে পারো!',
    },
  ]);
  const [chatInput, setChatInput] = useState<string>('');

  // -------------------------------------------------------------------------
  // LAB 1 STATE: Simple Harmonic Motion (Pendulum & Spring)
  // -------------------------------------------------------------------------
  const [shmMode, setShmMode] = useState<'pendulum' | 'spring'>('pendulum');
  const [pendulumLength, setPendulumLength] = useState<number>(1.0); // meters
  const [gravityPreset, setGravityPreset] = useState<'earth' | 'moon' | 'mars' | 'jupiter'>('earth');
  const [springK, setSpringK] = useState<number>(50); // N/m
  const [springMass, setSpringMass] = useState<number>(0.5); // kg
  const [isShmPlaying, setIsShmPlaying] = useState<boolean>(true);
  const [shmAngle, setShmAngle] = useState<number>(0);

  const gravityValues = {
    earth: 9.8,
    moon: 1.63,
    mars: 3.71,
    jupiter: 24.79,
  };
  const currentG = gravityValues[gravityPreset];

  // Calculated Period
  const pendulumPeriod = useMemo(() => {
    return 2 * Math.PI * Math.sqrt(pendulumLength / currentG);
  }, [pendulumLength, currentG]);

  const springPeriod = useMemo(() => {
    return 2 * Math.PI * Math.sqrt(springMass / springK);
  }, [springMass, springK]);

  useEffect(() => {
    if (!isShmPlaying) return;
    const interval = setInterval(() => {
      setShmAngle((prev) => (prev + 0.1) % (2 * Math.PI));
    }, 30);
    return () => clearInterval(interval);
  }, [isShmPlaying]);

  // -------------------------------------------------------------------------
  // LAB 2 STATE: Transverse vs Longitudinal Wave Generator
  // -------------------------------------------------------------------------
  const [waveType, setWaveType] = useState<'transverse' | 'longitudinal'>('transverse');
  const [frequency, setFrequency] = useState<number>(2.0); // Hz
  const [wavelength, setWavelength] = useState<number>(2.5); // meters
  const [amplitude, setAmplitude] = useState<number>(25); // px
  const [wavePhase, setWavePhase] = useState<number>(0);
  const [isWavePlaying, setIsWavePlaying] = useState<boolean>(true);

  const waveVelocity = useMemo(() => {
    return (frequency * wavelength).toFixed(2);
  }, [frequency, wavelength]);

  const wavePeriod = useMemo(() => {
    return (1 / frequency).toFixed(3);
  }, [frequency]);

  useEffect(() => {
    if (!isWavePlaying) return;
    const interval = setInterval(() => {
      setWavePhase((prev) => prev + frequency * 0.1);
    }, 40);
    return () => clearInterval(interval);
  }, [isWavePlaying, frequency]);

  // -------------------------------------------------------------------------
  // LAB 3 STATE: Speed of Sound in Media & Temperature ($v \propto \sqrt{T}$)
  // -------------------------------------------------------------------------
  const [selectedMedium, setSelectedMedium] = useState<'air' | 'hydrogen' | 'water' | 'iron' | 'diamond'>('air');
  const [airTempC, setAirTempC] = useState<number>(25); // Celsius
  const [isBellJarVacuum, setIsBellJarVacuum] = useState<boolean>(false);

  // Speed in air: v = 330 * sqrt((273 + T)/273) or 332 * sqrt(T/273)
  const calculatedAirSpeed = useMemo(() => {
    const kelvin = 273.15 + airTempC;
    return (330 * Math.sqrt(kelvin / 273.15)).toFixed(1);
  }, [airTempC]);

  const mediumSpeeds: Record<string, { nameBn: string; speedMs: number; desc: string }> = {
    air: { nameBn: 'বাতাস (Air, ২৫°C)', speedMs: parseFloat(calculatedAirSpeed), desc: 'বায়বীয় মাধ্যম, তাপমাত্রা বাড়লে বেগ বাড়ে' },
    hydrogen: { nameBn: 'হাইড্রোজেন (Hydrogen gas)', speedMs: 1284, desc: 'কম ঘনত্বের গ্যাসে শব্দ দ্রুত চলে' },
    water: { nameBn: 'পানি (Pure Water)', speedMs: 1493, desc: 'তরল মাধ্যম, স্থিতিস্থাপকতা বায়ুর চেয়ে অনেক বেশি' },
    iron: { nameBn: 'লোহা (Iron/Steel)', speedMs: 5130, desc: 'কঠিন মাধ্যম, অণুগুলো খুব কাছাকাছি ও দৃঢ় বন্ধনযুক্ত' },
    diamond: { nameBn: 'হীরা (Diamond)', speedMs: 12000, desc: 'সর্বোচ্চ দৃঢ় ও স্থিতিস্থাপক কেলাস গঠন' },
  };

  // -------------------------------------------------------------------------
  // LAB 4 STATE: Echo Distance & Well Depth Simulator
  // -------------------------------------------------------------------------
  const [echoDistance, setEchoDistance] = useState<number>(20.0); // meters
  const [echoTempC, setEchoTempC] = useState<number>(25); // Celsius
  const [isClapping, setIsClapping] = useState<boolean>(false);
  const [soundPulsePos, setSoundPulsePos] = useState<number>(0);
  const [echoResultStatus, setEchoResultStatus] = useState<'idle' | 'success' | 'overlap'>('idle');

  const echoSpeed = useMemo(() => {
    return 330 * Math.sqrt((273.15 + echoTempC) / 273.15);
  }, [echoTempC]);

  const echoMinDist = useMemo(() => {
    // d_min = (v * 0.1) / 2
    return ((echoSpeed * 0.1) / 2).toFixed(2);
  }, [echoSpeed]);

  const echoTimeSec = useMemo(() => {
    // t = 2d / v
    return ((2 * echoDistance) / echoSpeed).toFixed(3);
  }, [echoDistance, echoSpeed]);

  const handleMakeSound = () => {
    setIsClapping(true);
    setSoundPulsePos(0);
    setEchoResultStatus('idle');

    let step = 0;
    const animInterval = setInterval(() => {
      step += 1;
      setSoundPulsePos(step);
      if (step >= 20) {
        clearInterval(animInterval);
        setIsClapping(false);
        const t = (2 * echoDistance) / echoSpeed;
        if (t >= 0.1) {
          setEchoResultStatus('success');
        } else {
          setEchoResultStatus('overlap');
        }
      }
    }, 40);
  };

  // -------------------------------------------------------------------------
  // LAB 5 STATE: Audible Frequency Spectrum & SONAR / Seismic Explorer
  // -------------------------------------------------------------------------
  const [audioFreqHz, setAudioFreqHz] = useState<number>(1000); // Hz
  const [sonarDepth, setSonarDepth] = useState<number>(750); // meters
  const [waterSoundSpeed, setWaterSoundSpeed] = useState<number>(1493); // m/s in seawater

  const sonarEchoTime = useMemo(() => {
    return ((2 * sonarDepth) / waterSoundSpeed).toFixed(3);
  }, [sonarDepth, waterSoundSpeed]);

  let frequencyZone = '';
  let frequencyZoneColor = '';
  let animalUse = '';

  if (audioFreqHz < 20) {
    frequencyZone = 'ইনফ্রাসাউন্ড বা শব্দেতর তরঙ্গ (< ২০ Hz)';
    frequencyZoneColor = 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    animalUse = 'হাতি ও তিমি যোগাযোগ করে, ভূমিকম্পের ভূ-কম্পন তরঙ্গ। মানুষের কান শুনতে পায় না।';
  } else if (audioFreqHz <= 20000) {
    frequencyZone = 'শ্রাব্যতার সীমা (Audible Range: ২০ Hz – ২০,০০০ Hz)';
    frequencyZoneColor = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    animalUse = 'সুস্থ মানব কর্ণ এই কম্পাঙ্কের শব্দ স্পষ্ট শুনতে পায়। সুরযুক্ত বাদ্যযন্ত্র ও স্বাভাবিক কথোপকথন।';
  } else {
    frequencyZone = 'আল্ট্রাসাউন্ড বা শ্রবণাতীত তরঙ্গ (> ২০ kHz)';
    frequencyZoneColor = 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10';
    animalUse = 'বাদুড় ($100\\text{ kHz}$), ডলফিন, চিকিৎসাবিজ্ঞানে আল্ট্রাসনোগ্রাফি, এবং জাহাজের সোনার (SONAR)।';
  }

  // -------------------------------------------------------------------------
  // STEP 2: Worked Board CQs State
  // -------------------------------------------------------------------------
  const [expandedCQ, setExpandedCQ] = useState<number[]>([1]);
  const [expandedRubric, setExpandedRubric] = useState<number[]>([1]);

  const toggleCQ = (id: number) => {
    setExpandedCQ((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleRubric = (id: number) => {
    setExpandedRubric((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  // -------------------------------------------------------------------------
  // STEP 3: Interactive Calculation Challenges State
  // -------------------------------------------------------------------------
  const [challenge1Input, setChallenge1Input] = useState<string>('');
  const [challenge1Status, setChallenge1Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge2Input, setChallenge2Input] = useState<string>('');
  const [challenge2Status, setChallenge2Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const [challenge3Input, setChallenge3Input] = useState<string>('');
  const [challenge3Status, setChallenge3Status] = useState<'idle' | 'correct' | 'wrong'>('idle');

  const handleVerifyChallenge1 = () => {
    // v = 340, f = 512 Hz -> lambda = 340 / 512 = 0.664 m
    const val = parseFloat(challenge1Input);
    if (!isNaN(val) && Math.abs(val - 0.664) <= 0.05) {
      setChallenge1Status('correct');
    } else {
      setChallenge1Status('wrong');
    }
  };

  const handleVerifyChallenge2 = () => {
    // 30°C day, v = 350 m/s -> d_min = (350 * 0.1) / 2 = 17.5 m
    const val = parseFloat(challenge2Input);
    if (!isNaN(val) && Math.abs(val - 17.5) <= 0.2) {
      setChallenge2Status('correct');
    } else {
      setChallenge2Status('wrong');
    }
  };

  const handleVerifyChallenge3 = () => {
    // 0°C -> 332 m/s. 27°C (300 K) -> v = 332 * sqrt(300/273) = 348.0 m/s
    const val = parseFloat(challenge3Input);
    if (!isNaN(val) && Math.abs(val - 348) <= 2) {
      setChallenge3Status('correct');
    } else {
      setChallenge3Status('wrong');
    }
  };

  // -------------------------------------------------------------------------
  // STEP 4: MCQs State
  // -------------------------------------------------------------------------
  const mcqs = [
    {
      id: 1,
      question: 'মানুষের মস্তিষ্কে শব্দের অনুভূতি বা স্থায়িত্বকাল (Persistence of Hearing) কত সেকেন্ড থাকে?',
      options: ['০.৫ সেকেন্ড', '০.০১ সেকেন্ড', '০.১ সেকেন্ড', '১.০ সেকেন্ড'],
      correctIndex: 2,
      explanation: 'আমরা যখন কোনো শব্দ শুনি, তার অনুভূতি মানব মস্তিষ্কে প্রায় ০.১ সেকেন্ড পর্যন্ত বজায় থাকে। দুটি শব্দ আলাদাভাবে শুনতে হলে তাদের মাঝে কমপক্ষে ০.১ সেকেন্ড সময়ের ব্যবধান থাকতে হয়।',
    },
    {
      id: 2,
      question: 'কোন মাধ্যমে শব্দের বেগ সবচেয়ে বেশি?',
      options: ['বাতাস (বায়বীয়)', 'পানি (তরল)', 'লোহা (কঠিন)', 'হাইড্রোজেন গ্যাস'],
      correctIndex: 2,
      explanation: 'মাধ্যমের ঘনত্ব ও স্থিতিস্থাপকতার ওপর শব্দের বেগ নির্ভর করে। কঠিন পদার্থের স্থিতিস্থাপকতা সবচেয়ে বেশি হওয়ায় এতে শব্দের বেগ সর্বোচ্চ (লোহায় শব্দের বেগ প্রায় ৫,১৩০ m/s, বাতাসে মাত্র ৩৩০ m/s)।',
    },
    {
      id: 3,
      question: 'বায়ুতে শব্দের বেগ পরম তাপমাত্রা (T) এর সাথে কীভাবে পরিবর্তিত হয়?',
      options: [
        '$v \\propto T$',
        '$v \\propto \\sqrt{T}$',
        '$v \\propto \\frac{1}{T}$',
        '$v \\propto T^2$',
      ],
      correctIndex: 1,
      explanation: 'বাতাসে শব্দের বেগ কেলভিন স্কেলের পরম তাপমাত্রার বর্গমূলের সমানুপাতিক: $v \\propto \\sqrt{T}$। অর্থাৎ তাপমাত্রা বাড়লে শব্দের বেগ বৃদ্ধি পায়।',
    },
    {
      id: 4,
      question: '০°C তাপমাত্রায় বাতাসে প্রতিধ্বনি শোনার জন্য প্রতিফলক দেয়ালের ন্যূনতম দূরত্ব কত হতে হবে? ($v = 332\\text{ m/s}$)',
      options: ['১৬.৬ মিটার', '৩৩.২ মিটার', '৮.৩ মিটার', '২৫.০ মিটার'],
      correctIndex: 0,
      explanation: 'ন্যূনতম সময় $t = 0.1\\text{ s}$। সুতরাং ন্যূনতম দূরত্ব $d = \\frac{vt}{2} = \\frac{332 \\times 0.1}{2} = 16.6\\text{ m}$।',
    },
    {
      id: 5,
      question: 'বাদুড় অন্ধকারে চলাচলের সময় এবং শিকার শনাক্ত করতে কোন ধরনের শব্দ তরঙ্গ ব্যবহার করে?',
      options: [
        'ইনফ্রাসাউন্ড (< ২০ Hz)',
        'আল্ট্রাসাউন্ড বা শ্রবণাতীত শব্দ (> ২০ kHz)',
        'রেডিও তরঙ্গ',
        'সাধারণ শ্রবণযোগ্য শব্দ',
      ],
      correctIndex: 1,
      explanation: 'বাদুড় প্রায় ১০০ kHz পর্যন্ত উচ্চ কম্পাঙ্কের আল্ট্রাসাউন্ড বা শব্দোত্তর শব্দ তৈরি করে। সেই শব্দ সামনের বস্তু বা শিকার থেকে প্রতিফলিত হয়ে ফিরে আসলে তার সময় ও তীব্রতা বিশ্লেষণ করে বাদুড় পথ চলে।',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submittedQuiz, setSubmittedQuiz] = useState<boolean>(false);

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (submittedQuiz) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const calculateScore = () => {
    let score = 0;
    mcqs.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctIndex) {
        score += 1;
      }
    });
    return score;
  };

  // AI Chat handler
  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatInput('');

    setTimeout(() => {
      let reply = 'দারুণ প্রশ্ন! তরঙ্গ গতিতে শক্তি এক স্থান থেকে অন্য স্থানে সঞ্চালিত হয় কিন্তু মাধ্যমের কণাগুলো স্থায়ীভাবে স্থানান্তরিত হয় না।';
      if (userMsg.includes('প্রতিধ্বনি') || userMsg.includes('ন্যূনতম দূরত্ব')) {
        reply = 'প্রতিধ্বনি শোনার জন্য শব্দের স্থায়িত্বকাল ০.১ সেকেন্ড। তাই শব্দকে গিয়ে ফিরে আসতে কমপক্ষে ০.১ সেকেন্ড সময় লাগতে হবে। $0^\\circ\\text{C}$-এ $v = 332\\text{ m/s}$ হলে ন্যূনতম দূরত্ব $d = \\frac{vt}{2} = \\frac{332 \\times 0.1}{2} = 16.6\\text{ m}$!';
      } else if (userMsg.includes('বাদুড়') || userMsg.includes('আল্ট্রাসাউন্ড')) {
        reply = 'বাদুড় প্রায় ১০০ কিলোহার্টজ (100,000 Hz) কম্পাঙ্কের আল্ট্রাসাউন্ড শব্দ তৈরি করে। এই শব্দ সামনে কোনো বাধার সাথে ধাক্কা খেয়ে প্রতিধ্বনি হয়ে ফিরে এলে বাদুড় দূরত্ব ও দিক নিখুঁতভাবে অনুধাবন করতে পারে!';
      } else if (userMsg.includes('বেগ') || userMsg.includes('তাপমাত্রা')) {
        reply = 'বায়ুতে শব্দের বেগ কেলভিন তাপমাত্রার বর্গমূলের সমানুপাতিক ($v \\propto \\sqrt{T}$)। গ্রীষ্মকালে তাপমাত্রা বাড়লে বায়ুর অণুগুলোর গতি বৃদ্ধি পায়, ফলে শব্দের বেগও বাড়ে!';
      } else if (userMsg.includes('কঠিন') || userMsg.includes('পানি')) {
        reply = 'কঠিন ও তরল পদার্থের ঘনত্ব বেশি হলেও তাদের স্থিতিস্থাপকতা বায়ুর তুলনায় অত্যন্ত বেশি। স্থিতিস্থাপকতা বেশি হওয়ায় শব্দ কঠিন মাধ্যমে (যেমন লোহায় ৫,১৩০ m/s) সবচেয়ে দ্রুত চলে!';
      }
      setChatMessages((prev) => [...prev, { sender: 'tutor', text: reply }]);
    }, 600);
  };

  const copyNotesToClipboard = () => {
    const notes = `SheraTutor Physics Chapter 7 Summary & Formula Bank:
1. সরল দোলক: T = 2π√(l/g), কম্পাঙ্ক f = 1/T
2. তরঙ্গ মৌলিক সম্পর্ক: v = fλ = λ/T
3. তাপমাত্রার সাথে শব্দের বেগ: v ∝ √T => v1/v2 = √(T1/T2)
4. প্রতিধ্বনি: 2d = vt => d = vt/2
5. প্রতিধ্বনির ন্যূনতম দূরত্ব: d_min = (v * 0.1)/2 (০°C-এ ১৬.৬ মিটার)
6. শ্রাব্যতার সীমা: ২০ Hz থেকে ২০,০০০ Hz
7. ইনফ্রাসাউন্ড: < ২০ Hz, আল্ট্রাসাউন্ড: > ২০,০০০ Hz
8. শব্দের তীব্রতা: I ∝ A²`;
    navigator.clipboard.writeText(notes);
    setCopiedNote(true);
    setTimeout(() => setCopiedNote(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* ------------------------------------------------------------------- */}
      {/* TOP SUB-NAVBAR & NAVIGATION                                         */}
      {/* ------------------------------------------------------------------- */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard/playground/v2"
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
            >
              <span>পদার্থবিজ্ঞান</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
              অধ্যায় ০৭
            </span>
            <h1 className="text-sm font-bold text-white flex items-center gap-2">
              <Waves className="w-4 h-4 text-cyan-400" />
              <span>তরঙ্গ ও শব্দ (Waves and Sound)</span>
            </h1>
          </div>

          {/* 5-Step Learning Framework Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <button
              onClick={() => setActiveStep('learn')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeStep === 'learn'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>১. ল্যাব ও কনসেপ্ট</span>
            </button>

            <button
              onClick={() => setActiveStep('example')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeStep === 'example'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>২. বোর্ড CQ</span>
            </button>

            <button
              onClick={() => setActiveStep('practice')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeStep === 'practice'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>৩. প্র্যাকটিস</span>
            </button>

            <button
              onClick={() => setActiveStep('quiz')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeStep === 'quiz'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>৪. MCQ কুইজ</span>
            </button>

            <button
              onClick={() => setActiveStep('summary')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                activeStep === 'summary'
                  ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                  : 'bg-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>৫. সামারি</span>
            </button>

            {/* Socratic AI Tutor Trigger */}
            <button
              onClick={() => setIsAiTutorOpen(!isAiTutorOpen)}
              className="ml-2 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-cyan-600/20 to-teal-600/20 border border-cyan-500/40 text-cyan-300 hover:border-cyan-400 flex items-center gap-1.5 transition"
            >
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">সক্রেটিক এআই টিউটর</span>
            </button>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------- */}
      {/* MAIN CONTAINER WITH SIDEBAR & CONTENT AREA                          */}
      {/* ------------------------------------------------------------------- */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT LESSON NAVIGATION (Visible only on Learn Step) */}
        {activeStep === 'learn' && (
          <aside className="w-72 lg:w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col shrink-0 overflow-hidden">
            <div className="p-4 border-b border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  অধ্যায় সূচিপত্র (NCTB)
                </span>
                <span className="text-xs text-cyan-400 font-mono">৫টি পূর্ণাঙ্গ পাঠ</span>
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto p-3 space-y-2">
              {LESSONS.map((lesson) => {
                const isSelected = activeLesson === lesson.id && activeStep === 'learn';
                return (
                  <button
                    key={lesson.id}
                    onClick={() => {
                      setActiveLesson(lesson.id);
                      setActiveStep('learn');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-all border ${
                      isSelected
                        ? 'bg-cyan-600/15 border-cyan-500/40 text-cyan-200 shadow-md shadow-cyan-950/40'
                        : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-800/50 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono text-cyan-400">পাঠ ০{['১', '২', '৩', '৪', '৫'][lesson.id - 1]}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                        পৃ. {lesson.nctbPage}
                      </span>
                    </div>
                    <div className="text-sm font-medium text-slate-200 leading-tight mb-1">
                      {lesson.title}
                    </div>
                    <div className="text-xs text-slate-400 line-clamp-1">{lesson.subtitle}</div>
                  </button>
                );
              })}
            </nav>

            <div className="p-4 border-t border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                <span>বোর্ড পরীক্ষায় প্রতিধ্বনি ও বেগ রূপান্তর থেকে প্রতি বছর ১০ নম্বরের ১টি পূর্ণ CQ থাকে।</span>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN INTERACTIVE CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 bg-slate-950">
          {/* =============================================================== */}
          {/* STEP 1: LEARN CONCEPT & INTERACTIVE PHYSICS LABS                 */}
          {/* =============================================================== */}
          {activeStep === 'learn' && (
            <div className="max-w-5xl mx-auto space-y-8">
              {/* LESSON 1: SIMPLE HARMONIC MOTION (SHM) */}
              {activeLesson === 1 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
                      <span>বোর্ড ও বেসিক ফান্ডামেন্টাল</span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ১৮৮-১৯২</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০১: সরল স্পন্দন গতি (Simple Harmonic Motion - SHM)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      যদি কোনো পর্যাবৃত্ত গতিশীল বস্তুর ত্বরণ তার সাম্যাবস্থা থেকে সরণের সমানুপাতিক ও বিপরীতমুখী হয় ($a \propto -x$), তবে সেই গতিকে সরল স্পন্দন গতি বলে। সরল দোলক ও স্প্রিং-এ ঝুলন্ত বস্তুর গতি এর উৎকৃষ্ট উদাহরণ।
                    </p>
                  </div>

                  {/* LAB 1: SHM PENDULUM & SPRING SIMULATOR */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Activity className="w-5 h-5 text-cyan-400" />
                          <span>সরল দোলক ও স্প্রিং স্পন্দন লাইভ ল্যাব</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          দৈর্ঘ্য ($l$), ভর ($m$) ও অভিকর্ষজ ত্বরণ ($g$) পরিবর্তন করে পর্যায়কাল ($T$) এবং শক্তির রূপান্তর প্রত্যক্ষ করো।
                        </p>
                      </div>

                      {/* Mode Toggle */}
                      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setShmMode('pendulum')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            shmMode === 'pendulum'
                              ? 'bg-cyan-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          সরল দোলক (T = 2π√(l/g))
                        </button>
                        <button
                          onClick={() => setShmMode('spring')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            shmMode === 'spring'
                              ? 'bg-cyan-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          স্প্রিং স্পন্দন (T = 2π√(m/k))
                        </button>
                      </div>
                    </div>

                    {shmMode === 'pendulum' ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        {/* Pendulum Controls */}
                        <div className="space-y-4">
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-300">দোলকের কার্যকর দৈর্ঘ্য ($l$):</span>
                              <span className="text-cyan-400 font-mono font-bold">{pendulumLength.toFixed(2)} m</span>
                            </div>
                            <input
                              type="range"
                              min="0.2"
                              max="3.0"
                              step="0.1"
                              value={pendulumLength}
                              onChange={(e) => setPendulumLength(parseFloat(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-slate-500">
                              <span>০.২ m (দ্রুত দোলন)</span>
                              <span>১.০ m (সেকেন্ড দোলক সদৃশ)</span>
                              <span>৩.০ m</span>
                            </div>
                          </div>

                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                            <span className="text-xs font-medium text-slate-300 block">অভিকর্ষজ ত্বরণ ($g$ প্রিসেট):</span>
                            <div className="grid grid-cols-2 gap-2 text-xs">
                              {(['earth', 'moon', 'mars', 'jupiter'] as const).map((planet) => (
                                <button
                                  key={planet}
                                  onClick={() => setGravityPreset(planet)}
                                  className={`p-2 rounded-lg border text-left transition ${
                                    gravityPreset === planet
                                      ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                                  }`}
                                >
                                  <div className="font-semibold capitalize">
                                    {planet === 'earth' && 'পৃথিবী (Earth)'}
                                    {planet === 'moon' && 'চাঁদ (Moon)'}
                                    {planet === 'mars' && 'মঙ্গল (Mars)'}
                                    {planet === 'jupiter' && 'বৃহস্পতি (Jupiter)'}
                                  </div>
                                  <div className="text-[10px] text-slate-500 font-mono">
                                    {gravityValues[planet]} m/s²
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">
                                <RenderMathText text="পর্যায়কাল ($T = 2\pi\sqrt{l/g}$):" />
                              </span>
                              <span className="text-cyan-400 font-bold font-mono text-sm">{pendulumPeriod.toFixed(2)} s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">কম্পাঙ্ক ($f = 1/T$):</span>
                              <span className="text-emerald-400 font-bold font-mono text-sm">{(1 / pendulumPeriod).toFixed(2)} Hz</span>
                            </div>
                            <div className="text-[11px] text-amber-400/90 pt-1 border-t border-slate-800">
                              💡 <strong>বোর্ড পরীক্ষকের টিপ:</strong> দোলকের ববের ভর যত গুণই বাড়ানো হোক না কেন, দোলনকাল ($T$) অপরিবর্তিত থাকে কারণ সূত্রে ভরের ($m$) কোনো পদ নেই!
                            </div>
                          </div>
                        </div>

                        {/* Pendulum Visual Animation */}
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden">
                          {/* Ceiling */}
                          <div className="w-32 h-2.5 bg-slate-700 rounded-full mb-1" />
                          <div className="w-3 h-3 bg-cyan-400 rounded-full" />

                          {/* Bob SVG */}
                          <svg className="w-48 h-48 overflow-visible" viewBox="-100 0 200 200">
                            {/* String line */}
                            {(() => {
                              const angle = Math.sin(shmAngle) * (Math.PI / 6);
                              const lengthPx = 60 + pendulumLength * 35;
                              const bobX = Math.sin(angle) * lengthPx;
                              const bobY = Math.cos(angle) * lengthPx;
                              return (
                                <>
                                  <line
                                    x1="0"
                                    y1="0"
                                    x2={bobX}
                                    y2={bobY}
                                    stroke="#38bdf8"
                                    strokeWidth="2.5"
                                  />
                                  <circle cx={bobX} cy={bobY} r="16" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
                                  <text
                                    x={bobX}
                                    y={bobY + 4}
                                    textAnchor="middle"
                                    fill="#ffffff"
                                    fontSize="9"
                                    fontWeight="bold"
                                  >
                                    m
                                  </text>
                                </>
                              );
                            })()}
                          </svg>

                          <div className="mt-4 flex items-center gap-2">
                            <button
                              onClick={() => setIsShmPlaying(!isShmPlaying)}
                              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-xs rounded-lg text-slate-300 flex items-center gap-1.5"
                            >
                              {isShmPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                              <span>{isShmPlaying ? 'পজ' : 'প্লে'}</span>
                            </button>
                            <span className="text-[11px] text-slate-500 font-mono">
                              দোলন দশা: {(shmAngle % (2 * Math.PI)).toFixed(1)} rad
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* SPRING MODE */
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-4">
                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-300">স্প্রিং ধ্রুবক ($k$):</span>
                              <span className="text-cyan-400 font-mono font-bold">{springK} N/m</span>
                            </div>
                            <input
                              type="range"
                              min="10"
                              max="150"
                              step="5"
                              value={springK}
                              onChange={(e) => setSpringK(parseFloat(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer"
                            />
                          </div>

                          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-slate-300">ঝুলন্ত ভর ($m$):</span>
                              <span className="text-cyan-400 font-mono font-bold">{springMass.toFixed(2)} kg</span>
                            </div>
                            <input
                              type="range"
                              min="0.1"
                              max="2.0"
                              step="0.1"
                              value={springMass}
                              onChange={(e) => setSpringMass(parseFloat(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer"
                            />
                          </div>

                          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">
                                <RenderMathText text="স্প্রিং দোলনকাল ($T = 2\pi\sqrt{m/k}$):" />
                              </span>
                              <span className="text-cyan-400 font-bold font-mono text-sm">{springPeriod.toFixed(2)} s</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">কম্পাঙ্ক ($f = 1/T$):</span>
                              <span className="text-emerald-400 font-bold font-mono text-sm">{(1 / springPeriod).toFixed(2)} Hz</span>
                            </div>
                          </div>
                        </div>

                        {/* Spring Animation */}
                        <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 flex flex-col items-center justify-center min-h-[280px]">
                          <div className="w-28 h-2.5 bg-slate-700 rounded-full mb-1" />
                          {/* Spring Coils */}
                          <div className="flex flex-col items-center transition-all duration-75">
                            {(() => {
                              const displacement = Math.sin(shmAngle) * 25;
                              const currentHeight = 90 + displacement;
                              return (
                                <svg width="40" height={currentHeight} className="overflow-visible">
                                  <path
                                    d={`M 20 0 Q 35 15 20 30 Q 5 45 20 60 Q 35 75 20 90 L 20 ${currentHeight}`}
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth="3"
                                  />
                                </svg>
                              );
                            })()}
                            {/* Mass Block */}
                            <div
                              className="w-14 h-12 bg-cyan-600 rounded-lg border-2 border-cyan-400 flex items-center justify-center text-white font-mono text-xs font-bold shadow-lg"
                              style={{
                                transform: `translateY(${Math.sin(shmAngle) * 5}px)`,
                              }}
                            >
                              {springMass} kg
                            </div>
                          </div>
                          <span className="text-xs text-slate-500 mt-4">হুকের সূত্র ($F = -kx$) স্পন্দন</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* LESSON 2: TRANSVERSE VS LONGITUDINAL WAVES & WAVE VARIABLES */}
              {activeLesson === 2 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
                      <span>বোর্ড নিশ্চিত সৃজনশীল অধ্যায়</span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ১৯৩-১৯৭</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০২: অনুপ্রস্থ ও অনুদৈর্ঘ্য তরঙ্গ এবং তরঙ্গ-সংশ্লিষ্ট রাশি
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      তরঙ্গের বেগ ($v$), কম্পাঙ্ক ($f$), তরঙ্গদৈর্ঘ্য ($\lambda$) এবং পর্যায়কালের ($T$) মাঝে সুনির্দিষ্ট গাণিতিক সম্পর্ক রয়েছে:
                      <RenderMathText text=" $v = f\lambda = \frac{\lambda}{T}$" />। কণার কম্পনের দিকের ওপর ভিত্তি করে তরঙ্গ দুই প্রকার।
                    </p>
                  </div>

                  {/* LAB 2: WAVE GENERATOR */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Radio className="w-5 h-5 text-cyan-400" />
                          <span>
                            <RenderMathText text="তরঙ্গ জেনারেটর ও প্যারামিটার সিমুলেটর ($v = f\lambda$)" />
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          কম্পাঙ্ক ($f$) ও তরঙ্গদৈর্ঘ্য ($\lambda$) সমন্বয় করে তরঙ্গের বেগ এবং অনুপ্রস্থ বনাম অনুদৈর্ঘ্য তরঙ্গের পার্থক্য দেখো।
                        </p>
                      </div>

                      <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                          onClick={() => setWaveType('transverse')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            waveType === 'transverse'
                              ? 'bg-cyan-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          অনুপ্রস্থ তরঙ্গ (Transverse)
                        </button>
                        <button
                          onClick={() => setWaveType('longitudinal')}
                          className={`px-3 py-1 rounded-lg text-xs font-medium transition ${
                            waveType === 'longitudinal'
                              ? 'bg-cyan-600 text-white'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          অনুদৈর্ঘ্য তরঙ্গ (Longitudinal)
                        </button>
                      </div>
                    </div>

                    {/* Sliders Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">কম্পাঙ্ক ($f$):</span>
                          <span className="text-cyan-400 font-mono font-bold">{frequency.toFixed(1)} Hz</span>
                        </div>
                        <input
                          type="range"
                          min="0.5"
                          max="5.0"
                          step="0.1"
                          value={frequency}
                          onChange={(e) => setFrequency(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between items-center text-xs font-medium">
                          <span className="text-slate-300">
                            <RenderMathText text="তরঙ্গদৈর্ঘ্য ($\lambda$):" />
                          </span>
                          <span className="text-cyan-400 font-mono font-bold">{wavelength.toFixed(1)} m</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="5.0"
                          step="0.2"
                          value={wavelength}
                          onChange={(e) => setWavelength(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-1">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">বিস্তার (Amplitude, $A$):</span>
                          <span className="text-cyan-400 font-mono font-bold">{amplitude} px</span>
                        </div>
                        <input
                          type="range"
                          min="10"
                          max="45"
                          step="5"
                          value={amplitude}
                          onChange={(e) => setAmplitude(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Wave Visualization Box */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-400 font-medium">
                          {waveType === 'transverse'
                            ? 'পুকুরের পানির তরঙ্গ বা টানা তারের কম্পন (তরঙ্গশীর্ষ ও তরঙ্গপাদ)'
                            : 'বায়ুতে শব্দ তরঙ্গ বা স্প্রিং-এর সংকোচন ও প্রসারণ (Compression & Rarefaction)'}
                        </span>
                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-cyan-400">
                            <RenderMathText text={`বেগ $v = f\\lambda = ${waveVelocity}\\text{ m/s}`} />
                          </span>
                          <span className="text-emerald-400">পর্যায়কাল T = {wavePeriod} s</span>
                        </div>
                      </div>

                      {/* SVG Canvas for Wave */}
                      <div className="h-40 w-full relative flex items-center justify-center bg-slate-900/60 rounded-xl border border-slate-800/80 overflow-hidden">
                        {waveType === 'transverse' ? (
                          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 600 120">
                            {/* Center equilibrium line */}
                            <line x1="0" y1="60" x2="600" y2="600" stroke="#334155" strokeDasharray="4" />
                            {/* Sine curve path */}
                            {(() => {
                              let pathD = 'M 0 60';
                              const points: [number, number][] = [];
                              for (let x = 0; x <= 600; x += 10) {
                                const y = 60 - Math.sin((x / (wavelength * 40)) - wavePhase) * amplitude;
                                points.push([x, y]);
                                pathD += ` L ${x} ${y}`;
                              }
                              return (
                                <>
                                  <path d={pathD} fill="none" stroke="#06b6d4" strokeWidth="3" />
                                  {/* Water particles moving up and down */}
                                  {points.filter((_, idx) => idx % 4 === 0).map(([px, py], idx) => (
                                    <circle key={idx} cx={px} cy={py} r="3.5" fill="#38bdf8" />
                                  ))}
                                </>
                              );
                            })()}
                          </svg>
                        ) : (
                          /* Longitudinal Wave (Slinky Spring dots) */
                          <div className="w-full h-full flex flex-col justify-center px-4 space-y-3">
                            <div className="text-[11px] text-slate-400 flex justify-between font-mono">
                              <span className="text-cyan-400">← সংকোচন (ঘনীভবন) →</span>
                              <span className="text-slate-500">← প্রসারণ (তনুভবন) →</span>
                              <span className="text-cyan-400">← সংকোচন →</span>
                            </div>
                            <div className="relative h-12 w-full flex items-center">
                              {Array.from({ length: 45 }).map((_, idx) => {
                                const basePos = (idx / 45) * 100;
                                const shift = Math.sin((idx / 45) * Math.PI * 4 - wavePhase) * 4;
                                return (
                                  <div
                                    key={idx}
                                    className="absolute w-1 h-8 bg-cyan-400/80 rounded-full"
                                    style={{ left: `${Math.max(1, Math.min(99, basePos + shift))}%` }}
                                  />
                                );
                              })}
                            </div>
                            <div className="text-[10px] text-slate-500 text-center font-mono">
                              কণার স্পন্দনের দিক তরঙ্গের গতির অভিমুখের সমান্তরাল ($0^\circ$)
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Info callout */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                          <strong>তরঙ্গশীর্ষ ও তরঙ্গপাদ:</strong> অনুপ্রস্থ তরঙ্গের সর্বোচ্চ বিন্দুকে তরঙ্গশীর্ষ (Crest) এবং সর্বনিম্ন বিন্দুকে তরঙ্গপাদ (Trough) বলে। দুটি শীর্ষের মধ্যবর্তী দূরত্ব হলো ১টি পূর্ণ তরঙ্গদৈর্ঘ্য ($\lambda$)।
                        </div>
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-slate-300">
                          <strong>শক্তির নিত্যতা:</strong> তরঙ্গের বিস্তার ($A$) দ্বিগুণ হলে এর প্রবাহিত শক্তি হয় চারগুণ ($E \propto A^2$)।
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 3: SOUND WAVES & SPEED IN DIFFERENT MEDIA */}
              {activeLesson === 3 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
                      <span>পরীক্ষকের বিশেষ পছন্দের প্রশ্ন</span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ১৯৮-২০২</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০৩: শব্দ তরঙ্গের বৈশিষ্ট্য ও বিভিন্ন মাধ্যমে শব্দের বেগ
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      শব্দ একটি যান্ত্রিক অনুদৈর্ঘ্য তরঙ্গ যার সঞ্চালনের জন্য স্থিতিস্থাপক জড় মাধ্যমের প্রয়োজন। শূন্য মাধ্যমে শব্দ প্রবাহিত হতে পারে না। কঠিন মাধ্যমে শব্দের বেগ সবচেয়ে বেশি এবং বায়বীয় মাধ্যমে সবচেয়ে কম।
                    </p>
                  </div>

                  {/* LAB 3: SOUND VELOCITY & BELL JAR LAB */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Volume2 className="w-5 h-5 text-cyan-400" />
                          <span>মাধ্যম নির্বাচন ও তাপমাত্রা সাপেক্ষে শব্দের বেগ ল্যাব</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          <RenderMathText text="বাতাসে $v \propto \sqrt{T}$ এবং বিভিন্ন মাধ্যমের (কঠিন, তরল, গ্যাস) স্থিতিস্থাপকতার প্রভাব পর্যবেক্ষণ করো।" />
                        </p>
                      </div>

                      {/* Bell Jar Vacuum Toggle */}
                      <button
                        onClick={() => setIsBellJarVacuum(!isBellJarVacuum)}
                        className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition ${
                          isBellJarVacuum
                            ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                            : 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        }`}
                      >
                        {isBellJarVacuum ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                        <span>{isBellJarVacuum ? 'বেলজার: বায়ুশূন্য (No Sound)' : 'বেলজার: বায়ুপূর্ণ (Sound Audible)'}</span>
                      </button>
                    </div>

                    {/* Media Selector Buttons */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {(['air', 'hydrogen', 'water', 'iron', 'diamond'] as const).map((mKey) => {
                        const m = mediumSpeeds[mKey];
                        const isSelected = selectedMedium === mKey;
                        return (
                          <button
                            key={mKey}
                            onClick={() => setSelectedMedium(mKey)}
                            className={`p-3 rounded-xl border text-left transition ${
                              isSelected
                                ? 'bg-cyan-500/20 border-cyan-500 text-cyan-200'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-900'
                            }`}
                          >
                            <div className="text-xs font-semibold">{m.nameBn}</div>
                            <div className="text-sm font-mono font-bold text-cyan-400 mt-1">
                              {m.speedMs} m/s
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Temperature slider for Air */}
                    {selectedMedium === 'air' && (
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">বাতাসের তাপমাত্রা ($T_C$):</span>
                          <span className="text-cyan-400 font-mono font-bold">
                            {airTempC}°C ({273 + airTempC} K)
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={airTempC}
                          onChange={(e) => setAirTempC(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>০°C (৩৩০ m/s)</span>
                          <span>২৫°C (রুম টেম্পারেচার)</span>
                          <span>৫০°C (উত্তপ্ত)</span>
                        </div>
                      </div>
                    )}

                    {/* Velocity Comparison Dashboard */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                      {isBellJarVacuum ? (
                        <div className="text-center py-8 space-y-2">
                          <VolumeX className="w-12 h-12 text-rose-400 mx-auto" />
                          <h4 className="text-base font-bold text-rose-300">
                            শব্দ শোনা যাচ্ছে না! (বেগ = ০ m/s)
                          </h4>
                          <p className="text-xs text-slate-400 max-w-md mx-auto">
                            রবার্ট বয়েলের ঘণ্টা-জার পরীক্ষা: বাতাস পাম্প আউট করে শূন্য মাধ্যম তৈরি করায় শব্দ তরঙ্গের সঞ্চালনের জন্য কোনো কণা অবশিষ্ট নেই। সুতরাং শূন্য মাধ্যমে শব্দ চলতে পারে না!
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-300 font-medium">
                              নির্বাচিত মাধ্যম: {mediumSpeeds[selectedMedium].nameBn}
                            </span>
                            <span className="text-cyan-400 font-bold font-mono text-lg">
                              v = {mediumSpeeds[selectedMedium].speedMs} m/s
                            </span>
                          </div>

                          {/* Horizontal Speed Bar relative to diamond */}
                          <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
                            <div
                              className="h-full bg-gradient-to-r from-cyan-500 to-teal-400 rounded-full transition-all duration-300"
                              style={{
                                width: `${(mediumSpeeds[selectedMedium].speedMs / 12000) * 100}%`,
                              }}
                            />
                          </div>

                          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
                            <p>
                              <strong>বৈশিষ্ট্য:</strong> {mediumSpeeds[selectedMedium].desc}
                            </p>
                            <p className="text-cyan-300 font-mono">
                              <RenderMathText text="বায়ুতে শব্দের বেগ নির্ণয় সূত্র: $v = 330\sqrt{\frac{T}{273}}\text{ m/s}$ বা $v = 330 + 0.6 \times \theta\text{ m/s}$" />
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 4: ECHO & WELL DEPTH SIMULATOR */}
              {activeLesson === 4 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
                      <span>বোর্ড সৃজনশীলে শতভাগ আসা টপিক</span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২০১-২০৩</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০৪: প্রতিধ্বনি ও প্রতিফলন ল্যাব (Echo & Distance Calculation)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      <RenderMathText text="উৎস থেকে সৃষ্ট শব্দ কোনো দূরবর্তী মাধ্যমে বাধা পেয়ে পুনরায় উৎসের কাছে ফিরে আসলে তাকে প্রতিধ্বনি (Echo) বলে। মস্তিষ্কে শব্দের স্থায়িত্বকাল $0.1\text{ s}$ হওয়ায় শব্দকে গিয়ে ফিরে আসতে মোট $2d = vt$ দূরত্ব অতিক্রম করতে হয়।" />
                    </p>
                  </div>

                  {/* LAB 4: ECHO SIMULATOR */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <Radar className="w-5 h-5 text-cyan-400" />
                          <span>প্রতিধ্বনি ও দেয়াল/কূপ সিমুলেটর ($2d = vt$)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-1">
                          প্রতিফলক দেয়ালের দূরত্ব ও তাপমাত্রা পরিবর্তন করে প্রতিধ্বনি শোনার ন্যূনতম ব্যবধান পরীক্ষা করো।
                        </p>
                      </div>

                      <button
                        onClick={handleMakeSound}
                        disabled={isClapping}
                        className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-medium text-xs rounded-xl shadow-lg shadow-cyan-600/30 flex items-center gap-2 disabled:opacity-50 transition"
                      >
                        <Volume2 className="w-4 h-4" />
                        <span>{isClapping ? 'শব্দ সঞ্চালিত হচ্ছে...' : 'শব্দ তৈরি করো (Clap/Shout)'}</span>
                      </button>
                    </div>

                    {/* Sliders */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">প্রতিফলক দেয়ালের দূরত্ব ($d$):</span>
                          <span className="text-cyan-400 font-mono font-bold">{echoDistance.toFixed(1)} m</span>
                        </div>
                        <input
                          type="range"
                          min="5"
                          max="40"
                          step="0.5"
                          value={echoDistance}
                          onChange={(e) => setEchoDistance(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>৫ m (খুব কাছে)</span>
                          <span className="text-amber-400 font-bold">১৬.৬ m (ন্যূনতম)</span>
                          <span>৪০ m (অনেক দূরে)</span>
                        </div>
                      </div>

                      <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-300">বায়ুর তাপমাত্রা ($T_C$):</span>
                          <span className="text-cyan-400 font-mono font-bold">{echoTempC}°C</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="40"
                          step="1"
                          value={echoTempC}
                          onChange={(e) => setEchoTempC(parseFloat(e.target.value))}
                          className="w-full accent-cyan-500 cursor-pointer"
                        />
                        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                          <span>০°C (v = ৩৩০ m/s)</span>
                          <span>২০°C</span>
                          <span>৪০°C (v = ৩৫৩ m/s)</span>
                        </div>
                      </div>
                    </div>

                    {/* Visual Arena */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                      <div className="h-32 w-full relative flex items-center justify-between px-6 bg-slate-900/60 rounded-xl border border-slate-800 overflow-hidden">
                        {/* Person / Sound Source */}
                        <div className="flex flex-col items-center z-10">
                          <div className="w-8 h-8 rounded-full bg-cyan-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                            🗣️
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 font-mono">উৎস (S)</span>
                        </div>

                        {/* Traveling Sound Wave Pulse Animation */}
                        {isClapping && (
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-6 h-6 border-2 border-cyan-400 rounded-full animate-ping pointer-events-none"
                            style={{
                              left: soundPulsePos <= 10 ? `${10 + soundPulsePos * 7}%` : `${80 - (soundPulsePos - 10) * 7}%`,
                            }}
                          />
                        )}

                        {/* Mid distance indicator */}
                        <div className="flex-1 flex flex-col items-center px-4">
                          <div className="w-full border-b border-dashed border-slate-700 relative">
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-950 px-2 text-[11px] font-mono text-cyan-400">
                              দূরত্ব d = {echoDistance} m
                            </span>
                          </div>
                        </div>

                        {/* Reflecting Wall */}
                        <div className="flex flex-col items-center z-10">
                          <div className="w-6 h-24 bg-gradient-to-b from-slate-600 to-slate-800 rounded border border-slate-500 flex items-center justify-center">
                            <div className="w-full h-full bg-slate-700/50 flex flex-col justify-around py-1">
                              <div className="w-full h-0.5 bg-slate-600" />
                              <div className="w-full h-0.5 bg-slate-600" />
                              <div className="w-full h-0.5 bg-slate-600" />
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-400 mt-1 font-mono">প্রতিফলক দেয়াল</span>
                        </div>
                      </div>

                      {/* Echo Evaluation Result Badge */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block mb-1">শব্দের বেগ ($v$):</span>
                          <span className="text-cyan-400 font-mono font-bold text-sm">
                            {echoSpeed.toFixed(1)} m/s
                          </span>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block mb-1">
                            <RenderMathText text="আজকের ন্যূনতম দূরত্ব ($d_{\min}$):" />
                          </span>
                          <span className="text-amber-400 font-mono font-bold text-sm">
                            {echoMinDist} m
                          </span>
                        </div>

                        <div className="bg-slate-900 p-3 rounded-lg border border-slate-800">
                          <span className="text-slate-400 block mb-1">
                            <RenderMathText text="শব্দ ফিরে আসার সময় ($t = \frac{2d}{v}$):" />
                          </span>
                          <span className="text-emerald-400 font-mono font-bold text-sm">
                            {echoTimeSec} s
                          </span>
                        </div>
                      </div>

                      {/* Verification Verdict */}
                      {parseFloat(echoTimeSec) >= 0.1 ? (
                        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                          <span>
                            <strong>প্রতিধ্বনি স্পষ্ট শোনা যাবে!</strong> <RenderMathText text={`ফিরে আসার সময় (${echoTimeSec} s) $\\ge 0.1\\text{ s}$ এবং দূরত্ব (${echoDistance} m) $\\ge ${echoMinDist}\\text{ m}$।`} />
                          </span>
                        </div>
                      ) : (
                        <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                          <XCircle className="w-4 h-4 shrink-0 text-rose-400" />
                          <span>
                            <strong>প্রতিধ্বনি শোনা যাবে না!</strong> ফিরে আসার সময় ({echoTimeSec} s) &lt; ০.১ সেকেন্ড। প্রতিফলিত শব্দ মূল শব্দের সাথে মিশে গমগম করবে কিন্তু স্পষ্ট প্রতিধ্বনি হবে না!
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* LESSON 5: AUDIBLE SPECTRUM, ULTRASOUND & SONAR */}
              {activeLesson === 5 && (
                <div className="space-y-6">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium mb-3">
                      <span>আধুনিক ব্যবহারিক প্রযুক্তি</span>
                      <span>•</span>
                      <span>এনসিটিবি পৃষ্ঠা ২০৩-২০৫</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">
                      পাঠ ০৫: শ্রাব্যতার সীমা, আল্ট্রাসাউন্ড ও সোনার (SONAR)
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      মানব কানের শ্রাব্যতার পাল্লা ২০ Hz থেকে ২০,০০০ Hz। ২০ Hz এর নিচের শব্দকে ইনফ্রাসাউন্ড এবং ২০,০০০ Hz এর উপরের শব্দকে আল্ট্রাসাউন্ড বা শব্দোত্তর শব্দ বলে। চিকিৎসাবিজ্ঞানে আল্ট্রাসনোগ্রাফি এবং সমুদ্রের গভীরতা মাপতে সোনার (SONAR) ব্যবহৃত হয়।
                    </p>
                  </div>

                  {/* LAB 5: FREQUENCY SPECTRUM & SONAR EXPLORER */}
                  <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6 shadow-xl">
                    <div className="border-b border-slate-800 pb-4">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Compass className="w-5 h-5 text-cyan-400" />
                        <span>অডিও ফ্রিকোয়েন্সি স্পেকট্রাম ও সোনার (SONAR) ল্যাব</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-1">
                        কম্পাঙ্ক পরিবর্তন করে জীবজগতের শ্রবণসীমা এবং সাবমেরিন/জাহাজের শব্দ প্রতিফলনে সমুদ্রের গভীরতা পরিমাপ করো।
                      </p>
                    </div>

                    {/* Frequency Slider */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300 font-medium">কম্পাঙ্ক নিয়ন্ত্রক (Frequency, $f$):</span>
                        <span className="text-cyan-400 font-mono font-bold text-base">
                          {audioFreqHz.toLocaleString()} Hz ({ (audioFreqHz / 1000).toFixed(1) } kHz)
                        </span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="100000"
                        step="50"
                        value={audioFreqHz}
                        onChange={(e) => setAudioFreqHz(parseFloat(e.target.value))}
                        className="w-full accent-cyan-500 cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                        <span>৫ Hz (ইনফ্রাসাউন্ড)</span>
                        <span>২০ Hz (শ্রাব্য শুরু)</span>
                        <span>১,০০০ Hz (স্বাভাবিক)</span>
                        <span>২০ kHz (শ্রাব্য শেষ)</span>
                        <span>১০০ kHz (বাদুড়/SONAR)</span>
                      </div>

                      {/* Current Frequency Zone Badge */}
                      <div className={`p-3 rounded-xl border text-xs ${frequencyZoneColor} space-y-1`}>
                        <div className="font-bold flex items-center gap-1.5">
                          <Radio className="w-4 h-4" />
                          <span>{frequencyZone}</span>
                        </div>
                        <p className="text-slate-300">{animalUse}</p>
                      </div>
                    </div>

                    {/* SONAR Ocean Depth Simulator */}
                    <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 space-y-4">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-bold text-white flex items-center gap-2">
                          <Radar className="w-4 h-4 text-cyan-400" />
                          <span>জাহাজের সোনার (SONAR) ও সমুদ্রের তলদেশ জরিপ</span>
                        </h4>
                        <span className="text-xs font-mono text-cyan-400">
                          পানিতে বেগ v = ১৪৯৩ m/s
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="space-y-3">
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1 text-xs">
                            <div className="flex justify-between">
                              <span className="text-slate-300">সমুদ্রের গভীরতা ($h$):</span>
                              <span className="text-cyan-400 font-mono font-bold">{sonarDepth} m</span>
                            </div>
                            <input
                              type="range"
                              min="100"
                              max="3000"
                              step="50"
                              value={sonarDepth}
                              onChange={(e) => setSonarDepth(parseFloat(e.target.value))}
                              className="w-full accent-cyan-500 cursor-pointer"
                            />
                          </div>

                          <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-xs space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">
                                <RenderMathText text="প্রতিধ্বনি ফিরে আসার সময় ($t = \frac{2h}{v}$):" />
                              </span>
                              <span className="text-emerald-400 font-bold font-mono text-sm">{sonarEchoTime} s</span>
                            </div>
                            <div className="text-[11px] text-slate-400 leading-relaxed">
                              গভীরতা নির্ণয়ের সূত্র: <RenderMathText text="$h = \frac{v \times t}{2}$" />। তেল ও গ্যাস সন্ধানে ব্যবহৃত ত্রিমাত্রিক সিসমিক সার্ভেতেও (3D Seismic Survey with Geophone) একই নীতিতে মাটির নিচের স্তরের ত্রিমাত্রিক ছবি তৈরি করা হয়!
                            </div>
                          </div>
                        </div>

                        {/* Ocean Diagram */}
                        <div className="h-44 bg-gradient-to-b from-sky-950/60 via-blue-950/80 to-slate-950 rounded-xl border border-slate-800 p-3 relative flex flex-col justify-between overflow-hidden">
                          {/* Ship on top */}
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">🚢</span>
                            <span className="text-[11px] text-cyan-300 font-mono">SONAR ট্রান্সমিটার ও রিসিভার</span>
                          </div>

                          {/* Sound wave beam */}
                          <div className="self-center w-1 bg-gradient-to-b from-cyan-400 to-teal-400 h-20 opacity-70 animate-pulse rounded" />

                          {/* Sea Bed */}
                          <div className="border-t-2 border-amber-800/80 bg-amber-950/40 p-1 rounded-b text-center">
                            <span className="text-[10px] text-amber-300/80 font-mono">সমুদ্রের তলদেশ (গভীরতা: {sonarDepth} m)</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 2: WORKED BOARD CREATIVE QUESTIONS (CQs) & RUBRICS          */}
          {/* =============================================================== */}
          {activeStep === 'example' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <BookOpen className="w-4 h-4" />
                  <span>বোর্ড সৃজনশীল প্রশ্ন ও পরীক্ষকের গোপন মূল্যায়ন রুব্রিক</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  বোর্ড স্ট্যান্ডার্ড ৪টি সমাধানকৃত সৃজনশীল প্রশ্ন (CQs)
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  এনসিটিবি পাঠ্যবই এবং ঢাকা ও রাজশাহী শিক্ষা বোর্ডের বিগত বছরের গাণিতিক সমস্যাগুলোর পুঙ্খানুপুঙ্খ ধাপভিত্তিক সমাধান এবং পরীক্ষকের গোপন নম্বর বণ্টন নির্দেশিকা।
                </p>
              </div>

              {/* CQ 1: Textbook CQ 2 (Page 208) - Wave from Graph & Echo */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      পাঠ্যবই সৃজনশীল ০২ (পৃষ্ঠা ২০৮)
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      তরঙ্গ লেখচিত্র থেকে কম্পাঙ্ক এবং প্রতিফলক থেকে প্রতিধ্বনি যাচাই
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(1)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(1) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-1">
                  <p>
                    <strong>উদ্দীপক:</strong> <RenderMathText text="একটি মাধ্যমে সঞ্চালিত তরঙ্গের বিস্তার $A = 2\text{ cm}$, তরঙ্গদৈর্ঘ্য $\lambda = 4\text{ m}$ এবং শব্দের বেগ $v = 340\text{ m/s}$। উৎস $S$ থেকে একটি প্রতিফলক দেয়ালের দূরত্ব $18\text{ m}$।" />
                  </p>
                </div>

                {expandedCQ.includes(1) && (
                  <div className="space-y-4 pt-2 text-xs">
                    {/* Part G */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        (গ) তরঙ্গের কম্পাঙ্ক ($f$) ও পর্যায়কাল ($T$) নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p><RenderMathText text="আমরা জানি, তরঙ্গের বেগ $v = f\lambda$" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$f = \frac{v}{\lambda} = \frac{340\text{ m/s}}{4\text{ m}} = 85\text{ Hz}$$" />
                          <RenderMathText text="$$T = \frac{1}{f} = \frac{1}{85\text{ Hz}} \approx 0.0118\text{ s} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>

                    {/* Part Gh */}
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        (ঘ) $S$ অবস্থান থেকে প্রতিধ্বনি শোনা সম্ভব কি না? গাণিতিক যুক্তিসহ যাচাই করো। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p><RenderMathText text="দেওয়া আছে: উৎস থেকে প্রতিফলকের দূরত্ব $d = 18\text{ m}$ এবং শব্দের বেগ $v = 340\text{ m/s}$।" /></p>
                        <p><RenderMathText text="শব্দ উৎসে ফিরে আসার সময় $t = \frac{2d}{v}$:" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$t = \frac{2 \times 18}{340} = \frac{36}{340} \approx 0.1059\text{ s} \approx 0.106\text{ s}$$" />
                        </div>
                        <p>
                          <RenderMathText text="যেহেতু শব্দ প্রতিফলিত হয়ে ফিরে আসার সময় $0.106\text{ s} > 0.1\text{ s}$ (যা মস্তিষ্কে শব্দের স্থায়িত্বকালের চেয়ে বেশি), তাই $S$ অবস্থান থেকে প্রতিধ্বনি স্পষ্টভাবে শোনা সম্ভব!" />
                        </p>
                      </div>
                    </div>

                    {/* Examiner Secret Rubric Drawer */}
                    <div className="border border-amber-500/30 bg-amber-500/5 rounded-xl p-4">
                      <button
                        onClick={() => toggleRubric(1)}
                        className="flex items-center justify-between w-full text-left font-medium text-amber-300"
                      >
                        <span className="flex items-center gap-2">
                          <ShieldAlert className="w-4 h-4 text-amber-400" />
                          <span>পরীক্ষকের গোপন কথা (Examiner Marking Rubric)</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${expandedRubric.includes(1) ? 'rotate-180' : ''}`}
                        />
                      </button>

                      {expandedRubric.includes(1) && (
                        <div className="mt-3 pt-3 border-t border-amber-500/20 text-slate-300 space-y-2 leading-relaxed">
                          <p>
                            <RenderMathText text="• (গ) প্রয়োগমূলক [৩ নম্বর]: সূত্র $v = f\lambda$ লেখার জন্য ১ নম্বর, সঠিক মান বসিয়ে কম্পাঙ্ক $85\text{ Hz}$ বের করায় ১ নম্বর, এবং পর্যায়কাল $T = 0.012\text{ s}$ এককে ১ নম্বর।" />
                          </p>
                          <p>
                            <RenderMathText text="• (ঘ) উচ্চতর দক্ষতা [৪ নম্বর]: $2d = vt$ সূত্র প্রয়োগে ১ নম্বর, ফিরে আসার সময় $t = 0.106\text{ s}$ গণনায় ১ নম্বর, এবং ০.১ সেকেন্ড স্থায়িত্বকালের সাথে যৌক্তিক তুলনা ও সিদ্ধান্ত প্রদানে ২ নম্বর।" />
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 2: Textbook CQ 3 (Page 209) - Sajek Valley Echo */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      পাঠ্যবই সৃজনশীল ০৩ (পৃষ্ঠা ২০৯)
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      সাজেক পাহাড়ে নুসরাতের চিৎকার ও প্রতিধ্বনি শোনার অবস্থান
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(2)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(2) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="গ্রীষ্মকালীন ছুটিতে নুসরাত সাজেকে পাহাড়ের পাশে দাঁড়িয়ে চিৎকার করে কোনো প্রতিধ্বনি শুনতে পেল না। তখন তার বাবা নুসরাতকে আরও $3\text{ m}$ সরে গিয়ে আবার শব্দ করতে বললেন এবং এবার সে প্রতিধ্বনি শুনতে পেল। সেদিনের তাপমাত্রা অনুযায়ী বায়ুতে শব্দের বেগ $332\text{ m/s}$ এবং কম্পাঙ্ক $1328\text{ Hz}$।" />
                </div>

                {expandedCQ.includes(2) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        (গ) নুসরাতের উচ্চারিত শব্দের তরঙ্গদৈর্ঘ্য নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p><RenderMathText text="আমরা জানি, $\lambda = \frac{v}{f}$" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$\lambda = \frac{332\text{ m/s}}{1328\text{ Hz}} = 0.25\text{ m} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        <RenderMathText text="(ঘ) নুসরাত চিৎকার করার $0.3\text{ s}$ পর প্রতিধ্বনি শুনতে চাইলে তাকে আদি অবস্থান থেকে আরও কতটা পেছনে যেতে হবে? [৪ নম্বর]" />
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p>
                          <RenderMathText text="প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব $d_{\min} = \frac{v \times 0.1}{2} = \frac{332 \times 0.1}{2} = 16.6\text{ m}$।" />
                        </p>
                        <p>
                          <RenderMathText text="যেহেতু ৩ মিটার পিছিয়ে যাওয়ার পর সে ঠিক প্রতিধ্বনি শুনতে পায়, তাই তার আদি দূরত্ব ছিল $d_1 = 16.6 - 3 = 13.6\text{ m}$।" />
                        </p>
                        <p>
                          <RenderMathText text="এখন, $0.3\text{ s}$ পর প্রতিধ্বনি শোনার জন্য প্রয়োজনীয় দূরত্ব $d_2$:" />
                        </p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$d_2 = \frac{v \times t_2}{2} = \frac{332 \times 0.3}{2} = 49.8\text{ m}$$" />
                        </div>
                        <p>
                          <RenderMathText text="অতএব, আদি অবস্থান থেকে আরও পেছনে সরতে হবে $= d_2 - d_1 = 49.8 - 13.6 = 36.2\text{ m}$ (অথবা দ্বিতীয় অবস্থান থেকে সরতে হবে $49.8 - 16.6 = 33.2\text{ m}$)।" />
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 3: Dhaka Board - Temperature & Well Depth Echo */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      ঢাকা বোর্ড সৃজনশীল
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      শীত ও গ্রীষ্মে কূপের পানির গভীরতায় শব্দের বেগ ও প্রতিধ্বনির সময়
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(3)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(3) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="শীতকালে $15^\circ\text{C}$ তাপমাত্রায় একটি খালি কূপের মুখে দাঁড়িয়ে শব্দ করার $0.12\text{ s}$ পর প্রতিধ্বনি শোনা গেল। গ্রীষ্মকালে বায়ুর তাপমাত্রা বেড়ে $35^\circ\text{C}$ হলো। ($0^\circ\text{C}$-এ শব্দের বেগ $330\text{ m/s}$)।" />
                </div>

                {expandedCQ.includes(3) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        (গ) শীতকালে কূপটির গভীরতা কত ছিল নির্ণয় করো। [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p><RenderMathText text="শীতকালে ($15^\circ\text{C}$) শব্দের বেগ $v_1$:" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$v_1 = 330 \times \sqrt{\frac{273 + 15}{273}} = 330 \times \sqrt{\frac{288}{273}} \approx 338.93\text{ m/s}$$" />
                          <RenderMathText text="$$h = \frac{v_1 \times t_1}{2} = \frac{338.93 \times 0.12}{2} = 20.34\text{ m} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        (ঘ) গ্রীষ্মকালে ওই কূপ থেকে প্রতিধ্বনি শুনতে শীতকালের চেয়ে বেশি না কম সময় লাগবে? বিশ্লেষণ করো। [৪ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p><RenderMathText text="গ্রীষ্মকালে ($35^\circ\text{C}$) শব্দের বেগ $v_2$:" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$v_2 = 330 \times \sqrt{\frac{273 + 35}{273}} = 330 \times \sqrt{\frac{308}{273}} \approx 350.48\text{ m/s}$$" />
                          <RenderMathText text="$$t_2 = \frac{2h}{v_2} = \frac{2 \times 20.34}{350.48} \approx 0.116\text{ s}$$" />
                        </div>
                        <p>
                          <RenderMathText text="সিদ্ধান্ত: যেহেতু $v_2 > v_1$, তাই গ্রীষ্মকালে শব্দ দ্রুত ফিরে আসবে এবং সময় শীতকালের ($0.12\text{ s}$) চেয়ে কম লাগবে ($0.116\text{ s} < 0.12\text{ s}$)।" />
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* CQ 4: Rajshahi Board - Ultrasonic SONAR & Submarine */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                      রাজশাহী বোর্ড সৃজনশীল
                    </span>
                    <h3 className="text-base font-semibold text-white mt-1">
                      জাহাজের সোনার (SONAR) সংকেত ও সমুদ্রের তলদেশে ডুবো পাহাড় শনাক্তকরণ
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCQ(4)}
                    className="p-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${expandedCQ.includes(4) ? 'rotate-180' : ''}`}
                    />
                  </button>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  <strong>উদ্দীপক:</strong> <RenderMathText text="একটি সমুদ্র গবেষণা জাহাজ থেকে $50\text{ kHz}$ কম্পাঙ্কের একটি আল্ট্রাসোনিক সংকেত সমুদ্রের তলদেশে পাঠানো হলো এবং $1.8\text{ s}$ পর প্রতিধ্বনি রিসিভারে ধরা পড়ল। সমুদ্রের পানিতে শব্দের বেগ $1493\text{ m/s}$।" />
                </div>

                {expandedCQ.includes(4) && (
                  <div className="space-y-4 pt-2 text-xs">
                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        (গ) পানিতে প্রেরিত আল্ট্রাসাউন্ড তরঙ্গের তরঙ্গদৈর্ঘ্য কত? [৩ নম্বর]
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$\lambda = \frac{v}{f} = \frac{1493\text{ m/s}}{50 \times 10^3\text{ Hz}} = 0.02986\text{ m} \approx 2.99\text{ cm} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="font-semibold text-cyan-300">
                        <RenderMathText text="(ঘ) সমুদ্রের তলদেশে একটি ডুবো পাহাড়ের চূড়া সমতলের চেয়ে $400\text{ m}$ উঁচু হলে, চূড়ার উপর দিয়ে যাওয়ার সময় প্রতিধ্বনি সংকেত পেতে কত সময় লাগবে? [৪ নম্বর]" />
                      </div>
                      <div className="text-slate-300 leading-relaxed space-y-2">
                        <p><RenderMathText text="সমুদ্রের সমতল গভীরতা $h_1 = \frac{v \times t_1}{2} = \frac{1493 \times 1.8}{2} = 1343.7\text{ m}$।" /></p>
                        <p><RenderMathText text="পাহাড়ের চূড়ার গভীরতা $h_2 = 1343.7 - 400 = 943.7\text{ m}$।" /></p>
                        <div className="bg-slate-900 p-2.5 rounded font-mono text-emerald-400">
                          <RenderMathText text="$$t_2 = \frac{2 \times h_2}{v} = \frac{2 \times 943.7}{1493} \approx 1.264\text{ s} \quad \text{(উত্তর)}$$" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 3: INTERACTIVE PRACTICE CHALLENGES (TRY YOURSELF)           */}
          {/* =============================================================== */}
          {activeStep === 'practice' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Layers className="w-4 h-4" />
                  <span>ইন্টারেক্টিভ গাণিতিক চ্যালেঞ্জ (Instant Validation)</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  নিজে করো: ৩টি সরাসরি হিসাব চ্যালেঞ্জ
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  পরীক্ষার হলে দ্রুত ও নির্ভুল হিসাব নিশ্চিত করতে ক্যালকুলেটর নিয়ে নিচের সমস্যাগুলোর সমাধান করো।
                </p>
              </div>

              {/* Challenge 1 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-cyan-400">চ্যালেঞ্জ ০১: শব্দের বেগ ও তরঙ্গদৈর্ঘ্য</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">বোর্ড স্ট্যান্ডার্ড</span>
                </div>
                <p className="text-sm text-slate-200">
                  <RenderMathText text="$512\text{ Hz}$ কম্পাঙ্কের একটি সুর-শলাকা (Tuning Fork) বাতাসে $340\text{ m/s}$ বেগে শব্দ তরঙ্গ সৃষ্টি করলে উৎপন্ন শব্দের তরঙ্গদৈর্ঘ্য $\lambda$ কত মিটার?" />
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    step="0.01"
                    placeholder="উদা: 0.66"
                    value={challenge1Input}
                    onChange={(e) => setChallenge1Input(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono w-48"
                  />
                  <button
                    onClick={handleVerifyChallenge1}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition"
                  >
                    যাচাই করো
                  </button>
                </div>

                {challenge1Status === 'correct' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <RenderMathText text="🎉 একদম সঠিক উত্তর! $\lambda = \frac{v}{f} = \frac{340}{512} \approx 0.664\text{ m}$।" />
                  </div>
                )}
                {challenge1Status === 'wrong' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <RenderMathText text="সঠিক হয়নি। ক্লু: $\lambda = \frac{v}{f} = \frac{340}{512}$ সূত্রটি ব্যবহার করো।" />
                  </div>
                )}
              </div>

              {/* Challenge 2 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-cyan-400">চ্যালেঞ্জ ০২: প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">বোর্ড সৃজনশীল (গ)</span>
                </div>
                <p className="text-sm text-slate-200">
                  <RenderMathText text="৩০°C তাপমাত্রার দিনে বাতাসে শব্দের বেগ $350\text{ m/s}$ হলে প্রতিধ্বনি শোনার জন্য প্রতিফলক দেয়ালের ন্যূনতম দূরত্ব কত মিটার হতে হবে?" />
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    placeholder="উদা: 17.5"
                    value={challenge2Input}
                    onChange={(e) => setChallenge2Input(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono w-48"
                  />
                  <button
                    onClick={handleVerifyChallenge2}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition"
                  >
                    যাচাই করো
                  </button>
                </div>

                {challenge2Status === 'correct' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <RenderMathText text="🎉 চমৎকার! $d_{\min} = \frac{v \times 0.1}{2} = \frac{350 \times 0.1}{2} = 17.5\text{ m}$।" />
                  </div>
                )}
                {challenge2Status === 'wrong' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <RenderMathText text="সঠিক হয়নি। ক্লু: মস্তিষ্কে শব্দের স্থায়িত্বকাল ০.১ সেকেন্ড, তাই $d = \frac{vt}{2}$।" />
                  </div>
                )}
              </div>

              {/* Challenge 3 */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-mono text-cyan-400">চ্যালেঞ্জ ০৩: তাপমাত্রার সাথে শব্দের বেগ</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">বোর্ড সৃজনশীল (ঘ)</span>
                </div>
                <p className="text-sm text-slate-200">
                  <RenderMathText text="$0^\circ\text{C}$ তাপমাত্রায় বায়ুতে শব্দের বেগ $332\text{ m/s}$ হলে, ২৭°C ($300\text{ K}$) তাপমাত্রায় বায়ুতে শব্দের বেগ কত m/s?" />
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="number"
                    step="1"
                    placeholder="উদা: 348"
                    value={challenge3Input}
                    onChange={(e) => setChallenge3Input(e.target.value)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono w-48"
                  />
                  <button
                    onClick={handleVerifyChallenge3}
                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-medium transition"
                  >
                    যাচাই করো
                  </button>
                </div>

                {challenge3Status === 'correct' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <RenderMathText text="🎉 নির্ভুল গণনা! $v = 332 \times \sqrt{\frac{300}{273}} \approx 348\text{ m/s}$।" />
                  </div>
                )}
                {challenge3Status === 'wrong' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-rose-400" />
                    <RenderMathText text="সঠিক হয়নি। ক্লু: $\frac{v_1}{v_2} = \sqrt{\frac{T_1}{T_2}}$ যেখানে কেলভিন তাপমাত্রা ব্যবহার করতে হবে।" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 4: CHECK UNDERSTANDING MCQS                                 */}
          {/* =============================================================== */}
          {activeStep === 'quiz' && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                  <Award className="w-4 h-4" />
                  <span>অধ্যায়ভিত্তিক স্ব-মূল্যায়ন কুইজ</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-1">
                  বোর্ড পরীক্ষার স্ট্যান্ডার্ড ৫টি MCQ
                </h2>
                <p className="text-slate-400 text-xs leading-relaxed">
                  সঠিক উত্তরটি নির্বাচন করে তোমার প্রস্তুতি যাচাই করো। প্রতিটি প্রশ্নের সাথে বিস্তারিত ব্যাখ্যা সংযোজিত।
                </p>
              </div>

              <div className="space-y-4">
                {mcqs.map((q, idx) => {
                  const isAnswered = selectedAnswers[q.id] !== undefined;
                  const isCorrect = selectedAnswers[q.id] === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-cyan-500/15 text-cyan-400 flex items-center justify-center text-xs font-bold shrink-0">
                          {idx + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-white leading-relaxed">
                          <RenderMathText text={q.question} />
                        </h3>
                      </div>

                      <div className="space-y-2 pt-1 pl-9">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedAnswers[q.id] === optIdx;
                          let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:bg-slate-800';

                          if (submittedQuiz) {
                            if (optIdx === q.correctIndex) {
                              btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-200';
                            } else if (isSelected) {
                              btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-200';
                            }
                          } else if (isSelected) {
                            btnStyle = 'bg-cyan-600/30 border-cyan-500 text-cyan-200';
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelectOption(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                            >
                              <RenderMathText text={opt} />
                              {submittedQuiz && optIdx === q.correctIndex && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {submittedQuiz && isSelected && optIdx !== q.correctIndex && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {submittedQuiz && (
                        <div className="ml-9 p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
                          <strong className="text-cyan-400">ব্যাখ্যা:</strong>{' '}
                          <RenderMathText text={q.explanation} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-800">
                {submittedQuiz ? (
                  <div className="text-sm font-bold text-cyan-400">
                    তোমার স্কোর: ৫-এর মধ্যে {calculateScore()} ({Math.round((calculateScore() / 5) * 100)}%)
                  </div>
                ) : (
                  <div className="text-xs text-slate-400">
                    সবগুলো উত্তর দিয়ে সাবমিট বাটনে চাপ দাও।
                  </div>
                )}

                <button
                  onClick={() => setSubmittedQuiz(true)}
                  disabled={submittedQuiz}
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-xl text-xs font-semibold transition"
                >
                  উত্তর জমা দাও
                </button>
              </div>
            </div>
          )}

          {/* =============================================================== */}
          {/* STEP 5: SUMMARY CHEAT SHEET & FORMULA BANK                       */}
          {/* =============================================================== */}
          {activeStep === 'summary' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                      <Sparkles className="w-4 h-4" />
                      <span>অধ্যায় সারসংক্ষেপ ও সূত্র ভাণ্ডার</span>
                    </div>
                    <h2 className="text-xl font-bold text-white mb-1">
                      অধ্যায় ০৭: তরঙ্গ ও শব্দ — একনজরে রিভিশন
                    </h2>
                    <p className="text-slate-400 text-xs leading-relaxed">
                      পরীক্ষার আগের রাতের জন্য দ্রুত রিভিশন নোট ও শীর্ষ ফাঁদসমূহ।
                    </p>
                  </div>
                  <button
                    onClick={copyNotesToClipboard}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs rounded-xl text-slate-300 border border-slate-700 flex items-center gap-1.5 shrink-0 transition"
                  >
                    {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedNote ? 'কপি হয়েছে!' : 'নোট কপি করুন'}</span>
                  </button>
                </div>
              </div>

              {/* Formula Bank Cards */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-white">১. মূল গাণিতিক সমীকরণসমূহ (Formula Bank)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-cyan-400">সরল স্পন্দন ও পর্যায়কাল:</span>
                    <div className="text-xs text-slate-300 space-y-1 font-mono">
                      <RenderMathText text="$$T = 2\pi\sqrt{\frac{l}{g}}, \quad T = 2\pi\sqrt{\frac{m}{k}}, \quad f = \frac{1}{T}$$" />
                      <p className="text-[11px] text-slate-400">• দোলকের দোলনকাল ববের ভরের ওপর নির্ভর করে না।</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-cyan-400">তরঙ্গ গতি সমীকরণ:</span>
                    <div className="text-xs text-slate-300 space-y-1 font-mono">
                      <RenderMathText text="$$v = f\lambda = \frac{\lambda}{T}, \quad I \propto A^2$$" />
                      <p className="text-[11px] text-slate-400">• বিস্তার দ্বিগুণ হলে প্রবাহিত শক্তি ৪ গুণ হয়।</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-cyan-400">তাপমাত্রা ও শব্দের বেগ:</span>
                    <div className="text-xs text-slate-300 space-y-1 font-mono">
                      <RenderMathText text="$$v \propto \sqrt{T} \implies \frac{v_1}{v_2} = \sqrt{\frac{T_1}{T_2}}$$" />
                      <p className="text-[11px] text-slate-400">• $T$ অবশ্যই কেলভিন তাপমাত্রায় নিতে হবে।</p>
                    </div>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-xs font-semibold text-cyan-400">প্রতিধ্বনি ও গভীরতা নির্ণয়:</span>
                    <div className="text-xs text-slate-300 space-y-1 font-mono">
                      <RenderMathText text="$$2d = vt \implies d = \frac{vt}{2}, \quad d_{\min} = \frac{v \times 0.1}{2}$$" />
                      <p className="text-[11px] text-slate-400">• ০°C তাপমাত্রায় ন্যূনতম দূরত্ব ১৬.৬ মিটার।</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Examiner Traps */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400" />
                  <span>২. বোর্ড পরীক্ষার শীর্ষ ৪টি মারাত্মক ফাঁদ (Examiner Traps)</span>
                </h3>

                <div className="space-y-3 text-xs">
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০১: প্রতিধ্বনিতে ২ দিয়ে ভাগ করতে ভুলে যাওয়া!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="শব্দ দেয়ালে গিয়ে আবার ফিরে আসে, ফলে মোট অতিক্রান্ত দূরত্ব $2d$। ছাত্রছাত্রীরা প্রায়ই $d = vt$ লিখে বসে, সঠিক সূত্র $d = \frac{vt}{2}$।" />
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০২: তাপমাত্রার সূত্রে সেলসিয়াস সরাসরি বসানো!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="$v_1/v_2 = \sqrt{T_1/T_2}$ সূত্রে তাপমাত্রা অবশ্যই পরম তাপমাত্রা বা কেলভিন স্কেলে ($T = 273 + \theta$) বসাতে হবে। সেলসিয়াস বসালে শূন্য নম্বর পাওয়া যাবে!" />
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০৩: কম্পাঙ্ক বদলালে বায়ুতে শব্দের বেগ বদলায় মনে করা!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="বায়ুতে শব্দের বেগ মাধ্যমের তাপমাত্রা ও ঘনত্বের ওপর নির্ভর করে, উৎসের কম্পাঙ্কের ওপর নয়। কম্পাঙ্ক ($f$) বাড়লে তরঙ্গদৈর্ঘ্য ($\lambda$) সমানুপাতে কমে যায়, কিন্তু $v$ স্থির থাকে!" />
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-semibold text-rose-300">ফাঁদ ০৪: বাদুড়ের শ্রবণাতীত ও হাতির শব্দেতর কম্পাঙ্ক গোলমাল করা!</span>
                    <p className="text-slate-400">
                      <RenderMathText text="বাদুড় ব্যবহার করে শব্দোত্তর বা আল্ট্রাসাউন্ড ($>20\text{ kHz}$), আর হাতি ব্যবহার করে শব্দেতর বা ইনফ্রাসাউন্ড ($<20\text{ Hz}$)।" />
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* ----------------------------------------------------------------- */}
        {/* RIGHT SOCRATIC AI TUTOR DRAWER                                    */}
        {/* ----------------------------------------------------------------- */}
        {isAiTutorOpen && (
          <aside className="w-80 lg:w-96 border-l border-slate-800 bg-slate-900/95 flex flex-col z-30 shadow-2xl">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">সক্রেটিক এআই পদার্থবিজ্ঞান টিউটর</h3>
              </div>
              <button
                onClick={() => setIsAiTutorOpen(false)}
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`p-3 rounded-xl text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-cyan-600/20 border border-cyan-500/30 text-cyan-100 ml-6'
                      : 'bg-slate-950 border border-slate-800 text-slate-300 mr-4'
                  }`}
                >
                  <RenderMathText text={msg.text} />
                </div>
              ))}
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="p-3 border-t border-slate-800/60 bg-slate-950/40 flex flex-wrap gap-1.5">
              {[
                'প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব কেন ১৬.৬ মিটার?',
                'বাদুড় কীভাবে পথ দেখে?',
                'গরমের দিনে শব্দের বেগ বেশি হয় কেন?',
              ].map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setChatInput(p);
                  }}
                  className="px-2 py-1 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-lg text-[10px] text-slate-300 text-left transition"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-slate-800 bg-slate-950 flex gap-2">
              <input
                type="text"
                placeholder="প্রশ্ন জিজ্ঞাসা করো..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleSendMessage}
                className="p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
