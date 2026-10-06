'use client';

import React, { useState } from 'react';
import {
  Flame,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Thermometer,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface MetalMaterial {
  nameBn: string;
  nameEn: string;
  alpha: number; // K^-1 or °C^-1
  color: string;
}

const METALS: Record<string, MetalMaterial> = {
  copper: {
    nameBn: 'তামা (Copper)',
    nameEn: 'Copper',
    alpha: 16.7e-6,
    color: '#f97316',
  },
  iron: {
    nameBn: 'লোহা (Iron)',
    nameEn: 'Iron',
    alpha: 11.5e-6,
    color: '#94a3b8',
  },
  brass: {
    nameBn: 'পিতল (Brass)',
    nameEn: 'Brass',
    alpha: 19.0e-6,
    color: '#eab308',
  },
  invar: {
    nameBn: 'ইনভার (Invar alloy)',
    nameEn: 'Invar',
    alpha: 0.9e-6,
    color: '#06b6d4',
  },
};

export function ThermalExpansionSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 'expansion' (Solid Linear Expansion) or 'calorimetry' (Q = msΔθ)
  const [activeTab, setActiveTab] = useState<'expansion' | 'calorimetry'>('expansion');

  // Expansion parameters
  const [selectedMetal, setSelectedMetal] = useState<string>('copper');
  const [initialLengthM, setInitialLengthM] = useState<number>(2.0); // 2 meters
  const [temp1C, setTemp1C] = useState<number>(20); // 20 °C
  const [temp2C, setTemp2C] = useState<number>(100); // 100 °C

  const metal = METALS[selectedMetal] || METALS.copper;
  const deltaTheta = Math.max(0, temp2C - temp1C);
  // ΔL = L0 * alpha * Δθ (in meters)
  const deltaLMeters = initialLengthM * metal.alpha * deltaTheta;
  const deltaLMm = deltaLMeters * 1000; // in mm
  const finalLengthM = initialLengthM + deltaLMeters;

  // Calorimetry parameters
  const [waterMassKg, setWaterMassKg] = useState<number>(0.5); // 0.5 kg
  const [substanceSpecificHeat, setSubstanceSpecificHeat] = useState<number>(4200); // Water = 4200 J/(kg*K)
  const [calorimetryDeltaT, setCalorimetryDeltaT] = useState<number>(30); // 30 °C change

  // Q = m * s * Δθ
  const heatEnergyJoules = waterMassKg * substanceSpecificHeat * calorimetryDeltaT;
  const heatEnergyKj = heatEnergyJoules / 1000;

  // Visual expansion scale: exaggerate deltaL visually so it is visible to students
  const visualExtraWidth = Math.min(120, deltaLMm * 30);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => setActiveTab('expansion')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'expansion'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '১. কঠিনের দৈর্ঘ্য প্রসারণ (ΔL = L₀αΔθ)' : '1. Linear Thermal Expansion'}
        </button>
        <button
          onClick={() => setActiveTab('calorimetry')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'calorimetry'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '২. গৃহীত বা বর্জিত তাপ (Q = msΔθ)' : '2. Calorimetry & Specific Heat'}
        </button>
      </div>

      {activeTab === 'expansion' ? (
        /* EXPANSION TAB */
        <div className="space-y-6">
          {/* Stage */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
            <div className="flex items-center justify-between mb-4">
              <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
                {isBn ? 'ধাতব দণ্ডের দৈর্ঘ্য প্রসারণ' : 'Metal Rod Expansion'}
              </Badge>
              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-slate-400">Δθ = {deltaTheta}°C</span>
                <span className="text-amber-400 font-bold">
                  ΔL = {deltaLMm.toFixed(3)} mm
                </span>
              </div>
            </div>

            {/* SVG Visual Rod with Flame */}
            <div className="overflow-x-auto scrollbar-thin">
              <svg viewBox="0 0 740 220" className="w-full min-w-[620px] h-[190px]">
                <defs>
                  <linearGradient id="rodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={metal.color} />
                    <stop offset="100%" stopColor="#1e293b" />
                  </linearGradient>
                </defs>

                {/* Fixed Wall on Left */}
                <rect x="40" y="40" width="20" height="130" rx="2" fill="#475569" stroke="#334155" />
                {Array.from({ length: 6 }).map((_, i) => (
                  <line key={i} x1="30" y1={55 + i * 20} x2="40" y2={45 + i * 20} stroke="#64748b" strokeWidth="2" />
                ))}

                {/* Base Metal Rod */}
                <rect
                  x="60"
                  y="80"
                  width="460"
                  height="36"
                  rx="4"
                  fill="url(#rodGrad)"
                  stroke="#475569"
                  strokeWidth="2"
                />

                {/* Expanded Section (Glowing Amber Extension) */}
                {deltaLMm > 0.05 && (
                  <g>
                    <rect
                      x="520"
                      y="80"
                      width={visualExtraWidth}
                      height="36"
                      rx="4"
                      fill="#f59e0b"
                      opacity="0.9"
                      stroke="#d97706"
                      strokeWidth="2"
                      className="animate-pulse"
                    />
                    <line x1="520" y1="65" x2={520 + visualExtraWidth} y2="65" stroke="#f59e0b" strokeWidth="2" />
                    <text
                      x={520 + visualExtraWidth / 2}
                      y="58"
                      textAnchor="middle"
                      fontSize="10"
                      fontWeight="bold"
                      fill="#fef08a"
                      fontFamily="monospace"
                    >
                      +ΔL
                    </text>
                  </g>
                )}

                {/* Micrometer Indicator on the Right */}
                <g transform={`translate(${520 + visualExtraWidth}, 65)`}>
                  <line x1="0" y1="0" x2="0" y2="70" stroke="#ef4444" strokeWidth="2" strokeDasharray="3 3" />
                  <polygon points="0,75 -6,85 6,85" fill="#ef4444" />
                  <rect x="10" y="10" width="130" height="45" rx="6" fill="#0f172a" stroke="#334155" />
                  <text x="75" y="28" textAnchor="middle" fontSize="10" fill="#94a3b8" fontFamily="monospace">
                    {isBn ? 'প্রসারণ পাঠ' : 'Extension'}
                  </text>
                  <text x="75" y="46" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#38bdf8" fontFamily="monospace">
                    +{deltaLMm.toFixed(3)} mm
                  </text>
                </g>

                {/* Burner Flame Under Rod */}
                <g transform="translate(260, 125)">
                  <ellipse cx="25" cy="30" rx="16" ry="24" fill="#ea580c" opacity="0.8" />
                  <ellipse cx="25" cy="32" rx="10" ry="16" fill="#facc15" opacity="0.9" />
                  <text x="25" y="65" textAnchor="middle" fontSize="10" fill="#fdba74">
                    🔥 {temp2C}°C
                  </text>
                </g>
              </svg>
            </div>

            {/* Telemetry Strip */}
            <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'আদি দৈর্ঘ্য (L₀)' : 'Initial Length (L₀)'}</span>
                <span className="text-sm font-bold text-white">{initialLengthM} m</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'দৈর্ঘ্য প্রসারণ সহগ (α)' : 'Coeff. of Expansion (α)'}</span>
                <span className="text-sm font-bold text-amber-400">{(metal.alpha * 1e6).toFixed(1)} × 10⁻⁶ /K</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'দৈর্ঘ্য বৃদ্ধি (ΔL)' : 'Total Extension (ΔL)'}</span>
                <span className="text-sm font-bold text-emerald-400">{deltaLMm.toFixed(3)} mm</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'চূড়ান্ত দৈর্ঘ্য (L)' : 'Final Length (L)'}</span>
                <span className="text-sm font-bold text-cyan-400">{finalLengthM.toFixed(5)} m</span>
              </div>
            </div>
          </div>

          {/* Control Sliders Panel */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Metal Selector */}
            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <span className="text-xs font-bold text-foreground block">
                {isBn ? 'ধাতব উপাদান নির্বাচন' : 'Select Metal Rod'}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(METALS).map(([key, item]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedMetal(key)}
                    className={`text-xs p-2 rounded-xl border text-left transition-all ${
                      selectedMetal === key
                        ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                        : 'bg-surface-2 border-border text-muted-foreground'
                    }`}
                  >
                    <span className="font-semibold block truncate">{isBn ? item.nameBn : item.nameEn}</span>
                    <span className="text-[10px] opacity-80 font-mono">{(item.alpha * 1e6).toFixed(1)}×10⁻⁶</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Temperature T1 and T2 */}
            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'চূড়ান্ত তাপমাত্রা (θ₂)' : 'Final Temperature (θ₂)'}
                </label>
                <span className="font-mono text-xs font-bold text-rose-500">
                  {temp2C} °C
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="250"
                step="5"
                value={temp2C}
                onChange={(e) => setTemp2C(parseFloat(e.target.value))}
                className="w-full accent-rose-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>20 °C</span>
                <span>135 °C</span>
                <span>250 °C</span>
              </div>
            </Card>

            {/* Initial Length */}
            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'আদি দৈর্ঘ্য (L₀)' : 'Initial Length (L₀)'}
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {initialLengthM} m
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="10"
                step="0.5"
                value={initialLengthM}
                onChange={(e) => setInitialLengthM(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0.5 m</span>
                <span>5.0 m</span>
                <span>10.0 m</span>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* CALORIMETRY TAB */
        <div className="space-y-6">
          <Card className="p-6 border-border/80 bg-slate-950 text-white space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Flame className="size-4 text-amber-400" />
                  <span>{isBn ? 'ক্যালরিমিতি ও তাপীয় শক্তি ক্যালকুলেটর' : 'Specific Heat & Thermal Energy'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? 'তাপমাত্রা বাড়াতে বা কমাতে প্রয়োজনীয় তাপশক্তি: Q = msΔθ' : 'Thermal energy absorbed or released: Q = msΔθ'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-mono">Q (Thermal Energy)</div>
                <div className="text-2xl font-extrabold font-mono text-amber-400">
                  {heatEnergyKj.toFixed(1)} kJ
                </div>
              </div>
            </div>

            {/* Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'ভর (m):' : 'Mass (m):'}</span>
                  <span className="font-mono font-bold text-blue-400">{waterMassKg} kg</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="5"
                  step="0.1"
                  value={waterMassKg}
                  onChange={(e) => setWaterMassKg(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'আপেক্ষিক তাপ (s):' : 'Specific Heat (s):'}</span>
                  <span className="font-mono font-bold text-amber-400">{substanceSpecificHeat} J/(kg·K)</span>
                </div>
                <input
                  type="range"
                  min="400"
                  max="4200"
                  step="200"
                  value={substanceSpecificHeat}
                  onChange={(e) => setSubstanceSpecificHeat(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'তাপমাত্রার পরিবর্তন (Δθ):' : 'Temp Change (Δθ):'}</span>
                  <span className="font-mono font-bold text-rose-400">{calorimetryDeltaT} °C</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="80"
                  step="5"
                  value={calorimetryDeltaT}
                  onChange={(e) => setCalorimetryDeltaT(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-center">
              <RenderMathText
                text={`$$Q = ${waterMassKg}\\text{ kg} \\times ${substanceSpecificHeat}\\text{ J/(kg}\\cdot\\text{K)} \\times ${calorimetryDeltaT}\\text{ K} = ${heatEnergyJoules.toFixed(0)}\\text{ J} = ${heatEnergyKj.toFixed(2)}\\text{ kJ}$$`}
                inline={false}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
