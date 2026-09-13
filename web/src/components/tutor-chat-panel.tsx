"use client";

import { useRef, useEffect, useState } from "react";
import { RenderMathText } from "@/components/render-math-text";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Bot,
  User,
  Loader2,
  Send,
  Volume2,
  Sparkles,
  Mic,
  MicOff,
  Lightbulb,
  BookOpen,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  AlertCircle,
  Check,
  type LucideIcon,
} from "lucide-react";
import {
  parseTutorDirectives,
  type HintRung,
  type ParsedExitTicket,
  type ParsedAnalogousExample,
} from "@/lib/tutor-format";

export type TutorChatMessage = { role: "assistant" | "student"; text: string };
export type TutorChatQuickChip = { label: string; icon: LucideIcon; prompt: string; hintRung?: HintRung };

export interface RoiContextData {
  imageUrl?: string;
  questionLabel?: string;
  deductionReason?: string;
  marksLost?: number;
  studentAnswer?: string;
}

const MATH_SYMBOLS = [
  { label: "ms⁻¹", insert: "$\\text{ms}^{-1}$ " },
  { label: "ms⁻²", insert: "$\\text{ms}^{-2}$ " },
  { label: "kg", insert: "$\\text{kg}$ " },
  { label: "N", insert: "$\\text{N}$ " },
  { label: "J", insert: "$\\text{J}$ " },
  { label: "W", insert: "$\\text{W}$ " },
  { label: "Pa", insert: "$\\text{Pa}$ " },
  { label: "F=ma", insert: "$F = ma$ " },
  { label: "v=u+at", insert: "$v = u + at$ " },
  { label: "s=ut+½at²", insert: "$s = ut + \\frac{1}{2}at^2$ " },
  { label: "θ (Theta)", insert: "$\\theta$ " },
  { label: "λ (Lambda)", insert: "$\\lambda$ " },
  { label: "μ (Mu)", insert: "$\\mu$ " },
  { label: "Δ (Delta)", insert: "$\\Delta$ " },
  { label: "→ (বিক্রিয়া)", insert: "$\\rightarrow$ " },
  { label: "⇌ (সাম্য)", insert: "$\\rightleftharpoons$ " },
  { label: "Zn²⁺", insert: "$\\text{Zn}^{2+}$ " },
  { label: "NH₃", insert: "$NH_3$ " },
];

const HINT_STEPS = [
  { id: 1, label: "ধারণা ও সূত্র", description: "আইন ও সূত্র চিহ্নিতকরণ" },
  { id: 2, label: "মান বসানো", description: "উদ্দীপক থেকে মান গ্রহণ" },
  { id: 3, label: "সূত্র প্রয়োগ", description: "ধারাবাহিক সমাধান ধাপ" },
  { id: 4, label: "যাচাই ও সমাপ্তি", description: "একক ও চূড়ান্ত উত্তর" },
];

export function TutorChatPanel({
  messages,
  pending,
  onSend,
  quickChips,
  inputPlaceholder = "তোমার প্রশ্নটি এখানে লিখো বা বলো…",
  pendingLabel = "টিউটর চিন্তা করছে ও সহজ করে লিখছে…",
  scaffoldingStyle = "socratic",
  onScaffoldingChange,
  roiContext,
  currentHintRung = 3,
  onHintRungChange,
}: {
  messages: TutorChatMessage[];
  pending: boolean;
  onSend: (text: string, style?: "socratic" | "direct", hintRung?: HintRung) => void;
  quickChips?: TutorChatQuickChip[];
  inputPlaceholder?: string;
  pendingLabel?: string;
  scaffoldingStyle?: "socratic" | "direct";
  onScaffoldingChange?: (style: "socratic" | "direct") => void;
  roiContext?: RoiContextData;
  currentHintRung?: HintRung;
  onHintRungChange?: (rung: HintRung) => void;
}) {
  const [input, setInput] = useState("");
  const [currentStyle, setCurrentStyle] = useState<"socratic" | "direct">(scaffoldingStyle);
  const [activeRung, setActiveRung] = useState<HintRung>(currentHintRung);
  const [isRoiExpanded, setIsRoiExpanded] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [ticketAnswers, setTicketAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  useEffect(() => {
    setActiveRung(currentHintRung);
  }, [currentHintRung]);

  function submit(textToSend?: string, overrideRung?: HintRung) {
    const query = (textToSend ?? input).trim();
    if (!query || pending) return;
    const targetRung = overrideRung !== undefined ? overrideRung : activeRung;
    onSend(query, currentStyle, targetRung);
    setInput("");
  }

  function handleInsertSymbol(symbolText: string) {
    setInput((prev) => prev + symbolText);
  }

  function handleVoiceInput() {
    if (typeof window === "undefined") return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("তোমার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। অনুগ্রহ করে ক্রোম ব্রাউজার ব্যবহার করো।");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "bn-BD";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  }

  function playBanglaSpeech(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const plain = text
      .replace(/\$\$[\s\S]*?\$\$/g, "সমীকরণ")
      .replace(/\$([^$]+)\$/g, "$1")
      .replace(/[*#_`]/g, "")
      .replace(/:::[\s\S]*?:::/g, "")
      .trim();
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.lang = "bn-BD";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  // Derive current step for the 4-stage visual stepper
  const currentStepIndex = Math.min(4, Math.max(1, Math.floor((activeRung / 7) * 4) + 1));

  // Default smart action pills
  const defaultActionChips: TutorChatQuickChip[] = [
    {
      label: "💡 ছোট ক্লু দাও",
      icon: Lightbulb,
      prompt: "আমাকে ছোট একটি ক্লু দাও যাতে পরের ধাপটি নিজে সমাধান করতে পারি।",
      hintRung: Math.min(6, activeRung + 1) as HintRung,
    },
    {
      label: "🔄 একই নিয়মের অন্য উদাহরণ",
      icon: RotateCcw,
      prompt: "আসল অংকের বদলে একই নিয়মের অন্য একটি সমান্তরাল উদাহরণ দিয়ে বুঝিয়ে দাও।",
      hintRung: 5,
    },
    {
      label: "📖 পাঠ্যবইয়ের ডায়াগ্রাম",
      icon: BookOpen,
      prompt: "এই বিষয়ের বোর্ড বইয়ের চিত্র বা ডায়াগ্রামটি দেখাও।",
    },
    {
      label: "✍️ আমার সূত্র চেক করো",
      icon: CheckCircle2,
      prompt: "আমি কোন সূত্রটি ব্যবহার করব এবং আমার চিন্তা সঠিক কিনা বলো।",
    },
  ];

  const chipsToRender = quickChips && quickChips.length > 0 ? quickChips : defaultActionChips;

  return (
    <div className="flex flex-col h-full min-h-0 bg-background">
      {/* 1. Region-of-Interest (ROI) Handwritten Crop Header */}
      {roiContext && (
        <div className="border-b border-border/80 bg-surface-1 dark:bg-dark-surface-1 shadow-xs">
          <div className="px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-md bg-mark-deduction/10 text-mark-deduction flex items-center justify-center shrink-0">
                <ImageIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-foreground truncate block font-display">
                  {roiContext.questionLabel || "খাতার অংশবিশেষ (Student Khata)"}
                </span>
                {roiContext.deductionReason && (
                  <span className="text-2xs text-mark-deduction font-medium truncate block">
                    {roiContext.deductionReason}
                  </span>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsRoiExpanded(!isRoiExpanded)}
              className="p-1 text-muted-foreground hover:text-foreground rounded transition-colors"
              aria-label={isRoiExpanded ? "লুকান" : "দেখুন"}
            >
              {isRoiExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>

          {isRoiExpanded && roiContext.imageUrl && (
            <div className="px-4 pb-3 pt-1">
              <div className="relative rounded-lg overflow-hidden border-2 border-mark-deduction/40 bg-black/5 dark:bg-black/30 max-h-28 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={roiContext.imageUrl}
                  alt="Student handwriting snippet"
                  className="object-contain max-h-28 w-full select-none filter contrast-125"
                />
                <div className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-white text-3xs font-mono px-1.5 py-0.5 rounded">
                  {roiContext.marksLost ? `-${roiContext.marksLost} নম্বর` : "চিহ্নিত ভুল"}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. Visual Hint Ladder Stepper (H0 -> H7) */}
      <div className="px-4 py-2 bg-muted/30 dark:bg-dark-surface-2 border-b border-border/60">
        <div className="flex items-center justify-between text-2xs mb-1.5 text-muted-foreground">
          <span className="font-semibold font-display">ধাপে ধাপে শিক্ষণ (Scaffolding Ladder)</span>
          <span className="font-mono text-primary font-bold">ধাপ {currentStepIndex}/৪</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {HINT_STEPS.map((step) => {
            const isPassed = step.id < currentStepIndex;
            const isCurrent = step.id === currentStepIndex;
            return (
              <div
                key={step.id}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isPassed
                    ? "bg-success"
                    : isCurrent
                    ? "bg-primary animate-pulse"
                    : "bg-border/60"
                }`}
                title={`${step.label}: ${step.description}`}
              />
            );
          })}
        </div>
      </div>

      {/* 3. Socratic vs Direct Mode Toggle */}
      <div className="px-4 py-1.5 bg-muted/20 border-b border-border/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setCurrentStyle("socratic");
              onScaffoldingChange?.("socratic");
            }}
            className={`px-2.5 py-0.5 rounded-full text-2xs font-medium transition-all ${
              currentStyle === "socratic"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            <Sparkles className="w-3 h-3 inline mr-1" />
            সক্রেটিক গাইড
          </button>
          <button
            type="button"
            onClick={() => {
              setCurrentStyle("direct");
              onScaffoldingChange?.("direct");
            }}
            className={`px-2.5 py-0.5 rounded-full text-2xs font-medium transition-all ${
              currentStyle === "direct"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "bg-background text-muted-foreground hover:bg-muted"
            }`}
          >
            সরাসরি ব্যাখ্যা
          </button>
        </div>
        <span className="text-3xs font-mono text-muted-foreground">
          Rung: H{activeRung}
        </span>
      </div>

      {/* 4. Message Stream */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto w-full p-4 md:p-6 space-y-4 md:space-y-5">
          {messages.map((m, i) => {
            const { cleanText, exitTicket, analogousExamples } = parseTutorDirectives(m.text);

            return (
              <div
                key={i}
                className={`flex gap-2.5 md:gap-3 items-start ${
                  m.role === "student" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                    m.role === "student"
                      ? "bg-primary text-primary-foreground"
                      : "bg-success text-white"
                  }`}
                >
                  {m.role === "student" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                <div
                  className={`relative text-sm rounded-2xl px-3.5 md:px-4 py-2.5 md:py-3 max-w-[88%] lg:max-w-[75%] shadow-xs leading-relaxed ${
                    m.role === "student"
                      ? "bg-primary text-primary-foreground rounded-tr-xs"
                      : "bg-surface-1 dark:bg-dark-surface-1 text-foreground border border-border/70 rounded-tl-xs"
                  }`}
                >
                  <RenderMathText text={cleanText} inline={false} />

                  {/* Analogous Worked Example Callout Box */}
                  {analogousExamples.map((ex, exIdx) => (
                    <div
                      key={exIdx}
                      className="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-foreground"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5 font-display">
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{ex.title}</span>
                      </div>
                      <div className="text-xs leading-relaxed">
                        <RenderMathText text={ex.content} inline={false} />
                      </div>
                    </div>
                  ))}

                  {/* Formative Exit Ticket Micro-Quiz Card */}
                  {exitTicket && (
                    <div className="mt-3.5 p-3.5 rounded-xl bg-muted/40 border border-primary/30 shadow-xs">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-primary font-display flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5" />
                          কুইজ চেক (Exit Ticket)
                        </span>
                        {ticketAnswers[exitTicket.id] && (
                          <span
                            className={`text-2xs font-bold px-2 py-0.5 rounded-full ${
                              ticketAnswers[exitTicket.id].isCorrect
                                ? "bg-success/20 text-success"
                                : "bg-destructive/20 text-destructive"
                            }`}
                          >
                            {ticketAnswers[exitTicket.id].isCorrect
                              ? "✓ সঠিক! +১০ পয়েন্ট"
                              : "✕ ভুল, আবার চেষ্টা করো"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-foreground mb-2.5">{exitTicket.question}</p>
                      <div className="space-y-1.5">
                        {exitTicket.options.map((opt) => {
                          const state = ticketAnswers[exitTicket.id];
                          const isSelected = state?.selected === opt.id;
                          return (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => {
                                setTicketAnswers((prev) => ({
                                  ...prev,
                                  [exitTicket.id]: { selected: opt.id, isCorrect: opt.isCorrect },
                                }));
                              }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between border ${
                                isSelected
                                  ? opt.isCorrect
                                    ? "bg-success/15 border-success text-success font-semibold"
                                    : "bg-destructive/15 border-destructive text-destructive font-semibold"
                                  : "bg-background hover:bg-muted border-border text-foreground"
                              }`}
                            >
                              <span>
                                <strong className="mr-1 font-mono">{opt.id})</strong> {opt.label}
                              </span>
                              {isSelected && (
                                opt.isCorrect ? <Check className="w-3.5 h-3.5 text-success" /> : <AlertCircle className="w-3.5 h-3.5 text-destructive" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {exitTicket.explanation && ticketAnswers[exitTicket.id]?.isCorrect && (
                        <p className="mt-2 text-2xs text-muted-foreground bg-muted/30 p-2 rounded">
                          💡 {exitTicket.explanation}
                        </p>
                      )}
                    </div>
                  )}

                  {m.role === "assistant" && (
                    <div className="mt-2.5 pt-2 border-t border-border/30 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => playBanglaSpeech(cleanText)}
                        className="inline-flex items-center gap-1 text-2xs text-muted-foreground hover:text-foreground transition-opacity"
                        title="অডিও শোনো"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>বাংলায় শোনো</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {pending && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full shrink-0 bg-success text-white flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-surface-1 dark:bg-dark-surface-1 border border-border/70 text-muted-foreground text-xs rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>{pendingLabel}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 5. Formula & SI Unit Palette Toolbar */}
      <div className="px-3 py-1.5 border-t border-border/40 bg-muted/20 flex gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-2xs text-muted-foreground self-center shrink-0 mr-1 font-medium">প্রতীক:</span>
        {MATH_SYMBOLS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInsertSymbol(s.insert)}
            className="text-2xs font-mono bg-background hover:bg-muted border border-border/60 px-2 py-0.5 rounded text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* 6. Dynamic Scaffolding Action Chips (Pills) */}
      <div className="p-2 border-t border-border bg-surface-1 dark:bg-dark-surface-1">
        <div className="max-w-3xl mx-auto w-full flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {chipsToRender.map((chip, idx) => {
            const Icon = chip.icon;
            return (
              <button
                key={idx}
                type="button"
                disabled={pending}
                onClick={() => {
                  if (chip.hintRung !== undefined) {
                    setActiveRung(chip.hintRung);
                    onHintRungChange?.(chip.hintRung);
                  }
                  submit(chip.prompt, chip.hintRung);
                }}
                className="flex items-center gap-1.5 shrink-0 text-2xs bg-secondary/80 hover:bg-secondary text-secondary-foreground px-3 py-1 rounded-full border border-border/60 transition-colors disabled:opacity-50 font-medium"
              >
                <Icon className="w-3 h-3 text-primary" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Input Container with Voice Microphone & Submit */}
      <div className="p-3 md:p-4 border-t border-border bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="max-w-3xl mx-auto w-full flex items-center gap-2 md:gap-3"
        >
          <button
            type="button"
            onClick={handleVoiceInput}
            title={isListening ? "রেকর্ডিং থামাও" : "মুখে বলো (বাংলা)"}
            className={`p-2 md:p-3 rounded-full transition-all shrink-0 ${
              isListening
                ? "bg-destructive text-destructive-foreground animate-pulse"
                : "bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80"
            }`}
          >
            {isListening ? <MicOff className="w-4 h-4 md:w-5 md:h-5" /> : <Mic className="w-4 h-4 md:w-5 md:h-5" />}
          </button>

          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isListening ? "শুনছি... মুখে বলো..." : inputPlaceholder}
            disabled={pending}
            className="text-sm md:text-base h-9 md:h-12 rounded-full bg-muted/40 px-5 focus-visible:ring-primary"
          />

          <Button
            type="submit"
            size="icon"
            disabled={pending || !input.trim()}
            aria-label="পাঠাও"
            className="bg-primary hover:bg-primary/90 text-primary-foreground shrink-0 rounded-full md:size-12 shadow-xs"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}

