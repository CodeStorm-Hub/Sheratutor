"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Send, Bot, User, Loader2, Lightbulb, Car, Calculator, HelpCircle } from "lucide-react";

type Message = { role: "assistant" | "student"; text: string };

const QUICK_CHIPS = [
  { label: "সহজ ভাষায় বুঝিয়ে দাও", icon: Lightbulb, prompt: "আমাকে এই বিষয়টি একদম সহজ ভাষায় বুঝিয়ে বলো।" },
  { label: "বাস্তব জীবনের উদাহরণ", icon: Car, prompt: "বাস্তব জীবনের একটি পরিচিত উদাহরণ দিয়ে এটি ব্যাখ্যা করো।" },
  { label: "সঠিক সূত্র ও স্টেপ", icon: Calculator, prompt: "এই প্রশ্নের জন্য সঠিক সূত্র এবং স্টেপ বাই স্টেপ হিসাবটা কী হবে?" },
  { label: "আমার ভুল কোথায় ছিল?", icon: HelpCircle, prompt: "আমার উত্তরে মূল ভুলটা কোথায় হয়েছে তা পরিষ্কার করে বলো।" },
];

export function ExplainSimplyButton({
  questionText,
  stepName,
  observation,
  studentAnswerChunk,
  groundedContext,
}: {
  questionText: string;
  stepName: string;
  observation: string;
  studentAnswerChunk?: string;
  groundedContext?: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: `নমস্কার / আসসালামু আলাইকুম! **"${stepName}"** নিয়ে তোমার উত্তরের এই জায়গাটি নিয়ে আলোচনা করতে পারো। তোমার সুবিধার্থে আমি সহজ উদাহরণ ও সূত্রের সাহায্যে বুঝিয়ে দেবো।`,
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, pending]);

  async function handleSend(textToSend?: string) {
    const query = (textToSend ?? input).trim();
    if (!query || pending) return;

    const updatedHistory: Message[] = [...messages, { role: "student", text: query }];
    setMessages(updatedHistory);
    setInput("");
    setPending(true);

    // Format past history for backend (excluding the initial system welcome message)
    const historyPayload = messages
      .filter((_, idx) => idx > 0)
      .map((m) => ({
        role: m.role === "assistant" ? ("tutor" as const) : ("student" as const),
        text: m.text,
      }));

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          questionText,
          studentAnswerChunk: studentAnswerChunk ?? observation,
          rubricFailureReason: observation,
          groundedContext,
          history: historyPayload,
          studentMessage: query,
          languagePreference: "bn",
        }),
      });

      if (!res.ok) throw new Error("Failed to fetch response");
      const json = await res.json();
      setMessages([...updatedHistory, { role: "assistant", text: json.reply }]);
    } catch {
      setMessages([
        ...updatedHistory,
        { role: "assistant", text: "দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।" },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-emerald-500/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-950/40 text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          বুঝিয়ে বলো
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg flex flex-col p-0 h-full border-l border-border bg-background"
      >
        {/* Header */}
        <SheetHeader className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-heading font-bold text-foreground">
                SheraTutor — বুঝিয়ে বলো
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Socratic AI Tutor • {stepName}
              </SheetDescription>
            </div>
          </div>

          {/* Context Snippet */}
          <div className="mt-2 text-xs bg-card/60 p-2.5 rounded-md border border-border/80 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                মডেল ফিডব্যাক
              </Badge>
              <span className="truncate">{stepName}</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-2">
              {observation}
            </p>
          </div>
        </SheetHeader>

        {/* Chat History */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex gap-2.5 items-start ${
                m.role === "student" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-xs font-semibold ${
                  m.role === "student"
                    ? "bg-primary text-primary-foreground"
                    : "bg-emerald-600 text-white"
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
                    strong: ({ ...props }) => <strong className="font-semibold text-emerald-700 dark:text-emerald-300" {...props} />,
                    code: ({ ...props }) => (
                      <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props} />
                    ),
                  }}
                >
                  {m.text}
                </ReactMarkdown>
              </div>
            </div>
          ))}

          {pending && (
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full shrink-0 bg-emerald-600 text-white flex items-center justify-center">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="bg-muted/70 border border-border/50 text-muted-foreground text-xs rounded-2xl px-3.5 py-2.5 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
                <span>টিউটর চিন্তা করছে ও সহজ করে লিখছে…</span>
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Chips */}
        <div className="p-2.5 border-t border-border bg-card/30">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_CHIPS.map((chip, idx) => {
              const Icon = chip.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={pending}
                  onClick={() => handleSend(chip.prompt)}
                  className="flex items-center gap-1 shrink-0 text-[11px] bg-secondary/80 hover:bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border/60 transition-colors disabled:opacity-50"
                >
                  <Icon className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Input Form */}
        <div className="p-3 border-t border-border bg-background">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="তোমার প্রশ্নটি এখানে লিখো…"
              disabled={pending}
              className="text-sm bg-muted/40 focus-visible:ring-emerald-500"
            />
            <Button
              type="submit"
              size="icon"
              disabled={pending || !input.trim()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white shrink-0"
            >
              {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}

