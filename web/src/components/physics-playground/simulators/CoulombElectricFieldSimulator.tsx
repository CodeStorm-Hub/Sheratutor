'use client';

import React, { useState } from 'react';
import {
  Zap,
  RotateCcw,
  Sliders,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Magnet,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function CoulombElectricFieldSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 'force' (Coulomb Force between 2 charges) or 'field' (Field Intensity & Potential at test point)
  const [mode, setMode] = useState<'force' | 'field'>('force');

  // Charge 1: in microCoulombs (-10 to +10 μC)
  const [q1, setQ1] = useState<number>(4);
  // Charge 2: in microCoulombs (-10 to +10 μC)
  const [q2, setQ2] = useState<number>(-3);
  // Distance between charges in meters (0.05 to 1.0 m)
  const [distanceM, setDistanceM] = useState<number>(0.2);
  // Medium relative permittivity ε_r (1.0 for Air/Vacuum, 80 for Water)
  const [epsilonR, setEpsilonR] = useState<number>(1.0);

  // Probe test point distance from Q1 (fraction of distance: 0.1 to 0.9)
  const [probeFraction, setProbeFraction] = useState<number>(0.5);

  const kConstant = 9e9; // N m^2 C^-2
  const effectiveK = kConstant / epsilonR;

  // Actual charges in Coulombs
  const q1C = q1 * 1e-6;
  const q2C = q2 * 1e-6;

  // Coulomb Force calculation
  // F = k * |q1 * q2| / r^2
  const forceN =
    distanceM > 0
      ? (effectiveK * Math.abs(q1C * q2C)) / (distanceM * distanceM)
      : 0;

  const isRepulsive = (q1 > 0 && q2 > 0) || (q1 < 0 && q2 < 0);
  const isZeroForce = q1 === 0 || q2 === 0;

  // Probe point calculation (Mode: 'field')
  const r1 = distanceM * probeFraction;
  const r2 = distanceM * (1 - probeFraction);

  // Electric field from Q1: E1 = k * q1 / r1^2 (pointing away if q1 > 0, towards if q1 < 0)
  const e1 = r1 > 0 ? (effectiveK * q1C) / (r1 * r1) : 0;
  // Electric field from Q2: E2 = k * q2 / r2^2 (pointing away from Q2 if q2 > 0 [which is -x dir], towards Q2 if q2 < 0 [+x dir])
  // Let +x be towards the right (from Q1 to Q2):
  // Field from Q1 points in +x if q1 > 0, -x if q1 < 0
  const e1_vector = e1;
  // Field from Q2 at point between them: points towards -x if q2 > 0 (away from Q2), and towards +x if q2 < 0 (towards Q2)
  const e2_vector = r2 > 0 ? (effectiveK * (-q2C)) / (r2 * r2) : 0;
  const eNet = e1_vector + e2_vector;

  // Electric potential: V = k * q1 / r1 + k * q2 / r2 (scalar sum)
  const v1 = r1 > 0 ? (effectiveK * q1C) / r1 : 0;
  const v2 = r2 > 0 ? (effectiveK * q2C) / r2 : 0;
  const vNet = v1 + v2;

  // Reset helper
  const handleReset = () => {
    setQ1(4);
    setQ2(-3);
    setDistanceM(0.2);
    setEpsilonR(1.0);
    setProbeFraction(0.5);
  };

  return (
    <Card className="overflow-hidden border border-border/70 bg-gradient-to-b from-card to-card/60 shadow-xl rounded-2xl">
      {/* Top Banner / Controls Bar */}
      <div className="p-4 sm:p-5 border-b border-border/70 bg-muted/30 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="size-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Zap className="size-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold">
              {isBn
                ? 'স্থির তড়িৎ ও কুলম্ব বল স্যান্ডবক্স'
                : 'Coulomb Force & Electric Field Sandbox'}
            </h3>
            <p className="text-xs text-muted-foreground">
              {isBn
                ? 'আধানের আকর্ষণ-বিকর্ষণ, প্রাবল্য ও বিভব পর্যবেক্ষণ'
                : 'Charge interaction, field intensity, and potential'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-background border border-border/80">
            <button
              onClick={() => setMode('force')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'force'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'কুলম্ব বল (F)' : 'Coulomb Force (F)'}
            </button>
            <button
              onClick={() => setMode('field')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                mode === 'field'
                  ? 'bg-amber-500 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {isBn ? 'প্রাবল্য ও বিভব (E & V)' : 'Field & Potential (E & V)'}
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
          {/* Canvas Header / Coordinate Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {isBn
                  ? `মাধ্যম: ${epsilonR === 1 ? 'বায়ু / শূন্যস্থান' : 'পানি (εr = ৮০)'}`
                  : `Medium: ${epsilonR === 1 ? 'Air / Vacuum' : 'Water (εr = 80)'}`}
              </span>
            </div>
            <span className="font-mono text-slate-300">
              k = {epsilonR === 1 ? '9 × 10⁹' : (9e9 / 80).toExponential(2)} N·m²/C²
            </span>
          </div>

          {/* SVG Diagram of Point Charges & Vectors */}
          <div className="relative w-full flex-1 flex items-center justify-center">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 160"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Arrow markers */}
                <marker
                  id="arrow-right"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-fill"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-left"
                  viewBox="0 0 10 10"
                  refX="4"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-fill"
                >
                  <path d="M 10 1 L 0 5 L 10 9 z" fill="#f59e0b" />
                </marker>
                <marker
                  id="arrow-cyan"
                  viewBox="0 0 10 10"
                  refX="6"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-fill"
                >
                  <path d="M 0 1 L 10 5 L 0 9 z" fill="#38bdf8" />
                </marker>
              </defs>

              {/* Baseline axis */}
              <line
                x1="60"
                y1="80"
                x2="540"
                y2="80"
                stroke="#334155"
                strokeWidth="2"
                strokeDasharray="4 4"
              />

              {/* Distance dimension bracket */}
              {/* Charge 1 position fixed at x = 140 */}
              {/* Charge 2 position determined by distanceM (scaled between 260 and 460) */}
              {(() => {
                const x1 = 140;
                const x2 = 140 + distanceM * 320; // 0.05m -> 156, 1.0m -> 460
                const probeX = x1 + (x2 - x1) * probeFraction;

                return (
                  <>
                    {/* Dimension Line */}
                    <line
                      x1={x1}
                      y1="125"
                      x2={x2}
                      y2="125"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={x1}
                      y1="118"
                      x2={x1}
                      y2="132"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    <line
                      x1={x2}
                      y1="118"
                      x2={x2}
                      y2="132"
                      stroke="#64748b"
                      strokeWidth="1.5"
                    />
                    <text
                      x={(x1 + x2) / 2}
                      y="142"
                      fill="#94a3b8"
                      fontSize="12"
                      textAnchor="middle"
                      fontFamily="monospace"
                    >
                      r = {distanceM.toFixed(2)} m ({(distanceM * 100).toFixed(0)} cm)
                    </text>

                    {/* Force Vector Arrows (Mode: 'force') */}
                    {mode === 'force' && !isZeroForce && (
                      <>
                        {isRepulsive ? (
                          // Repulsive: Q1 arrow points Left, Q2 arrow points Right
                          <>
                            <line
                              x1={x1}
                              y1="80"
                              x2={x1 - Math.min(60, 20 + forceN / 20)}
                              y2="80"
                              stroke="#f59e0b"
                              strokeWidth="3"
                              markerEnd="url(#arrow-left)"
                            />
                            <line
                              x1={x2}
                              y1="80"
                              x2={x2 + Math.min(60, 20 + forceN / 20)}
                              y2="80"
                              stroke="#f59e0b"
                              strokeWidth="3"
                              markerEnd="url(#arrow-right)"
                            />
                            <text
                              x={x1 - 35}
                              y="65"
                              fill="#f59e0b"
                              fontSize="11"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              -F
                            </text>
                            <text
                              x={x2 + 35}
                              y="65"
                              fill="#f59e0b"
                              fontSize="11"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              +F
                            </text>
                          </>
                        ) : (
                          // Attractive: Q1 arrow points Right (towards Q2), Q2 arrow points Left (towards Q1)
                          <>
                            <line
                              x1={x1}
                              y1="80"
                              x2={x1 + Math.min(50, (x2 - x1) * 0.35)}
                              y2="80"
                              stroke="#10b981"
                              strokeWidth="3"
                              markerEnd="url(#arrow-right)"
                            />
                            <line
                              x1={x2}
                              y1="80"
                              x2={x2 - Math.min(50, (x2 - x1) * 0.35)}
                              y2="80"
                              stroke="#10b981"
                              strokeWidth="3"
                              markerEnd="url(#arrow-left)"
                            />
                            <text
                              x={x1 + 25}
                              y="65"
                              fill="#10b981"
                              fontSize="11"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              F₁₂
                            </text>
                            <text
                              x={x2 - 25}
                              y="65"
                              fill="#10b981"
                              fontSize="11"
                              textAnchor="middle"
                              fontWeight="bold"
                            >
                              F₂₁
                            </text>
                          </>
                        )}
                      </>
                    )}

                    {/* Field Probe Point Marker (Mode: 'field') */}
                    {mode === 'field' && (
                      <g transform={`translate(${probeX}, 80)`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="7"
                          fill="#38bdf8"
                          stroke="#ffffff"
                          strokeWidth="2"
                        />
                        <text
                          x="0"
                          y="-14"
                          fill="#38bdf8"
                          fontSize="11"
                          fontWeight="bold"
                          textAnchor="middle"
                        >
                          P (Test Probe)
                        </text>
                        {/* Net Field vector arrow */}
                        {Math.abs(eNet) > 100 && (
                          <line
                            x1="0"
                            y1="0"
                            x2={eNet > 0 ? 35 : -35}
                            y2="0"
                            stroke="#38bdf8"
                            strokeWidth="3"
                            markerEnd={eNet > 0 ? 'url(#arrow-cyan)' : 'url(#arrow-left)'}
                          />
                        )}
                      </g>
                    )}

                    {/* Charge 1 Circle */}
                    <g transform={`translate(${x1}, 80)`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill={q1 > 0 ? '#ef4444' : q1 < 0 ? '#3b82f6' : '#64748b'}
                        className="transition-colors duration-200"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <text
                        x="0"
                        y="5"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {q1 > 0 ? '+' : q1 < 0 ? '-' : '0'}
                      </text>
                      <text
                        x="0"
                        y="-32"
                        fill={q1 > 0 ? '#fca5a5' : q1 < 0 ? '#93c5fd' : '#cbd5e1'}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        q₁ = {q1 > 0 ? `+${q1}` : q1} μC
                      </text>
                    </g>

                    {/* Charge 2 Circle */}
                    <g transform={`translate(${x2}, 80)`}>
                      <circle
                        cx="0"
                        cy="0"
                        r="24"
                        fill={q2 > 0 ? '#ef4444' : q2 < 0 ? '#3b82f6' : '#64748b'}
                        className="transition-colors duration-200"
                        stroke="#ffffff"
                        strokeWidth="2.5"
                      />
                      <text
                        x="0"
                        y="5"
                        fill="#ffffff"
                        fontSize="14"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        {q2 > 0 ? '+' : q2 < 0 ? '-' : '0'}
                      </text>
                      <text
                        x="0"
                        y="-32"
                        fill={q2 > 0 ? '#fca5a5' : q2 < 0 ? '#93c5fd' : '#cbd5e1'}
                        fontSize="12"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        q₂ = {q2 > 0 ? `+${q2}` : q2} μC
                      </text>
                    </g>
                  </>
                );
              })()}
            </svg>
          </div>

          {/* Canvas Bottom Legend */}
          <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 border-t border-slate-800/80 pt-2">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-red-500" />
                {isBn ? 'ধনাত্মক আধান (+Q)' : 'Positive Charge (+Q)'}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-blue-500" />
                {isBn ? 'ঋণাত্মক আধান (-Q)' : 'Negative Charge (-Q)'}
              </span>
            </div>
            <div>
              {mode === 'force' ? (
                <span
                  className={`font-semibold ${
                    isZeroForce
                      ? 'text-slate-400'
                      : isRepulsive
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                  }`}
                >
                  {isZeroForce
                    ? isBn
                      ? 'কোনো বল অনুভূত হচ্ছে না'
                      : 'No force (neutral charge)'
                    : isRepulsive
                      ? isBn
                        ? 'বিকর্ষণ বল (Repulsive Force)'
                        : 'Repulsive Force (Same Polarity)'
                      : isBn
                        ? 'আকর্ষণ বল (Attractive Force)'
                        : 'Attractive Force (Opposite Polarity)'}
                </span>
              ) : (
                <span className="text-cyan-400 font-semibold">
                  {isBn
                    ? `P বিন্দুর অবস্থান: ${(probeFraction * distanceM * 100).toFixed(0)} cm (Q₁ থেকে)`
                    : `Probe P: ${(probeFraction * distanceM * 100).toFixed(0)} cm from Q₁`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Live Measurement Cockpit */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'কুলম্ব বল (Force)' : 'Coulomb Force (F)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-amber-500">
              {isBn ? toBengaliNumber(forceN.toFixed(2)) : forceN.toFixed(2)}{' '}
              <span className="text-xs font-sans text-muted-foreground">N</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isZeroForce
                ? 'F = 0 N'
                : isRepulsive
                  ? isBn
                    ? 'পরস্পরকে ঠেলছে'
                    : 'Pushing apart'
                  : isBn
                    ? 'কাছে টানছে'
                    : 'Pulling together'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'মধ্যবর্তী দূরত্ব (r)' : 'Distance (r)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-foreground">
              {isBn
                ? toBengaliNumber((distanceM * 100).toFixed(0))
                : (distanceM * 100).toFixed(0)}{' '}
              <span className="text-xs font-sans text-muted-foreground">cm</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isBn
                ? `${toBengaliNumber(distanceM.toFixed(2))} m (এসআই একক)`
                : `${distanceM.toFixed(2)} m (SI unit)`}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'তড়িৎ প্রাবল্য (E_net)' : 'Field Intensity (E)'}
            </span>
            <div className="text-base sm:text-lg font-mono font-bold text-cyan-500">
              {isBn
                ? toBengaliNumber(Math.abs(eNet).toExponential(2))
                : Math.abs(eNet).toExponential(2)}{' '}
              <span className="text-xs font-sans text-muted-foreground">N/C</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {eNet >= 0
                ? isBn
                  ? 'ডান দিকে (+x)'
                  : 'Rightward'
                : isBn
                  ? 'বাম দিকে (-x)'
                  : 'Leftward'}
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-card border border-border/80 space-y-1">
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider block">
              {isBn ? 'তড়িৎ বিভব (V_net)' : 'Net Potential (V)'}
            </span>
            <div
              className={`text-base sm:text-lg font-mono font-bold ${
                vNet >= 0 ? 'text-emerald-500' : 'text-blue-500'
              }`}
            >
              {isBn
                ? toBengaliNumber((vNet / 1000).toFixed(1))
                : (vNet / 1000).toFixed(1)}{' '}
              <span className="text-xs font-sans text-muted-foreground">kV</span>
            </div>
            <p className="text-[10px] text-muted-foreground">
              {isBn ? 'স্কেলার যোগফল (V₁ + V₂)' : 'Scalar sum (V₁ + V₂)'}
            </p>
          </div>
        </div>

        {/* Sliders & Parameters Control Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
          {/* Left Column: Charge 1 & Charge 2 */}
          <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Sliders className="size-3.5" />
              <span>{isBn ? 'আধান নিয়ন্ত্রণ (Charges)' : 'Charge Controls'}</span>
            </h4>

            {/* Q1 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? '১ম আধান (q₁)' : 'Charge 1 (q₁)'}
                </span>
                <span
                  className={`font-mono font-bold ${
                    q1 > 0 ? 'text-red-500' : q1 < 0 ? 'text-blue-500' : 'text-muted-foreground'
                  }`}
                >
                  {q1 > 0 ? `+${q1}` : q1} μC
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={q1}
                onChange={(e) => setQ1(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>-10 μC</span>
                <span>0 μC</span>
                <span>+10 μC</span>
              </div>
            </div>

            {/* Q2 Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? '২য় আধান (q₂)' : 'Charge 2 (q₂)'}
                </span>
                <span
                  className={`font-mono font-bold ${
                    q2 > 0 ? 'text-red-500' : q2 < 0 ? 'text-blue-500' : 'text-muted-foreground'
                  }`}
                >
                  {q2 > 0 ? `+${q2}` : q2} μC
                </span>
              </div>
              <input
                type="range"
                min="-10"
                max="10"
                step="1"
                value={q2}
                onChange={(e) => setQ2(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>-10 μC</span>
                <span>0 μC</span>
                <span>+10 μC</span>
              </div>
            </div>
          </div>

          {/* Right Column: Distance & Medium/Probe */}
          <div className="space-y-4 p-4 rounded-xl bg-muted/20 border border-border/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Magnet className="size-3.5" />
              <span>
                {isBn
                  ? 'দূরত্ব ও মাধ্যম (Geometry & Medium)'
                  : 'Geometry & Medium Controls'}
              </span>
            </h4>

            {/* Distance Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-foreground">
                  {isBn ? 'মধ্যবর্তী দূরত্ব (r)' : 'Distance (r)'}
                </span>
                <span className="font-mono font-bold text-amber-500">
                  {distanceM.toFixed(2)} m ({(distanceM * 100).toFixed(0)} cm)
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="1.0"
                step="0.01"
                value={distanceM}
                onChange={(e) => setDistanceM(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-muted rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0.05 m (5 cm)</span>
                <span>0.5 m (50 cm)</span>
                <span>1.0 m (100 cm)</span>
              </div>
            </div>

            {/* Medium Selector or Probe Point Slider */}
            {mode === 'force' ? (
              <div className="space-y-1.5">
                <span className="text-xs font-medium text-foreground block">
                  {isBn ? 'মাধ্যম নির্বাচন (Medium Permittivity)' : 'Medium Dielectric'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setEpsilonR(1.0)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                      epsilonR === 1.0
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-500'
                        : 'border-border/80 hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-bold">{isBn ? 'বায়ু / শূন্য' : 'Air / Vacuum'}</div>
                    <div className="text-[10px] text-muted-foreground">ε_r = 1.0</div>
                  </button>
                  <button
                    onClick={() => setEpsilonR(80.0)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-medium border text-left transition-all ${
                      epsilonR === 80.0
                        ? 'border-amber-500/60 bg-amber-500/10 text-amber-500'
                        : 'border-border/80 hover:bg-muted/50'
                    }`}
                  >
                    <div className="font-bold">{isBn ? 'পানি (Water)' : 'Water'}</div>
                    <div className="text-[10px] text-muted-foreground">ε_r = 80.0</div>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">
                    {isBn ? 'টেস্ট পয়েন্ট P এর অবস্থান' : 'Probe P Position'}
                  </span>
                  <span className="font-mono font-bold text-cyan-500">
                    {(probeFraction * distanceM * 100).toFixed(0)} cm from Q₁
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="0.9"
                  step="0.05"
                  value={probeFraction}
                  onChange={(e) => setProbeFraction(Number(e.target.value))}
                  className="w-full accent-cyan-500 cursor-pointer h-2 bg-muted rounded-lg"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Q₁ এর কাছে (10%)</span>
                  <span>মধ্যবিন্দু (50%)</span>
                  <span>Q₂ এর কাছে (90%)</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Board Insight Banner */}
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <Sparkles className="size-4 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1 text-foreground/90">
            <span className="font-bold text-amber-600 dark:text-amber-400 block">
              {isBn
                ? 'বোর্ড সৃজনশীল ট্রিক: দূরত্বের বর্গের ব্যস্তানুপাতিক সম্পর্ক'
                : 'Board Exam Pattern: Inverse Square Law ($F \\propto 1/r^2$)'}
            </span>
            <p className="leading-relaxed">
              {isBn
                ? 'দূরত্ব অর্ধেক ($r/2$) করলে কুলম্ব বল ৪ গুণ ($4F$) হয়ে যায়। কিন্তু আধানের পরিমাণ দ্বিগুণ করলে বল ২ গুণ বাড়ে। বোর্ডের "ঘ" অংশে সম্পর্ক যাচাই করতে প্রায়ই দূরত্ব পরিবর্তন করে বলের তুলনা করতে বলা হয়।'
                : 'Halving the distance ($r/2$) quadruples the force ($4F$). Examiners frequently test this ratio in CQ Part (d) comparative evaluations.'}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
