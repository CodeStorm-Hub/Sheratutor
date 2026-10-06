'use client';

import React from 'react';
import {
  FlaskConical,
  Lightbulb,
  Sparkles,
  Info,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { Step2SandboxData } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VernierCaliperSimulator } from '../simulators/VernierCaliperSimulator';
import { KinematicsMotionSimulator } from '../simulators/KinematicsMotionSimulator';
import { MomentumCollisionSimulator } from '../simulators/MomentumCollisionSimulator';
import { EnergyConservationSimulator } from '../simulators/EnergyConservationSimulator';
import { HydraulicPressureSimulator } from '../simulators/HydraulicPressureSimulator';

interface StepSimulationHostProps {
  data: Step2SandboxData;
  chapterNo: number;
}

export function StepSimulationHost({ data, chapterNo }: StepSimulationHostProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const renderSimulatorWidget = () => {
    switch (data.simulatorType) {
      case 'vernier':
        return <VernierCaliperSimulator />;
      case 'motion':
        return <KinematicsMotionSimulator />;
      case 'force':
        return <MomentumCollisionSimulator />;
      case 'energy':
        return <EnergyConservationSimulator />;
      case 'pressure':
        return <HydraulicPressureSimulator />;
      default:
        // Generic Parameter Sandbox fallback for chapters in progression
        return (
          <Card className="p-8 border-dashed border-border/80 bg-card/50 text-center space-y-4">
            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <FlaskConical className="size-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold">
                {isBn ? 'ইন্টারেক্টিভ ল্যাবরেটরি স্পেস' : 'Interactive Laboratory Space'}
              </h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                {isBn
                  ? 'এই অধ্যায়ের স্পেশালাইজড ২D ক্যানভাস সিমুলেটরটি পরবর্তী আপডেটে সংযুক্ত হচ্ছে। নিচের পর্যবেক্ষণ টিপ ও সূত্রসমূহ অনুসরণ করো।'
                  : 'Specialized 2D canvas simulation for this chapter is rolling out in the next build. Review the observation tips and parameters below.'}
              </p>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
          <FlaskConical className="size-3.5" />
          <span>{isBn ? 'ধাপ ২: ইন্টারঅ্যাক্টিভ স্যান্ডবক্স' : 'Step 2: Interactive Sandbox'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {isBn ? 'ভার্চুয়াল ল্যাবরেটরি ও দৃশ্যমান পরীক্ষা' : 'Virtual Laboratory Sandbox'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {isBn ? data.instructionsBn : data.instructionsEn}
        </p>
      </div>

      {/* Simulator Canvas / Interactive Host */}
      <div>{renderSimulatorWidget()}</div>

      {/* Key Observation Tip Card */}
      <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3.5">
        <Lightbulb className="size-5 text-amber-500 shrink-0 mt-0.5" />
        <div className="space-y-1 flex-1">
          <h4 className="text-xs sm:text-sm font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
            {isBn ? 'ল্যাব পরীক্ষকের পর্যবেক্ষণ টিপ' : 'Examiner Laboratory Observation Tip'}
          </h4>
          <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            <RenderMathText
              text={isBn ? data.keyObservationTipBn : data.keyObservationTipEn}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
