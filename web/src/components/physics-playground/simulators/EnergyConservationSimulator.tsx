'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Zap,
  Gauge,
  CheckCircle2,
  Sliders,
  TrendingDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function EnergyConservationSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 1) Conservation of mechanical energy (free fall), 2) Pump / Motor efficiency
  const [activeTab, setActiveTab] = useState<'conservation' | 'efficiency'>('conservation');

  // Mechanical Energy Parameters
  const [massKg, setMassKg] = useState<number>(5); // kg
  const [totalHeightH, setTotalHeightH] = useState<number>(80); // meters
  const [currentHeightH, setCurrentHeightH] = useState<number>(80); // meters from ground
  const g = 9.8; // m/s^2

  // Kinematics & Energy Calculations
  const distanceFallenX = Math.max(0, totalHeightH - currentHeightH);
  const velocityV = Math.sqrt(2 * g * distanceFallenX);
  const ep = massKg * g * currentHeightH; // Potential Energy
  const ek = 0.5 * massKg * Math.pow(velocityV, 2); // Kinetic Energy
  const totalE = massKg * g * totalHeightH; // Constant Total Energy

  // Percentages for bar chart
  const epPercent = Math.min(100, Math.max(0, (ep / totalE) * 100));
  const ekPercent = Math.min(100, Math.max(0, (ek / totalE) * 100));

  // Animation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Motor Efficiency Parameters
  const [motorPowerKw, setMotorPowerKw] = useState<number>(2.0); // 2 kW = 2000 W
  const [waterMassKg, setWaterMassKg] = useState<number>(1000); // 1000 kg (1000 liters)
  const [pumpHeightM, setPumpHeightM] = useState<number>(20); // 20 m
  const [pumpTimeSec, setPumpTimeSec] = useState<number>(120); // 120 seconds (2 mins)

  const effectiveWork = waterMassKg * g * pumpHeightM; // J
  const effectivePowerW = effectiveWork / pumpTimeSec; // W
  const inputPowerW = motorPowerKw * 1000; // W
  const efficiencyPercent = Math.min(100, (effectivePowerW / inputPowerW) * 100);
  const powerLossW = Math.max(0, inputPowerW - effectivePowerW);

  // Free fall animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      return;
    }

    const step = (now: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setCurrentHeightH((prevH) => {
        // Drop speed based on current velocity
        const dist = totalHeightH - prevH;
        const currentSpeed = Math.sqrt(2 * g * dist);
        const nextH = prevH - Math.max(5, currentSpeed) * dt;

        if (nextH <= 0) {
          setIsPlaying(false);
          return 0;
        }
        return nextH;
      });

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, totalHeightH]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentHeightH(totalHeightH);
  };

  // Ball SVG coordinate: ground is at y = 200, top is at y = 30
  const ballY = 30 + ((totalHeightH - currentHeightH) / totalHeightH) * 170;

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => setActiveTab('conservation')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'conservation'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '১. যান্ত্রিক শক্তির সংরক্ষণ (Eₚ + Eₖ = ধ্রুবক)' : '1. Conservation of Mechanical Energy'}
        </button>
        <button
          onClick={() => setActiveTab('efficiency')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'efficiency'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '২. মোটরের কর্মদক্ষতা (Efficiency η)' : '2. Motor Efficiency (η)'}
        </button>
      </div>

      {activeTab === 'conservation' ? (
        <div className="space-y-6">
          {/* Simulation Stage */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
                  {isBn ? 'মুক্তভাবে পড়ন্ত বস্তু ও শক্তি' : 'Mechanical Energy Free-Fall'}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  h = {currentHeightH.toFixed(1)}m / {totalHeightH}m
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="gap-1.5 h-8 text-xs bg-amber-600 hover:bg-amber-700 text-white rounded-xl"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="size-3.5" />
                      <span>{isBn ? 'থামাও' : 'Pause'}</span>
                    </>
                  ) : (
                    <>
                      <Play className="size-3.5" />
                      <span>{isBn ? 'পতন শুরু' : 'Drop Object'}</span>
                    </>
                  )}
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="text-xs text-slate-300 hover:text-white hover:bg-white/10 h-8 rounded-xl"
                >
                  <RotateCcw className="size-3.5 mr-1" />
                  {isBn ? 'রিসেট' : 'Reset'}
                </Button>
              </div>
            </div>

            {/* SVG Visual Stage with Dual Bar Gauges */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              {/* Left Canvas: Falling Body & Cliff */}
              <div className="md:col-span-6 flex justify-center">
                <svg viewBox="0 0 340 240" className="w-full max-w-[320px] h-[220px]">
                  <defs>
                    <linearGradient id="cliffGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#334155" />
                      <stop offset="100%" stopColor="#1e293b" />
                    </linearGradient>
                    <radialGradient id="ballShade" cx="35%" cy="35%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="100%" stopColor="#d97706" />
                    </radialGradient>
                  </defs>

                  {/* Ground */}
                  <rect x="20" y="210" width="300" height="20" rx="4" fill="#0f172a" stroke="#334155" />
                  <text x="170" y="225" textAnchor="middle" fontSize="10" fill="#64748b" fontFamily="monospace">
                    {isBn ? 'ভূমি (Ground h = 0)' : 'Ground (h = 0)'}
                  </text>

                  {/* Cliff / Height Pole with Rulers */}
                  <rect x="70" y="30" width="16" height="180" fill="url(#cliffGrad)" stroke="#475569" />
                  {/* Height markers */}
                  <line x1="86" y1="30" x2="105" y2="30" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="110" y="34" fontSize="10" fill="#94a3b8" fontFamily="monospace">
                    A ({totalHeightH}m)
                  </text>

                  <line x1="86" y1="120" x2="105" y2="120" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="110" y="124" fontSize="10" fill="#94a3b8" fontFamily="monospace">
                    B ({(totalHeightH / 2).toFixed(0)}m)
                  </text>

                  <line x1="86" y1="210" x2="105" y2="210" stroke="#94a3b8" strokeWidth="1.5" />
                  <text x="110" y="206" fontSize="10" fill="#94a3b8" fontFamily="monospace">
                    C (0m)
                  </text>

                  {/* Falling Ball */}
                  <g transform={`translate(180, ${ballY})`} className="transition-transform duration-75">
                    <circle cx="0" cy="0" r="16" fill="url(#ballShade)" stroke="#b45309" strokeWidth="2" />
                    <text x="0" y="4" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#78350f">
                      {massKg}kg
                    </text>
                  </g>
                </svg>
              </div>

              {/* Right Live Dual Energy Exchange Bars */}
              <div className="md:col-span-6 space-y-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
                <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                  <span>{isBn ? 'শক্তির আন্তঃরূপান্তর' : 'Energy Swap'}</span>
                  <span className="font-mono text-emerald-400">
                    E_total = {totalE.toFixed(0)} J
                  </span>
                </div>

                {/* Potential Energy Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-400" />
                      {isBn ? 'বিভব শক্তি (Eₚ = mgh)' : 'Potential Energy (Eₚ)'}
                    </span>
                    <span className="font-bold text-amber-400">{ep.toFixed(0)} J ({epPercent.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-75"
                      style={{ width: `${epPercent}%` }}
                    />
                  </div>
                </div>

                {/* Kinetic Energy Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-400" />
                      {isBn ? 'গতি শক্তি (Eₖ = ½mv²)' : 'Kinetic Energy (Eₖ)'}
                    </span>
                    <span className="font-bold text-emerald-400">{ek.toFixed(0)} J ({ekPercent.toFixed(0)}%)</span>
                  </div>
                  <div className="h-3.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-75"
                      style={{ width: `${ekPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">{isBn ? 'তাৎক্ষণিক বেগ (v):' : 'Velocity (v):'}</span>
                  <span className="text-white font-bold text-sm">
                    {velocityV.toFixed(1)} m/s
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Controls: Height Scrubber & Mass */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'ভূমি থেকে বর্তমান উচ্চতা (h)' : 'Height from Ground (h)'}
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {currentHeightH.toFixed(1)} m
                </span>
              </div>
              <input
                type="range"
                min="0"
                max={totalHeightH}
                step="0.5"
                value={currentHeightH}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentHeightH(parseFloat(e.target.value));
                }}
                className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0m (ভূমি)</span>
                <span>{(totalHeightH / 2).toFixed(0)}m</span>
                <span>{totalHeightH}m (শীর্ষ)</span>
              </div>
            </Card>

            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'বস্তুর ভর (m)' : 'Object Mass (m)'}
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {massKg} kg
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                step="1"
                value={massKg}
                disabled={isPlaying}
                onChange={(e) => {
                  setMassKg(parseFloat(e.target.value));
                  handleReset();
                }}
                className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>1 kg</span>
                <span>10 kg</span>
                <span>20 kg</span>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Tab 2: Motor Efficiency */
        <div className="space-y-6">
          <Card className="p-6 border-border/80 bg-slate-950 text-white space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Zap className="size-4 text-amber-400" />
                  <span>{isBn ? 'মোটরের কর্মদক্ষতা (Efficiency) ক্যালকুলেটর' : 'Electric Motor Efficiency'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? 'বোর্ড পরীক্ষায় ৪ নম্বরের সৃজনশীলে পানি তোলার মোটরের অঙ্ক প্রতি বছর আসে।' : 'Lifting water via electric pump is an SSC Board examination classic.'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400 font-mono">η (Efficiency)</div>
                <div className="text-2xl font-extrabold font-mono text-emerald-400">
                  {efficiencyPercent.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Parameter Sliders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'মোটর ক্ষমতা:' : 'Motor Rating:'}</span>
                  <span className="font-mono font-bold text-amber-400">{motorPowerKw} kW</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="5"
                  step="0.5"
                  value={motorPowerKw}
                  onChange={(e) => setMotorPowerKw(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'পানির পরিমাণ:' : 'Water Mass:'}</span>
                  <span className="font-mono font-bold text-blue-400">{waterMassKg} kg</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3000"
                  step="100"
                  value={waterMassKg}
                  onChange={(e) => setWaterMassKg(parseFloat(e.target.value))}
                  className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'উচ্চতা (h):' : 'Height (h):'}</span>
                  <span className="font-mono font-bold text-emerald-400">{pumpHeightM} m</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="50"
                  step="1"
                  value={pumpHeightM}
                  onChange={(e) => setPumpHeightM(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div className="space-y-1.5 p-3 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">{isBn ? 'সময় (t):' : 'Time (t):'}</span>
                  <span className="font-mono font-bold text-cyan-400">{pumpTimeSec} s</span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="300"
                  step="10"
                  value={pumpTimeSec}
                  onChange={(e) => setPumpTimeSec(parseFloat(e.target.value))}
                  className="w-full accent-cyan-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'মোট প্রদত্ত ক্ষমতা (P_in)' : 'Input Power (P_in)'}</span>
                <span className="text-sm font-bold text-white">{inputPowerW} W</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'কার্যকর ক্ষমতা (P_out = mgh/t)' : 'Useful Output Power'}</span>
                <span className="text-sm font-bold text-emerald-400">{effectivePowerW.toFixed(1)} W</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 block text-[11px]">{isBn ? 'নষ্ট ক্ষমতা (P_loss)' : 'Power Loss (P_loss)'}</span>
                <span className="text-sm font-bold text-rose-400">{powerLossW.toFixed(1)} W</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
