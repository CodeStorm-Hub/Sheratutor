"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/components/ui/sheet";
import { Sparkles, Lightbulb, Car, Calculator, HelpCircle } from "lucide-react";
import { TutorChatPanel, type TutorChatMessage } from "@/components/tutor-chat-panel";
import { streamTutorChatRequest } from "@/lib/tutor-chat-stream";

const QUICK_CHIPS = [
  { label: "সহজ ভাষায় বুঝিয়ে দাও", icon: Lightbulb, prompt: "আমাকে এই বিষয়টি একদম সহজ ভাষায় বুঝিয়ে বলো।" },
  { label: "বাস্তব জীবনের উদাহরণ", icon: Car, prompt: "বাস্তব জীবনের একটি পরিচিত উদাহরণ দিয়ে এটি ব্যাখ্যা করো।" },
  { label: "সঠিক সূত্র ও স্টেপ", icon: Calculator, prompt: "এই প্রশ্নের জন্য সঠিক সূত্র এবং স্টেপ বাই স্টেপ হিসাবটা কী হবে?" },
  { label: "আমার ভুল কোথায় ছিল?", icon: HelpCircle, prompt: "আমার উত্তরে মূল ভুলটা কোথায় হয়েছে তা পরিষ্কার করে বলো।" },
];

function welcomeMessage(stepName: string): TutorChatMessage {
  return {
    role: "assistant",
    text: `নমস্কার / আসসালামু আলাইকুম! **"${stepName}"** নিয়ে তোমার উত্তরের এই জায়গাটি নিয়ে আলোচনা করতে পারো। তোমার সুবিধার্থে আমি সহজ উদাহরণ ও সূত্রের সাহায্যে বুঝিয়ে দেবো।`,
  };
}

export function ExplainSimplyButton({
  questionText,
  stepName,
  observation,
  studentAnswerChunk,
  groundedContext,
  submissionId,
  questionId,
  rubricStepIndex,
}: {
  questionText: string;
  stepName: string;
  observation: string;
  studentAnswerChunk?: string;
  groundedContext?: string;
  submissionId: string;
  questionId: string;
  rubricStepIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorChatMessage[]>([welcomeMessage(stepName)]);
  const [pending, setPending] = useState(false);

  const loadExistingSession = useCallback(async () => {
    if (loaded) return;
    setLoaded(true);
    try {
      const params = new URLSearchParams({ submissionId, questionId, rubricStepIndex: String(rubricStepIndex) });
      const res = await fetch(`/api/tutor-chat/sessions?${params}`);
      const json = await res.json();
      if (!json.session) return;

      const detailRes = await fetch(`/api/tutor-chat/sessions/${json.session.id}`);
      const detail = await detailRes.json();
      if (!detail.messages?.length) return;

      setSessionId(json.session.id);
      setMessages(
        detail.messages.map((m: { role: "student" | "tutor"; content: string }) => ({
          role: m.role === "tutor" ? "assistant" : "student",
          text: m.content,
        }))
      );
    } catch {
      // Keep the local welcome message if the lookup fails — chat still works, just starts fresh.
    }
  }, [loaded, submissionId, questionId, rubricStepIndex]);

  async function handleSend(query: string) {
    const updatedHistory: TutorChatMessage[] = [...messages, { role: "student", text: query }];
    setMessages(updatedHistory);
    setPending(true);

    let assistantStarted = false;
    function appendOrUpdateAssistant(text: string) {
      setMessages((prev) => {
        if (!assistantStarted) {
          assistantStarted = true;
          return [...prev, { role: "assistant", text }];
        }
        const next = [...prev];
        next[next.length - 1] = { role: "assistant", text };
        return next;
      });
    }

    try {
      await streamTutorChatRequest(
        {
          sessionId,
          mode: "rubric",
          submissionId,
          questionId,
          rubricStepIndex,
          questionText,
          studentAnswerChunk: studentAnswerChunk ?? observation,
          rubricFailureReason: observation,
          groundedContext,
          studentMessage: query,
          languagePreference: "bn",
        },
        {
          onSession: (id) => setSessionId(id),
          onChunk: appendOrUpdateAssistant,
          onDone: appendOrUpdateAssistant,
          onRateLimited: (message) => appendOrUpdateAssistant(message),
          onError: (message) => appendOrUpdateAssistant(message),
        }
      );
    } catch {
      appendOrUpdateAssistant("দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।");
    } finally {
      setPending(false);
    }
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (next) loadExistingSession();
      }}
    >
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5 border-mint/30 text-mint-deep hover:bg-mint/10 dark:text-mint dark:hover:bg-mint/10 text-xs font-semibold"
        >
          <Sparkles className="w-3.5 h-3.5 text-mint-deep dark:text-mint" />
          বুঝিয়ে বলো
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-full sm:max-w-md md:max-w-lg flex flex-col p-0 h-full border-l border-border bg-background"
      >
        <SheetHeader className="p-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-mint/10 flex items-center justify-center text-mint-deep dark:text-mint">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <SheetTitle className="text-base font-heading font-bold text-foreground">
                SheraTutor — বুঝিয়ে বলো
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                Socratic AI Tutor • {stepName}
              </SheetDescription>
            </div>
          </div>

          <div className="mt-2 text-xs bg-card/60 p-2.5 rounded-md border border-border/80 space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-mono">
                মডেল ফিডব্যাক
              </Badge>
              <span className="truncate">{stepName}</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-2">{observation}</p>
          </div>
        </SheetHeader>

        <TutorChatPanel messages={messages} pending={pending} onSend={handleSend} quickChips={QUICK_CHIPS} />
      </SheetContent>
    </Sheet>
  );
}
