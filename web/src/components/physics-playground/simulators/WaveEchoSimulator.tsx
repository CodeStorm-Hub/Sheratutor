'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Volume2,
  RotateCcw,
  Play,
  Pause,
  CheckCircle2,
  XCircle,
  Thermometer,
  Waves,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function WaveEchoSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mode: 'echo' (Echo Distance & Reflection) or 'waveform' (v = fλ Waveform)
  const [activeTab, setActiveTab] = useState<'echo' | 'waveform'>('echo');

  // Echo Parameters
  const [distanceD, setDistanceD] = useState<number>(18); // meters from source to wall
  const [temperatureC, setTemperatureC] = useState<number>(20); // 20 °C

  // Speed of sound: v = 332 + 0.6 * T (m/s)
  const speedOfSound = 332 + 0.6 * temperatureC;

  // Total path = 2d
  // Return time: t = 2d / v
  const returnTimeSec = (2 * distanceD) / speedOfSound;

  // Persistence of hearing threshold in humans is 0.1 seconds
  const canHearEcho = returnTimeSec >= 0.1;
  const minEchoDistanceM = (speedOfSound * 0.1) / 2;

  // Animation State for sound pulse
  const [isPulseActive, setIsPulseActive] = useState<boolean>(false);
  const [pulseProgress, setPulseProgress] = useState<number>(0); // 0 to 1 (0 to wall to source)
  const animRef = useRef<number | null>(null);

  const handleFireSound = () => {
    setIsPulseActive(true);
    setPulseProgress(0);
  };

  useEffect(() => {
    if (!isPulseActive) return;

    const startTime = performance.now();
    const durationMs = returnTimeSec * 1000;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      setPulseProgress(progress);

      if (progress < 1) {
        animRef.current = requestAnimationFrame(step);
      } else {
        setIsPulseActive(false);
      }
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPulseActive, returnTimeSec]);

  // Waveform parameters
  const [frequencyF, setFrequencyF] = useState<number>(250); // Hz
  const wavelengthLambda = speedOfSound / frequencyF; // m

  // SVG coordinates: Source at x = 80, Wall at x = 80 + (distanceD / 40) * 580
  const wallX = 80 + Math.min(600, (distanceD / 40) * 580);
  // Pulse X: 0..0.5 moves right, 0.5..1 moves left
  const currentPulseX =
    pulseProgress <= 0.5
      ? 80 + (pulseProgress * 2) * (wallX - 80)
      : wallX - ((pulseProgress - 0.5) * 2) * (wallX - 80);

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => setActiveTab('echo')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'echo'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '১. প্রতিধ্বনি ও প্রতিফলক দূরত্ব (২d = vt)' : '1. Echo Detection & Distance'}
        </button>
        <button
          onClick={() => setActiveTab('waveform')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            activeTab === 'waveform'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '২. তরঙ্গ সমীকরণ যাচাই (v = fλ)' : '2. Wave Equation (v = fλ)'}
        </button>
      </div>

      {activeTab === 'echo' ? (
        /* ECHO TAB */
        <div className="space-y-6">
          {/* Stage */}
          <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
                  {isBn ? 'প্রতিধ্বনি সিমুলেটর' : 'Echo Simulator'}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  v = {speedOfSound.toFixed(1)} m/s ({temperatureC}°C)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleFireSound}
                  disabled={isPulseActive}
                  className="gap-1.5 h-8 text-xs bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl"
                >
                  <Volume2 className="size-3.5" />
                  <span>{isBn ? 'শব্দ তৈরি করো' : 'Emit Pulse'}</span>
                </Button>
              </div>
            </div>

            {/* SVG Visual Stage */}
            <div className="overflow-x-auto scrollbar-thin">
              <svg viewBox="0 0 740 220" className="w-full min-w-[620px] h-[190px]">
                <defs>
                  <linearGradient id="wallGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#475569" />
                    <stop offset="100%" stopColor="#334155" />
                  </linearGradient>
                </defs>

                {/* Ground Line */}
                <line x1="40" y1="180" x2="700" y2="180" stroke="#334155" strokeWidth="2" strokeDasharray="6 4" />

                {/* Sound Source (Speaker / Person) */}
                <g transform="translate(60, 110)">
                  <circle cx="20" cy="20" r="14" fill="#3b82f6" />
                  <path d="M 28 12 L 40 4 L 40 36 L 28 28 Z" fill="#60a5fa" />
                  <text x="20" y="55" textAnchor="middle" fontSize="10" fill="#93c5fd">
                    {isBn ? 'শব্দের উৎস' : 'Source'}
                  </text>
                </g>

                {/* Reflecting Wall / Mountain */}
                <g transform={`translate(${wallX}, 40)`} className="transition-transform duration-100">
                  <rect x="0" y="0" width="24" height="140" rx="4" fill="url(#wallGrad)" stroke="#64748b" strokeWidth="2" />
                  {Array.from({ length: 6 }).map((_, i) => (
                    <line key={i} x1="24" y1={10 + i * 22} x2="34" y2={20 + i * 22} stroke="#64748b" strokeWidth="2" />
                  ))}
                  <text x="12" y="160" textAnchor="middle" fontSize="10" fill="#94a3b8">
                    {isBn ? 'প্রতিফলক' : 'Wall'}
                  </text>
                </g>

                {/* Distance Dimension Line */}
                <line x1="80" y1="75" x2={wallX} y2="75" stroke="#94a3b8" strokeWidth="1.5" />
                <polygon points="80,75 88,71 88,79" fill="#94a3b8" />
                <polygon points={`${wallX},75 ${wallX - 8},71 ${wallX - 8},79`} fill="#94a3b8" />
                <text x={(80 + wallX) / 2} y="68" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#f8fafc" fontFamily="monospace">
                  d = {distanceD} m
                </text>

                {/* Moving Sound Wavefront */}
                {isPulseActive && (
                  <g transform={`translate(${currentPulseX}, 130)`}>
                    <circle cx="0" cy="0" r="16" fill="none" stroke="#38bdf8" strokeWidth="3" opacity="0.8" />
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#0284c7" strokeWidth="2" opacity="0.5" />
                    <circle cx="0" cy="0" r="5" fill="#38bdf8" />
                  </g>
                )}
              </svg>
            </div>

            {/* Verdict HUD */}
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-slate-400">{isBn ? 'শব্দ ফিরে আসার সময় (t):' : 'Echo Return Time (t):'}</span>
                <span className="text-base font-bold text-white">
                  {returnTimeSec.toFixed(3)} s
                </span>
                <span className="text-slate-500 text-[11px]">
                  ({isBn ? 'শব্দানুভূতির স্থায়িত্বকাল: 0.1s' : 'Persistence threshold: 0.1s'})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className={`text-xs font-bold gap-1.5 py-1 px-3 ${
                    canHearEcho
                      ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}
                >
                  {canHearEcho ? (
                    <>
                      <CheckCircle2 className="size-3.5" />
                      <span>{isBn ? 'প্রতিধ্বনি স্পষ্ট শোনা যাবে' : 'Echo clearly audible!'}</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="size-3.5" />
                      <span>{isBn ? 'প্রতিধ্বনি শোনা যাবে না (t < 0.1s)' : 'No echo (Too close, t < 0.1s)'}</span>
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>

          {/* Controls Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'প্রতিফলকের দূরত্ব (d)' : 'Wall Distance (d)'}
                </label>
                <span className="font-mono text-xs font-bold text-primary">
                  {distanceD} m
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                step="0.5"
                value={distanceD}
                onChange={(e) => setDistanceD(parseFloat(e.target.value))}
                className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>5 m</span>
                <span className="text-amber-500 font-bold">
                  {isBn ? `ন্যূনতম: ${minEchoDistanceM.toFixed(1)}m` : `Min: ${minEchoDistanceM.toFixed(1)}m`}
                </span>
                <span>40 m</span>
              </div>
            </Card>

            <Card className="p-4 border-border/80 bg-card space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground">
                  {isBn ? 'বায়ুর তাপমাত্রা (T)' : 'Air Temperature (T)'}
                </label>
                <span className="font-mono text-xs font-bold text-amber-500">
                  {temperatureC} °C
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={temperatureC}
                onChange={(e) => setTemperatureC(parseFloat(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                <span>0 °C (332 m/s)</span>
                <span>20 °C</span>
                <span>45 °C (359 m/s)</span>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* WAVEFORM TAB */
        <div className="space-y-6">
          <Card className="p-6 border-border/80 bg-slate-950 text-white space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Waves className="size-4 text-cyan-400" />
                  <span>{isBn ? 'তরঙ্গ সমীকরণ ক্যালকুলেটর (v = fλ)' : 'Wave Equation (v = fλ)'}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {isBn ? 'শব্দের বেগ (v) = কম্পাঙ্ক (f) × তরঙ্গদৈর্ঘ্য (λ)' : 'Speed of sound = Frequency × Wavelength'}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-center font-mono">
                <div className="text-[10px] text-slate-400">λ (Wavelength)</div>
                <div className="text-2xl font-extrabold text-cyan-400">
                  {wavelengthLambda.toFixed(2)} m
                </div>
              </div>
            </div>

            {/* Slider */}
            <div className="space-y-1.5 p-4 rounded-xl bg-slate-900 border border-slate-800">
              <div className="flex justify-between text-xs">
                <span className="text-slate-400">{isBn ? 'কম্পাঙ্ক (Frequency f):' : 'Frequency (f):'}</span>
                <span className="font-mono font-bold text-emerald-400">{frequencyF} Hz</span>
              </div>
              <input
                type="range"
                min="50"
                max="1000"
                step="25"
                value={frequencyF}
                onChange={(e) => setFrequencyF(parseFloat(e.target.value))}
                className="w-full accent-cyan-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>50 Hz (শব্দ)</span>
                <span>500 Hz</span>
                <span>1000 Hz</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-center">
              <RenderMathText
                text={`$$\\lambda = \\frac{v}{f} = \\frac{${speedOfSound.toFixed(1)}\\text{ m/s}}{${frequencyF}\\text{ Hz}} = ${wavelengthLambda.toFixed(3)}\\text{ m}$$`}
                inline={false}
              />
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
