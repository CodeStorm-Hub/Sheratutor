'use client';

import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  Activity,
  Gauge,
  Layers,
  Flame,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function CircuitOhmBuilderSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Topology: 'series' | 'parallel' | 'mixed'
  const [circuitType, setCircuitType] = useState<'series' | 'parallel' | 'mixed'>('mixed');

  // Battery EMF E (1 to 24 V)
  const [emf, setEmf] = useState<number>(12);
  // Internal resistance r (0 to 5 Ω)
  const [internalR, setInternalR] = useState<number>(1.0);

  // Resistors in Ohms (1 to 50 Ω)
  const [r1, setR1] = useState<number>(6);
  const [r2, setR2] = useState<number>(12);
  const [r3, setR3] = useState<number>(12);

  // Calculations based on topology
  let req = 0;
  let iTotal = 0;
  let i1 = 0;
  let i2 = 0;
  let i3 = 0;
  let v1 = 0;
  let v2 = 0;
  let v3 = 0;

  if (circuitType === 'series') {
    req = r1 + r2;
    const rTotal = req + internalR;
    iTotal = rTotal > 0 ? emf / rTotal : 0;
    i1 = iTotal;
    i2 = iTotal;
    v1 = i1 * r1;
    v2 = i2 * r2;
  } else if (circuitType === 'parallel') {
    // 1 / Req = 1/R1 + 1/R2 => Req = (R1 * R2) / (R1 + R2)
    req = (r1 * r2) / (r1 + r2);
    const rTotal = req + internalR;
    iTotal = rTotal > 0 ? emf / rTotal : 0;
    const vTerminal = iTotal * req;
    i1 = r1 > 0 ? vTerminal / r1 : 0;
    i2 = r2 > 0 ? vTerminal / r2 : 0;
    v1 = vTerminal;
    v2 = vTerminal;
  } else {
    // Mixed: R1 in series with (R2 || R3)
    const rParallel23 = (r2 * r3) / (r2 + r3);
    req = r1 + rParallel23;
    const rTotal = req + internalR;
    iTotal = rTotal > 0 ? emf / rTotal : 0;
    i1 = iTotal;
    v1 = i1 * r1;
    const vParallel = iTotal * rParallel23;
    i2 = r2 > 0 ? vParallel / r2 : 0;
    i3 = r3 > 0 ? vParallel / r3 : 0;
    v2 = vParallel;
    v3 = vParallel;
  }

  // Terminal voltage V = E - I*r
  const lostVolt = iTotal * internalR;
  const vTerminal = emf - lostVolt;

  // Power dissipated by external circuit P = V * I = I^2 * Req
  const powerWatts = iTotal * vTerminal;

  // Monthly electricity bill estimate for 6 hours daily usage at 7.50 BDT / kWh
  const dailyKwh = (powerWatts * 6) / 1000;
  const monthlyKwh = dailyKwh * 30;
  const monthlyCostBdt = monthlyKwh * 7.5;

  const handleReset = () => {
    setCircuitType('mixed');
    setEmf(12);
    setInternalR(1.0);
    setR1(6);
    setR2(12);
    setR3(12);
  };

  return (
    <Card className="overflow-hidden border border-border/70 bg-gradient-to-b from-card to-card/60 shadow-xl rounded-2xl">
      {/* Top Banner / Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center">
            <Activity className="size-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">
              {isBn
                ? 'ডিসি বর্তনী ও ওহমের সূত্র ল্যাবরেটরি'
                : 'DC Circuit & Ohm’s Law Laboratory'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'শ্রেণি, সমান্তরাল ও মিশ্র বর্তনীতে তড়িৎ প্রবাহ ও হারানো ভোল্টেজ'
                : 'Series, parallel, equivalent resistance, and lost voltage'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Circuit Type Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-background border border-border/80">
            <button
              onClick={() => setCircuitType('series')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                circuitType === 'series'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'শ্রেণি (Series)' : 'Series'}
            </button>
            <button
              onClick={() => setCircuitType('parallel')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                circuitType === 'parallel'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'সমান্তরাল (Parallel)' : 'Parallel'}
            </button>
            <button
              onClick={() => setCircuitType('mixed')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                circuitType === 'mixed'
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'মিশ্র (Mixed)' : 'Mixed'}
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
        {/* Circuit Diagram Canvas */}
        <div className="relative w-full h-64 sm:h-72 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col justify-between p-4">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-semibold text-slate-300">
                {circuitType === 'series'
                  ? isBn
                    ? 'শ্রেণি বর্তনী (R₁ + R₂)'
                    : 'Series Circuit'
                  : circuitType === 'parallel'
                    ? isBn
                      ? 'সমান্তরাল বর্তনী (R₁ ∥ R₂)'
                      : 'Parallel Circuit'
                    : isBn
                      ? 'মিশ্র বর্তনী [R₁ + (R₂ ∥ R₃)]'
                      : 'Mixed Circuit'}
              </span>
            </div>
            <span className="font-mono text-cyan-400">
              E = {emf} V | r = {internalR} Ω
            </span>
          </div>

          {/* SVG Circuit Schematic */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 560 160"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                <linearGradient id="wire-glow" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="50%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
              </defs>

              {/* Main Outer Loop Wires */}
              <path
                d="M 80 120 L 40 120 L 40 40 L 520 40 L 520 120 L 220 120"
                fill="none"
                stroke="url(#wire-glow)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              {/* Battery Symbol & Internal Resistor (at bottom: x = 80 to 220) */}
              <g transform="translate(100, 120)">
                {/* Long bar (Positive) */}
                <line x1="0" y1="-14" x2="0" y2="14" stroke="#ef4444" strokeWidth="3" />
                {/* Short bar (Negative) */}
                <line x1="12" y1="-8" x2="12" y2="8" stroke="#38bdf8" strokeWidth="4" />
                <text x="-8" y="-18" fill="#ef4444" fontSize="10" fontWeight="bold">
                  +
                </text>
                <text x="18" y="-18" fill="#38bdf8" fontSize="10" fontWeight="bold">
                  -
                </text>
                <text
                  x="6"
                  y="26"
                  fill="#f1f5f9"
                  fontSize="11"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  {emf} V
                </text>

                {/* Internal Resistor r */}
                <rect
                  x="45"
                  y="-10"
                  width="40"
                  height="20"
                  rx="4"
                  fill="#1e293b"
                  stroke="#64748b"
                  strokeWidth="1.5"
                />
                <text
                  x="65"
                  y="4"
                  fill="#94a3b8"
                  fontSize="10"
                  textAnchor="middle"
                  fontFamily="monospace"
                >
                  r={internalR}Ω
                </text>
                <line x1="12" y1="0" x2="45" y2="0" stroke="#38bdf8" strokeWidth="2" />
                <line x1="85" y1="0" x2="120" y2="0" stroke="#38bdf8" strokeWidth="2" />
              </g>

              {/* Resistors along Top Wire (y = 40) */}
              {circuitType === 'series' && (
                <>
                  {/* R1 */}
                  <g transform="translate(160, 40)">
                    <rect
                      x="-35"
                      y="-14"
                      width="70"
                      height="28"
                      rx="5"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="-18"
                      fill="#f59e0b"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₁ = {r1} Ω
                    </text>
                    <text
                      x="0"
                      y="4"
                      fill="#e2e8f0"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {v1.toFixed(1)} V | {i1.toFixed(2)} A
                    </text>
                  </g>

                  {/* R2 */}
                  <g transform="translate(360, 40)">
                    <rect
                      x="-35"
                      y="-14"
                      width="70"
                      height="28"
                      rx="5"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="-18"
                      fill="#10b981"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₂ = {r2} Ω
                    </text>
                    <text
                      x="0"
                      y="4"
                      fill="#e2e8f0"
                      fontSize="10"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {v2.toFixed(1)} V | {i2.toFixed(2)} A
                    </text>
                  </g>
                </>
              )}

              {circuitType === 'parallel' && (
                <>
                  {/* Branch Split at x = 180, rejoin at x = 380 */}
                  <line x1="180" y1="40" x2="180" y2="18" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="180" y1="40" x2="180" y2="62" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="380" y1="18" x2="380" y2="40" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="380" y1="62" x2="380" y2="40" stroke="#38bdf8" strokeWidth="2" />

                  {/* Branch 1 (Top: y = 18) */}
                  <line x1="180" y1="18" x2="245" y2="18" stroke="#38bdf8" strokeWidth="2" />
                  <g transform="translate(280, 18)">
                    <rect
                      x="-35"
                      y="-12"
                      width="70"
                      height="24"
                      rx="4"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="-15"
                      fill="#f59e0b"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₁ = {r1} Ω ({i1.toFixed(2)} A)
                    </text>
                    <text
                      x="0"
                      y="4"
                      fill="#e2e8f0"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      V = {v1.toFixed(1)} V
                    </text>
                  </g>
                  <line x1="315" y1="18" x2="380" y2="18" stroke="#38bdf8" strokeWidth="2" />

                  {/* Branch 2 (Bottom: y = 62) */}
                  <line x1="180" y1="62" x2="245" y2="62" stroke="#38bdf8" strokeWidth="2" />
                  <g transform="translate(280, 62)">
                    <rect
                      x="-35"
                      y="-12"
                      width="70"
                      height="24"
                      rx="4"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="24"
                      fill="#10b981"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₂ = {r2} Ω ({i2.toFixed(2)} A)
                    </text>
                    <text
                      x="0"
                      y="4"
                      fill="#e2e8f0"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      V = {v2.toFixed(1)} V
                    </text>
                  </g>
                  <line x1="315" y1="62" x2="380" y2="62" stroke="#38bdf8" strokeWidth="2" />
                </>
              )}

              {circuitType === 'mixed' && (
                <>
                  {/* R1 in series first at x = 140 */}
                  <g transform="translate(140, 40)">
                    <rect
                      x="-30"
                      y="-14"
                      width="60"
                      height="28"
                      rx="5"
                      fill="#0f172a"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="-18"
                      fill="#f59e0b"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₁ = {r1} Ω
                    </text>
                    <text
                      x="0"
                      y="4"
                      fill="#e2e8f0"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      {v1.toFixed(1)} V | {i1.toFixed(2)} A
                    </text>
                  </g>

                  {/* Then Parallel branches for R2 & R3 */}
                  <line x1="220" y1="40" x2="220" y2="20" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="220" y1="40" x2="220" y2="60" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="420" y1="20" x2="420" y2="40" stroke="#38bdf8" strokeWidth="2" />
                  <line x1="420" y1="60" x2="420" y2="40" stroke="#38bdf8" strokeWidth="2" />

                  {/* R2 top */}
                  <line x1="220" y1="20" x2="285" y2="20" stroke="#38bdf8" strokeWidth="2" />
                  <g transform="translate(320, 20)">
                    <rect
                      x="-35"
                      y="-11"
                      width="70"
                      height="22"
                      rx="4"
                      fill="#0f172a"
                      stroke="#10b981"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#10b981"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₂ = {r2} Ω ({i2.toFixed(2)} A)
                    </text>
                  </g>
                  <line x1="355" y1="20" x2="420" y2="20" stroke="#38bdf8" strokeWidth="2" />

                  {/* R3 bottom */}
                  <line x1="220" y1="60" x2="285" y2="60" stroke="#38bdf8" strokeWidth="2" />
                  <g transform="translate(320, 60)">
                    <rect
                      x="-35"
                      y="-11"
                      width="70"
                      height="22"
                      rx="4"
                      fill="#0f172a"
                      stroke="#8b5cf6"
                      strokeWidth="2"
                    />
                    <text
                      x="0"
                      y="4"
                      fill="#8b5cf6"
                      fontSize="9"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      R₃ = {r3} Ω ({i3.toFixed(2)} A)
                    </text>
                  </g>
                  <line x1="355" y1="60" x2="420" y2="60" stroke="#38bdf8" strokeWidth="2" />
                </>
              )}

              {/* Ammeter circle icon at right wire */}
              <g transform="translate(520, 80)">
                <circle cx="0" cy="0" r="16" fill="#0284c7" stroke="#ffffff" strokeWidth="1.5" />
                <text
                  x="0"
                  y="5"
                  fill="#ffffff"
                  fontSize="12"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  A
                </text>
                <text
                  x="30"
                  y="4"
                  fill="#38bdf8"
                  fontSize="11"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {iTotal.toFixed(2)} A
                </text>
              </g>
            </svg>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-3">
              <span className="text-amber-400 font-mono font-semibold">
                {isBn
                  ? `তুল্য রোধ R_p = ${req.toFixed(2)} Ω`
                  : `Equivalent Req = ${req.toFixed(2)} Ω`}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-emerald-400 font-mono font-semibold">
                {isBn
                  ? `মোট রোধ = ${(req + internalR).toFixed(2)} Ω`
                  : `Total (Req + r) = ${(req + internalR).toFixed(2)} Ω`}
              </span>
            </div>
            <div className="text-rose-400 font-mono">
              {isBn
                ? `হারানো ভোল্ট (Ir) = ${lostVolt.toFixed(2)} V`
                : `Lost Volts (Ir) = ${lostVolt.toFixed(2)} V`}
            </div>
          </div>
        </div>

        {/* Live Measurement Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'বর্তনীর মোট প্রবাহ (I)' : 'Total Current (I)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-500">
              {isBn ? toBengaliNumber(iTotal.toFixed(2)) : iTotal.toFixed(2)}{' '}
              <span className="text-xs font-sans text-muted-foreground">A</span>
            </div>
            <p className="text-[10px] text-muted-foreground">I = E / (Req + r)</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'প্রান্তীয় বিভব (V_terminal)' : 'Terminal Voltage (V)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-emerald-500">
              {isBn ? toBengaliNumber(vTerminal.toFixed(2)) : vTerminal.toFixed(2)}{' '}
              <span className="text-xs font-sans text-muted-foreground">V</span>
            </div>
            <p className="text-[10px] text-muted-foreground">V = E - Ir</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'তড়িৎ ক্ষমতা (Power)' : 'Dissipated Power (P)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-amber-500">
              {isBn ? toBengaliNumber(powerWatts.toFixed(1)) : powerWatts.toFixed(1)}{' '}
              <span className="text-xs font-sans text-muted-foreground">W</span>
            </div>
            <p className="text-[10px] text-muted-foreground">P = V × I = I²Req</p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'মাসিক বিদ্যুৎ বিল' : 'Monthly Bill (Est.)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-indigo-500">
              {isBn
                ? toBengaliNumber(monthlyCostBdt.toFixed(1))
                : monthlyCostBdt.toFixed(1)}{' '}
              <span className="text-xs font-sans text-muted-foreground">৳</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isBn
                ? `${toBengaliNumber(monthlyKwh.toFixed(2))} ইউনিট (kWh)`
                : `${monthlyKwh.toFixed(2)} Units (kWh)`}
            </p>
          </div>
        </div>

        {/* Sliders & Parameters Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Left Column: Battery Parameters */}
          <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Zap className="size-3.5" />
              <span>
                {isBn ? 'তড়িচ্চালক শক্তি ও অভ্যন্তরীণ রোধ' : 'EMF & Internal Resistance'}
              </span>
            </h4>

            {/* EMF Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? 'তড়িচ্চালক শক্তি (E)' : 'Electromotive Force (E)'}
                </span>
                <span className="font-mono font-bold text-cyan-500">{emf} V</span>
              </div>
              <input
                type="range"
                min="1"
                max="24"
                step="1"
                value={emf}
                onChange={(e) => setEmf(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>1 V</span>
                <span>12 V</span>
                <span>24 V</span>
              </div>
            </div>

            {/* Internal Resistance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? 'অভ্যন্তরীণ রোধ (r)' : 'Internal Resistance (r)'}
                </span>
                <span className="font-mono font-bold text-rose-500">{internalR} Ω</span>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={internalR}
                onChange={(e) => setInternalR(Number(e.target.value))}
                className="w-full accent-rose-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0 Ω (আদর্শ ব্যাটারি)</span>
                <span>2.5 Ω</span>
                <span>5.0 Ω</span>
              </div>
            </div>
          </div>

          {/* Right Column: Resistors R1, R2, R3 */}
          <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="size-3.5" />
              <span>{isBn ? 'রোধক মান নিয়ন্ত্রণ (Resistors)' : 'Resistor Values'}</span>
            </h4>

            {/* R1 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? '১ম রোধ (R₁)' : 'Resistor 1 (R₁)'}
                </span>
                <span className="font-mono font-bold text-amber-500">{r1} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={r1}
                onChange={(e) => setR1(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
            </div>

            {/* R2 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? '২য় রোধ (R₂)' : 'Resistor 2 (R₂)'}
                </span>
                <span className="font-mono font-bold text-emerald-500">{r2} Ω</span>
              </div>
              <input
                type="range"
                min="1"
                max="50"
                step="1"
                value={r2}
                onChange={(e) => setR2(Number(e.target.value))}
                className="w-full accent-emerald-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
            </div>

            {/* R3 Slider (Visible only in Mixed mode) */}
            {circuitType === 'mixed' && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? '৩য় রোধ (R₃ - সমান্তরাল শাখা)' : 'Resistor 3 (R₃ - Parallel)'}
                  </span>
                  <span className="font-mono font-bold text-purple-500">{r3} Ω</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="50"
                  step="1"
                  value={r3}
                  onChange={(e) => setR3(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Board Insight Banner */}
        <div className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-start gap-3">
          <Sparkles className="size-4 text-cyan-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-foreground/90">
            <span className="font-bold text-cyan-600 dark:text-cyan-400 block">
              {isBn
                ? 'বোর্ড এক্সাম সিক্রেট: হারানো ভোল্ট (Lost Volt) ট্র্যাপ'
                : 'Board Exam Secret: Lost Volt Trap ($v = Ir$)'}
            </span>
            <p className="leading-relaxed">
              {isBn
                ? 'উদ্দীপকে ব্যাটারির অভ্যন্তরীণ রোধ $r$ উল্লেখ থাকলে সরাসরি $I = E / R$ বসালে পুরো অংক ভুল হবে। সঠিক সূত্র হলো $I = \\frac{E}{R_{\\text{eq}} + r}$ এবং প্রান্তীয় ভোল্টেজ $V = E - Ir$। এই হারানো ভোল্টেজ $v = Ir$ কোনো বহিস্থ কাজে আসে না, ব্যাটারির ভেতরে তাপ হিসেবে অপচয় হয়।'
                : 'Whenever internal resistance $r$ is mentioned in CQ prompts, never omit it from total resistance! Terminal voltage $V$ is strictly $E - Ir$.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
