'use client';

import React, { useState } from 'react';
import {
  RotateCcw,
  CheckCircle2,
  Waves,
  Weight,
  Layers,
  HelpCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function HydraulicPressureSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 'pascal' (Hydraulic Press) or 'archimedes' (Buoyancy Tank)
  const [activeTab, setActiveTab] = useState<'pascal' | 'archimedes'>('pascal');

  // Pascal Press Parameters
  const [appliedForceF1, setAppliedForceF1] = useState<number>(100); // N
  const [radiusR1Cm, setRadiusR1Cm] = useState<number>(4); // cm
  const [radiusR2Cm, setRadiusR2Cm] = useState<number>(20); // cm
  const [strokeDistanceL1Cm, setStrokeDistanceL1Cm] = useState<number>(25); // cm

  // Area ratio: A2 / A1 = (r2 / r1)^2
  const areaRatio = Math.pow(radiusR2Cm / radiusR1Cm, 2);
  const multipliedForceF2 = appliedForceF1 * areaRatio; // N
  const liftDistanceL2Cm = strokeDistanceL1Cm / areaRatio; // cm
  const liftableMassKg = multipliedForceF2 / 9.8;

  // Work done on both pistons:
  const work1 = appliedForceF1 * (strokeDistanceL1Cm / 100); // Joules
  const work2 = multipliedForceF2 * (liftDistanceL2Cm / 100); // Joules

  // Archimedes Tank Parameters
  const [liquidDensity, setLiquidDensity] = useState<number>(1000); // 1000 = Water, 800 = Kerosene, 1030 = Saline
  const [objectDensity, setObjectDensity] = useState<number>(700); // kg/m^3 (wood)
  const [objectVolumeCm3, setObjectVolumeCm3] = useState<number>(500); // cm^3
  const g = 9.8;

  const objectVolumeM3 = objectVolumeCm3 * 1e-6;
  const objectMassKg = objectDensity * objectVolumeM3;
  const trueWeightN = objectMassKg * g;

  // Submerged fraction:
  // If rho_obj < rho_liq -> fraction = rho_obj / rho_liq
  // Else fraction = 1.0
  const submergedRatio = Math.min(1.0, objectDensity / liquidDensity);
  const submergedVolumeM3 = objectVolumeM3 * submergedRatio;
  const buoyantForceN = submergedVolumeM3 * liquidDensity * g;
  const apparentWeightN = Math.max(0, trueWeightN - buoyantForceN);

  const floatStatus =
    objectDensity < liquidDensity
      ? 'floats'
      : objectDensity === liquidDensity
      ? 'neutral'
      : 'sinks';

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => setActiveTab('pascal')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'pascal'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '১. পাস্কেলের হাইড্রোলিক প্রেস (বল বৃদ্ধি নীতি)' : '1. Pascal’s Hydraulic Press'}
        </button>
        <button
          onClick={() => setActiveTab('archimedes')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'archimedes'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '২. আর্কিমিডিসের নীতি ও প্লবতা ট্যাংক' : '2. Archimedes Buoyancy Tank'}
        </button>
      </div>

      {activeTab === 'pascal' ? (
        /* TAB 1: PASCAL PRESS */
        <div className="space-y-6">
          {/* Hydraulic Press SVG Stage */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
                {isBn ? 'হাইড্রোলিক বল বৃদ্ধিকরণ নীতি' : 'Hydraulic Force Multiplier'}
              </Badge>
              <span className="text-xs text-amber-400 font-mono font-bold">
                {isBn ? `বল বৃদ্ধির হার: ${areaRatio.toFixed(1)} গুণ` : `Multiplier: ${areaRatio.toFixed(1)}x`}
              </span>
            </div>

            {/* SVG Press */}
            <div className="overflow-x-auto scrollbar-thin">
              <svg viewBox="0 0 740 240" className="w-full min-w-[620px] h-[210px]">
                <defs>
                  <linearGradient id="fluidGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>
                  <linearGradient id="pistonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="100%" stopColor="#64748b" />
                  </linearGradient>
                </defs>

                {/* Hydraulic Cylinder Vessel (U-Tube shape) */}
                <path
                  d="M 60 70 L 60 190 L 680 190 L 680 70 L 520 70 L 520 150 L 160 150 L 160 70 Z"
                  fill="url(#fluidGrad)"
                  stroke="#334155"
                  strokeWidth="3"
                />

                {/* Left Small Piston 1 */}
                <g transform="translate(62, 70)">
                  <rect x="0" y="0" width="96" height="24" rx="3" fill="url(#pistonGrad)" stroke="#1e293b" strokeWidth="2" />
                  <line x1="48" y1="-30" x2="48" y2="0" stroke="#f43f5e" strokeWidth="3" markerEnd="url(#arrow)" />
                  <text x="48" y="-36" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f43f5e">
                    F₁ = {appliedForceF1} N ↓
                  </text>
                  <text x="48" y="16" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">
                    r₁ = {radiusR1Cm} cm
                  </text>
                </g>

                {/* Right Massive Piston 2 */}
                <g transform="translate(522, 50)">
                  <rect x="0" y="0" width="156" height="26" rx="3" fill="url(#pistonGrad)" stroke="#1e293b" strokeWidth="2" />
                  <line x1="78" y1="0" x2="78" y2="-30" stroke="#10b981" strokeWidth="3" />
                  {/* Lifted Car Object */}
                  <rect x="28" y="-45" width="100" height="40" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
                  <text x="78" y="-20" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff">
                    🚗 {liftableMassKg.toFixed(0)} kg
                  </text>
                  <text x="78" y="-55" textAnchor="middle" fontSize="12" fontWeight="extrabold" fill="#10b981">
                    F₂ = {multipliedForceF2.toFixed(0)} N ↑
                  </text>
                  <text x="78" y="17" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#ffffff">
                    r₂ = {radiusR2Cm} cm
                  </text>
                </g>
              </svg>
            </div>

            {/* Live Telemetry Hud */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'প্রযুক্ত বল F₁' : 'Input Force F₁'}</span>
                <span className="text-sm font-bold text-rose-400">{appliedForceF1} N</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'প্রাপ্ত উর্ধ্বমুখী বল F₂' : 'Output Force F₂'}</span>
                <span className="text-sm font-bold text-emerald-400">{multipliedForceF2.toFixed(0)} N</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'উত্তোলনযোগ্য ভর' : 'Max Lift Mass'}</span>
                <span className="text-sm font-bold text-amber-400">{liftableMassKg.toFixed(1)} kg</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'শক্তির সংরক্ষণ (W₁ = W₂)' : 'Work (W₁ = W₂)'}</span>
                <span className="text-sm font-bold text-cyan-400">{work1.toFixed(1)} J</span>
              </div>
            </div>
          </div>

          {/* Control Sliders Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'প্রযুক্ত বল (F₁)' : 'Input Force (F₁)'}
                </label>
                <span className="font-mono text-xs font-bold text-rose-500">
                  {appliedForceF1} N
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={appliedForceF1}
                onChange={(e) => setAppliedForceF1(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
            </Card>

            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'ছোট পিস্টনের ব্যাসার্ধ (r₁)' : 'Piston 1 Radius (r₁)'}
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {radiusR1Cm} cm
                </span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                step="1"
                value={radiusR1Cm}
                onChange={(e) => setRadiusR1Cm(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
            </Card>

            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'বড় পিস্টনের ব্যাসার্ধ (r₂)' : 'Piston 2 Radius (r₂)'}
                </label>
                <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  {radiusR2Cm} cm
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="40"
                step="2"
                value={radiusR2Cm}
                onChange={(e) => setRadiusR2Cm(parseFloat(e.target.value))}
                className="w-full accent-emerald-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
            </Card>
          </div>
        </div>
      ) : (
        /* TAB 2: ARCHIMEDES BUOYANCY */
        <div className="space-y-6">
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
                {isBn ? 'আর্কিমিডিসের নীতি ও প্লবতা ল্যাব' : 'Archimedes Buoyancy Tank'}
              </Badge>
              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs font-bold ${
                    floatStatus === 'floats'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : floatStatus === 'neutral'
                      ? 'bg-blue-500/20 text-blue-400 border-blue-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {floatStatus === 'floats'
                    ? isBn
                      ? 'ভেসে থাকবে (ভাসন)'
                      : 'Floats on surface'
                    : floatStatus === 'neutral'
                    ? isBn
                      ? 'নিমজ্জিত অবস্থায় ভাসবে'
                      : 'Neutrally suspended'
                    : isBn
                    ? 'তলিয়ে যাবে (নিমজ্জন)'
                    : 'Sinks to bottom'}
                </Badge>
              </div>
            </div>

            {/* Liquid Tank SVG */}
            <div className="flex justify-center">
              <svg viewBox="0 0 400 220" className="w-full max-w-[380px] h-[200px]">
                <defs>
                  <linearGradient id="tankFluid" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#0284c7" stopOpacity="0.9" />
                  </linearGradient>
                </defs>

                {/* Glass Tank Container */}
                <rect x="40" y="30" width="320" height="170" rx="8" fill="url(#tankFluid)" stroke="#64748b" strokeWidth="2.5" />
                {/* Surface line */}
                <line x1="40" y1="60" x2="360" y2="60" stroke="#bae6fd" strokeWidth="2" strokeDasharray="5 3" />
                <text x="350" y="55" textAnchor="end" fontSize="10" fill="#bae6fd" fontFamily="monospace">
                  ρ = {liquidDensity} kg/m³
                </text>

                {/* Submerged / Floating Object */}
                {/* Y position depends on float status */}
                <g
                  transform={`translate(160, ${
                    floatStatus === 'floats'
                      ? 60 - (1 - submergedRatio) * 50
                      : floatStatus === 'neutral'
                      ? 100
                      : 145
                  })`}
                  className="transition-transform duration-300"
                >
                  <rect x="0" y="0" width="80" height="50" rx="4" fill="#d97706" stroke="#78350f" strokeWidth="2" />
                  <text x="40" y="24" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ffffff">
                    {objectDensity} kg/m³
                  </text>
                  <text x="40" y="38" textAnchor="middle" fontSize="9" fill="#fef3c7" fontFamily="monospace">
                    {trueWeightN.toFixed(2)} N
                  </text>
                </g>
              </svg>
            </div>

            {/* Telemetry Readings */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'বাতাসে প্রকৃত ওজন (W)' : 'True Weight (W)'}</span>
                <span className="text-sm font-bold text-white">{trueWeightN.toFixed(2)} N</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'ঊর্ধ্বমুখী প্লবতা (F_B)' : 'Buoyant Force (F_B)'}</span>
                <span className="text-sm font-bold text-emerald-400">{buoyantForceN.toFixed(2)} N</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'পানিতে আপাত ওজন' : 'Apparent Weight'}</span>
                <span className="text-sm font-bold text-amber-400">{apparentWeightN.toFixed(2)} N</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'নিমজ্জিত আয়তন' : 'Submerged %'}</span>
                <span className="text-sm font-bold text-cyan-400">{(submergedRatio * 100).toFixed(0)}%</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-border/80 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'তরলের ঘনত্ব নির্বাচন' : 'Liquid Density (ρ_liquid)'}
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {liquidDensity} kg/m³
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setLiquidDensity(1000)}
                  className={`text-xs p-2 rounded-xl border transition-all ${
                    liquidDensity === 1000
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface-2 border-border text-muted-foreground'
                  }`}
                >
                  পানি (1000)
                </button>
                <button
                  onClick={() => setLiquidDensity(800)}
                  className={`text-xs p-2 rounded-xl border transition-all ${
                    liquidDensity === 800
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface-2 border-border text-muted-foreground'
                  }`}
                >
                  কেরোসিন (800)
                </button>
                <button
                  onClick={() => setLiquidDensity(1030)}
                  className={`text-xs p-2 rounded-xl border transition-all ${
                    liquidDensity === 1030
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-surface-2 border-border text-muted-foreground'
                  }`}
                >
                  লোনা পানি (1030)
                </button>
              </div>
            </Card>

            <Card className="p-4 border-border/80 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'বস্তুর ঘনত্ব (ρ_object)' : 'Object Density (ρ_obj)'}
                </label>
                <span className="font-mono text-xs font-bold text-amber-500">
                  {objectDensity} kg/m³
                </span>
              </div>
              <input
                type="range"
                min="300"
                max="1500"
                step="50"
                value={objectDensity}
                onChange={(e) => setObjectDensity(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>300 (কাঠ)</span>
                <span>1000 (পানি)</span>
                <span>1500 (ভারী পাথর)</span>
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
