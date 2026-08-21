"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  MessageSquarePlus,
  Sparkles,
  BookOpen,
  History,
  Lightbulb,
  ListChecks,
  PencilLine,
  Send,
  Loader2,
  type LucideIcon,
} from "lucide-react";
import { TutorChatPanel, type TutorChatMessage } from "@/components/tutor-chat-panel";
import { cn } from "@/lib/utils";

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

const STARTER_PROMPTS: { label: string; icon: LucideIcon; prompt: string }[] = [
  { label: "মূল ধারণাগুলো সংক্ষেপে বুঝিয়ে দাও", icon: Sparkles, prompt: "এই অধ্যায়ের মূল ধারণাগুলো সংক্ষেপে বুঝিয়ে দাও।" },
  { label: "একটি সহজ উদাহরণ দাও", icon: Lightbulb, prompt: "একটি সহজ, বাস্তব জীবনের উদাহরণ দিয়ে বুঝিয়ে দাও।" },
  { label: "গুরুত্বপূর্ণ সূত্র ও সংজ্ঞা", icon: ListChecks, prompt: "এই অধ্যায়ের গুরুত্বপূর্ণ সূত্র ও সংজ্ঞাগুলো তালিকা করে দাও।" },
  { label: "অনুশীলনের জন্য একটি প্রশ্ন দাও", icon: PencilLine, prompt: "আমাকে অনুশীলনের জন্য এই অধ্যায় থেকে একটি প্রশ্ন দাও।" },
];

/** Picks the first subject that actually has chapter data — the other subjects are placeholders with no content yet, so defaulting to one of those would just show an empty chapter list. */
function defaultSubject(subjects: Subject[]): Subject | undefined {
  return subjects.find((s) => s.chapters.length > 0) ?? subjects[0];
}

function relativeTimeBn(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "এখনই";
  if (minutes < 60) return `${minutes} মিনিট আগে`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ঘণ্টা আগে`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} দিন আগে`;
  return new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "short" });
}

const SESSION_GROUP_LABELS = ["আজ", "গতকাল", "গত ৭ দিন", "গত ৩০ দিন", "পুরনো"] as const;

/** Buckets sessions the way ChatGPT/Claude-style sidebars do — Today / Yesterday / Last 7 days / etc. — so a long history stays scannable instead of one flat list of dozens of items. Not a component, so Date.now() here doesn't trip the render-purity rule. */
function groupSessionsByRecency(sessions: SessionSummary[]): { label: string; items: SessionSummary[] }[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;
  const buckets = new Map<string, SessionSummary[]>();

  for (const s of sessions) {
    const updated = new Date(s.updated_at).getTime();
    const daysAgo = Math.floor((startOfToday - updated) / dayMs);
    const label =
      daysAgo <= 0 ? "আজ" : daysAgo === 1 ? "গতকাল" : daysAgo <= 7 ? "গত ৭ দিন" : daysAgo <= 30 ? "গত ৩০ দিন" : "পুরনো";
    if (!buckets.has(label)) buckets.set(label, []);
    buckets.get(label)!.push(s);
  }

  return SESSION_GROUP_LABELS.map((label) => ({ label, items: buckets.get(label) ?? [] })).filter(
    (g) => g.items.length > 0
  );
}

function SessionList({ sessions, activeSessionId, onOpen }: { sessions: SessionSummary[]; activeSessionId: string | null; onOpen: (id: string) => void }) {
  if (sessions.length === 0) {
    return <p className="text-xs text-muted-foreground p-2">এখনও কোনো কথোপকথন নেই।</p>;
  }
  const groups = groupSessionsByRecency(sessions);
  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="eyebrow text-[10px] text-muted-foreground px-2 pb-1">{group.label}</p>
          <div className="space-y-1">
            {group.items.map((s) => (
              <button
                key={s.id}
                onClick={() => onOpen(s.id)}
                className={`w-full text-left rounded-lg p-3 transition-colors ${
                  s.id === activeSessionId ? "bg-green/15 text-green-deep dark:text-green" : "hover:bg-muted"
                }`}
              >
                <p className="text-sm font-medium leading-snug line-clamp-2">{s.title || "কথোপকথন"}</p>
                <div className="flex items-center justify-between gap-2 mt-1">
                  <p className="text-xs text-muted-foreground truncate">
                    {s.context_json?.subjectName ?? ""}
                    {s.context_json?.chapterName ? ` • ${s.context_json.chapterName}` : ""}
                  </p>
                  <span className="text-[11px] text-muted-foreground shrink-0">{relativeTimeBn(s.updated_at)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Centered "how can I help" hero shown before the first real message —
 * modern chat UIs (Gemini, ChatGPT) lead with grounded suggestions instead
 * of a blank input, since an empty "Ask anything" field is what actually
 * stalls people out.
 */
function EmptyStateHero({
  chapterLabel,
  onPick,
  disabled,
}: {
  chapterLabel: string | null;
  onPick: (prompt: string) => void;
  disabled: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
      <div className="w-12 h-12 rounded-full bg-green/10 flex items-center justify-center text-green-deep dark:text-green mb-4">
        <Sparkles className="w-6 h-6" />
      </div>
      <h2 className="font-heading font-bold text-xl md:text-2xl">
        {chapterLabel ? `${chapterLabel} নিয়ে কী জানতে চাও?` : "কী নিয়ে সাহায্য করতে পারি?"}
      </h2>
      <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">
        {chapterLabel
          ? "নিচের যেকোনো একটি বেছে নাও, অথবা নিজের প্রশ্ন লেখো।"
          : "শুরু করতে একটি বিষয় ও অধ্যায় বেছে নাও।"}
      </p>

      <div className="grid sm:grid-cols-2 gap-3 mt-8 w-full max-w-lg">
        {STARTER_PROMPTS.map(({ label, icon: Icon, prompt }) => (
          <button
            key={label}
            type="button"
            disabled={disabled}
            onClick={() => onPick(prompt)}
            className="flex items-center gap-3 text-left rounded-xl border border-border bg-card hover:bg-muted/60 hover:border-green/40 transition-colors p-3.5 disabled:opacity-40 disabled:pointer-events-none"
          >
            <Icon className="w-4 h-4 text-green-deep dark:text-green shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </div>
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
  const initialSubject = defaultSubject(subjects);
  const [sessions, setSessions] = useState<SessionSummary[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<TutorChatMessage[]>([WELCOME]);
  const [pending, setPending] = useState(false);
  const [subjectId, setSubjectId] = useState<string>(initialSubject?.id ?? "");
  const [chapterId, setChapterId] = useState<string>(initialSubject?.chapters?.[0]?.id ?? "");
  const [loadingSession, setLoadingSession] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const selectedSubject = subjects.find((s) => s.id === subjectId);
  const selectedChapter = selectedSubject?.chapters.find((c) => c.id === chapterId);
  const isFreshConversation = !activeSessionId && messages.length <= 1;

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
            context_json: { subjectName: selectedSubject?.name_en, chapterName: selectedChapter?.title_en },
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
    <div className="flex h-full bg-background">
      {/* Sessions sidebar — desktop only, part of the same seamless shell (no
          nested card/border-radius). On mobile this lives in a slide-in sheet. */}
      <div className="hidden md:flex w-72 lg:w-80 shrink-0 border-r border-border flex-col bg-muted/10">
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
        {/* Slim context bar — no heavy toolbar chrome, just the subject/chapter picker. */}
        <div className="p-3 md:px-4 md:py-3 border-b border-border flex items-center gap-2">
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
            <SelectTrigger className="h-8 text-xs w-40 md:w-64" size="sm">
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

          <div className="flex-1" />

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
        ) : isFreshConversation ? (
          <div className={cn("flex-1 flex flex-col min-h-0")}>
            <EmptyStateHero
              chapterLabel={selectedChapter ? selectedChapter.title_bn || selectedChapter.title_en : null}
              onPick={handleSend}
              disabled={!chapterId || pending}
            />
            <div className="p-3 md:p-4 border-t border-border">
              <div className="max-w-2xl mx-auto w-full">
                <TutorComposer
                  onSend={handleSend}
                  pending={pending}
                  placeholder={chapterId ? "তোমার প্রশ্নটি এখানে লিখো…" : "প্রথমে একটি অধ্যায় বেছে নাও"}
                />
              </div>
            </div>
          </div>
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

/** Standalone composer for the empty-state hero — the full TutorChatPanel input, without the message list around it. */
function TutorComposer({
  onSend,
  pending,
  placeholder,
}: {
  onSend: (text: string) => void;
  pending: boolean;
  placeholder: string;
}) {
  const [input, setInput] = useState("");

  function submit() {
    const query = input.trim();
    if (!query || pending) return;
    onSend(query);
    setInput("");
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex gap-2 md:gap-3"
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        disabled={pending}
        className="flex-1 h-11 md:h-12 rounded-full bg-muted/40 px-5 text-sm md:text-base focus-visible:ring-green"
      />
      <Button
        type="submit"
        size="icon"
        disabled={pending || !input.trim()}
        aria-label="পাঠাও"
        className="bg-green-deep hover:bg-green text-white shrink-0 rounded-full size-11 md:size-12"
      >
        {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
      </Button>
    </form>
  );
}
