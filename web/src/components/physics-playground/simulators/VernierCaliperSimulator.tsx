'use client';

import React, { useState } from 'react';
import { RotateCcw, ZoomIn, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function VernierCaliperSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // State
  const [objectWidthMm, setObjectWidthMm] = useState<number>(18.4);
  const [vernierDivisions, setVernierDivisions] = useState<number>(10); // 10 or 20
  const [zeroErrorMm, setZeroErrorMm] = useState<number>(0.0); // mechanical zero error

  // Vernier Constant
  // s = 1mm, n = vernierDivisions -> VC = 1/n mm
  const vc = 1 / vernierDivisions; // 0.1 mm for 10 divisions, 0.05 mm for 20 divisions

  // Reading calculations:
  // Raw position = objectWidthMm + zeroErrorMm
  const rawPosition = Math.max(0, objectWidthMm + zeroErrorMm);
  const mainScaleReading = Math.floor(rawPosition); // M in mm
  const fraction = rawPosition - mainScaleReading; // mm fraction
  const vernierCoincidence = Math.round(fraction / vc) % vernierDivisions; // V
  const totalLength = mainScaleReading + vernierCoincidence * vc - zeroErrorMm;

  // Visual scaling: 1 mm = 12 SVG units
  const pxPerMm = 12;
  const maxMm = 55;
  const originX = 140; // X position where main scale 0 starts
  const jawWidth = 24;

  const sliderOffset = rawPosition * pxPerMm;

  return (
    <div className="space-y-6">
      {/* SVG Canvas Stage */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
              {isBn ? 'ভার্নিয়ার ক্যালিপার্স সিমুলেটর' : 'Vernier Calipers Simulator'}
            </Badge>
            <span className="text-xs text-slate-400">
              {isBn ? `VC = ${vc} মি.মি.` : `VC = ${vc} mm`}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setObjectWidthMm(18.4);
                setZeroErrorMm(0);
              }}
              className="text-xs text-slate-300 hover:text-white hover:bg-white/10 h-7"
            >
              <RotateCcw className="size-3.5 mr-1" />
              {isBn ? 'রিসেট' : 'Reset'}
            </Button>
          </div>
        </div>

        {/* SVG Drawing */}
        <div className="overflow-x-auto scrollbar-thin">
          <svg
            viewBox="0 0 920 300"
            className="w-full min-w-[700px] h-[260px] sm:h-[300px]"
          >
            <defs>
              <linearGradient id="metalBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="50%" stopColor="#cbd5e1" />
                <stop offset="100%" stopColor="#64748b" />
              </linearGradient>
              <linearGradient id="metalSlide" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#f1f5f9" />
                <stop offset="100%" stopColor="#94a3b8" />
              </linearGradient>
              <linearGradient id="cylinderObj" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#d97706" />
              </linearGradient>
            </defs>

            {/* Background grid markings */}
            <line x1="0" y1="270" x2="920" y2="270" stroke="#334155" strokeDasharray="4 4" />

            {/* MAIN SCALE (Fixed Body) */}
            <g id="main-scale">
              {/* Main beam bar */}
              <rect x="30" y="80" width="860" height="70" rx="4" fill="url(#metalBody)" stroke="#475569" strokeWidth="2" />

              {/* Fixed Left Jaw */}
              <path
                d="M 30 80 L 140 80 L 140 250 L 115 250 L 70 150 L 30 150 Z"
                fill="url(#metalBody)"
                stroke="#334155"
                strokeWidth="2"
              />

              {/* Main Scale Millimeter / Centimeter Markings */}
              {Array.from({ length: maxMm + 1 }).map((_, mm) => {
                const x = originX + mm * pxPerMm;
                const isCm = mm % 10 === 0;
                const isHalfCm = mm % 5 === 0 && !isCm;
                const tickHeight = isCm ? 32 : isHalfCm ? 22 : 14;

                return (
                  <g key={mm}>
                    <line
                      x1={x}
                      y1="80"
                      x2={x}
                      y2={80 + tickHeight}
                      stroke="#0f172a"
                      strokeWidth={isCm ? 2 : 1.2}
                    />
                    {isCm && (
                      <text
                        x={x}
                        y="126"
                        textAnchor="middle"
                        fontSize="12"
                        fontWeight="bold"
                        fill="#0f172a"
                        fontFamily="monospace"
                      >
                        {mm / 10}
                      </text>
                    )}
                  </g>
                );
              })}
              <text x="840" y="126" fontSize="11" fontWeight="bold" fill="#1e293b" fontFamily="monospace">
                cm
              </text>
            </g>

            {/* TEST OBJECT (Sandwiched between jaws) */}
            {rawPosition > 0.5 && (
              <g id="measured-object">
                <rect
                  x={originX}
                  y="150"
                  width={sliderOffset}
                  height="75"
                  rx="6"
                  fill="url(#cylinderObj)"
                  stroke="#b45309"
                  strokeWidth="2"
                  opacity="0.95"
                />
                <text
                  x={originX + sliderOffset / 2}
                  y="192"
                  textAnchor="middle"
                  fontSize="12"
                  fontWeight="bold"
                  fill="#78350f"
                >
                  {isBn ? 'বস্তু' : 'Object'}
                </text>
                <text
                  x={originX + sliderOffset / 2}
                  y="208"
                  textAnchor="middle"
                  fontSize="11"
                  fontWeight="bold"
                  fill="#78350f"
                  fontFamily="monospace"
                >
                  {objectWidthMm.toFixed(2)} mm
                </text>
              </g>
            )}

            {/* MOVABLE JAW & VERNIER SCALE (Moves by sliderOffset) */}
            <g
              id="sliding-vernier"
              transform={`translate(${sliderOffset}, 0)`}
              className="transition-transform duration-75"
            >
              {/* Sliding Upper & Lower Jaw */}
              <path
                d={`M ${originX} 65 L ${originX + 160} 65 L ${originX + 160} 150 L ${originX + 50} 150 L ${originX + 25} 250 L ${originX} 250 Z`}
                fill="url(#metalSlide)"
                stroke="#1e293b"
                strokeWidth="2"
              />

              {/* Vernier Window Cutout */}
              <rect
                x={originX + 5}
                y="80"
                width={140}
                height="38"
                fill="#f8fafc"
                stroke="#64748b"
                strokeWidth="1.5"
                rx="2"
              />

              {/* Vernier scale ticks */}
              {Array.from({ length: vernierDivisions + 1 }).map((_, vIdx) => {
                // In a metric vernier caliper, n divisions equal (n - 1) mm on the main scale.
                // Distance of vIdx-th tick from Vernier 0:
                // each vernier division = 1mm - VC
                const vernierDivSpacingMm = 1 - vc;
                const vx = originX + 10 + vIdx * vernierDivSpacingMm * pxPerMm;
                const isKeyTick = vIdx === 0 || vIdx === vernierDivisions || vIdx === vernierDivisions / 2;
                const isCoinciding = vIdx === vernierCoincidence;

                return (
                  <g key={vIdx}>
                    <line
                      x1={vx}
                      y1="80"
                      x2={vx}
                      y2={80 + (isKeyTick ? 18 : 12)}
                      stroke={isCoinciding ? '#dc2626' : '#0f172a'}
                      strokeWidth={isCoinciding ? 2.5 : 1.2}
                    />
                    {isKeyTick && (
                      <text
                        x={vx}
                        y="112"
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#0f172a"
                        fontFamily="monospace"
                      >
                        {vIdx}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Coincidence Alignment Indicator Line (Laser highlight) */}
              <line
                x1={originX + 10 + vernierCoincidence * (1 - vc) * pxPerMm}
                y1="50"
                x2={originX + 10 + vernierCoincidence * (1 - vc) * pxPerMm}
                y2="145"
                stroke="#10b981"
                strokeWidth="2"
                strokeDasharray="3 3"
              />
              <circle
                cx={originX + 10 + vernierCoincidence * (1 - vc) * pxPerMm}
                cy="48"
                r="4"
                fill="#10b981"
              />
            </g>
          </svg>
        </div>

        {/* Live Reading HUD Overlay */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">{isBn ? 'ভার্নিয়ার সমপাতন (V):' : 'Vernier Coincidence (V):'}</span>
            <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
              {isBn ? toBengaliNumber(vernierCoincidence) : vernierCoincidence}
            </span>
            <span className="text-slate-500 text-[11px]">
              {isBn ? `(সবচেয়ে নিখুঁতভাবে মিলে যাওয়া দাগ)` : `(Best aligned mark)`}
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono">
            <span className="text-slate-400">{isBn ? 'সঠিক পাঠ:' : 'Calibrated Reading:'}</span>
            <span className="text-base font-extrabold text-amber-400">
              {totalLength.toFixed(2)} mm
            </span>
          </div>
        </div>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Slider 1: Object Width */}
        <Card className="p-4 border-border/80 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              {isBn ? 'বস্তুর দৈর্ঘ্য পরিবর্তন করুন' : 'Adjust Object Thickness / Length'}
            </label>
            <span className="font-mono text-xs font-bold text-primary">
              {objectWidthMm.toFixed(1)} mm
            </span>
          </div>

          <input
            type="range"
            min="0"
            max="45"
            step="0.1"
            value={objectWidthMm}
            onChange={(e) => setObjectWidthMm(parseFloat(e.target.value))}
            className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
          />

          <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
            <span>0 mm</span>
            <span>22.5 mm</span>
            <span>45 mm</span>
          </div>
        </Card>

        {/* Slider 2: Vernier Scale Type & Zero Error */}
        <Card className="p-4 border-border/80 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              {isBn ? 'স্কেলের ধরণ ও যান্ত্রিক ত্রুটি' : 'Scale Divisions & Zero Error'}
            </label>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setVernierDivisions(10)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                  vernierDivisions === 10
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-surface-2 text-muted-foreground border-border'
                }`}
              >
                10 ভাগ (VC 0.1)
              </button>
              <button
                onClick={() => setVernierDivisions(20)}
                className={`text-[11px] px-2 py-0.5 rounded font-medium border ${
                  vernierDivisions === 20
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-surface-2 text-muted-foreground border-border'
                }`}
              >
                20 ভাগ (VC 0.05)
              </button>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-muted-foreground">
                {isBn ? 'যান্ত্রিক ত্রুটি (e):' : 'Zero Error (e):'}
              </span>
              <span className="font-mono font-medium">
                {zeroErrorMm > 0 ? `+${zeroErrorMm.toFixed(1)}` : zeroErrorMm.toFixed(1)} mm
              </span>
            </div>
            <input
              type="range"
              min="-0.4"
              max="0.4"
              step="0.1"
              value={zeroErrorMm}
              onChange={(e) => setZeroErrorMm(parseFloat(e.target.value))}
              className="w-full accent-primary h-1.5 bg-surface-2 rounded-lg cursor-pointer"
            />
          </div>
        </Card>
      </div>

      {/* Live NCTB Formula Breakdown Card */}
      <Card className="p-5 border-border/80 bg-gradient-to-r from-card via-card to-primary/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>{isBn ? 'বোর্ড পাঠ্যবইয়ের সূত্রানুসারে হিসাব' : 'NCTB Live Formula Breakdown'}</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            L = M + (V × VC) - (±e)
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
          <div className="p-2.5 rounded-xl bg-surface-1/70 border border-border/60">
            <div className="text-[11px] text-muted-foreground">{isBn ? 'প্রধান স্কেল পাঠ (M)' : 'Main Scale (M)'}</div>
            <div className="text-sm sm:text-base font-mono font-bold text-foreground mt-0.5">
              {mainScaleReading} mm
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-1/70 border border-border/60">
            <div className="text-[11px] text-muted-foreground">{isBn ? 'ভার্নিয়ার সমপাতন (V)' : 'Coincidence (V)'}</div>
            <div className="text-sm sm:text-base font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
              {vernierCoincidence}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-surface-1/70 border border-border/60">
            <div className="text-[11px] text-muted-foreground">{isBn ? 'ভার্নিয়ার ধ্রুবক (VC)' : 'Constant (VC)'}</div>
            <div className="text-sm sm:text-base font-mono font-bold text-primary mt-0.5">
              {vc} mm
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/25">
            <div className="text-[11px] text-primary font-semibold">{isBn ? 'চূড়ান্ত মান (L)' : 'Final Length (L)'}</div>
            <div className="text-sm sm:text-base font-mono font-extrabold text-foreground mt-0.5">
              {totalLength.toFixed(2)} mm
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
