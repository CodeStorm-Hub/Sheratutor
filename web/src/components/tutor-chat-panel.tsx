"use client";

import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Loader2, Send, Volume2, Sparkles, type LucideIcon } from "lucide-react";

export type TutorChatMessage = { role: "assistant" | "student"; text: string };
export type TutorChatQuickChip = { label: string; icon: LucideIcon; prompt: string };

const MATH_SYMBOLS = [
  { label: "F=ma", insert: "$F = ma$ " },
  { label: "v=u+at", insert: "$v = u + at$ " },
  { label: "s=ut+½at²", insert: "$s = ut + \\frac{1}{2}at^2$ " },
  { label: "ms⁻¹", insert: "$\\text{ms}^{-1}$ " },
  { label: "ms⁻²", insert: "$\\text{ms}^{-2}$ " },
  { label: "Δ (Delta)", insert: "$\\Delta$ " },
  { label: "θ (Theta)", insert: "$\\theta$ " },
  { label: "λ (Lambda)", insert: "$\\lambda$ " },
  { label: "Ω (Ohm)", insert: "$\\Omega$ " },
];

export function TutorChatPanel({
  messages,
  pending,
  onSend,
  quickChips,
  inputPlaceholder = "তোমার প্রশ্নটি এখানে লিখো…",
  pendingLabel = "টিউটর চিন্তা করছে ও সহজ করে লিখছে…",
  scaffoldingStyle = "socratic",
  onScaffoldingChange,
}: {
  messages: TutorChatMessage[];
  pending: boolean;
  onSend: (text: string, style?: "socratic" | "direct") => void;
  quickChips?: TutorChatQuickChip[];
  inputPlaceholder?: string;
  pendingLabel?: string;
  scaffoldingStyle?: "socratic" | "direct";
  onScaffoldingChange?: (style: "socratic" | "direct") => void;
}) {
  const [input, setInput] = useState("");
  const [currentStyle, setCurrentStyle] = useState<"socratic" | "direct">(scaffoldingStyle);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  function submit(textToSend?: string) {
    const query = (textToSend ?? input).trim();
    if (!query || pending) return;
    onSend(query, currentStyle);
    setInput("");
  }

  function handleInsertSymbol(symbolText: string) {
    setInput((prev) => prev + symbolText);
  }

  function playBanglaSpeech(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    // Clean markdown and LaTeX delimiters for natural audio
    const plain = text
      .replace(/\$\$[\s\S]*?\$\$/g, "সমীকরণ")
      .replace(/\$([^$]+)\$/g, "$1")
      .replace(/[*#_`]/g, "")
      .trim();
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.lang = "bn-BD";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Socratic Mode Header Controls */}
      <div className="px-4 py-2 bg-muted/40 border-b border-border flex items-center justify-between text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-muted-foreground">পদ্ধতি:</span>
            <button
              type="button"
              onClick={() => {
                const next = "socratic";
                setCurrentStyle(next);
                onScaffoldingChange?.(next);
              }}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                currentStyle === "socratic"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              <Sparkles className="w-3 h-3 inline mr-1" />
              সক্রেটিক গাইড (ধাপে ধাপে শেখা)
            </button>
            <button
              type="button"
              onClick={() => {
                const next = "direct";
                setCurrentStyle(next);
                onScaffoldingChange?.(next);
              }}
              className={`px-2.5 py-1 rounded-full font-medium transition-all ${
                currentStyle === "direct"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              সরাসরি ব্যাখ্যা
            </button>
          </div>
          <span className="text-xs text-muted-foreground/90 font-medium">
            {currentStyle === "socratic"
              ? "💡 সক্রেটিক: AI প্রশ্নোত্তরের মাধ্যমে নিজে সমাধান বের করতে শেখায়"
              : "⚡ সরাসরি: তাৎক্ষণিক নির্ভুল সমাধান, সূত্র ও সম্পূর্ণ ব্যাখ্যা"}
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto">
       <div className="max-w-3xl mx-auto w-full p-4 md:p-6 space-y-4 md:space-y-5">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 md:gap-3 items-start ${m.role === "student" ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className={`w-7 h-7 md:w-8 md:h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                m.role === "student" ? "bg-primary text-primary-foreground" : "bg-green-deep text-white"
              }`}
            >
              {m.role === "student" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`relative text-sm md:text-sm rounded-2xl px-3.5 md:px-4 py-2.5 md:py-3 max-w-[85%] lg:max-w-[70%] shadow-xs leading-relaxed ${
                m.role === "student"
                  ? "bg-primary text-primary-foreground rounded-tr-xs"
                  : "bg-muted/70 text-foreground border border-border/50 rounded-tl-xs"
              }`}
            >
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                  ul: ({ ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
                  ol: ({ ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
                  li: ({ ...props }) => <li className="text-xs leading-relaxed" {...props} />,
                  strong: ({ ...props }) => <strong className="font-semibold text-green-deep dark:text-green" {...props} />,
                  code: ({ ...props }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                }}
              >
                {m.text}
              </ReactMarkdown>

              {m.role === "assistant" && (
                <button
                  type="button"
                  onClick={() => playBanglaSpeech(m.text)}
                  className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground opacity-80 hover:opacity-100 transition-opacity"
                  title="অডিও শোনো"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>শোনো</span>
                </button>
              )}
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full shrink-0 bg-green-deep text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-muted/70 border border-border/50 text-muted-foreground text-xs rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-green-deep" />
              <span>{pendingLabel}</span>
            </div>
          </div>
        )}
       </div>
      </div>

      {/* Physics & Math Symbols Quick Palette */}
      <div className="px-3 py-1.5 border-t border-border/40 bg-muted/20 flex gap-1.5 overflow-x-auto scrollbar-none">
        <span className="text-xs text-muted-foreground self-center shrink-0 mr-1 font-medium">প্রতীক:</span>
        {MATH_SYMBOLS.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleInsertSymbol(s.insert)}
            className="text-xs font-mono bg-background hover:bg-muted border border-border/60 px-2 py-0.5 rounded text-muted-foreground hover:text-foreground shrink-0 transition-colors"
          >
            {s.label}
          </button>
        ))}
      </div>

      {quickChips && quickChips.length > 0 && (
        <div className="p-2.5 border-t border-border bg-card/30">
          <div className="max-w-3xl mx-auto w-full flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={pending}
                  onClick={() => submit(chip.prompt)}
                  className="flex items-center gap-1 shrink-0 text-xs bg-secondary/80 hover:bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border/60 transition-colors disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-green-deep dark:text-green" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-3 md:p-4 border-t border-border bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="max-w-3xl mx-auto w-full flex gap-2 md:gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={pending}
            className="text-sm md:text-base h-9 md:h-12 rounded-full bg-muted/40 px-5 focus-visible:ring-green"
          />
          <Button
            type="submit"
            size="icon"
            disabled={pending || !input.trim()}
            aria-label="পাঠাও"
            className="bg-green-deep hover:bg-green text-white shrink-0 rounded-full md:size-12"
          >
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
