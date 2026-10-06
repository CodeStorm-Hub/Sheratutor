'use client';

import React, { useState } from 'react';
import {
  Sun,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function MirrorRaySimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Mirror type: 'concave' (অবতল) or 'convex' (উত্তল)
  const [mirrorType, setMirrorType] = useState<'concave' | 'convex'>('concave');

  // Focal length: positive for concave, negative for convex in standard convention
  const fMagnitude = 15; // 15 cm
  const f = mirrorType === 'concave' ? fMagnitude : -fMagnitude;
  const cDist = 2 * fMagnitude; // 30 cm

  // Object distance from pole: u (always positive real object)
  const [objectDistU, setObjectDistU] = useState<number>(25); // cm
  const objectHeight = 25; // px

  // Mirror formula: 1/u + 1/v = 1/f => 1/v = 1/f - 1/u => v = (u*f) / (u - f)
  const isAtFocus = Math.abs(objectDistU - f) < 0.2;
  const imageDistV = isAtFocus ? 9999 : (objectDistU * f) / (objectDistU - f);

  // Magnification: m = -v / u
  const magnification = isAtFocus ? 999 : -imageDistV / objectDistU;
  const imageHeight = -objectHeight * magnification;

  const isRealImage = imageDistV > 0 && mirrorType === 'concave';
  const isVirtualImage = imageDistV < 0 || mirrorType === 'convex';

  // SVG coordinate system:
  // Pole P is at (500, 120)
  // Concave: Left is real space (x < 500), Right is behind mirror (x > 500)
  const poleX = 500;
  const axisY = 120;
  const pxPerCm = 8;

  // Object position
  const objX = poleX - objectDistU * pxPerCm;
  const objTopY = axisY - objectHeight;

  // Focus & Center of Curvature
  const focusX = mirrorType === 'concave' ? poleX - fMagnitude * pxPerCm : poleX + fMagnitude * pxPerCm;
  const centerCurvX = mirrorType === 'concave' ? poleX - cDist * pxPerCm : poleX + cDist * pxPerCm;

  // Image position
  const imgX = mirrorType === 'concave'
    ? (imageDistV > 0 ? poleX - imageDistV * pxPerCm : poleX + Math.abs(imageDistV) * pxPerCm)
    : poleX + Math.abs(imageDistV) * pxPerCm;
  const imgTopY = axisY + imageHeight;

  return (
    <div className="space-y-6">
      {/* Mirror Type Selector */}
      <div className="flex items-center gap-2 border-b border-border/80 pb-2">
        <button
          onClick={() => {
            setMirrorType('concave');
            setObjectDistU(25);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mirrorType === 'concave'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '১. অবতল দর্পণ (Concave Mirror - f > 0)' : '1. Concave Mirror (f > 0)'}
        </button>
        <button
          onClick={() => {
            setMirrorType('convex');
            setObjectDistU(20);
          }}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
            mirrorType === 'convex'
              ? 'bg-primary text-primary-foreground shadow-xs'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {isBn ? '২. উত্তল দর্পণ (Convex Mirror - f < 0)' : '2. Convex Mirror (f < 0)'}
        </button>
      </div>

      {/* Ray Tracing SVG Stage */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
              {isBn
                ? mirrorType === 'concave'
                  ? 'অবতল দর্পণে রশ্মিচিত্র'
                  : 'উত্তল দর্পণে রশ্মিচিত্র'
                : 'Spherical Mirror Ray Tracing'}
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              f = {fMagnitude} cm, C = {cDist} cm
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Badge
              variant="secondary"
              className={`font-semibold ${
                isRealImage
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              {isAtFocus
                ? isBn
                  ? 'অসীম দূরত্বে প্রতিবিম্ব'
                  : 'Image at Infinity'
                : isRealImage
                ? isBn
                  ? 'বাস্তব ও উল্টো প্রতিবিম্ব'
                  : 'Real & Inverted Image'
                : isBn
                ? 'অবাস্তব ও সোজা প্রতিবিম্ব'
                : 'Virtual & Erect Image'}
            </Badge>
          </div>
        </div>

        {/* Ray Tracing SVG Canvas */}
        <div className="overflow-x-auto scrollbar-thin">
          <svg viewBox="0 0 760 250" className="w-full min-w-[650px] h-[210px]">
            {/* Principal Axis Line */}
            <line x1="20" y1={axisY} x2="740" y2={axisY} stroke="#475569" strokeWidth="1.5" />

            {/* CURVED MIRROR SURFACE */}
            {mirrorType === 'concave' ? (
              <g>
                <path
                  d={`M ${poleX} 30 Q ${poleX - 30} ${axisY} ${poleX} 210`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                />
                {/* Silvering hatched lines behind mirror */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={i}
                    x1={poleX + 2}
                    y1={45 + i * 18}
                    x2={poleX + 12}
                    y2={35 + i * 18}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            ) : (
              <g>
                <path
                  d={`M ${poleX} 30 Q ${poleX + 30} ${axisY} ${poleX} 210`}
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="3.5"
                />
                {/* Silvering hatched lines */}
                {Array.from({ length: 9 }).map((_, i) => (
                  <line
                    key={i}
                    x1={poleX - 12}
                    y1={35 + i * 18}
                    x2={poleX - 2}
                    y2={45 + i * 18}
                    stroke="#64748b"
                    strokeWidth="1.5"
                  />
                ))}
              </g>
            )}

            {/* POLE (P) */}
            <circle cx={poleX} cy={axisY} r="3" fill="#ffffff" />
            <text x={poleX - 6} y={axisY + 16} fontSize="10" fill="#94a3b8" fontFamily="monospace">
              P
            </text>

            {/* FOCUS (F) */}
            <circle cx={focusX} cy={axisY} r="3.5" fill="#eab308" />
            <text x={focusX} y={axisY + 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#eab308" fontFamily="monospace">
              F
            </text>

            {/* CENTER OF CURVATURE (C) */}
            <circle cx={centerCurvX} cy={axisY} r="3.5" fill="#f97316" />
            <text x={centerCurvX} y={axisY + 16} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#f97316" fontFamily="monospace">
              C
            </text>

            {/* OBJECT (Upward Blue Arrow) */}
            <g>
              <line x1={objX} y1={axisY} x2={objX} y2={objTopY} stroke="#3b82f6" strokeWidth="3" />
              <polygon points={`${objX},${objTopY - 4} ${objX - 4},${objTopY + 4} ${objX + 4},${objTopY + 4}`} fill="#3b82f6" />
              <text x={objX} y={objTopY - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill="#60a5fa">
                {isBn ? 'লক্ষ্যবস্তু' : 'Object'}
              </text>
            </g>

            {/* IMAGE (Arrow) */}
            {!isAtFocus && (
              <g>
                <line x1={imgX} y1={axisY} x2={imgX} y2={imgTopY} stroke={isRealImage ? '#10b981' : '#f59e0b'} strokeWidth="2.5" strokeDasharray={isVirtualImage ? '4 3' : 'none'} />
                <polygon
                  points={
                    imageHeight < 0
                      ? `${imgX},${imgTopY + 4} ${imgX - 4},${imgTopY - 4} ${imgX + 4},${imgTopY - 4}`
                      : `${imgX},${imgTopY - 4} ${imgX - 4},${imgTopY + 4} ${imgX + 4},${imgTopY + 4}`
                  }
                  fill={isRealImage ? '#10b981' : '#f59e0b'}
                />
                <text x={imgX} y={imageHeight < 0 ? imgTopY + 14 : imgTopY - 8} textAnchor="middle" fontSize="10" fontWeight="bold" fill={isRealImage ? '#34d399' : '#fbbf24'}>
                  {isBn ? 'প্রতিবিম্ব' : 'Image'}
                </text>
              </g>
            )}

            {/* RAY 1: Parallel to Principal Axis -> Passes through/diverges from Focus */}
            <line x1={objX} y1={objTopY} x2={poleX - 5} y2={objTopY} stroke="#60a5fa" strokeWidth="1.5" />
            {mirrorType === 'concave' ? (
              <line x1={poleX - 5} y1={objTopY} x2={focusX - 150} y2={axisY + (axisY - objTopY) * 1.5} stroke="#60a5fa" strokeWidth="1.5" />
            ) : (
              <g>
                <line x1={poleX} y1={objTopY} x2={focusX} y2={axisY} stroke="#60a5fa" strokeWidth="1" strokeDasharray="3 3" />
                <line x1={poleX} y1={objTopY} x2={poleX - 120} y2={objTopY - 50} stroke="#60a5fa" strokeWidth="1.5" />
              </g>
            )}

            {/* RAY 2: Towards Pole -> Reflects at equal angle */}
            <line x1={objX} y1={objTopY} x2={poleX} y2={axisY} stroke="#34d399" strokeWidth="1.5" />
            <line x1={poleX} y1={axisY} x2={poleX - 180} y2={axisY + (axisY - objTopY) * 1.2} stroke="#34d399" strokeWidth="1.5" />
          </svg>
        </div>

        {/* Live Mathematical Telemetry */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'বস্তুর দূরত্ব (u)' : 'Object Distance (u)'}</span>
            <span className="text-sm font-bold text-blue-400">{objectDistU} cm</span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'প্রতিবিম্বের দূরত্ব (v)' : 'Image Distance (v)'}</span>
            <span className="text-sm font-bold text-emerald-400">
              {isAtFocus ? '∞ (Infinity)' : `${imageDistV.toFixed(1)} cm`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'বিবর্ধন (m = -v/u)' : 'Magnification (m)'}</span>
            <span className="text-sm font-bold text-amber-400">
              {isAtFocus ? '∞' : `${Math.abs(magnification).toFixed(2)}x`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'প্রতিবিম্বের প্রকৃতি' : 'Image Nature'}</span>
            <span className="text-xs font-bold text-cyan-400 truncate">
              {isRealImage ? (isBn ? 'বাস্তব ও উল্টো' : 'Real & Inverted') : (isBn ? 'অবাস্তব ও সোজা' : 'Virtual & Erect')}
            </span>
          </div>
        </div>
      </div>

      {/* Object Distance Slider */}
      <Card className="p-5 border-border/80 bg-card space-y-3">
        <div className="flex justify-between items-center">
          <label className="text-xs font-semibold text-foreground">
            {isBn ? 'দর্পণ থেকে লক্ষ্যবস্তুর দূরত্ব পরিবর্তন করুন (u)' : 'Adjust Object Position (u)'}
          </label>
          <span className="font-mono text-xs font-bold text-primary">
            u = {objectDistU} cm
          </span>
        </div>
        <input
          type="range"
          min="5"
          max="45"
          step="1"
          value={objectDistU}
          onChange={(e) => setObjectDistU(parseFloat(e.target.value))}
          className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
          <span>5 cm (ফোকাসের ভেতর: অবাস্তব)</span>
          <span className="text-amber-500 font-bold">F (15 cm)</span>
          <span className="text-orange-500 font-bold">C (30 cm: সমআকার)</span>
          <span>45 cm (C এর বাইরে: খর্বিত)</span>
        </div>
      </Card>
    </div>
  );
}
