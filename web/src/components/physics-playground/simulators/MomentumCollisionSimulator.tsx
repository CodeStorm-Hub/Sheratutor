'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Sliders,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { toBengaliNumber } from '../PhysicsCatalogView';

export function MomentumCollisionSimulator() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Cart 1 parameters
  const [m1, setM1] = useState<number>(4); // kg
  const [u1, setU1] = useState<number>(6); // m/s (moves right)

  // Cart 2 parameters
  const [m2, setM2] = useState<number>(2); // kg
  const [u2, setU2] = useState<number>(-4); // m/s (moves left or stationary)

  // Collision mode: inelastic (stick together) or elastic
  const [isInelastic, setIsInelastic] = useState<boolean>(true);

  // Common final velocity after inelastic collision:
  // v = (m1*u1 + m2*u2) / (m1 + m2)
  const finalVInelastic = (m1 * u1 + m2 * u2) / (m1 + m2);

  // Elastic collision final velocities:
  // v1 = ((m1 - m2)*u1 + 2*m2*u2) / (m1 + m2)
  // v2 = ((m2 - m1)*u2 + 2*m1*u1) / (m1 + m2)
  const finalV1Elastic = ((m1 - m2) * u1 + 2 * m2 * u2) / (m1 + m2);
  const finalV2Elastic = ((m2 - m1) * u2 + 2 * m1 * u1) / (m1 + m2);

  // Initial and final total momentum:
  const initialP = m1 * u1 + m2 * u2;
  const finalP = isInelastic
    ? (m1 + m2) * finalVInelastic
    : m1 * finalV1Elastic + m2 * finalV2Elastic;

  // Kinetic energy:
  const initialEk = 0.5 * m1 * Math.pow(u1, 2) + 0.5 * m2 * Math.pow(u2, 2);
  const finalEk = isInelastic
    ? 0.5 * (m1 + m2) * Math.pow(finalVInelastic, 2)
    : 0.5 * m1 * Math.pow(finalV1Elastic, 2) + 0.5 * m2 * Math.pow(finalV2Elastic, 2);

  // Animation State
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [hasCollided, setHasCollided] = useState<boolean>(false);

  // Track positions (in px): Track width 800, collision point at center x = 400
  const initialPos1 = 120;
  const initialPos2 = 680;
  const [pos1, setPos1] = useState<number>(initialPos1);
  const [pos2, setPos2] = useState<number>(initialPos2);

  const animRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  // Reset helper
  const handleReset = () => {
    setIsPlaying(false);
    setTime(0);
    setHasCollided(false);
    setPos1(initialPos1);
    setPos2(initialPos2);
  };

  // Animation loop
  useEffect(() => {
    if (!isPlaying) {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      lastTimeRef.current = null;
      return;
    }

    const cartWidth = 70;
    const speedScale = 25; // px per m/s per second

    const step = (now: number) => {
      if (lastTimeRef.current === null) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      setTime((t) => t + dt);

      setPos1((p1) => {
        setPos2((p2) => {
          const distanceBetween = p2 - (p1 + cartWidth);

          if (distanceBetween <= 0) {
            // Collision occurs
            setHasCollided(true);
            if (isInelastic) {
              const nextP1 = p1 + finalVInelastic * speedScale * dt;
              return nextP1 + cartWidth;
            } else {
              return p2 + finalV2Elastic * speedScale * dt;
            }
          }

          // Pre-collision movement
          const nextP2 = p2 + u2 * speedScale * dt;
          return nextP2;
        });

        // Pre-collision Cart 1 movement
        if (!hasCollided) {
          return p1 + u1 * speedScale * dt;
        } else {
          return isInelastic
            ? p1 + finalVInelastic * speedScale * dt
            : p1 + finalV1Elastic * speedScale * dt;
        }
      });

      // Stop if carts run off screen
      if (pos1 > 850 || pos1 < -100 || pos2 > 850 || pos2 < -100) {
        setIsPlaying(false);
        return;
      }

      animRef.current = requestAnimationFrame(step);
    };

    animRef.current = requestAnimationFrame(step);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [isPlaying, hasCollided, isInelastic, u1, u2, finalVInelastic, finalV1Elastic, finalV2Elastic, pos1, pos2]);

  return (
    <div className="space-y-6">
      {/* Simulation Stage */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-slate-950 p-4 sm:p-6 shadow-inner select-none">
        {/* Top toolbar */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-white border-white/20 bg-white/5 font-mono text-xs">
              {isBn ? 'ভরবেগ ও সংঘর্ষ ল্যাব' : 'Momentum & Collision Lab'}
            </Badge>
            <span className="text-xs text-slate-400 font-mono">
              t = {time.toFixed(1)}s
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-1.5 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-3.5" />
                  <span>{isBn ? 'থামাও' : 'Pause'}</span>
                </>
              ) : (
                <>
                  <Play className="size-3.5" />
                  <span>{isBn ? 'সংঘর্ষ শুরু' : 'Launch'}</span>
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
          <svg viewBox="0 0 800 200" className="w-full min-w-[650px] h-[170px] sm:h-[190px]">
            <defs>
              <linearGradient id="metalTrack" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>
            </defs>

            {/* Track rail */}
            <rect x="20" y="120" width="760" height="20" rx="4" fill="url(#metalTrack)" stroke="#475569" strokeWidth="1.5" />
            <line x1="20" y1="126" x2="780" y2="126" stroke="#64748b" strokeWidth="2" strokeDasharray="6 6" />

            {/* Collision Center Line */}
            <line x1="400" y1="60" x2="400" y2="160" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="400" y="50" textAnchor="middle" fontSize="10" fill="#f87171" fontFamily="monospace">
              {isBn ? 'সংঘর্ষ বিন্দু' : 'Collision Zone'}
            </text>

            {/* CART 1 (Left - Blue) */}
            <g transform={`translate(${pos1}, 70)`} className="transition-transform duration-75">
              <rect x="0" y="0" width="70" height="42" rx="6" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="2" />
              {/* Wheels */}
              <circle cx="15" cy="46" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="55" cy="46" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Cart Label & Mass */}
              <text x="35" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">
                m₁ = {m1}kg
              </text>
              <text x="35" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#bfdbfe" fontFamily="monospace">
                {!hasCollided ? `u₁ = ${u1 > 0 ? `+${u1}` : u1} m/s` : `v₁ = ${(isInelastic ? finalVInelastic : finalV1Elastic).toFixed(1)}`}
              </text>
            </g>

            {/* CART 2 (Right - Amber) */}
            <g transform={`translate(${pos2}, 70)`} className="transition-transform duration-75">
              <rect x="0" y="0" width="70" height="42" rx="6" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
              {/* Wheels */}
              <circle cx="15" cy="46" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
              <circle cx="55" cy="46" r="6" fill="#0f172a" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Cart Label & Mass */}
              <text x="35" y="20" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffffff">
                m₂ = {m2}kg
              </text>
              <text x="35" y="34" textAnchor="middle" fontSize="9" fontWeight="bold" fill="#fef3c7" fontFamily="monospace">
                {!hasCollided ? `u₂ = ${u2 > 0 ? `+${u2}` : u2} m/s` : `v₂ = ${(isInelastic ? finalVInelastic : finalV2Elastic).toFixed(1)}`}
              </text>
            </g>
          </svg>
        </div>

        {/* Live Momentum Conservation Telemetry */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'আদি মোট ভরবেগ (Pᵢ)' : 'Initial Momentum (Pᵢ)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-white">
              {initialP.toFixed(1)} kg·m/s
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'শেষ মোট ভরবেগ (Pբ)' : 'Final Momentum (Pբ)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-emerald-400">
              {finalP.toFixed(1)} kg·m/s
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">
              {isInelastic ? (isBn ? 'মিলিত শেষবেগ (v)' : 'Combined Velocity (v)') : (isBn ? 'শেষবেগ v₁ / v₂' : 'Final v₁ / v₂')}
            </span>
            <span className="text-sm sm:text-base font-mono font-bold text-amber-400">
              {isInelastic ? `${finalVInelastic.toFixed(2)} m/s` : `${finalV1Elastic.toFixed(1)} / ${finalV2Elastic.toFixed(1)}`}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-slate-400 block text-[11px]">{isBn ? 'গতিশক্তি রূপান্তর (Eₖ)' : 'Kinetic Energy (Eₖ)'}</span>
            <span className="text-sm sm:text-base font-mono font-bold text-cyan-400">
              {initialEk.toFixed(0)}J → {finalEk.toFixed(0)}J
            </span>
          </div>
        </div>
      </div>

      {/* Control Sliders Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Cart 1 Controls */}
        <Card className="p-4 border-border/80 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
              {isBn ? '১ম গাড়ি (m₁ ও u₁)' : 'Cart 1 (m₁ & u₁)'}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              p₁ = {(m1 * u1).toFixed(1)}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">{isBn ? 'ভর m₁:' : 'Mass m₁:'}</span>
              <span className="font-mono font-semibold">{m1} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={m1}
              disabled={isPlaying}
              onChange={(e) => {
                setM1(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-blue-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">{isBn ? 'আদিবেগ u₁:' : 'Velocity u₁:'}</span>
              <span className="font-mono font-semibold">+{u1} m/s</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={u1}
              disabled={isPlaying}
              onChange={(e) => {
                setU1(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-blue-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
            />
          </div>
        </Card>

        {/* Cart 2 Controls */}
        <Card className="p-4 border-border/80 bg-card space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
              {isBn ? '২য় গাড়ি (m₂ ও u₂)' : 'Cart 2 (m₂ & u₂)'}
            </span>
            <Badge variant="outline" className="text-[10px] font-mono">
              p₂ = {(m2 * u2).toFixed(1)}
            </Badge>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">{isBn ? 'ভর m₂:' : 'Mass m₂:'}</span>
              <span className="font-mono font-semibold">{m2} kg</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={m2}
              disabled={isPlaying}
              onChange={(e) => {
                setM2(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-amber-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-muted-foreground">{isBn ? 'আদিবেগ u₂:' : 'Velocity u₂:'}</span>
              <span className="font-mono font-semibold">{u2} m/s</span>
            </div>
            <input
              type="range"
              min="-8"
              max="5"
              step="1"
              value={u2}
              disabled={isPlaying}
              onChange={(e) => {
                setU2(parseFloat(e.target.value));
                handleReset();
              }}
              className="w-full accent-amber-500 h-2 bg-surface-2 rounded-lg cursor-pointer"
            />
          </div>
        </Card>

        {/* Collision Type Selector */}
        <Card className="p-4 border-border/80 bg-card space-y-3 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-foreground block mb-1">
              {isBn ? 'সংঘর্ষের প্রকৃতি নির্বাচন' : 'Collision Type'}
            </span>
            <p className="text-[11px] text-muted-foreground">
              {isBn
                ? 'অস্থিতিস্থাপক সংঘর্ষে গাড়ি দুটি একসাথে আটকে যায় (বোর্ড পছন্দের সৃজনশীল প্রশ্ন)।'
                : 'Inelastic collisions fuse the bodies together (common board CQ pattern).'}
            </p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                setIsInelastic(true);
                handleReset();
              }}
              className={`w-full text-xs font-medium py-2 px-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                isInelastic
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-surface-2 border-border text-muted-foreground'
              }`}
            >
              <span>{isBn ? 'অস্থিতিস্থাপক (একত্রে আটকে যাওয়া)' : 'Inelastic (Stick Together)'}</span>
              <CheckCircle2 className={`size-3.5 ${isInelastic ? 'opacity-100' : 'opacity-0'}`} />
            </button>

            <button
              onClick={() => {
                setIsInelastic(false);
                handleReset();
              }}
              className={`w-full text-xs font-medium py-2 px-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                !isInelastic
                  ? 'bg-primary text-primary-foreground border-primary shadow-xs'
                  : 'bg-surface-2 border-border text-muted-foreground'
              }`}
            >
              <span>{isBn ? 'স্থিতিস্থাপক (ছিটকে যাওয়া)' : 'Elastic (Bounce Off)'}</span>
              <CheckCircle2 className={`size-3.5 ${!isInelastic ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          </div>
        </Card>
      </div>

      {/* Live Formula Mathematical Verification */}
      <Card className="p-5 border-border/80 bg-gradient-to-r from-card via-card to-primary/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <CheckCircle2 className="size-4 text-emerald-500" />
            <span>{isBn ? 'ভরবেগের নিত্যতা সূত্রের লাইভ প্রতিপাদন' : 'Law of Conservation of Momentum Proof'}</span>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            m₁u₁ + m₂u₂ = (m₁ + m₂)v
          </Badge>
        </div>

        <div className="p-3 rounded-xl bg-surface-1/70 border border-border/60 text-xs sm:text-sm font-mono text-center overflow-x-auto scrollbar-none">
          <RenderMathText
            text={`$$(${m1} \\times ${u1}) + (${m2} \\times (${u2})) = (${m1} + ${m2}) \\times (${finalVInelastic.toFixed(2)}) \\implies ${initialP.toFixed(1)} = ${finalP.toFixed(1)}\\text{ kg}\\cdot\\text{m/s}$$`}
            inline={false}
          />
        </div>
      </Card>
    </div>
  );
}
