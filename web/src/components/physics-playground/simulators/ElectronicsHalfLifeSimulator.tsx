'use client';

import React, { useState } from 'react';
import {
  Cpu,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Radio,
  Activity,
  Layers,
  Lightbulb,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface IsotopePreset {
  nameBn: string;
  nameEn: string;
  symbol: string;
  halfLife: number;
  unitBn: string;
  unitEn: string;
  applicationBn: string;
  applicationEn: string;
}

const ISOTOPE_PRESETS: Record<string, IsotopePreset> = {
  c14: {
    nameBn: 'কার্বন-১৪',
    nameEn: 'Carbon-14',
    symbol: '¹⁴C',
    halfLife: 5730,
    unitBn: 'বছর',
    unitEn: 'years',
    applicationBn: 'প্রাচীন জীবাশ্ম ও কঙ্কালের বয়স নির্ধারণ (Carbon Dating)',
    applicationEn: 'Radiocarbon dating of biological artifacts and fossils',
  },
  i131: {
    nameBn: 'আয়োডিন-১৩১',
    nameEn: 'Iodine-131',
    symbol: '¹³¹I',
    halfLife: 8,
    unitBn: 'দিন',
    unitEn: 'days',
    applicationBn: 'থাইরয়েড গ্রন্থির ক্যান্সার ও গলগণ্ড রোগ নির্ণয় ও চিকিৎসা',
    applicationEn: 'Thyroid cancer radiotherapy and diagnostic scanning',
  },
  ra226: {
    nameBn: 'রেডিয়াম-২২৬',
    nameEn: 'Radium-226',
    symbol: '²²⁶Ra',
    halfLife: 1600,
    unitBn: 'বছর',
    unitEn: 'years',
    applicationBn: 'তেজস্ক্রিয় রশ্মির উৎস ও শিল্পকারখানায় রেডিওগ্রাফি',
    applicationEn: 'Industrial radiation sources and cancer radiotherapy',
  },
};

export function ElectronicsHalfLifeSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 'halflife' | 'diode'
  const [activeTab, setActiveTab] = useState<'halflife' | 'diode'>('halflife');

  // Half-life parameters
  const [selectedIsotope, setSelectedIsotope] = useState<string>('c14');
  const [initialAtoms, setInitialAtoms] = useState<number>(1000); // N0
  const [halfLifePeriodsElapsed, setHalfLifePeriodsElapsed] = useState<number>(1.0); // t / T_half (0 to 4)

  // Diode / Logic parameters
  const [diodeBias, setDiodeBias] = useState<'forward' | 'reverse'>('forward');
  const [logicGate, setLogicGate] = useState<'AND' | 'OR' | 'NOT' | 'NAND'>('AND');
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);

  // Calculations for Half-life
  const isotope = ISOTOPE_PRESETS[selectedIsotope];
  // Remaining atoms: N(t) = N0 * (0.5)^(t / T_half)
  const remainingAtoms = Math.round(initialAtoms * Math.pow(0.5, halfLifePeriodsElapsed));
  const decayedAtoms = initialAtoms - remainingAtoms;
  const remainingPercent = ((remainingAtoms / initialAtoms) * 100).toFixed(1);
  const elapsedTimeActual = (halfLifePeriodsElapsed * isotope.halfLife).toLocaleString();

  // Calculations for Logic Gate Output
  let gateOutput = false;
  if (logicGate === 'AND') {
    gateOutput = inputA && inputB;
  } else if (logicGate === 'OR') {
    gateOutput = inputA || inputB;
  } else if (logicGate === 'NOT') {
    gateOutput = !inputA;
  } else if (logicGate === 'NAND') {
    gateOutput = !(inputA && inputB);
  }

  const handleReset = () => {
    setSelectedIsotope('c14');
    setHalfLifePeriodsElapsed(1.0);
    setDiodeBias('forward');
    setLogicGate('AND');
    setInputA(true);
    setInputB(false);
  };

  return (
    <Card className="overflow-hidden border border-border/70 bg-gradient-to-b from-card to-card/60 shadow-xl rounded-2xl">
      {/* Top Banner / Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <Cpu className="size-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">
              {isBn
                ? 'আধুনিক পদার্থবিজ্ঞান ও সেমিকন্ডাক্টর ল্যাব'
                : 'Modern Physics & Semiconductor Laboratory'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'তেজস্ক্রিয় অর্ধায়ু ক্ষয়, ডায়োড বায়াসিং ও ডিজিটাল লজিক গেট'
                : 'Radioactive half-life decay, p-n diode biasing & logic gates'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-background border border-border/80">
            <button
              onClick={() => setActiveTab('halflife')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'halflife'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'তেজস্ক্রিয় অর্ধায়ু (Half-life)' : 'Radioactive Decay'}
            </button>
            <button
              onClick={() => setActiveTab('diode')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'diode'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'ডায়োড ও লজিক গেট' : 'Diode & Logic Gates'}
            </button>
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
        {/* Interactive 2D Visual Canvas */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-violet-400 animate-pulse" />
              <span className="font-semibold text-slate-300">
                {activeTab === 'halflife'
                  ? `${isotope.nameBn} (${isotope.symbol}) - T½ = ${isotope.halfLife} ${isotope.unitBn}`
                  : diodeBias === 'forward'
                    ? isBn
                      ? 'সম্মুখী ঝোঁক (Forward Bias) - তড়িৎ সংবহন সচল'
                      : 'Forward Bias - Depletion Layer Shrinks (Conduction ON)'
                    : isBn
                      ? 'বিমুখী ঝোঁক (Reverse Bias) - তড়িৎ সংবহন বন্ধ'
                      : 'Reverse Bias - Depletion Layer Expands (Conduction OFF)'}
              </span>
            </div>
            <span className="font-mono text-violet-400">
              {activeTab === 'halflife'
                ? `N(t) = ${remainingPercent}% অবশিষ্ট`
                : `Output: ${gateOutput ? '1 (HIGH)' : '0 (LOW)'}`}
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            {activeTab === 'halflife' ? (
              // Half-life Exponential Decay Graph & Particle Population
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Axes */}
                <line x1="50" y1="130" x2="500" y2="130" stroke="#475569" strokeWidth="2" />
                <line x1="50" y1="130" x2="50" y2="20" stroke="#475569" strokeWidth="2" />

                {/* Y Axis Labels */}
                <text x="42" y="25" fill="#94a3b8" fontSize="10" textAnchor="end">
                  N₀ (100%)
                </text>
                <text x="42" y="78" fill="#94a3b8" fontSize="10" textAnchor="end">
                  N₀/2 (50%)
                </text>
                <text x="42" y="105" fill="#94a3b8" fontSize="10" textAnchor="end">
                  N₀/4 (25%)
                </text>
                <text x="42" y="132" fill="#94a3b8" fontSize="10" textAnchor="end">
                  0
                </text>

                {/* X Axis Step Marks */}
                {[0, 1, 2, 3, 4].map((step) => {
                  const x = 50 + step * 105;
                  return (
                    <g key={`x-step-${step}`}>
                      <line x1={x} y1="130" x2={x} y2="135" stroke="#64748b" strokeWidth="1.5" />
                      <text
                        x={x}
                        y="146"
                        fill="#94a3b8"
                        fontSize="10"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {step === 0 ? '0' : `${step} T½`}
                      </text>
                    </g>
                  );
                })}

                {/* Theoretical Exponential Decay Curve: y = 25 + 105 * (1 - e^(-0.693 * (x - 50)/105)) */}
                <path
                  d="M 50 25 Q 120 75, 155 77 T 260 103 T 365 116 T 470 123"
                  fill="none"
                  stroke="#8b5cf6"
                  strokeWidth="2.5"
                />

                {/* Current Time Cursor Point */}
                {(() => {
                  const currentX = 50 + halfLifePeriodsElapsed * 105;
                  // fraction: (0.5)^n => y from 25 (at 1.0) to 130 (at 0)
                  const currentY = 130 - 105 * Math.pow(0.5, halfLifePeriodsElapsed);

                  return (
                    <g>
                      {/* Vertical line to x-axis */}
                      <line
                        x1={currentX}
                        y1={currentY}
                        x2={currentX}
                        y2="130"
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      {/* Horizontal line to y-axis */}
                      <line
                        x1="50"
                        y1={currentY}
                        x2={currentX}
                        y2={currentY}
                        stroke="#f59e0b"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      {/* Active Cursor Circle */}
                      <circle
                        cx={currentX}
                        cy={currentY}
                        r="6"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                      <text
                        x={currentX + 10}
                        y={Math.max(30, currentY - 8)}
                        fill="#f59e0b"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="monospace"
                      >
                        N = {remainingPercent}%
                      </text>
                    </g>
                  );
                })()}
              </svg>
            ) : (
              // p-n Junction Diode Circuit & Depletion Layer
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Circuit Wire Loop */}
                <path
                  d="M 120 120 L 60 120 L 60 40 L 480 40 L 480 120 L 260 120"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                />

                {/* Battery at bottom */}
                <g transform="translate(190, 120)">
                  {diodeBias === 'forward' ? (
                    <>
                      <line x1="-30" y1="-12" x2="-30" y2="12" stroke="#ef4444" strokeWidth="3" />
                      <line x1="-15" y1="-7" x2="-15" y2="7" stroke="#38bdf8" strokeWidth="3.5" />
                      <text x="-40" y="4" fill="#ef4444" fontSize="10" fontWeight="bold">
                        +
                      </text>
                      <text x="-5" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold">
                        -
                      </text>
                    </>
                  ) : (
                    <>
                      <line x1="-30" y1="-7" x2="-30" y2="7" stroke="#38bdf8" strokeWidth="3.5" />
                      <line x1="-15" y1="-12" x2="-15" y2="12" stroke="#ef4444" strokeWidth="3" />
                      <text x="-40" y="4" fill="#38bdf8" fontSize="10" fontWeight="bold">
                        -
                      </text>
                      <text x="-5" y="4" fill="#ef4444" fontSize="10" fontWeight="bold">
                        +
                      </text>
                    </>
                  )}
                  <text x="25" y="4" fill="#cbd5e1" fontSize="11" fontFamily="monospace">
                    V_bias
                  </text>
                </g>

                {/* p-n Junction Diode at Top (x = 220 to 320) */}
                <g transform="translate(220, 40)">
                  {/* p-region (Left) */}
                  <rect
                    x="-50"
                    y="-20"
                    width="50"
                    height="40"
                    rx="3"
                    fill="#1e3a8a"
                    stroke="#3b82f6"
                    strokeWidth="2"
                  />
                  <text
                    x="-25"
                    y="5"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    p
                  </text>
                  <text x="-25" y="-25" fill="#93c5fd" fontSize="9" textAnchor="middle">
                    হোল (Holes)
                  </text>

                  {/* Depletion Layer (Middle) */}
                  <rect
                    x="0"
                    y="-20"
                    width={diodeBias === 'forward' ? '12' : '36'}
                    height="40"
                    fill="#334155"
                    stroke="#64748b"
                    strokeWidth="1.5"
                    className="transition-all duration-300"
                  />

                  {/* n-region (Right) */}
                  <rect
                    x={diodeBias === 'forward' ? '12' : '36'}
                    y="-20"
                    width="50"
                    height="40"
                    rx="3"
                    fill="#065f46"
                    stroke="#10b981"
                    strokeWidth="2"
                    className="transition-all duration-300"
                  />
                  <text
                    x={diodeBias === 'forward' ? '37' : '61'}
                    y="5"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    n
                  </text>
                  <text
                    x={diodeBias === 'forward' ? '37' : '61'}
                    y="-25"
                    fill="#6ee7b7"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    ইলেকট্রন (e⁻)
                  </text>
                </g>

                {/* Indicator Bulb at right wire (x = 480, y = 80) */}
                <g transform="translate(480, 80)">
                  <circle
                    cx="0"
                    cy="0"
                    r="15"
                    fill={diodeBias === 'forward' ? '#eab308' : '#1e293b'}
                    stroke={diodeBias === 'forward' ? '#fde047' : '#475569'}
                    strokeWidth="2"
                  />
                  <text
                    x="0"
                    y="4"
                    fill={diodeBias === 'forward' ? '#000000' : '#94a3b8'}
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {diodeBias === 'forward' ? 'ON' : 'OFF'}
                  </text>
                </g>
              </svg>
            )}
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <div>
              {activeTab === 'halflife' ? (
                <span>
                  {isBn
                    ? `ব্যয়িত সময়: ${toBengaliNumber(elapsedTimeActual)} ${isotope.unitBn} (${toBengaliNumber(halfLifePeriodsElapsed.toFixed(2))} টি অর্ধায়ু)`
                    : `Elapsed: ${elapsedTimeActual} ${isotope.unitEn} (${halfLifePeriodsElapsed.toFixed(2)} half-lives)`}
                </span>
              ) : (
                <span>
                  {diodeBias === 'forward'
                    ? isBn
                      ? 'নিঃশেষিত স্তর সংকুচিত → ডায়োড দিয়ে কারেন্ট প্রবাহিত হচ্ছে'
                      : 'Depletion region narrowed → Current conducts'
                    : isBn
                      ? 'নিঃশেষিত স্তর প্রসারিত → বিভব বাধা অতিক্রম করা অসম্ভব'
                      : 'Depletion region widened → Barrier blocks current'}
                </span>
              )}
            </div>
            <div className="text-violet-400 font-mono">
              {activeTab === 'halflife'
                ? `N/N₀ = (1/2)^(${halfLifePeriodsElapsed.toFixed(2)}) = ${(remainingAtoms / initialAtoms).toFixed(3)}`
                : isBn
                  ? 'রেকটিফায়ার মূলনীতি (AC → DC)'
                  : 'Rectifier principle (AC to DC)'}
            </div>
          </div>
        </div>

        {/* Live Measurement Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'অবশিষ্ট অবিভাজিত পরমাণু' : 'Remaining Atoms (N)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-violet-500">
              {isBn ? toBengaliNumber(remainingPercent) : remainingPercent}%
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isBn
                ? `${toBengaliNumber(remainingAtoms)} / ${toBengaliNumber(initialAtoms)} পরমাণু`
                : `${remainingAtoms} / ${initialAtoms} atoms`}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'ক্ষয়প্রাপ্ত পরমাণু' : 'Decayed Atoms (ΔN)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-amber-500">
              {isBn
                ? toBengaliNumber(((decayedAtoms / initialAtoms) * 100).toFixed(1))
                : ((decayedAtoms / initialAtoms) * 100).toFixed(1)}
              %
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isBn
                ? `${toBengaliNumber(decayedAtoms)} পরমাণু ক্ষয়প্রাপ্ত`
                : `${decayedAtoms} atoms decayed`}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'অর্ধায়ু সময়কাল (T½)' : 'Half-Life (T½)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-500">
              {isBn ? toBengaliNumber(isotope.halfLife) : isotope.halfLife}{' '}
              <span className="text-xs font-sans text-muted-foreground">
                {isBn ? isotope.unitBn : isotope.unitEn}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              λ = 0.693 / {isotope.halfLife}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'লজিক গেট আউটপুট' : 'Logic Output'}
            </span>
            <div
              className={`text-base sm:text-lg font-mono font-bold ${
                gateOutput ? 'text-emerald-500' : 'text-rose-500'
              }`}
            >
              {gateOutput ? 'HIGH (1)' : 'LOW (0)'}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {logicGate} (A={inputA ? '1' : '0'}, B={inputB ? '1' : '0'})
            </p>
          </div>
        </div>

        {/* Sliders & Parameters Control Grid */}
        {activeTab === 'halflife' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Isotope Presets */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isBn ? 'তেজস্ক্রিয় আইসোটোপ নির্বাচন' : 'Isotope Preset Selection'}
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(ISOTOPE_PRESETS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedIsotope(key)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedIsotope === key
                        ? 'border-violet-500/60 bg-violet-500/10 text-violet-500 shadow-sm'
                        : 'border-border/80 hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-bold text-xs">{item.symbol}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      T½ = {item.halfLife} {isBn ? item.unitBn : item.unitEn}
                    </div>
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground bg-muted/30 p-2.5 rounded-lg border border-border/50">
                <span className="font-semibold text-foreground">
                  {isBn ? 'বাস্তব প্রয়োগ: ' : 'Application: '}
                </span>
                {isBn ? isotope.applicationBn : isotope.applicationEn}
              </p>
            </div>

            {/* Elapsed Time Slider */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isBn ? 'অতিবাহিত সময় সমন্বয় (Elapsed Half-Lives)' : 'Elapsed Time Controls'}
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'অর্ধায়ুর সংখ্যা (t / T½)' : 'Half-Life Cycles (n)'}
                  </span>
                  <span className="font-mono font-bold text-violet-500">
                    {halfLifePeriodsElapsed.toFixed(2)} T½
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4"
                  step="0.1"
                  value={halfLifePeriodsElapsed}
                  onChange={(e) => setHalfLifePeriodsElapsed(Number(e.target.value))}
                  className="w-full accent-violet-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>০ (১০০%)</span>
                  <span>১ T½ (৫০%)</span>
                  <span>২ T½ (২৫%)</span>
                  <span>৩ T½ (১২.৫%)</span>
                  <span>৪ T½ (৬.২৫%)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Diode & Logic Controls
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Diode Bias Toggle */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isBn ? 'পি-এন জংশন ডায়োড ঝোঁক (Bias)' : 'p-n Junction Diode Bias'}
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDiodeBias('forward')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                    diodeBias === 'forward'
                      ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-500'
                      : 'border-border/80 hover:bg-muted/50'
                  }`}
                >
                  <div className="font-bold">{isBn ? 'সম্মুখী ঝোঁক' : 'Forward Bias'}</div>
                  <div className="text-[10px] text-muted-foreground">p → (+), n → (-)</div>
                </button>
                <button
                  onClick={() => setDiodeBias('reverse')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                    diodeBias === 'reverse'
                      ? 'border-rose-500/60 bg-rose-500/10 text-rose-500'
                      : 'border-border/80 hover:bg-muted/50'
                  }`}
                >
                  <div className="font-bold">{isBn ? 'বিমুখী ঝোঁক' : 'Reverse Bias'}</div>
                  <div className="text-[10px] text-muted-foreground">p → (-), n → (+)</div>
                </button>
              </div>
            </div>

            {/* Logic Gates Switcher */}
            <div className="space-y-3 p-4 rounded-xl bg-muted/20 border border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {isBn ? 'লজিক গেট ইনপুট সমন্বয়' : 'Digital Logic Gate Tester'}
              </h4>
              <div className="flex gap-2">
                {(['AND', 'OR', 'NOT', 'NAND'] as const).map((gate) => (
                  <button
                    key={gate}
                    onClick={() => setLogicGate(gate)}
                    className={`flex-1 py-1 px-2 rounded-lg text-xs font-bold transition-all ${
                      logicGate === gate
                        ? 'bg-violet-600 text-white'
                        : 'bg-background border border-border/80 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {gate}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputA}
                    onChange={(e) => setInputA(e.target.checked)}
                    className="accent-violet-500 size-4 rounded"
                  />
                  <span>ইনপুট A ({inputA ? '1' : '0'})</span>
                </label>
                {logicGate !== 'NOT' && (
                  <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={inputB}
                      onChange={(e) => setInputB(e.target.checked)}
                      className="accent-violet-500 size-4 rounded"
                    />
                    <span>ইনপুট B ({inputB ? '1' : '0'})</span>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Board Insight Banner */}
        <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-start gap-3">
          <Sparkles className="size-4 text-violet-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-foreground/90">
            <span className="font-bold text-violet-600 dark:text-violet-400 block">
              {isBn
                ? 'বোর্ড এক্সাম ট্র্যাপ: অর্ধায়ু ও ক্ষয় ধ্রুবক (λ)'
                : 'Board Exam Trap: Half-Life & Decay Constant ($T_{1/2} = 0.693 / \\lambda$)'}
            </span>
            <p className="leading-relaxed">
              {isBn
                ? 'উদ্দীপকে বলে "কোনো মৌলের অর্ধায়ু ২০ দিন, ৪০ দিন পর কতটুকু ক্ষয়প্রাপ্ত হবে?" ছাত্রছাত্রীরা তাড়াহুড়ো করে উত্তর লিখে ফেলে ২৫%! মনে রাখবে: ২৫% অবশিষ্ট থাকে, কিন্তু ক্ষয়প্রাপ্ত হয় (১০০ - ২৫) = ৭৫%! প্রশ্নে "অবশিষ্ট" চেয়েছে নাকি "ক্ষয়প্রাপ্ত" চেয়েছে তা নিশ্চিত করো।'
                : 'Distinguish carefully between remaining sample fraction $N/N_0$ versus decayed fraction $(1 - N/N_0)$. After 2 half-lives, 25% remains while 75% has decayed!'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
