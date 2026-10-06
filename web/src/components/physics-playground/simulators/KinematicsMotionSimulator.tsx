'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  Activity,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function KinematicsMotionSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Parameters
  const [initialVelocityU, setInitialVelocityU] = useState<number>(5); // m/s
  const [accelerationA, setAccelerationA] = useState<number>(2); // m/s^2
  const [maxDuration, setMaxDuration] = useState<number>(8); // seconds

  // Animation playback state
  const [currentTimeT, setCurrentTimeT] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Derived kinematics quantities at currentTimeT
  // v = u + at (can't be negative if car stops under friction)
  const currentV = Math.max(0, initialVelocityU + accelerationA * currentTimeT);
  // s = ut + 0.5 a t^2
  const currentS = Math.max(
    0,
    initialVelocityU * currentTimeT + 0.5 * accelerationA * Math.pow(currentTimeT, 2),
  );

  // Animation Loop
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      lastTimestampRef.current = null;
      return;
    }

    const step = (now: number) => {
      if (lastTimestampRef.current === null) {
        lastTimestampRef.current = now;
      }
      const deltaSec = (now - lastTimestampRef.current) / 1000;
      lastTimestampRef.current = now;

      setCurrentTimeT((prev) => {
        const next = prev + deltaSec;
        if (next >= maxDuration) {
          setIsPlaying(false);
          return maxDuration;
        }
        return next;
      });

      animFrameRef.current = requestAnimationFrame(step);
    };

    animFrameRef.current = requestAnimationFrame(step);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, maxDuration]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentTimeT(0);
  };

  // Graphical Road scaling
  // Road width 800px representing 150 meters
  const roadLengthMeters = 140;
  const carX = Math.min(760, 40 + (currentS / roadLengthMeters) * 720);

  return (
    <div className="space-y-6">
      {/* Simulation Stage */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
        {/* Top bar controls */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
              {isBn ? 'গতি ও বেগ-সময় সিমুলেটর' : 'Kinematics & v-t Simulator'}
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              t = {currentTimeT.toFixed(2)}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-1.5 h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3.5" />
                  <span>{isBn ? 'থামাও' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  <span>{isBn ? 'স্টার্ট' : 'Start Motion'}</span>
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

        {/* 2D Track Canvas (SVG) */}
        <div className="overflow-x-auto scrollbar-thin">
          <svg
            viewBox="0 0 840 180"
            className="w-full min-w-[650px] h-[160px] sm:h-[180px]"
          >
            <defs>
              <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>
            </defs>

            {/* Road */}
            <rect x="20" y="80" width="800" height="70" rx="8" fill="url(#roadGrad)" stroke="#334155" strokeWidth="2" />

            {/* Road Lane Markings */}
            {Array.from({ length: 14 }).map((_, i) => (
              <line
                key={i}
                x1={40 + i * 55}
                y1="115"
                x2={70 + i * 55}
                y2="115"
                stroke="#64748b"
                strokeWidth="2.5"
                strokeDasharray="10 5"
              />
            ))}

            {/* Distance Markers along Road */}
            {[0, 20, 40, 60, 80, 100, 120, 140].map((m) => {
              const xPos = 40 + (m / roadLengthMeters) * 720;
              return (
                <g key={m}>
                  <line x1={xPos} y1="150" x2={xPos} y2="162" stroke="#64748b" strokeWidth="1.5" />
                  <text
                    x={xPos}
                    y="174"
                    textAnchor="middle"
                    fontSize="10"
                    fill="#94a3b8"
                    fontFamily="monospace"
                  >
                    {m}m
                  </text>
                </g>
              );
            })}

            {/* Moving Car / Vehicle */}
            <g transform={`translate(${carX}, 65)`} className="transition-transform duration-75">
              {/* Car Body */}
              <rect x="-35" y="10" width="70" height="26" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
              <path d="M -20 10 L -10 -5 L 15 -5 L 25 10 Z" fill="#60a5fa" stroke="#1d4ed8" strokeWidth="1.5" />
              {/* Windows */}
              <path d="M -16 8 L -8 -1 L 12 -1 L 20 8 Z" fill="#e0f2fe" opacity="0.8" />
              {/* Wheels */}
              <circle cx="-20" cy="36" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              <circle cx="-20" cy="36" r="3" fill="#cbd5e1" />
              <circle cx="20" cy="36" r="8" fill="#0f172a" stroke="#64748b" strokeWidth="2" />
              <circle cx="20" cy="36" r="3" fill="#cbd5e1" />
              {/* Headlights */}
              <polygon points="35,16 65,10 65,24 35,22" fill="#fef08a" opacity="0.4" />
            </g>
          </svg>
        </div>

        {/* Live Gauges Strip */}
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'অতিবাহিত সময় (t)' : 'Elapsed Time (t)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white">
              {currentTimeT.toFixed(1)} s
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'তাৎক্ষণিক বেগ (v)' : 'Velocity (v)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-amber-400">
              {currentV.toFixed(1)} m/s
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'অতিক্রান্ত দূরত্ব (s)' : 'Distance (s)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-emerald-400">
              {currentS.toFixed(1)} m
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'ত্বরণ / মন্দন (a)' : 'Acceleration (a)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-cyan-400">
              {accelerationA > 0 ? `+${accelerationA}` : accelerationA} m/s²
            </span>
          </div>
        </div>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Slider 1: Initial Velocity (u) */}
        <Card className="p-4 border-border/80 bg-card space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              {isBn ? 'আদিবেগ (u)' : 'Initial Velocity (u)'}
            </label>
            <span className="font-mono text-xs font-bold text-primary">
              {initialVelocityU} m/s
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="20"
            step="1"
            value={initialVelocityU}
            disabled={isPlaying}
            onChange={(e) => {
              setInitialVelocityU(parseFloat(e.target.value));
              setCurrentTimeT(0);
            }}
            className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0 m/s (স্থির)</span>
            <span>10 m/s</span>
            <span>20 m/s</span>
          </div>
        </Card>

        {/* Slider 2: Acceleration (a) */}
        <Card className="p-4 border-border/80 bg-card space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              {isBn ? 'সুষম ত্বরণ / মন্দন (a)' : 'Acceleration (a)'}
            </label>
            <span className="font-mono text-xs font-bold text-primary">
              {accelerationA > 0 ? `+${accelerationA}` : accelerationA} m/s²
            </span>
          </div>
          <input
            type="range"
            min="-3"
            max="6"
            step="0.5"
            value={accelerationA}
            disabled={isPlaying}
            onChange={(e) => {
              setAccelerationA(parseFloat(e.target.value));
              setCurrentTimeT(0);
            }}
            className="w-full accent-primary h-2 bg-surface-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>-3 (মন্দন)</span>
            <span>0 (সুষম বেগ)</span>
            <span>+6 (ত্বরণ)</span>
          </div>
        </Card>

        {/* Timeline Scrubber */}
        <Card className="p-4 border-border/80 bg-card space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-foreground">
              {isBn ? 'সময় স্ক্রাবার (Time Scrub)' : 'Time Scrubber (t)'}
            </label>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
              {currentTimeT.toFixed(1)} s
            </span>
          </div>
          <input
            type="range"
            min="0"
            max={maxDuration}
            step="0.1"
            value={currentTimeT}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentTimeT(parseFloat(e.target.value));
            }}
            className="w-full accent-emerald-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
            <span>0 s</span>
            <span>{maxDuration / 2} s</span>
            <span>{maxDuration} s</span>
          </div>
        </Card>
      </div>

      {/* Synchronized Live Kinematics Formula Board */}
      <Card className="p-5 border-border/80 bg-gradient-to-r from-card via-card to-primary/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>{isBn ? 'সুষম ত্বরণের ৪টি গতির সমীকরণ যাচাই' : '4 Kinematic Equations Verification'}</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            SSC Board Favorite
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-center pt-2">
          {/* Formula 1 */}
          <div className="p-3 rounded-xl bg-surface-1/70 border border-border/60 space-y-1">
            <div className="text-[11px] font-mono text-primary font-bold">v = u + at</div>
            <div className="text-xs text-muted-foreground">
              {initialVelocityU} + ({accelerationA} × {currentTimeT.toFixed(1)}) =
            </div>
            <div className="text-sm font-mono font-bold text-foreground">
              {currentV.toFixed(1)} m/s
            </div>
          </div>

          {/* Formula 2 */}
          <div className="p-3 rounded-xl bg-surface-1/70 border border-border/60 space-y-1">
            <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
              s = ut + ½at²
            </div>
            <div className="text-xs text-muted-foreground">
              {initialVelocityU}×{currentTimeT.toFixed(1)} + ½({accelerationA})({currentTimeT.toFixed(1)})² =
            </div>
            <div className="text-sm font-mono font-bold text-foreground">
              {currentS.toFixed(1)} m
            </div>
          </div>

          {/* Formula 3 */}
          <div className="p-3 rounded-xl bg-surface-1/70 border border-border/60 space-y-1">
            <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400 font-bold">
              v² = u² + 2as
            </div>
            <div className="text-xs text-muted-foreground">
              ({initialVelocityU})² + 2({accelerationA})({currentS.toFixed(1)}) =
            </div>
            <div className="text-sm font-mono font-bold text-foreground">
              {(Math.pow(initialVelocityU, 2) + 2 * accelerationA * currentS).toFixed(1)} (m/s)²
            </div>
          </div>

          {/* Formula 4 */}
          <div className="p-3 rounded-xl bg-surface-1/70 border border-border/60 space-y-1">
            <div className="text-[11px] font-mono text-violet-600 dark:text-violet-400 font-bold">
              s = ((u + v)/2) × t
            </div>
            <div className="text-xs text-muted-foreground">
              (({initialVelocityU} + {currentV.toFixed(1)}) / 2) × {currentTimeT.toFixed(1)} =
            </div>
            <div className="text-sm font-mono font-bold text-foreground">
              {(((initialVelocityU + currentV) / 2) * currentTimeT).toFixed(1)} m
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
