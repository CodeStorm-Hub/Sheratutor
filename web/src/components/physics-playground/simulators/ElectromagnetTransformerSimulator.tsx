'use client';

import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  Layers,
  Magnet,
  Radio,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function ElectromagnetTransformerSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 'transformer' | 'solenoid'
  const [activeTab, setActiveTab] = useState<'transformer' | 'solenoid'>('transformer');

  // Transformer Parameters
  const [np, setNp] = useState<number>(500); // Primary coil turns
  const [ns, setNs] = useState<number>(1000); // Secondary coil turns
  const [vp, setVp] = useState<number>(220); // Primary AC voltage (V)
  const [loadResistance, setLoadResistance] = useState<number>(44); // Load resistance (Ω)
  const [efficiency, setEfficiency] = useState<number>(100); // Efficiency percentage (90 to 100%)

  // Solenoid Parameters
  const [solenoidTurns, setSolenoidTurns] = useState<number>(200);
  const [solenoidCurrent, setSolenoidCurrent] = useState<number>(3.0);
  const [coreType, setCoreType] = useState<'air' | 'iron'>('iron');

  // Transformer Calculations
  const turnsRatio = np > 0 ? ns / np : 0;
  const isStepUp = ns > np;
  const isStepDown = ns < np;
  const isOneToOne = ns === np;

  // Secondary voltage: Vs = Vp * (Ns / Np)
  const vs = vp * turnsRatio;

  // Secondary current: Is = Vs / R_L
  const is = loadResistance > 0 ? vs / loadResistance : 0;

  // Secondary power: Ps = Vs * Is
  const ps = vs * is;

  // Primary power: Pp = Ps / (η / 100)
  const pp = efficiency > 0 ? ps / (efficiency / 100) : 0;

  // Primary current: Ip = Pp / Vp
  const ip = vp > 0 ? pp / vp : 0;

  // Solenoid calculations
  // B = μ * (N / L) * I, assuming length L = 0.2m
  const mu0 = 4 * Math.PI * 1e-7;
  const muR = coreType === 'iron' ? 2000 : 1;
  const solenoidLengthM = 0.2;
  const magneticFieldTesla =
    (mu0 * muR * (solenoidTurns / solenoidLengthM) * solenoidCurrent);

  const handleReset = () => {
    setNp(500);
    setNs(1000);
    setVp(220);
    setLoadResistance(44);
    setEfficiency(100);
    setSolenoidTurns(200);
    setSolenoidCurrent(3.0);
    setCoreType('iron');
  };

  return (
    <Card className="overflow-hidden border border-border/70 bg-gradient-to-b from-card to-card/60 shadow-xl rounded-2xl">
      {/* Top Banner / Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <Magnet className="size-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">
              {isBn
                ? 'তড়িৎ চুম্বকত্ব ও ট্রান্সফরমার ল্যাবরেটরি'
                : 'Electromagnetism & Transformer Laboratory'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'আরোহী/অবরোহী ট্রান্সফরমার, ফ্লাক্স ও সোলেনয়েডের চৌম্বক ক্ষেত্র'
                : 'Step-up/Step-down transformer ratio, magnetic flux & solenoids'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-background border border-border/80">
            <button
              onClick={() => setActiveTab('transformer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'transformer'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'ট্রান্সফরমার (V_p & V_s)' : 'Transformer'}
            </button>
            <button
              onClick={() => setActiveTab('solenoid')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'solenoid'
                  ? 'bg-purple-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'সোলেনয়েড (B-Field)' : 'Solenoid (B)'}
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
              <span className="inline-block size-2 rounded-full bg-purple-400 animate-pulse" />
              <span className="font-semibold text-slate-300">
                {activeTab === 'transformer'
                  ? isStepUp
                    ? isBn
                      ? 'আরোহী ট্রান্সফরমার (Step-Up Transformer)'
                      : 'Step-Up Transformer (Vs > Vp)'
                    : isStepDown
                      ? isBn
                        ? 'অবরোহী ট্রান্সফরমার (Step-Down Transformer)'
                        : 'Step-Down Transformer (Vs < Vp)'
                      : isBn
                        ? 'আইসোলেশন ট্রান্সফরমার (1:1 Ratio)'
                        : '1:1 Isolation Transformer'
                  : isBn
                    ? `সোলেনয়েড তড়িৎচুম্বক (${coreType === 'iron' ? 'কাঁচা লোহার মজ্জা' : 'বায়ু মজ্জা'})`
                    : `Solenoid Electromagnet (${coreType === 'iron' ? 'Soft Iron Core' : 'Air Core'})`}
              </span>
            </div>
            <span className="font-mono text-purple-400">
              {activeTab === 'transformer'
                ? `Np : Ns = ${np} : ${ns} (${turnsRatio.toFixed(2)}x)`
                : `B = ${magneticFieldTesla >= 0.01 ? magneticFieldTesla.toFixed(2) : (magneticFieldTesla * 1000).toFixed(1)} ${magneticFieldTesla >= 0.01 ? 'T' : 'mT'}`}
            </span>
          </div>

          {/* SVG Diagram Canvas */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            {activeTab === 'transformer' ? (
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                <defs>
                  <linearGradient id="core-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#334155" />
                    <stop offset="50%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Soft Iron Core (Laminated Rectangular Core Ring) */}
                <rect
                  x="180"
                  y="20"
                  width="180"
                  height="120"
                  rx="12"
                  fill="url(#core-grad)"
                  stroke="#64748b"
                  strokeWidth="3"
                />
                {/* Core Hollow Inside */}
                <rect
                  x="225"
                  y="50"
                  width="90"
                  height="60"
                  rx="6"
                  fill="#020617"
                  stroke="#475569"
                  strokeWidth="2"
                />
                <text
                  x="270"
                  y="85"
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  Φ (ফ্লাক্স)
                </text>

                {/* Primary Coil (Left Arm: x = 180 to 225) */}
                <g transform="translate(160, 40)">
                  {/* Primary windings visual coils */}
                  {Array.from({ length: 7 }).map((_, i) => (
                    <ellipse
                      key={`p-coil-${i}`}
                      cx="25"
                      cy={15 + i * 10}
                      rx="20"
                      ry="5"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2.5"
                    />
                  ))}
                  {/* Primary Input Leads */}
                  <line x1="-80" y1="20" x2="5" y2="20" stroke="#f59e0b" strokeWidth="2" />
                  <line x1="-80" y1="75" x2="5" y2="75" stroke="#f59e0b" strokeWidth="2" />
                  <text
                    x="-50"
                    y="10"
                    fill="#f59e0b"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    V_p = {vp}V (AC)
                  </text>
                  <text
                    x="-50"
                    y="95"
                    fill="#fbbf24"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    I_p = {ip.toFixed(2)}A
                  </text>
                  <text
                    x="25"
                    y="-10"
                    fill="#f59e0b"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    N_p = {np} পাক
                  </text>
                </g>

                {/* Secondary Coil (Right Arm: x = 315 to 360) */}
                <g transform="translate(330, 40)">
                  {/* Secondary windings visual coils */}
                  {Array.from({ length: Math.min(10, Math.max(4, Math.round(7 * turnsRatio))) }).map(
                    (_, i) => (
                      <ellipse
                        key={`s-coil-${i}`}
                        cx="25"
                        cy={10 + i * 8}
                        rx="20"
                        ry="4.5"
                        fill="none"
                        stroke="#38bdf8"
                        strokeWidth="2.5"
                      />
                    )
                  )}
                  {/* Secondary Output Leads to Load */}
                  <line x1="45" y1="18" x2="130" y2="18" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="45" y1="78" x2="130" y2="78" stroke="#38bdf8" strokeWidth="2" />
                  {/* Load Resistor */}
                  <rect
                    x="130"
                    y="30"
                    width="24"
                    height="36"
                    rx="4"
                    fill="#0f172a"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <line x1="142" y1="18" x2="142" y2="30" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="142" y1="66" x2="142" y2="78" stroke="#38bdf8" strokeWidth="2" />
                  <text
                    x="142"
                    y="52"
                    fill="#38bdf8"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    R_L
                  </text>

                  <text
                    x="90"
                    y="10"
                    fill="#38bdf8"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    V_s = {vs.toFixed(1)}V
                  </text>
                  <text
                    x="90"
                    y="95"
                    fill="#7dd3fc"
                    fontSize="10"
                    textAnchor="middle"
                    fontFamily="monospace"
                  >
                    I_s = {is.toFixed(2)}A
                  </text>
                  <text
                    x="25"
                    y="-10"
                    fill="#38bdf8"
                    fontSize="10"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    N_s = {ns} পাক
                  </text>
                </g>
              </svg>
            ) : (
              // Solenoid Electromagnet SVG
              <svg
                className="w-full h-full"
                viewBox="0 0 540 160"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Iron / Air Core Cylinder */}
                <rect
                  x="140"
                  y="60"
                  width="260"
                  height="40"
                  rx="6"
                  fill={coreType === 'iron' ? '#475569' : '#0f172a'}
                  stroke={coreType === 'iron' ? '#94a3b8' : '#334155'}
                  strokeWidth="2"
                />
                <text
                  x="270"
                  y="85"
                  fill="#cbd5e1"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {coreType === 'iron' ? 'Soft Iron Core (μr = 2000)' : 'Air Core (μr = 1)'}
                </text>

                {/* Coils wrapped around core */}
                {Array.from({ length: 12 }).map((_, i) => (
                  <ellipse
                    key={`sol-${i}`}
                    cx={160 + i * 19}
                    cy="80"
                    rx="8"
                    ry="28"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="3"
                  />
                ))}

                {/* North & South Pole Indicators */}
                <g transform="translate(110, 80)">
                  <circle cx="0" cy="0" r="16" fill="#ef4444" />
                  <text
                    x="0"
                    y="5"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    N
                  </text>
                </g>
                <g transform="translate(430, 80)">
                  <circle cx="0" cy="0" r="16" fill="#3b82f6" />
                  <text
                    x="0"
                    y="5"
                    fill="#ffffff"
                    fontSize="13"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    S
                  </text>
                </g>

                {/* Magnetic Field Lines flowing out of N into S */}
                <path
                  d="M 110 64 C 180 15, 360 15, 430 64"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
                <path
                  d="M 110 96 C 180 145, 360 145, 430 96"
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />
              </svg>
            )}
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-amber-400" />
                {isBn ? 'মুখ্য কুণ্ডলী (Primary)' : 'Primary Coil'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-sky-400" />
                {isBn ? 'গৌণ কুণ্ডলী (Secondary)' : 'Secondary Coil'}
              </span>
            </div>
            <div>
              {activeTab === 'transformer' ? (
                <span className="font-semibold text-purple-400">
                  {isBn
                    ? `ক্ষমতা সংরক্ষণ: P_p = ${pp.toFixed(0)} W | P_s = ${ps.toFixed(0)} W`
                    : `Power: Pp = ${pp.toFixed(0)} W | Ps = ${ps.toFixed(0)} W`}
                </span>
              ) : (
                <span className="text-purple-400 font-semibold">
                  {isBn
                    ? `চৌম্বক আবেশ প্রাবল্য B = ${(magneticFieldTesla * 1000).toFixed(0)} mT`
                    : `Flux Density B = ${(magneticFieldTesla * 1000).toFixed(0)} mT`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Measurement Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'গৌণ বিভব (V_s)' : 'Secondary Voltage (Vs)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-sky-500">
              {isBn ? toBengaliNumber(vs.toFixed(1)) : vs.toFixed(1)}{' '}
              <span className="text-xs font-sans text-muted-foreground">V</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Vs = Vp × (Ns / Np)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'গৌণ প্রবাহ (I_s)' : 'Secondary Current (Is)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-500">
              {isBn ? toBengaliNumber(is.toFixed(2)) : is.toFixed(2)}{' '}
              <span className="text-xs font-sans text-muted-foreground">A</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Is = Vs / R_L</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'মুখ্য প্রবাহ (I_p)' : 'Primary Current (Ip)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-amber-500">
              {isBn ? toBengaliNumber(ip.toFixed(2)) : ip.toFixed(2)}{' '}
              <span className="text-xs font-sans text-muted-foreground">A</span>
            </div>
            <p className="text-[10px] text-muted-foreground">Ip = Is × (Ns / Np)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'ট্রান্সফরমার রূপান্তর' : 'Transformation Type'}
            </span>
            <div className="text-sm font-bold flex items-center gap-1 text-purple-500">
              {isStepUp ? (
                <>
                  <ArrowUpRight className="size-4" />
                  <span>{isBn ? 'স্টেপ-আপ (আরোহী)' : 'Step-Up'}</span>
                </>
              ) : isStepDown ? (
                <>
                  <ArrowDownRight className="size-4" />
                  <span>{isBn ? 'স্টেপ-ডাউন (অবরোহী)' : 'Step-Down'}</span>
                </>
              ) : (
                <span>1:1 Isolation</span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isStepUp
                ? isBn
                  ? 'ভোল্টেজ বৃদ্ধি, প্রবাহ হ্রাস'
                  : 'Voltage increases, current drops'
                : isBn
                  ? 'ভোল্টেজ হ্রাস, প্রবাহ বৃদ্ধি'
                  : 'Voltage drops, current increases'}
            </p>
          </div>
        </div>

        {/* Sliders & Parameters Control Grid */}
        {activeTab === 'transformer' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            {/* Primary Coil Controls */}
            <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Zap className="size-3.5 text-amber-500" />
                <span>{isBn ? 'মুখ্য কুণ্ডলী (Primary Coil)' : 'Primary Coil Controls'}</span>
              </h4>

              {/* Np Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'পাক সংখ্যা (N_p)' : 'Primary Turns (Np)'}
                  </span>
                  <span className="font-mono font-bold text-amber-500">{np} পাক</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={np}
                  onChange={(e) => setNp(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>

              {/* Vp Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'মুখ্য ভোল্টেজ (V_p)' : 'Primary Voltage (Vp)'}
                  </span>
                  <span className="font-mono font-bold text-amber-500">{vp} V (AC)</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="440"
                  step="1"
                  value={vp}
                  onChange={(e) => setVp(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>
            </div>

            {/* Secondary Coil Controls */}
            <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Radio className="size-3.5 text-sky-500" />
                <span>{isBn ? 'গৌণ কুণ্ডলী (Secondary Coil)' : 'Secondary Coil Controls'}</span>
              </h4>

              {/* Ns Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'পাক সংখ্যা (N_s)' : 'Secondary Turns (Ns)'}
                  </span>
                  <span className="font-mono font-bold text-sky-500">{ns} পাক</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2000"
                  step="50"
                  value={ns}
                  onChange={(e) => setNs(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>

              {/* Load Resistance Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'বহিস্থ লোড রোধ (R_L)' : 'Load Resistance (R_L)'}
                  </span>
                  <span className="font-mono font-bold text-sky-500">{loadResistance} Ω</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="1"
                  value={loadResistance}
                  onChange={(e) => setLoadResistance(Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>
            </div>
          </div>
        ) : (
          // Solenoid Controls
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'কুণ্ডলীর পাকসংখ্যা (N)' : 'Solenoid Turns (N)'}
                  </span>
                  <span className="font-mono font-bold text-purple-500">{solenoidTurns}</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="1000"
                  step="25"
                  value={solenoidTurns}
                  onChange={(e) => setSolenoidTurns(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'তড়িৎ প্রবাহ (I)' : 'Electric Current (I)'}
                  </span>
                  <span className="font-mono font-bold text-purple-500">{solenoidCurrent} A</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10.0"
                  step="0.5"
                  value={solenoidCurrent}
                  onChange={(e) => setSolenoidCurrent(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>
            </div>

            <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
              <span className="text-xs font-medium text-foreground block">
                {isBn ? 'মজ্জার উপাদান (Core Material)' : 'Core Material'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setCoreType('iron')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                    coreType === 'iron'
                      ? 'border-purple-500/60 bg-purple-500/10 text-purple-500'
                      : 'border-border/80 hover:bg-muted/50'
                  }`}
                >
                  <div className="font-bold">{isBn ? 'কাঁচা লোহা' : 'Soft Iron'}</div>
                  <div className="text-[10px] text-muted-foreground">μ_r = 2000</div>
                </button>
                <button
                  onClick={() => setCoreType('air')}
                  className={`py-2 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                    coreType === 'air'
                      ? 'border-purple-500/60 bg-purple-500/10 text-purple-500'
                      : 'border-border/80 hover:bg-muted/50'
                  }`}
                >
                  <div className="font-bold">{isBn ? 'বায়ু মজ্জা' : 'Air Core'}</div>
                  <div className="text-[10px] text-muted-foreground">μ_r = 1</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Board Insight Banner */}
        <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-start gap-3">
          <Sparkles className="size-4 text-purple-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-foreground/90">
            <span className="font-bold text-purple-600 dark:text-purple-400 block">
              {isBn
                ? 'বোর্ড এক্সাম সতর্কতা: ট্রান্সফরমারে ডিসি (DC) ভোল্টেজ ট্র্যাপ!'
                : 'Board Trap Alert: DC Voltage Applied to Transformer!'}
            </span>
            <p className="leading-relaxed">
              {isBn
                ? 'ট্রান্সফরমার শুধুমাত্র পরিবর্তী প্রবাহে (AC) কাজ করে। যদি উদ্দীপকে বলা হয় "মুখ্য কুণ্ডলীতে ১২V ব্যাটারি যুক্ত করা হলো, গৌণ কুণ্ডলীর ভোল্টেজ কত?", উত্তর সর্বদা 0V হবে! কারণ ডিসিতে চৌম্বক ফ্লাক্সের পরিবর্তন হয় না (dΦ/dt = 0), ফলে কোনো ভোল্টেজ আবিষ্ট হয় না এবং অতিরিক্ত তাপে কুণ্ডলী পুড়ে যেতে পারে।'
                : 'Transformers operate strictly on AC. When a DC battery is attached to primary, secondary induced voltage is strictly 0V because flux does not change over time.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
