"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquarePlus, Sparkles, BookOpen, History } from "lucide-react";
import { TutorChatPanel, type TutorChatMessage } from "@/components/tutor-chat-panel";
import { streamTutorChatRequest } from "@/lib/tutor-chat-stream";

type Chapter = { id: string; chapter_no: number; title_en: string; title_bn: string };
type Subject = { id: string; name_en: string; name_bn: string; chapters: Chapter[] };
type SessionSummary = {
  id: string;
  title: string | null;
  context_json: { subjectName?: string; chapterName?: string } | null;
  updated_at: string;
};

const WELCOME: TutorChatMessage = {
  role: "assistant",
  text: "একটি বিষয় ও অধ্যায় বেছে নাও, তারপর তোমার প্রশ্ন লেখো — আমি NCTB পাঠ্যবই অনুযায়ী সহজ করে বুঝিয়ে দেবো।",
};

export function TutorPageClient({
  subjects,
  initialSessions,
}: {
  subjects: Subject[];
  initialSessions: SessionSummary[];
}) {
  const [sessions, setSessions] = useState<SessionSummary[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorChatMessage[]>([WELCOME]);
  const [pending, setPending] = useState(false);
  const [subjectId, setSubjectId] = useState<string>(subjects[0]?.id ?? "");
  const [chapterId, setChapterId] = useState<string>(subjects[0]?.chapters?.[0]?.id ?? "");
  const [loadingSession, setLoadingSession] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === subjectId);

  function startNewConversation() {
    setActiveSessionId(null);
    setMessages([WELCOME]);
  }

  async function openSession(id: string) {
    setHistoryOpen(false);
    if (id === activeSessionId) return;
    setLoadingSession(true);
    try {
      const res = await fetch(`/api/tutor-chat/sessions/${id}`);
      const json = await res.json();
      if (!json.messages) return;
      setActiveSessionId(id);
      setMessages(
        json.messages.map((m: { role: "student" | "tutor"; content: string }) => ({
          role: m.role === "tutor" ? "assistant" : "student",
          text: m.content,
        }))
      );
    } finally {
      setLoadingSession(false);
    }
  }

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

    const isNewSession = !activeSessionId;

    try {
      await streamTutorChatRequest(
        {
          sessionId: activeSessionId,
          mode: "general",
          subjectId,
          chapterId,
          studentMessage: query,
          languagePreference: "bn",
        },
        {
          onSession: (sessionId) => {
            if (isNewSession) {
              setActiveSessionId(sessionId);
              setSessions((prev) => [
                {
                  id: sessionId,
                  title: query.slice(0, 40),
                  context_json: {
                    subjectName: selectedSubject?.name_en,
                    chapterName: selectedSubject?.chapters.find((c) => c.id === chapterId)?.title_en,
                  },
                  updated_at: new Date().toISOString(),
                },
                ...prev,
              ]);
            }
          },
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

  const sessionList = (
    <>
      <div className="p-3 border-b border-border">
        <Button size="sm" className="w-full gap-1.5" variant="outline" onClick={startNewConversation}>
          <MessageSquarePlus className="w-3.5 h-3.5" />
          নতুন কথোপকথন
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-muted-foreground p-2">এখনও কোনো কথোপকথন নেই।</p>
          )}
          {sessions.map((s) => (
            <button
              key={s.id}
              onClick={() => openSession(s.id)}
              className={`w-full text-left text-xs rounded-lg p-2.5 transition-colors ${
                s.id === activeSessionId ? "bg-mint/15 text-mint-deep dark:text-mint" : "hover:bg-muted"
              }`}
            >
              <p className="font-medium truncate">{s.title || "কথোপকথন"}</p>
              <p className="text-muted-foreground truncate mt-0.5">
                {s.context_json?.subjectName ?? ""} {s.context_json?.chapterName ? `• ${s.context_json.chapterName}` : ""}
              </p>
            </button>
          ))}
        </div>
      </ScrollArea>
    </>
  );

  return (
    <div className="flex h-full border border-border rounded-xl overflow-hidden bg-card">
      {/* Session history: persistent column on md:+, Sheet drawer below md: */}
      <div className="hidden md:flex md:w-64 md:shrink-0 border-r border-border flex-col bg-muted/20">
        {sessionList}
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden shrink-0 h-9 w-9" aria-label="কথোপকথনের ইতিহাস">
                <History className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle>কথোপকথনের ইতিহাস</SheetTitle>
              </SheetHeader>
              {sessionList}
            </SheetContent>
          </Sheet>
          <div className="w-8 h-8 rounded-full bg-mint/10 flex items-center justify-center text-mint-deep dark:text-mint shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Select
              value={subjectId}
              disabled={!!activeSessionId}
              onValueChange={(v) => {
                setSubjectId(v);
                setChapterId(subjects.find((s) => s.id === v)?.chapters?.[0]?.id ?? "");
              }}
            >
              <SelectTrigger className="h-9 text-xs w-28 sm:w-36" size="sm">
                <BookOpen className="w-3 h-3" />
                <SelectValue placeholder="বিষয়" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.name_en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={chapterId} disabled={!!activeSessionId} onValueChange={setChapterId}>
              <SelectTrigger className="h-9 text-xs flex-1 min-w-0" size="sm">
                <SelectValue placeholder="অধ্যায়" />
              </SelectTrigger>
              <SelectContent>
                {selectedSubject?.chapters
                  ?.sort((a, b) => a.chapter_no - b.chapter_no)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.chapter_no}. {c.title_en}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {loadingSession ? (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">লোড হচ্ছে…</div>
        ) : (
          <TutorChatPanel
            messages={messages}
            pending={pending}
            onSend={handleSend}
            inputPlaceholder={chapterId ? "তোমার প্রশ্নটি এখানে লিখো…" : "প্রথমে একটি অধ্যায় বেছে নাও"}
          />
        )}
      </div>
    </div>
  );
}
