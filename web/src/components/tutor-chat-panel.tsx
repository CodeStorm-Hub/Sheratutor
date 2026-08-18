"use client";

import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, User, Loader2, Send, type LucideIcon } from "lucide-react";

export type TutorChatMessage = { role: "assistant" | "student"; text: string };
export type TutorChatQuickChip = { label: string; icon: LucideIcon; prompt: string };

/**
 * Shared chat rendering for both the per-rubric-step panel
 * (ExplainSimplyButton) and the standalone /dashboard/tutor page — same
 * markdown/KaTeX rendering, quick-chip row, and input form so the two
 * surfaces don't drift apart.
 */
export function TutorChatPanel({
  messages,
  pending,
  onSend,
  quickChips,
  inputPlaceholder = "তোমার প্রশ্নটি এখানে লিখো…",
  pendingLabel = "টিউটর চিন্তা করছে ও সহজ করে লিখছে…",
}: {
  messages: TutorChatMessage[];
  pending: boolean;
  onSend: (text: string) => void;
  quickChips?: TutorChatQuickChip[];
  inputPlaceholder?: string;
  pendingLabel?: string;
}) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  function submit(textToSend?: string) {
    const query = (textToSend ?? input).trim();
    if (!query || pending) return;
    onSend(query);
    setInput("");
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((m, i) => (
          <div key={i} className={`flex gap-2.5 items-start ${m.role === "student" ? "flex-row-reverse" : "flex-row"}`}>
            <div
              className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                m.role === "student" ? "bg-primary text-primary-foreground" : "bg-mint-deep text-white"
              }`}
            >
              {m.role === "student" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`text-sm rounded-2xl px-3.5 py-2.5 max-w-[85%] shadow-xs leading-relaxed ${
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
                  strong: ({ ...props }) => <strong className="font-semibold text-mint-deep dark:text-mint" {...props} />,
                  code: ({ ...props }) => <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props} />,
                }}
              >
                {m.text}
              </ReactMarkdown>
            </div>
          </div>
        ))}

        {pending && (
          <div className="flex gap-2.5 items-start">
            <div className="w-7 h-7 rounded-full shrink-0 bg-mint-deep text-white flex items-center justify-center">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div className="bg-muted/70 border border-border/50 text-muted-foreground text-xs rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-mint-deep" />
              <span>{pendingLabel}</span>
            </div>
          </div>
        )}
      </div>

      {quickChips && quickChips.length > 0 && (
        <div className="p-2.5 border-t border-border bg-card/30">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {quickChips.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={pending}
                  onClick={() => submit(chip.prompt)}
                  className="flex items-center gap-1 shrink-0 text-[11px] bg-secondary/80 hover:bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border/60 transition-colors disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-mint-deep dark:text-mint" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="p-3 border-t border-border bg-background">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submit();
          }}
          className="flex gap-2"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            disabled={pending}
            className="text-sm bg-muted/40 focus-visible:ring-mint"
          />
          <Button type="submit" size="icon" disabled={pending || !input.trim()} className="bg-mint-deep hover:bg-mint text-white shrink-0">
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    </div>
  );
}
