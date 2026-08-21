"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { MessageSquarePlus, Sparkles, BookOpen, History } from "lucide-react";
import { TutorChatPanel, type TutorChatMessage } from "@/components/tutor-chat-panel";

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

function SessionList({ sessions, activeSessionId, onOpen }: { sessions: SessionSummary[]; activeSessionId: string | null; onOpen: (id: string) => void }) {
  if (sessions.length === 0) {
    return <p className="text-xs text-muted-foreground p-2">এখনও কোনো কথোপকথন নেই।</p>;
  }
  return (
    <div className="space-y-1">
      {sessions.map((s) => (
        <button
          key={s.id}
          onClick={() => onOpen(s.id)}
          className={`w-full text-left text-xs rounded-lg p-2.5 transition-colors ${
            s.id === activeSessionId ? "bg-green/15 text-green-deep dark:text-green" : "hover:bg-muted"
          }`}
        >
          <p className="font-medium truncate">{s.title || "কথোপকথন"}</p>
          <p className="text-muted-foreground truncate mt-0.5">
            {s.context_json?.subjectName ?? ""} {s.context_json?.chapterName ? `• ${s.context_json.chapterName}` : ""}
          </p>
        </button>
      ))}
    </div>
  );
}

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
    setHistoryOpen(false);
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

    try {
      const res = await fetch("/api/tutor-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: activeSessionId,
          mode: "general",
          subjectId,
          chapterId,
          studentMessage: query,
          languagePreference: "bn",
        }),
      });

      if (res.status === 429) {
        const json = await res.json();
        setMessages([...updatedHistory, { role: "assistant", text: json.message }]);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch response");
      const json = await res.json();

      if (!activeSessionId) {
        setActiveSessionId(json.sessionId);
        setSessions((prev) => [
          {
            id: json.sessionId,
            title: query.slice(0, 40),
            context_json: { subjectName: selectedSubject?.name_en, chapterName: selectedSubject?.chapters.find((c) => c.id === chapterId)?.title_en },
            updated_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      }
      setMessages([...updatedHistory, { role: "assistant", text: json.reply }]);
    } catch {
      setMessages([
        ...updatedHistory,
        { role: "assistant", text: "দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।" },
      ]);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex h-full border border-border rounded-xl overflow-hidden bg-card">
      {/* Sessions sidebar — desktop only. On mobile this lives in a slide-in sheet instead. */}
      <div className="hidden md:flex w-64 shrink-0 border-r border-border flex-col bg-muted/20">
        <div className="p-3 border-b border-border">
          <Button size="sm" className="w-full gap-1.5" variant="outline" onClick={startNewConversation}>
            <MessageSquarePlus className="w-3.5 h-3.5" />
            নতুন কথোপকথন
          </Button>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2">
            <SessionList sessions={sessions} activeSessionId={activeSessionId} onOpen={openSession} />
          </div>
        </ScrollArea>
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="p-3 border-b border-border bg-muted/30 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green/10 flex items-center justify-center text-green-deep dark:text-green shrink-0">
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
              <SelectTrigger className="h-8 text-xs w-28 md:w-36" size="sm">
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
              <SelectTrigger className="h-8 text-xs flex-1 min-w-0" size="sm">
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

          {/* Mobile: sessions live behind this history sheet trigger. */}
          <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="কথোপকথনের ইতিহাস দেখাও" className="md:hidden shrink-0">
                <History className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0 flex flex-col">
              <SheetHeader className="p-4 border-b border-border">
                <SheetTitle className="text-sm">কথোপকথনের ইতিহাস</SheetTitle>
              </SheetHeader>
              <div className="p-3 border-b border-border">
                <Button size="sm" className="w-full gap-1.5" variant="outline" onClick={startNewConversation}>
                  <MessageSquarePlus className="w-3.5 h-3.5" />
                  নতুন কথোপকথন
                </Button>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-2">
                  <SessionList sessions={sessions} activeSessionId={activeSessionId} onOpen={openSession} />
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
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
