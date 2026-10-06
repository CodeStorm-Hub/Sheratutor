'use client';

import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Activity,
  Shield,
  Eye,
  Scan,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

type DiagnosticTech = 'xray' | 'usg' | 'mri' | 'ecg' | 'ct';

interface TechInfo {
  nameBn: string;
  nameEn: string;
  physicsPrincipleBn: string;
  physicsPrincipleEn: string;
  radiationTypeBn: string;
  radiationTypeEn: string;
  safetyProfileBn: string;
  safetyProfileEn: string;
  clinicalUseBn: string;
  clinicalUseEn: string;
}

const DIAGNOSTIC_DATABASE: Record<DiagnosticTech, TechInfo> = {
  xray: {
    nameBn: 'এক্স-রে (X-Ray)',
    nameEn: 'X-Ray Radiography',
    physicsPrincipleBn:
      'উচ্চ শক্তির তড়িৎচৌম্বকীয় বিকিরণ। হাড়ের ঘন ক্যালসিয়ামে শোষণ বেশি (সাদা ছায়া) এবং নরম মাংসপেশিতে শোষণ কম (কালো ছায়া)।',
    physicsPrincipleEn:
      'High-energy ionizing EM radiation. High attenuation in dense calcium bone produces radiopaque white silhouettes.',
    radiationTypeBn: 'আয়নাইজিং বিকিরণ (Ionizing Radiation - অতিরিক্ত ব্যবহারে ঝুঁকি)',
    radiationTypeEn: 'Ionizing Radiation (Requires lead shielding)',
    safetyProfileBn: 'গর্ভবতী নারীদের ক্ষেত্রে ঝুঁকি রয়েছে; সীসার অ্যাপ্রন ব্যবহার জরুরি।',
    safetyProfileEn: 'Contraindicated in early pregnancy; requires lead protection.',
    clinicalUseBn: 'অস্থিভঙ্গ (হাড় ভাঙা), ফুসফুসের নিউমোনিয়া ও দাঁতের সমস্যা শনাক্তকরণ।',
    clinicalUseEn: 'Bone fractures, chest pneumonia, and dental diagnostics.',
  },
  usg: {
    nameBn: 'আল্ট্রাসনোগ্রাফি (USG)',
    nameEn: 'Ultrasonography (Ultrasound)',
    physicsPrincipleBn:
      'উচ্চ কম্পাঙ্কের শব্দতরঙ্গ (১-১০ MHz)। পিজোইলেকট্রিক ট্রান্সডিউসারের মাধ্যমে শরীরের বিভিন্ন অঙ্গের বিভেদতল থেকে শব্দের প্রতিফলন (Echo)।',
    physicsPrincipleEn:
      'High-frequency acoustic waves (1-10 MHz) reflected at acoustic impedance interfaces via piezoelectric transducers.',
    radiationTypeBn: 'শব্দতরঙ্গ (Non-ionizing - সম্পূর্ণ নিরাপদ)',
    radiationTypeEn: 'Acoustic Sound Waves (Non-ionizing, 100% safe)',
    safetyProfileBn: 'কোনো ক্ষতিকর তেজস্ক্রিয়তা নেই; গর্ভস্থ ভ্রূণ ও শিশুর জন্য সম্পূর্ণ নিরাপদ।',
    safetyProfileEn: 'Completely safe for fetal monitoring and internal organs.',
    clinicalUseBn: 'গর্ভস্থ ভ্রূণের বৃদ্ধি পর্যবেক্ষণ, পিত্তথলির পাথর ও লিভার পরীক্ষা।',
    clinicalUseEn: 'Obstetric fetal scans, gallstones, liver and kidney screening.',
  },
  mri: {
    nameBn: 'এমআরআই (MRI)',
    nameEn: 'Magnetic Resonance Imaging',
    physicsPrincipleBn:
      'শক্তিশালী চৌম্বক ক্ষেত্র (১.৫-৩.০ টেসলা) ও রেডিও তরঙ্গের অনুরণন। মানবদেহের পানির হাইড্রোজেন প্রোটন স্পিন অনুরণনে সাড়া দেয়।',
    physicsPrincipleEn:
      'Nuclear magnetic resonance of hydrogen protons under strong magnetic field (1.5-3.0T) and RF excitation pulses.',
    radiationTypeBn: 'রেডিও তরঙ্গ ও চৌম্বক ক্ষেত্র (Non-ionizing)',
    radiationTypeEn: 'RF Radio Waves & Static Magnetic Fields (Non-ionizing)',
    safetyProfileBn: 'নিরাপদ, তবে শরীরে পেসমেকার বা ধাতব ইমপ্লান্ট থাকলে নিষিদ্ধ।',
    safetyProfileEn: 'No radiation hazard; strictly prohibited with pacemakers or metallic implants.',
    clinicalUseBn: 'মস্তিষ্ক (Brain), মেরুদণ্ড, লিগামেন্ট ও নরম টিস্যুর সর্বোচ্চ স্পষ্ট ত্রিমাত্রিক চিত্র।',
    clinicalUseEn: 'Brain lesions, spinal cord injuries, ligaments, and soft tissue oncology.',
  },
  ecg: {
    nameBn: 'ইসিজি (ECG)',
    nameEn: 'Electrocardiogram',
    physicsPrincipleBn:
      'হৃদপিণ্ডের সংকোচন-প্রসারণে উৎপন্ন ক্ষুদ্র মিলিভোল্ট তড়িৎ সংকেত (P-QRS-T তরঙ্গ) ত্বকে সংযুক্ত ইলেকট্রোডের মাধ্যমে পরিমাপ।',
    physicsPrincipleEn:
      'Bioelectric dipole potential recording of cardiac depolarization and repolarization via surface electrodes.',
    radiationTypeBn: 'দেহের নিজস্ব জৈব-বিদ্যুৎ সংকেত (Bio-electric signal)',
    radiationTypeEn: 'Endogenous cardiac bio-potential (0-2 mV)',
    safetyProfileBn: 'সম্পূর্ণ অহিংস (Non-invasive) ও নিরাপদ।',
    safetyProfileEn: 'Completely non-invasive, painless, and risk-free.',
    clinicalUseBn: 'হার্ট অ্যাটাক (মায়োকার্ডিয়াল ইনফার্কশন) ও হৃদস্পন্দনের ছন্দপতন শনাক্তকরণ।',
    clinicalUseEn: 'Diagnosing myocardial infarction, arrhythmias, and cardiac ischemia.',
  },
  ct: {
    nameBn: 'সিটি স্ক্যান (CT Scan)',
    nameEn: 'Computed Tomography (CT)',
    physicsPrincipleBn:
      'ঘূর্ণায়মান এক্স-রে টিউব ও ডিজিটাল ডিটেক্টর দ্বারা শরীরের শত শত দ্বি-মাত্রিক স্লাইস নিয়ে কম্পিউটারের মাধ্যমে ত্রিমাত্রিক (3D) পুনর্গঠন।',
    physicsPrincipleEn:
      'Rotating X-ray tube and detector array generating multi-slice cross-sectional 3D volumetric reconstructions.',
    radiationTypeBn: 'উচ্চ মাত্রার এক্স-রে বিকিরণ (Ionizing)',
    radiationTypeEn: 'High-dose ionizing X-rays',
    safetyProfileBn: 'সাধারণ এক্স-রে চেয়ে বিকিরণের মাত্রা অনেক বেশি; প্রয়োজন ছাড়া ঘনঘন করা অনুচিত।',
    safetyProfileEn: 'Higher radiation dose than standard radiography; use judiciously.',
    clinicalUseBn: 'মাথায় রক্তক্ষরণ (Brain Hemorrhage), টিউমার ও অভ্যন্তরীণ জটিল আঘাতের জরুরি স্ক্যান।',
    clinicalUseEn: 'Acute stroke, intracranial hemorrhage, trauma, and cancer staging.',
  },
};

export function BiomedicalDiagnosticSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [selectedTech, setSelectedTech] = useState<DiagnosticTech>('ecg');

  // Interactive controls
  const [heartRateBpm, setHeartRateBpm] = useState<number>(75);
  const [xrayKv, setXrayKv] = useState<number>(70);
  const [ultrasoundFreqMhz, setUltrasoundFreqMhz] = useState<number>(3.5);
  const [mriFieldTesla, setMriFieldTesla] = useState<number>(1.5);

  // Animated ECG sweep counter
  const [ecgTick, setEcgTick] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEcgTick((prev) => (prev + 1) % 100);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const currentInfo = DIAGNOSTIC_DATABASE[selectedTech];

  const handleReset = () => {
    setSelectedTech('ecg');
    setHeartRateBpm(75);
    setXrayKv(70);
    setUltrasoundFreqMhz(3.5);
    setMriFieldTesla(1.5);
  };

  return (
    <Card className="overflow-hidden border border-border/70 bg-gradient-to-b from-card to-card/60 shadow-xl rounded-2xl">
      {/* Top Banner / Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center">
            <HeartPulse className="size-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">
              {isBn
                ? 'জীবন বাঁচাতে পদার্থবিজ্ঞান: ডায়াগনস্টিক ল্যাব'
                : 'Biomedical Physics Diagnostic Laboratory'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'এক্স-রে, আল্ট্রাসাউন্ড, এমআরআই ও ইসিজির বৈজ্ঞানিক মূলনীতি ও নিরাপত্তা'
                : 'Physical principles & safety profiles of X-Ray, USG, MRI & ECG'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tech Selector Bar */}
          <div className="inline-flex p-1 rounded-xl bg-background border border-border/80 overflow-x-auto max-w-full">
            {(['ecg', 'xray', 'usg', 'mri', 'ct'] as const).map((tech) => (
              <button
                key={tech}
                onClick={() => setSelectedTech(tech)}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedTech === tech
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tech.toUpperCase()}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="h-8 gap-1.5 text-xs rounded-xl"
          >
            <RotateCcw className="size-3.5" />
            <span>{isBn ? 'রিসেট' : 'Reset'}</span>
          </Button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Interactive Medical Monitor Canvas */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold text-slate-200">
                {currentInfo.nameBn}
              </span>
            </div>
            <span className="font-mono text-emerald-400">
              {selectedTech === 'ecg'
                ? `HR = ${heartRateBpm} BPM | Lead II`
                : selectedTech === 'xray'
                  ? `Tube Potential = ${xrayKv} kV`
                  : selectedTech === 'usg'
                    ? `Probe Frequency = ${ultrasoundFreqMhz} MHz`
                    : selectedTech === 'mri'
                      ? `Field Strength = ${mriFieldTesla} Tesla`
                      : 'Multi-Slice 3D Reconstruction'}
            </span>
          </div>

          {/* SVG Diagram / Medical Display */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            {selectedTech === 'ecg' ? (
              // Real-time ECG Oscilloscope Display
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Oscilloscope Grid Lines */}
                <defs>
                  <pattern
                    id="ecg-grid"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 20 0 L 0 0 0 20"
                      fill="none"
                      stroke="#0f3d2e"
                      strokeWidth="0.5"
                    />
                  </pattern>
                </defs>
                <rect width="540" height="160" fill="url(#ecg-grid)" />

                {/* Simulated ECG Baseline with classic P-QRS-T complexes */}
                {/* Repeat 3 cardiac cycles */}
                <g stroke="#10b981" strokeWidth="2.5" fill="none" strokeLinecap="round">
                  {/* Cycle 1 (x: 20 to 180) */}
                  <path d="M 20 80 L 60 80 C 65 72, 75 72, 80 80 L 95 80 L 100 88 L 108 24 L 116 102 L 122 80 L 135 80 C 145 65, 160 65, 170 80 L 180 80" />
                  {/* Cycle 2 (x: 180 to 340) */}
                  <path d="M 180 80 L 220 80 C 225 72, 235 72, 240 80 L 255 80 L 260 88 L 268 24 L 276 102 L 282 80 L 295 80 C 305 65, 320 65, 330 80 L 340 80" />
                  {/* Cycle 3 (x: 340 to 500) */}
                  <path d="M 340 80 L 380 80 C 385 72, 395 72, 400 80 L 415 80 L 420 88 L 428 24 L 436 102 L 442 80 L 455 80 C 465 65, 480 65, 490 80 L 520 80" />
                </g>

                {/* Annotated Wave Tags on Cycle 2 */}
                <text x="232" y="65" fill="#34d399" fontSize="10" fontWeight="bold">
                  P
                </text>
                <text x="268" y="16" fill="#34d399" fontSize="11" fontWeight="bold">
                  R
                </text>
                <text x="254" y="100" fill="#34d399" fontSize="9" fontWeight="bold">
                  Q
                </text>
                <text x="280" y="114" fill="#34d399" fontSize="9" fontWeight="bold">
                  S
                </text>
                <text x="312" y="58" fill="#34d399" fontSize="10" fontWeight="bold">
                  T
                </text>

                {/* Animated Sweep Bar */}
                <line
                  x1={20 + (ecgTick / 100) * 500}
                  y1="10"
                  x2={20 + (ecgTick / 100) * 500}
                  y2="150"
                  stroke="#6ee7b7"
                  strokeWidth="2"
                  opacity="0.8"
                />
              </svg>
            ) : selectedTech === 'xray' ? (
              // X-Ray Viewbox Simulation
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Radiopaque Bone Silhouette against dark film */}
                <rect x="140" y="20" width="260" height="120" rx="10" fill="#090d16" stroke="#334155" strokeWidth="2" />
                {/* Arm / Hand bone structure */}
                <path
                  d="M 180 80 L 360 80"
                  stroke="#e2e8f0"
                  strokeWidth="22"
                  strokeLinecap="round"
                />
                {/* Radius / Ulna parallel bone */}
                <path
                  d="M 180 50 L 360 50"
                  stroke="#cbd5e1"
                  strokeWidth="16"
                  strokeLinecap="round"
                />
                {/* Hairline Fracture line on Ulna */}
                <line
                  x1="270"
                  y1="40"
                  x2="274"
                  y2="60"
                  stroke="#ef4444"
                  strokeWidth="3"
                />
                <circle cx="272" cy="50" r="14" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x="272" y="24" fill="#ef4444" fontSize="10" fontWeight="bold" textAnchor="middle">
                  অস্থিভঙ্গ (Fracture Detected)
                </text>
                <text x="270" y="125" fill="#94a3b8" fontSize="11" textAnchor="middle" fontFamily="monospace">
                  Calcium Density = High Absorption (White Radiopaque)
                </text>
              </svg>
            ) : selectedTech === 'usg' ? (
              // Ultrasound Echo Simulation
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Piezoelectric Transducer Probe at Left */}
                <rect x="50" y="55" width="45" height="50" rx="6" fill="#3b82f6" stroke="#93c5fd" strokeWidth="2" />
                <text x="72" y="85" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">
                  Probe
                </text>

                {/* Emitted Sound Wave Arcs propagating right */}
                {[1, 2, 3, 4].map((i) => (
                  <path
                    key={`sound-wave-${i}`}
                    d={`M ${110 + i * 40} 40 A 60 60 0 0 1 ${110 + i * 40} 120`}
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Reflected Echo boundary (Internal organ boundary at x = 320) */}
                <ellipse cx="360" cy="80" rx="60" ry="40" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2.5" />
                <text x="360" y="85" fill="#e0f2fe" fontSize="11" fontWeight="bold" textAnchor="middle">
                  টিস্যু বিভেদতল (Organ)
                </text>

                {/* Reflected Echo Waves going back to probe */}
                <path
                  d="M 280 55 A 40 40 0 0 0 280 105"
                  fill="none"
                  stroke="#eab308"
                  strokeWidth="2.5"
                />
                <text x="240" y="135" fill="#eab308" fontSize="10" textAnchor="middle">
                  প্রতিফলিত প্রতিধ্বনি (Reflected Echo)
                </text>
              </svg>
            ) : (
              // MRI & CT Cross Sectional Slice
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* MRI Magnet Bore Ring */}
                <circle cx="270" cy="80" r="65" fill="#0f172a" stroke="#8b5cf6" strokeWidth="4" />
                <circle cx="270" cy="80" r="45" fill="#1e1b4b" stroke="#a78bfa" strokeWidth="2" />

                {/* Hydrogen Protons aligned with magnetic field */}
                {[
                  { x: 250, y: 70 },
                  { x: 285, y: 65 },
                  { x: 260, y: 95 },
                  { x: 285, y: 90 },
                ].map((pt, i) => (
                  <g key={`proton-${i}`} transform={`translate(${pt.x}, ${pt.y})`}>
                    <circle cx="0" cy="0" r="6" fill="#38bdf8" />
                    <line x1="0" y1="5" x2="0" y2="-9" stroke="#ffffff" strokeWidth="1.5" />
                    <polygon points="-2,-7 2,-7 0,-11" fill="#ffffff" />
                  </g>
                ))}

                <text x="270" y="135" fill="#c4b5fd" fontSize="11" fontWeight="bold" textAnchor="middle">
                  B₀ = {mriFieldTesla} Tesla (Hydrogen Proton Nuclear Spin Alignment)
                </text>
              </svg>
            )}
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-2">
              <Shield className="size-3.5 text-emerald-400" />
              <span>{isBn ? currentInfo.radiationTypeBn : currentInfo.radiationTypeEn}</span>
            </div>
            <div className="text-rose-400 font-semibold">
              {isBn ? 'জীবন রক্ষাকারী প্রযুক্তি' : 'Life-Saving Diagnostic Modality'}
            </div>
          </div>
        </div>

        {/* Live Measurement Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'বিকিরণ ঝুঁকি মাত্রা' : 'Radiation Risk Profile'}
            </span>
            <div
              className={`text-sm sm:text-base font-bold ${
                selectedTech === 'usg' || selectedTech === 'mri' || selectedTech === 'ecg'
                  ? 'text-emerald-500'
                  : 'text-amber-500'
              }`}
            >
              {selectedTech === 'usg' || selectedTech === 'mri' || selectedTech === 'ecg'
                ? isBn
                  ? 'শূন্য ঝুঁকি (Non-ionizing)'
                  : 'Zero Radiation Risk'
                : isBn
                  ? 'আয়নাইজিং (Ionizing)'
                  : 'Ionizing Radiation'}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {selectedTech === 'usg'
                ? isBn
                  ? 'গর্ভবতী নারীর জন্য নিরাপদ'
                  : 'Safe in Pregnancy'
                : selectedTech === 'mri'
                  ? isBn
                    ? 'ধাতব ইমপ্লান্ট নিষিদ্ধ'
                    : 'No Metal Implants'
                  : isBn
                    ? 'সীসার অ্যাপ্রন বাধ্যতামূলক'
                    : 'Lead Shielding Needed'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'প্রধান পদার্থবিজ্ঞান নীতি' : 'Governing Principle'}
            </span>
            <div className="text-xs sm:text-sm font-bold text-foreground">
              {selectedTech === 'xray'
                ? 'EM Wave Absorption'
                : selectedTech === 'usg'
                  ? 'Acoustic Echo Refl.'
                  : selectedTech === 'mri'
                    ? 'Proton Resonance'
                    : selectedTech === 'ecg'
                      ? 'Cardiac Bio-potentials'
                      : 'Multi-slice X-ray 3D'}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {selectedTech === 'ecg' ? 'P-QRS-T Wave' : 'Diagnostic Imaging'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'টিস্যু বৈসাদৃশ্য স্পষ্টতা' : 'Contrast Resolution'}
            </span>
            <div className="text-xs sm:text-sm font-bold text-sky-500">
              {selectedTech === 'mri'
                ? isBn
                  ? 'সর্বোচ্চ স্পষ্ট (Soft Tissue)'
                  : 'Superb Soft Tissue'
                : selectedTech === 'xray'
                  ? isBn
                    ? 'হাড়ের জন্য সেরা (Bone)'
                    : 'Optimal for Bones'
                  : selectedTech === 'ct'
                    ? isBn
                      ? 'জরুরি রক্তক্ষরণে সেরা'
                      : 'Emergency Hemorrhage'
                    : isBn
                      ? 'বাস্তব সময় পর্যবেক্ষণ'
                      : 'Real-time Dynamics'}
            </div>
            <p className="text-[10px] text-muted-foreground">Clinical Diagnostic Efficacy</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'প্রধান ক্লিনিক্যাল ব্যবহার' : 'Primary Clinical Use'}
            </span>
            <div className="text-xs sm:text-sm font-bold text-rose-500 truncate">
              {isBn ? currentInfo.clinicalUseBn.split(',')[0] : currentInfo.clinicalUseEn.split(',')[0]}
            </div>
            <p className="text-[10px] text-muted-foreground">SSC Board CQ Focus</p>
          </div>
        </div>

        {/* Detailed Medical Intelligence Comparison Card */}
        <div className="p-4 rounded-xl bg-muted/20 border border-border/70 space-y-3">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {isBn
                ? `${currentInfo.nameBn} এর কর্মপদ্ধতি ও নিরাপত্তা বিশ্লেষণ`
                : `${currentInfo.nameEn} Physics Mechanism & Safety`}
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs leading-relaxed">
            <div className="p-3 rounded-lg bg-background border border-border/60">
              <span className="font-bold text-muted-foreground block mb-1">
                {isBn ? 'পদার্থবিজ্ঞানের মূলনীতি:' : 'Physics Working Mechanism:'}
              </span>
              <p className="text-foreground/90">
                {isBn ? currentInfo.physicsPrincipleBn : currentInfo.physicsPrincipleEn}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-background border border-border/60">
              <span className="font-bold text-muted-foreground block mb-1">
                {isBn ? 'নিরাপত্তা ও সতর্কতা:' : 'Safety & Precautionary Profile:'}
              </span>
              <p className="text-foreground/90">
                {isBn ? currentInfo.safetyProfileBn : currentInfo.safetyProfileEn}
              </p>
            </div>
          </div>
        </div>

        {/* Board Insight Banner */}
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3">
          <Sparkles className="size-4 text-rose-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-foreground/90">
            <span className="font-bold text-rose-600 dark:text-rose-400 block">
              {isBn
                ? 'বোর্ড এক্সাম সিক্রেট: এক্স-রে ও এমআরআই এর তুলনা'
                : 'Board Exam Pattern: Comparing X-Ray vs MRI vs Ultrasonography'}
            </span>
            <p className="leading-relaxed">
              {isBn
                ? 'এসএসসি বোর্ড পরীক্ষায় ১৪তম অধ্যায় থেকে প্রায়ই প্রশ্ন আসে: "গর্ভবতী নারীর উদরস্থ ভ্রূণের অবস্থান নির্ণয়ে এক্স-রে না করে আল্ট্রাসনোগ্রাফি করা নিরাপদ কেন?" ব্যাখ্যায় লিখবে: এক্স-রে হলো ক্ষতিকর আয়নাইজিং বিকিরণ যা ভ্রূণের কোষের জিনগত রূপান্তর ঘটাতে পারে। অন্যদিকে আল্ট্রাসনোগ্রাফি হলো অহিংস উচ্চ কম্পাঙ্কের শব্দতরঙ্গ (Non-ionizing), যার কোনো পার্শ্বপ্রতিক্রিয়া নেই।'
                : 'Examiners consistently ask in CQ Part (b)/(d) why Ultrasonography is preferred over X-Ray for fetal screening: Ultrasound relies on non-ionizing acoustic echoes, carrying zero radiation hazard to developing embryonic cells.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
