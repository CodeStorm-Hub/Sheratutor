'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { RenderMathText } from '@/components/render-math-text';
import {
  Sparkles,
  Send,
  Square,
  Copy,
  Check,
  Plus,
  BookOpen,
  MessageSquare,
  Clock,
  HelpCircle,
  Lightbulb,
  ArrowDown,
  Menu,
  X,
  Bot,
  User,
  GraduationCap,
  Calculator,
  ChevronRight,
  Flame,
  Compass,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type Chapter = { id: string; chapter_no: number; title_en: string; title_bn: string };
type Subject = { id: string; name_en: string; name_bn: string; chapters: Chapter[] };
type SessionSummary = {
  id: string;
  title: string | null;
  context_json: { subjectName?: string; chapterName?: string; chapterId?: string; subjectId?: string } | null;
  updated_at: string;
};

interface Message {
  id?: string;
  role: 'student' | 'assistant';
  text: string;
  isStreaming?: boolean;
}

export function TutorPageClient({
  subjects,
  initialSessions = [],
}: {
  subjects: Subject[];
  initialSessions?: SessionSummary[];
}) {
  const { language, t } = useLanguage();

  // Find initial subject that actually has chapters
  const initialSubject =
    subjects.find((s) => s.chapters && s.chapters.length > 0) || subjects[0];

  // Selected subject & chapter
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(initialSubject?.id ?? '');
  const currentSubject =
    subjects.find((s) => s.id === selectedSubjectId) || initialSubject || subjects[0];

  const sortedChapters = (currentSubject?.chapters ?? [])
    .slice()
    .sort((a, b) => (a.chapter_no || 0) - (b.chapter_no || 0));

  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    sortedChapters[0]?.id ?? ''
  );
  const currentChapter =
    sortedChapters.find((c) => c.id === selectedChapterId) || sortedChapters[0];

  // Sessions and messages state
  const [sessions, setSessions] = useState<SessionSummary[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Subject change handler
  const handleSubjectChange = (id: string) => {
    setSelectedSubjectId(id);
    const sub = subjects.find((s) => s.id === id);
    const chs = (sub?.chapters ?? []).slice().sort((a, b) => (a.chapter_no || 0) - (b.chapter_no || 0));
    if (chs.length > 0) {
      setSelectedChapterId(chs[0].id);
    } else {
      setSelectedChapterId('');
    }
  };

  // Scroll to bottom helper
  const scrollToBottom = useCallback((smooth = true) => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
    }
  }, []);

  // Monitor scroll position to show/hide scroll-to-bottom floating button
  const handleScroll = () => {
    const el = chatScrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollBottom(distanceToBottom > 120);
  };

  // Auto-scroll when messages update
  useEffect(() => {
    if (!showScrollBottom) {
      scrollToBottom();
    }
  }, [messages, isGenerating, showScrollBottom, scrollToBottom]);

  // Adjust textarea height dynamically
  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  // Start new session
  const startNewSession = () => {
    if (isGenerating && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
    setActiveSessionId(null);
    setMessages([]);
    setPrompt('');
    setMobileSidebarOpen(false);
  };

  // Load existing session history
  const selectSession = async (sess: SessionSummary) => {
    if (isGenerating && abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
    }
    setActiveSessionId(sess.id);
    setMobileSidebarOpen(false);

    try {
      const res = await fetch(`/api/tutor-chat/sessions/${sess.id}`);
      if (!res.ok) throw new Error('Failed to load session');
      const data = await res.json();
      if (data.messages) {
        setMessages(
          data.messages.map((m: { id: string; role: string; content: string }) => ({
            id: m.id,
            role: m.role === 'student' ? 'student' : 'assistant',
            text: m.content,
          }))
        );
      }
    } catch {
      toast.error(language === 'bn' ? 'সেশন লোড করতে ব্যর্থ হয়েছে' : 'Failed to load conversation');
    }
  };

  // Copy message text to clipboard
  const copyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success(language === 'bn' ? 'টেক্সট কপি করা হয়েছে!' : 'Copied to clipboard!');
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Stop Generation
  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last && last.role === 'assistant') {
          return [...prev.slice(0, -1), { ...last, isStreaming: false }];
        }
        return prev;
      });
      toast.info(language === 'bn' ? 'উত্তর তৈরি বন্ধ করা হয়েছে' : 'Generation stopped');
    }
  };

  const [scaffoldingStyle] = useState<'socratic' | 'direct'>('socratic');


  // Submit Question with Real-time SSE Token Streaming
  const submitQuestion = async (textToSend?: string) => {
    const query = (textToSend ?? prompt).trim();
    if (!query || isGenerating) return;

    // Reset prompt and textarea
    setPrompt('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    // Append student message and empty streaming assistant bubble
    const userMessage: Message = { role: 'student', text: query };
    const tempAssistantMessage: Message = { role: 'assistant', text: '', isStreaming: true };
    const updatedMessages = [...messages, userMessage, tempAssistantMessage];
    setMessages(updatedMessages);
    setIsGenerating(true);

    // Setup abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          mode: 'general',
          sessionId: activeSessionId,
          subjectId: currentSubject?.id,
          chapterId: currentChapter?.id,
          studentMessage: query,
          languagePreference: language === 'en' ? 'en' : 'bn',
          scaffoldingStyle,
          stream: true,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error (${res.status})`);
      }

      // Read Server-Sent Events stream
      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let accumulatedText = '';
        let resolvedSessionId = activeSessionId;
        let buffer = '';

        const processLine = (line: string) => {
          const trimmed = line.trim();
          if (trimmed.startsWith('data: ')) {
            const jsonStr = trimmed.slice(6);
            try {
              const event = JSON.parse(jsonStr);
              if (event.type === 'start' && event.sessionId) {
                resolvedSessionId = event.sessionId;
                setActiveSessionId(event.sessionId);
              } else if (event.type === 'chunk' && event.text) {
                accumulatedText += event.text;
                setMessages((prev) => {
                  const newArr = [...prev];
                  const lastIdx = newArr.length - 1;
                  if (lastIdx >= 0 && newArr[lastIdx].role === 'assistant') {
                    newArr[lastIdx] = {
                      ...newArr[lastIdx],
                      text: accumulatedText,
                      isStreaming: true,
                    };
                  }
                  return newArr;
                });
              } else if (event.type === 'done') {
                const finalReply = event.reply || accumulatedText;
                if (event.sessionId) {
                  resolvedSessionId = event.sessionId;
                  setActiveSessionId(event.sessionId);
                }
                setMessages((prev) => {
                  const newArr = [...prev];
                  const lastIdx = newArr.length - 1;
                  if (lastIdx >= 0 && newArr[lastIdx].role === 'assistant') {
                    newArr[lastIdx] = {
                      ...newArr[lastIdx],
                      text: finalReply,
                      isStreaming: false,
                    };
                  }
                  return newArr;
                });

                // Update recent sessions list if new session
                if (resolvedSessionId && !sessions.some((s) => s.id === resolvedSessionId)) {
                  setSessions((prev) => [
                    {
                      id: resolvedSessionId!,
                      title: query.slice(0, 40),
                      context_json: {
                        subjectName: currentSubject?.name_en,
                        chapterName: currentChapter?.title_en,
                        subjectId: currentSubject?.id,
                        chapterId: currentChapter?.id,
                      },
                      updated_at: new Date().toISOString(),
                    },
                    ...prev,
                  ]);
                }
              } else if (event.type === 'error') {
                throw new Error(event.error || 'Stream error occurred');
              }
            } catch {
              // Ignore parsing chunk split across network boundaries
            }
          }
        };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
            processLine(line);
          }
        }

        if (buffer.trim()) {
          processLine(buffer);
        }
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return;
      }
      setMessages((prev) => {
        const newArr = [...prev];
        const lastIdx = newArr.length - 1;
        if (lastIdx >= 0 && newArr[lastIdx].role === 'assistant') {
          newArr[lastIdx] = {
            ...newArr[lastIdx],
            text:
              language === 'bn'
                ? 'দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।'
                : 'Sorry, a connection error occurred. Please try again.',
            isStreaming: false,
          };
        }
        return newArr;
      });
      toast.error(language === 'bn' ? 'সংযোগ সমস্যা হয়েছে' : 'Connection error');
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  const subjectDisplayName =
    language === 'bn'
      ? currentSubject?.name_bn || currentSubject?.name_en || 'পদার্থবিজ্ঞান'
      : currentSubject?.name_en || 'Physics';

  const chapterDisplayName =
    currentChapter
      ? language === 'bn'
        ? currentChapter.title_bn || currentChapter.title_en
        : currentChapter.title_en
      : language === 'bn'
      ? 'সাধারণ টিউটর'
      : 'General Discussion';

  // Quick suggestion prompts for the current chapter
  const quickPrompts =
    language === 'bn'
      ? [
          { label: 'কোথায় নম্বর কাটা যায়?', prompt: `${chapterDisplayName} অধ্যায়ে বোর্ড পরীক্ষায় শিক্ষার্থীরা সাধারণত কোথায় নম্বর হারায়?` },
          { label: 'বাস্তব জীবনের উদাহরণ', prompt: `${chapterDisplayName} অধ্যায়ের মূল ধারণার বাস্তব জীবনের সহজ উদাহরণ দাও।` },
          { label: 'বোর্ড স্ট্যান্ডার্ড সৃজনশীল', prompt: `${chapterDisplayName} অধ্যায় থেকে ১টি বোর্ড স্ট্যান্ডার্ড সৃজনশীল প্রশ্ন ও উত্তর তৈরি করো।` },
        ]
      : [
          { label: 'Common Pitfalls', prompt: `What are the most common mistakes students make in ${chapterDisplayName}?` },
          { label: 'Real-life Analogy', prompt: `Explain the core concepts of ${chapterDisplayName} using everyday analogies.` },
          { label: 'Board CQ Question', prompt: `Generate a standard board-style Creative Question (CQ) with step-by-step solutions for ${chapterDisplayName}.` },
        ];

  const hintTag = (tone: 'mint' | 'sun' | 'coral') =>
    cn(
      'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold',
      tone === 'mint' && 'bg-green-soft text-green',
      tone === 'sun' && 'bg-ochre-soft text-ochre',
      tone === 'coral' && 'bg-coral-soft text-cta',
    );

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title={t('tutor.title')} description={t('tutor.desc')}>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="grid size-9 place-items-center rounded-lg border border-border lg:hidden"
            onClick={() => setMobileSidebarOpen((v) => !v)}
            aria-label="Toggle navigation drawer"
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-cta px-4 py-2 text-sm font-semibold text-cta-foreground shadow-sm transition-colors hover:opacity-90"
            onClick={startNewSession}
          >
            <Plus size={16} />
            <span>{t('tutor.new_session')}</span>
          </button>
        </div>
      </PageHeader>

      <div className="relative grid h-[calc(100vh-240px)] max-h-[850px] min-h-[560px] w-full gap-5 lg:grid-cols-[310px_minmax(0,1fr)]">
        {mobileSidebarOpen && (
          <button
            type="button"
            aria-label={language === 'bn' ? 'মেনু বন্ধ করো' : 'Close menu'}
            className="fixed inset-0 z-40 bg-black/30 lg:hidden"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Left navigation sidebar */}
        <aside
          className={cn(
            'flex h-full flex-col gap-3.5 overflow-y-auto rounded-2xl border border-border bg-surface-1 p-4',
            mobileSidebarOpen
              ? 'fixed inset-y-0 left-0 z-50 w-[300px] max-w-[85vw] lg:static lg:w-auto'
              : 'hidden lg:flex',
          )}
        >
          {/* Subject selector */}
          <div className="rounded-xl border border-border p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-2xs font-bold tracking-wide text-muted-foreground uppercase">
                {language === 'bn' ? 'বিষয় নির্বাচন' : 'SELECT SUBJECT'}
              </span>
              <span className="rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-green">
                {subjectDisplayName}
              </span>
            </div>
            <select
              id="tutor-subject"
              name="subject"
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              aria-label="Select Subject"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium outline-none transition-colors focus:border-cta"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {language === 'bn' ? s.name_bn || s.name_en : s.name_en}
                </option>
              ))}
            </select>
          </div>

          {/* Chapters */}
          <div className="flex items-center gap-2 font-mono text-2xs font-bold tracking-wide text-muted-foreground uppercase">
            <BookOpen size={14} />
            <span>{language === 'bn' ? 'অধ্যায়সমূহ' : 'CHAPTERS'}</span>
          </div>

          <div className="flex max-h-[220px] flex-col gap-1.5 overflow-y-auto pr-1">
            {sortedChapters.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border px-3 py-5">
                <Compass size={20} className="mb-1.5 text-muted-foreground opacity-60" />
                <p className="text-center text-xs leading-relaxed text-muted-foreground">
                  {language === 'bn'
                    ? 'এই বিষয়ের অধ্যায় শীঘ্রই যুক্ত হচ্ছে।'
                    : 'No chapters available yet for this subject.'}
                </p>
              </div>
            ) : (
              sortedChapters.map((c, i) => {
                const isSelected = c.id === selectedChapterId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setSelectedChapterId(c.id);
                      setMobileSidebarOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left text-xs font-medium transition-colors',
                      isSelected
                        ? 'border-cta/40 bg-surface-2 text-foreground'
                        : 'border-transparent text-muted-foreground hover:bg-surface-2 hover:text-foreground',
                    )}
                  >
                    <span className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-xs">
                      {String(c.chapter_no || i + 1).padStart(2, '0')}
                    </span>
                    <span className="flex-1 truncate">
                      {language === 'bn' ? c.title_bn || c.title_en : c.title_en}
                    </span>
                    {isSelected && <Check size={14} className="shrink-0 text-green" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Recent chats */}
          {sessions.length > 0 && (
            <div>
              <div className="mt-3 flex items-center gap-2 font-mono text-2xs font-bold tracking-wide text-muted-foreground uppercase">
                <Clock size={14} />
                <span>{language === 'bn' ? 'পূর্বের আলোচনা' : 'RECENT CHATS'}</span>
              </div>
              <div className="mt-2 flex max-h-[160px] flex-col gap-1 overflow-y-auto">
                {sessions.slice(0, 8).map((sess) => {
                  const isActive = sess.id === activeSessionId;
                  return (
                    <button
                      key={sess.id}
                      type="button"
                      onClick={() => selectSession(sess)}
                      className={cn(
                        'flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-xs transition-colors',
                        isActive
                          ? 'border-cta/40 bg-surface-2 text-foreground'
                          : 'border-transparent text-muted-foreground hover:bg-surface-1 hover:text-foreground',
                      )}
                    >
                      <MessageSquare size={13} className="shrink-0 opacity-70" />
                      <span className="flex-1 truncate text-left">
                        {sess.title || (language === 'bn' ? 'প্রশ্নোত্তর সেশন' : 'Tutoring session')}
                      </span>
                      <ChevronRight size={12} className="shrink-0 opacity-40" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Model badge */}
          <div className="mt-auto rounded-xl border border-border bg-surface-1 p-3">
            <div className="flex items-center gap-2">
              <span className="size-[7px] animate-pulse rounded-full bg-green" />
              <span className="text-xs font-semibold text-foreground">Shera AI Engine</span>
            </div>
            <p className="mt-0.5 text-xs text-muted-foreground">NCTB Curriculum • Llama 3.1 70B</p>
          </div>
        </aside>

        {/* Chat canvas */}
        <section className="relative flex h-full min-h-0 flex-col overflow-hidden rounded-2xl border border-border bg-surface-1">
          <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-border bg-surface-1/90 px-4 py-3.5 backdrop-blur-sm sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="grid size-8 flex-none place-items-center rounded-lg bg-cta text-cta-foreground">
                <Sparkles size={16} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="truncate text-sm font-bold">{chapterDisplayName}</h2>
                  <span className="hidden rounded-full border border-border bg-surface-2 px-2 py-0.5 text-xs font-semibold text-green sm:inline">
                    {subjectDisplayName}
                  </span>
                </div>
                <p className="truncate text-xs text-muted-foreground">
                  {language === 'bn'
                    ? 'সহজ উদাহরণ, নিখুঁত সূত্র ও বোর্ড রুব্রিকের সাহায্যে বোঝানো হবে'
                    : 'Interactive Socratic tutoring with KaTeX formula rendering & NCTB rubrics'}
                </p>
              </div>
            </div>

            {messages.length > 0 && (
              <button
                type="button"
                onClick={startNewSession}
                className="inline-flex flex-none items-center gap-1.5 rounded-lg border border-border bg-surface-1 px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
                title={language === 'bn' ? 'নতুন সেশন শুরু করুন' : 'New session'}
              >
                <Plus size={14} />
                <span className="hidden sm:inline">{language === 'bn' ? 'নতুন আলাপ' : 'New'}</span>
              </button>
            )}
          </div>

          {/* Messages */}
          <div
            ref={chatScrollContainerRef}
            onScroll={handleScroll}
            className="flex flex-1 flex-col gap-5 overflow-y-auto px-4 py-5 sm:px-6"
            role="log"
            aria-live="polite"
          >
            {messages.length === 0 && (
              <div className="flex flex-col gap-5">
                <div className="rounded-2xl border border-border bg-surface-1 p-5">
                  <div className="mb-3 flex items-start gap-3">
                    <div className="grid size-10 flex-none place-items-center rounded-xl bg-cta text-cta-foreground">
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <h3 className="font-heading text-base font-bold">
                        {language === 'bn'
                          ? `চলো "${chapterDisplayName}" অধ্যায়টি সহজভাবে বুঝে নিই!`
                          : `Let's master "${chapterDisplayName}" together!`}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {language === 'bn'
                          ? 'তোমার যেকোনো দ্বিধা বা জটিল সূত্রের ব্যাখ্যা জিজ্ঞেস করতে পারো।'
                          : 'Ask any concept, formula derivation, or board exam question.'}
                      </p>
                    </div>
                  </div>

                  <div className="my-3.5 rounded-xl border border-border bg-background px-5 py-3.5">
                    <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-foreground">
                      <Calculator size={14} className="text-mint" />
                      <span>{language === 'bn' ? 'অধ্যায়ের মূল সূত্রমালা' : 'Core Concept Highlight'}</span>
                    </div>
                    <div className="flex flex-col gap-1 overflow-x-auto py-1 text-sm">
                      <RenderMathText text={`$$W = \\vec{F} \\cdot \\vec{s} = F s \\cos\\theta$$`} inline={false} />
                      <RenderMathText text={`$$\\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$`} inline={false} />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={hintTag('mint')}>
                      <Check size={12} /> {language === 'bn' ? 'বোর্ড রুব্রিক মেনে ব্যাখ্যা' : 'NCTB Rubric Verified'}
                    </span>
                    <span className={hintTag('sun')}>
                      <Flame size={12} /> {language === 'bn' ? 'সচরাচর ভুলের সতর্কতা' : 'Mistake Detection'}
                    </span>
                    <span className={hintTag('coral')}>
                      <Sparkles size={12} /> {language === 'bn' ? 'রিয়েল-টাইম স্ট্রিমিং' : 'Real-time Streaming'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-mono text-2xs font-bold tracking-wide text-muted-foreground uppercase">
                    {language === 'bn' ? 'প্রস্তাবিত কিছু প্রশ্ন' : 'SUGGESTED QUESTIONS'}
                  </span>
                  <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => submitQuestion(qp.prompt)}
                        className="w-full rounded-xl border border-border bg-surface-1 p-3.5 text-left transition-colors hover:border-cta/40"
                      >
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-mint">
                          <Lightbulb size={14} />
                          <span>{qp.label}</span>
                        </div>
                        <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{qp.prompt}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div key={idx} className={cn('flex w-full gap-3.5', !isAssistant && 'flex-row-reverse')}>
                  <div className="flex-none">
                    {isAssistant ? (
                      <div className="grid size-[30px] place-items-center rounded-lg bg-cta text-cta-foreground">
                        <Bot size={15} />
                      </div>
                    ) : (
                      <div className="grid size-[30px] place-items-center rounded-lg bg-navy text-surface-1">
                        <User size={15} />
                      </div>
                    )}
                  </div>

                  <div className={cn('flex max-w-[88%] flex-col gap-1.5', !isAssistant && 'items-end')}>
                    <div
                      className={cn(
                        'rounded-2xl px-4 py-3 text-sm leading-relaxed',
                        isAssistant ? 'bg-surface-2' : 'bg-cta text-cta-foreground',
                      )}
                    >
                      {m.text ? (
                        <div className="break-words">
                          <RenderMathText text={m.text} inline={false} />
                          {m.isStreaming && (
                            <span className="ml-1 inline-block h-3.5 w-1.5 animate-pulse bg-green align-middle" />
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 py-1 text-xs text-muted-foreground">
                          <span className="flex gap-1">
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                          </span>
                          <span>{language === 'bn' ? 'টিউটর চিন্তা করছে ও লিখছে…' : 'Generating response…'}</span>
                        </div>
                      )}
                    </div>

                    {isAssistant && m.text && !m.isStreaming && (
                      <div className="flex items-center gap-2 pl-1">
                        <button
                          type="button"
                          onClick={() => copyMessage(m.text, idx)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check size={12} className="text-mint" />
                              <span className="text-mint">{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={12} />
                              <span>{language === 'bn' ? 'কপি' : 'Copy'}</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            <div ref={messagesEndRef} />
          </div>

          {showScrollBottom && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="absolute right-6 bottom-[92px] z-20 grid size-9 place-items-center rounded-full border border-border bg-surface-1 shadow-md transition-colors hover:bg-accent"
              aria-label="Scroll to newest messages"
            >
              <ArrowDown size={16} />
            </button>
          )}

          {messages.length > 0 && !isGenerating && (
            <div className="flex-shrink-0 border-t border-border bg-surface-1 px-4 py-2 sm:px-6">
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="inline-flex shrink-0 items-center gap-1 text-xs font-semibold whitespace-nowrap text-muted-foreground">
                  <HelpCircle size={12} /> {language === 'bn' ? 'পরবর্তী প্রশ্ন:' : 'Follow-up:'}
                </span>
                {[
                  language === 'bn' ? 'এটি একটি বাস্তব জীবনের উদাহরণ দিয়ে বুঝিয়ে দাও।' : 'Explain this with a real-life analogy.',
                  language === 'bn' ? 'এই সূত্রের একক ও মাত্রা কীভাবে বের করবো?' : 'How to derive the units and dimensions?',
                  language === 'bn' ? 'বোর্ডে এই সংক্রান্ত ৩ বা ৪ নম্বরের প্রশ্ন কেমন হয়?' : 'What does a 3 or 4 mark board question look like?',
                ].map((q, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => submitQuestion(q)}
                    className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-surface-1 px-2.5 py-1 text-xs font-medium whitespace-nowrap transition-colors hover:bg-accent"
                  >
                    {[
                      language === 'bn' ? 'বাস্তব উদাহরণ' : 'Real-life example',
                      language === 'bn' ? 'একক ও মাত্রা' : 'Units & dimensions',
                      language === 'bn' ? 'বোর্ড ৩/৪ নম্বর প্রশ্ন' : 'Board 3-4 mark CQ',
                    ][i]}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input dock */}
          <div className="flex-shrink-0 border-t border-border bg-surface-1 px-4 pt-3 pb-2.5 sm:px-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitQuestion();
              }}
              className="flex items-end gap-2.5 rounded-2xl border border-border bg-surface-1 px-3 py-2 transition-colors focus-within:border-cta"
            >
              <textarea
                ref={textareaRef}
                id="tutor-prompt"
                name="prompt"
                value={prompt}
                onChange={handleTextareaInput}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submitQuestion();
                  }
                }}
                placeholder={t('tutor.ask_placeholder')}
                disabled={isGenerating}
                rows={1}
                aria-label="Type your message"
                className="max-h-[120px] flex-1 resize-none border-0 bg-transparent py-1 text-sm leading-normal outline-none"
              />
              <div className="flex-none">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-mark px-2.5 py-1.5 text-cta-foreground"
                    title={language === 'bn' ? 'উত্তর তৈরি থামান' : 'Stop generating'}
                  >
                    <Square size={14} />
                    <span className="text-xs">{language === 'bn' ? 'থামাও' : 'Stop'}</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    aria-label="Send message"
                    className="grid size-8 place-items-center rounded-lg bg-cta text-cta-foreground transition-opacity disabled:opacity-50"
                  >
                    <Send size={15} />
                  </button>
                )}
              </div>
            </form>
            <div className="mt-1 text-center text-xs text-muted-foreground">
              <span>
                {language === 'bn'
                  ? 'Enter চাপুন পাঠাতে • Shift + Enter নতুন লাইনের জন্য'
                  : 'Press Enter to send • Shift + Enter for new line'}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
