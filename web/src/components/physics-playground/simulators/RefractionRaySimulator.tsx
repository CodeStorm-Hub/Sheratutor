'use client';

import React, { useState } from 'react';
import {
  Glasses,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Sparkles,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface OpticalMedium {
  nameBn: string;
  nameEn: string;
  n: number;
  color: string;
}

const MEDIA_PRESETS: Record<string, OpticalMedium> = {
  air: {
    nameBn: 'বায়ু (Air)',
    nameEn: 'Air',
    n: 1.0,
    color: '#0f172a',
  },
  water: {
    nameBn: 'পানি (Water)',
    nameEn: 'Water',
    n: 1.33,
    color: '#0369a1',
  },
  glass: {
    nameBn: 'কাঁচ (Crown Glass)',
    nameEn: 'Glass',
    n: 1.52,
    color: '#047857',
  },
  diamond: {
    nameBn: 'হীরক (Diamond)',
    nameEn: 'Diamond',
    n: 2.42,
    color: '#6d28d9',
  },
};

export function RefractionRaySimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Medium 1 (Incident side - Top) and Medium 2 (Refracted side - Bottom)
  const [med1Key, setMed1Key] = useState<string>('air');
  const [med2Key, setMed2Key] = useState<string>('glass');

  // Angle of incidence: i (degrees)
  const [angleIncidenceDeg, setAngleIncidenceDeg] = useState<number>(45);

  const med1 = MEDIA_PRESETS[med1Key] || MEDIA_PRESETS.air;
  const med2 = MEDIA_PRESETS[med2Key] || MEDIA_PRESETS.glass;

  const n1 = med1.n;
  const n2 = med2.n;

  const iRad = (angleIncidenceDeg * Math.PI) / 180;

  // Check critical angle: only exists if n1 > n2 (denser to rarer)
  const hasCriticalAngle = n1 > n2;
  const criticalAngleDeg = hasCriticalAngle
    ? (Math.asin(n2 / n1) * 180) / Math.PI
    : null;

  // Snell's Law: n1 * sin(i) = n2 * sin(r)
  const sinR = (n1 / n2) * Math.sin(iRad);
  const isTIR = sinR > 1.0; // Total Internal Reflection occurs!
  const angleRefractionDeg = isTIR ? null : (Math.asin(sinR) * 180) / Math.PI;

  // SVG Geometry: Center point of incidence is (380, 110)
  const centerX = 380;
  const centerY = 110;
  const rayLength = 120;

  // Incident ray (comes from top-left at angle i with normal)
  const incStartX = centerX - rayLength * Math.sin(iRad);
  const incStartY = centerY - rayLength * Math.cos(iRad);

  // Partial or Total Reflected ray (exits top-right at angle i with normal)
  const reflEndX = centerX + rayLength * Math.sin(iRad);
  const reflEndY = centerY - rayLength * Math.cos(iRad);

  // Refracted ray (exits bottom-right at angle r with normal)
  const rRad = angleRefractionDeg !== null ? (angleRefractionDeg * Math.PI) / 180 : 0;
  const refrEndX = centerX + rayLength * Math.sin(rRad);
  const refrEndY = centerY + rayLength * Math.cos(rRad);

  return (
    <div className="space-y-6">
      {/* Quick Setup Presets */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-2">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {isBn ? 'স্নলের সূত্র ও সংকট কোণ ল্যাব' : 'Snell’s Law & Critical Angle Lab'}
          </Badge>
          <span className="text-xs text-muted-foreground">
            n₁ = {n1}, n₂ = {n2}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setMed1Key('glass');
              setMed2Key('air');
              setAngleIncidenceDeg(48);
            }}
            className="text-xs rounded-xl h-7 gap-1.5 hover:bg-surface-2"
          >
            <Sparkles className="size-3 text-amber-500" />
            <span>{isBn ? 'পূর্ণ অভ্যন্তরীণ প্রতিফলন ডেমো (কাঁচ → বায়ু)' : 'Demo TIR (Glass → Air)'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setMed1Key('air');
              setMed2Key('glass');
              setAngleIncidenceDeg(45);
            }}
            className="text-xs rounded-xl h-7"
          >
            <RotateCcw className="size-3 mr-1" />
            {isBn ? 'স্বাভাবিক প্রতিসরণ' : 'Standard'}
          </Button>
        </div>
      </div>

      {/* Laser Stage SVG */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400">i = {angleIncidenceDeg}°</span>
            {angleRefractionDeg !== null ? (
              <span className="text-emerald-400 font-bold">
                r = {angleRefractionDeg.toFixed(1)}°
              </span>
            ) : (
              <span className="text-rose-400 font-bold">
                {isBn ? 'প্রতিসরণ নেই (TIR)' : 'No refraction (TIR)'}
              </span>
            )}
          </div>

          <div>
            <Badge
              variant="secondary"
              className={`font-semibold text-xs ${
                isTIR
                  ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                  : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
              }`}
            >
              {isTIR
                ? isBn
                  ? '⚡ পূর্ণ অভ্যন্তরীণ প্রতিফলন (TIR)!'
                  : '⚡ Total Internal Reflection (TIR)!'
                : isBn
                ? 'স্বাভাবিক আলোর প্রতিসরণ'
                : 'Standard Refraction'}
            </Badge>
          </div>
        </div>

        {/* SVG Laser Stage */}
        <div className="overflow-x-auto scrollbar-thin">
          <svg viewBox="0 0 760 230" className="w-full min-w-[650px] h-[200px]">
            {/* Medium 1 (Top Background) */}
            <rect x="20" y="20" width="720" height="90" fill="#0f172a" opacity="0.6" />
            <text x="50" y="45" fontSize="11" fontWeight="bold" fill="#94a3b8" fontFamily="monospace">
              {isBn ? `১ম মাধ্যম: ${med1.nameBn} (n₁ = ${n1})` : `Medium 1: ${med1.nameEn} (n₁ = ${n1})`}
            </text>

            {/* Medium 2 (Bottom Background with tint) */}
            <rect x="20" y="110" width="720" height="90" fill={med2.color} opacity="0.3" />
            <text x="50" y="185" fontSize="11" fontWeight="bold" fill="#38bdf8" fontFamily="monospace">
              {isBn ? `২য় মাধ্যম: ${med2.nameBn} (n₂ = ${n2})` : `Medium 2: ${med2.nameEn} (n₂ = ${n2})`}
            </text>

            {/* Boundary Interface (বিভেদতল) */}
            <line x1="20" y1={centerY} x2="740" y2={centerY} stroke="#64748b" strokeWidth="2.5" />
            <text x="730" y={centerY - 6} textAnchor="end" fontSize="10" fill="#94a3b8">
              {isBn ? 'বিভেদতল' : 'Interface'}
            </text>

            {/* Normal Line (অভিলম্ব) */}
            <line x1={centerX} y1="30" x2={centerX} y2="190" stroke="#475569" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x={centerX + 6} y="42" fontSize="10" fill="#64748b" fontFamily="monospace">
              N (অভিলম্ব)
            </text>

            {/* Critical Angle Reference Line if available */}
            {hasCriticalAngle && criticalAngleDeg !== null && (
              <g opacity="0.4">
                <line
                  x1={centerX - rayLength * Math.sin((criticalAngleDeg * Math.PI) / 180)}
                  y1={centerY - rayLength * Math.cos((criticalAngleDeg * Math.PI) / 180)}
                  x2={centerX}
                  y2={centerY}
                  stroke="#f59e0b"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
                <text
                  x={centerX - rayLength * Math.sin((criticalAngleDeg * Math.PI) / 180) - 10}
                  y={centerY - rayLength * Math.cos((criticalAngleDeg * Math.PI) / 180)}
                  fontSize="9"
                  fill="#f59e0b"
                  fontFamily="monospace"
                >
                  θ_c ({criticalAngleDeg.toFixed(1)}°)
                </text>
              </g>
            )}

            {/* INCIDENT LASER RAY (Green) */}
            <line x1={incStartX} y1={incStartY} x2={centerX} y2={centerY} stroke="#22c55e" strokeWidth="3" />
            <circle cx={incStartX} cy={incStartY} r="4" fill="#22c55e" />
            <text x={incStartX - 10} y={incStartY - 6} fontSize="10" fontWeight="bold" fill="#4ade80">
              {isBn ? 'আপতিত রশ্মি' : 'Incident Ray'} (i={angleIncidenceDeg}°)
            </text>

            {/* REFRACTED RAY (Cyan - Only if not TIR) */}
            {!isTIR && (
              <g>
                <line x1={centerX} y1={centerY} x2={refrEndX} y2={refrEndY} stroke="#06b6d4" strokeWidth="3" />
                <circle cx={refrEndX} cy={refrEndY} r="3" fill="#06b6d4" />
                <text x={refrEndX + 10} y={refrEndY + 12} fontSize="10" fontWeight="bold" fill="#38bdf8">
                  {isBn ? 'প্রতিসরিত রশ্মি' : 'Refracted Ray'} (r={angleRefractionDeg?.toFixed(1)}°)
                </text>
              </g>
            )}

            {/* REFLECTED RAY (Red/Orange if TIR, dim yellow if partial) */}
            <g>
              <line
                x1={centerX}
                y1={centerY}
                x2={reflEndX}
                y2={reflEndY}
                stroke={isTIR ? '#f43f5e' : '#eab308'}
                strokeWidth={isTIR ? 3.5 : 1.2}
                strokeDasharray={isTIR ? 'none' : '3 3'}
                opacity={isTIR ? 1 : 0.4}
              />
              <text x={reflEndX + 8} y={reflEndY - 6} fontSize="10" fontWeight="bold" fill={isTIR ? '#f43f5e' : '#eab308'}>
                {isTIR ? (isBn ? 'পূর্ণ প্রতিফলিত রশ্মি (TIR)' : 'Total Reflected Ray') : (isBn ? 'আংশিক প্রতিফলন' : 'Partial')}
              </text>
            </g>
          </svg>
        </div>

        {/* Live HUD Readout */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'আপতন কোণ (i)' : 'Incident Angle (i)'}</span>
            <span className="text-sm font-bold text-emerald-400">{angleIncidenceDeg}°</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'প্রতিসরণ কোণ (r)' : 'Refraction Angle (r)'}</span>
            <span className="text-sm font-bold text-cyan-400">
              {angleRefractionDeg !== null ? `${angleRefractionDeg.toFixed(1)}°` : 'None (TIR)'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'সংকট কোণ (θ_c)' : 'Critical Angle (θ_c)'}</span>
            <span className="text-sm font-bold text-amber-400">
              {criticalAngleDeg !== null ? `${criticalAngleDeg.toFixed(1)}°` : 'N/A (n₁ < n₂)'}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'আপেক্ষিক প্রতিসরণাঙ্ক' : 'Relative Index ₁n₂'}</span>
            <span className="text-sm font-bold text-white">{(n2 / n1).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Control Sliders & Media Selector */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Medium 1 Picker */}
        <Card className="p-4 border-border/80 bg-card space-y-2.5">
          <span className="text-xs font-bold text-foreground block">
            {isBn ? '১ম মাধ্যম নির্বাচন (আপতিত পাশ)' : 'Medium 1 (Incident Side)'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MEDIA_PRESETS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setMed1Key(key)}
                className={`text-xs p-2 rounded-xl border text-left transition-all ${
                  med1Key === key
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-surface-2 border-border text-muted-foreground'
                }`}
              >
                <span className="font-semibold block truncate">{isBn ? item.nameBn : item.nameEn}</span>
                <span className="text-[10px] opacity-80 font-mono">n = {item.n}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Medium 2 Picker */}
        <Card className="p-4 border-border/80 bg-card space-y-2.5">
          <span className="text-xs font-bold text-foreground block">
            {isBn ? '২য় মাধ্যম নির্বাচন (প্রতিসরিত পাশ)' : 'Medium 2 (Refracted Side)'}
          </span>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(MEDIA_PRESETS).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setMed2Key(key)}
                className={`text-xs p-2 rounded-xl border text-left transition-all ${
                  med2Key === key
                    ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                    : 'bg-surface-2 border-border text-muted-foreground'
                }`}
              >
                <span className="font-semibold block truncate">{isBn ? item.nameBn : item.nameEn}</span>
                <span className="text-[10px] opacity-80 font-mono">n = {item.n}</span>
              </button>
            ))}
          </div>
        </Card>

        {/* Angle Slider */}
        <Card className="p-4 border-border/80 bg-card space-y-2.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-semibold text-foreground">
              {isBn ? 'আপতন কোণ (i)' : 'Angle of Incidence (i)'}
            </label>
            <span className="font-mono text-xs font-bold text-emerald-500">
              {angleIncidenceDeg}°
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="85"
            step="1"
            value={angleIncidenceDeg}
            onChange={(e) => setAngleIncidenceDeg(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0° (অভিলম্ব বরাবর)</span>
            <span className="text-amber-500 font-bold">
              {criticalAngleDeg !== null ? `সংকট কোণ: ${criticalAngleDeg.toFixed(1)}°` : '45°'}
            </span>
            <span>85°</span>
          </div>
        </Card>
      </div>
    </div>
  );
}
