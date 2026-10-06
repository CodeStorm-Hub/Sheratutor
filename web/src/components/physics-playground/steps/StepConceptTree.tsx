'use client';

import React, { useState } from 'react';
import {
  GitFork,
  Lightbulb,
  Sparkles,
  BookOpen,
  HelpCircle,
  ChevronRight,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { Step1ConceptTreeData, ConceptNode } from '@/lib/physics-playground/types';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toBengaliNumber } from '../PhysicsCatalogView';

interface StepConceptTreeProps {
  data: Step1ConceptTreeData;
}

export function StepConceptTree({ data }: StepConceptTreeProps) {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  const [activeNodeId, setActiveNodeId] = useState<string | null>(
    data.nodes[0]?.id || null,
  );

  const activeNode = data.nodes.find((n) => n.id === activeNodeId) || data.nodes[0];

  return (
    <div className="space-y-6">
      {/* Step Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <GitFork className="size-3.5" />
          <span>{isBn ? 'ধাপ ১: কনসেপ্ট ইউনিভার্স' : 'Step 1: The Concept Universe'}</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
          {isBn ? 'অধ্যায়ের মূল ধারণার সংযোগ ও বাস্তব রূপ' : 'Connected Conceptual Architecture'}
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {isBn ? data.summaryBn : data.summaryEn}
        </p>
      </div>

      {/* Main Grid: Left interactive node list, Right deep-dive spotlight card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Concept Nodes Selector */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1">
            {isBn
              ? `মূল কনসেপ্টসমূহ (${toBengaliNumber(data.nodes.length)}টি)`
              : `Core Concepts (${data.nodes.length})`}
          </div>

          <div className="space-y-2">
            {data.nodes.map((node, index) => {
              const isSelected = activeNode?.id === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setActiveNodeId(node.id)}
                  className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'bg-card border-primary/50 shadow-md ring-1 ring-primary/30'
                      : 'bg-card/60 hover:bg-surface-2 border-border/70 text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div
                    className={`mt-0.5 size-7 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 ${
                      isSelected
                        ? 'bg-primary text-primary-foreground shadow-xs'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {isBn ? toBengaliNumber(index + 1) : index + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4
                        className={`text-sm font-semibold truncate ${
                          isSelected ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {isBn ? node.titleBn : node.titleEn}
                      </h4>
                      <ChevronRight
                        className={`size-4 transition-transform ${
                          isSelected ? 'rotate-90 text-primary' : 'text-muted-foreground/50'
                        }`}
                      />
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {isBn ? node.titleEn : node.titleBn}
                    </p>

                    {node.formulaLatex && (
                      <div className="mt-2 text-xs font-mono text-primary/90 bg-primary/5 px-2 py-0.5 rounded border border-primary/10 inline-block">
                        <RenderMathText text={`$${node.formulaLatex}$`} inline />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Deep-Dive Concept Card */}
        {activeNode && (
          <div className="lg:col-span-7">
            <Card className="border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-6">
              {/* Node Title & Header */}
              <div className="space-y-1.5 pb-4 border-b border-border/80">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs font-mono">
                    {isBn ? 'বিস্তারিত ধারণা' : 'In-Depth Concept'}
                  </Badge>
                  {activeNode.formulaLatex && (
                    <Badge variant="secondary" className="font-mono text-xs text-primary">
                      {isBn ? 'গাণিতিক রূপ' : 'Mathematical Form'}
                    </Badge>
                  )}
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                  {isBn ? activeNode.titleBn : activeNode.titleEn}
                </h3>
                <p className="text-xs text-muted-foreground font-medium">
                  {isBn ? activeNode.titleEn : activeNode.titleBn}
                </p>
              </div>

              {/* Concept Core Description */}
              <div className="space-y-2">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isBn ? 'সংজ্ঞা ও মূল রহস্য' : 'Definition & Core Logic'}
                </h5>
                <div className="text-sm leading-relaxed text-foreground/90 bg-surface-1/40 p-4 rounded-xl border border-border/50">
                  <RenderMathText
                    text={isBn ? activeNode.descriptionBn : activeNode.descriptionEn}
                  />
                </div>
              </div>

              {/* Formula Callout if exists */}
              {activeNode.formulaLatex && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-1.5">
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                    {isBn ? 'সংশ্লিষ্ট সমীকরণ' : 'Associated Formula'}
                  </span>
                  <div className="text-base sm:text-lg font-mono font-bold text-foreground py-1">
                    <RenderMathText
                      text={`$$${activeNode.formulaLatex}$$`}
                      inline={false}
                    />
                  </div>
                </div>
              )}

              {/* Real World Intuition Card */}
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2.5">
                <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-semibold text-xs sm:text-sm">
                  <Lightbulb className="size-4 shrink-0" />
                  <span>{isBn ? 'বাস্তব জীবনের দৃশ্যমান উদাহরণ' : 'Real-World Everyday Intuition'}</span>
                </div>
                <p className="text-xs sm:text-sm text-foreground/85 leading-relaxed">
                  {isBn ? activeNode.realWorldExampleBn : activeNode.realWorldExampleEn}
                </p>
              </div>

              {/* Bottom Quick-Tip */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
                <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                <span>
                  {isBn
                    ? 'এই কনসেপ্টটি আয়ত্ত করার পর পরবর্তী ধাপে সরাসরি ভার্চুয়াল ল্যাবে পরীক্ষা করে দেখো।'
                    : 'Once you grasp this concept, proceed to the virtual laboratory to manipulate it directly.'}
                </span>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
