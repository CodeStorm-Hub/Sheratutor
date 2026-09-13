'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { streamFlow } from '@genkit-ai/next/client';
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
  Volume2,
  Mic,
  MicOff,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import {
  sanitizeTutorReply,
  parseTutorDirectives,
  type HintRung,
} from '@/lib/tutor-format';

const MATH_SYMBOLS = [
  { label: 'ms⁻¹', insert: '$\\text{ms}^{-1}$ ' },
  { label: 'ms⁻²', insert: '$\\text{ms}^{-2}$ ' },
  { label: 'kg', insert: '$\\text{kg}$ ' },
  { label: 'N', insert: '$\\text{N}$ ' },
  { label: 'J', insert: '$\\text{J}$ ' },
  { label: 'W', insert: '$\\text{W}$ ' },
  { label: 'Pa', insert: '$\\text{Pa}$ ' },
  { label: 'F=ma', insert: '$F = ma$ ' },
  { label: 'v=u+at', insert: '$v = u + at$ ' },
  { label: 's=ut+½at²', insert: '$s = ut + \\frac{1}{2}at^2$ ' },
  { label: 'θ', insert: '$\\theta$ ' },
  { label: 'λ', insert: '$\\lambda$ ' },
  { label: 'Δ', insert: '$\\Delta$ ' },
  { label: '→', insert: '$\\rightarrow$ ' },
  { label: '⇌', insert: '$\\rightleftharpoons$ ' },
  { label: 'Zn²⁺', insert: '$\\text{Zn}^{2+}$ ' },
  { label: 'NH₃', insert: '$NH_3$ ' },
];

type Chapter = { id: string; chapter_no: number; title_en: string; title_bn: string };
type Subject = { id: string; code?: string; name_en: string; name_bn: string; chapters: Chapter[] };
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

  // Keep state in sync when subjects are provided or updated
  useEffect(() => {
    if ((!selectedSubjectId || !subjects.some(s => s.id === selectedSubjectId)) && subjects.length > 0) {
      const initSub = subjects.find((s) => s.chapters && s.chapters.length > 0) || subjects[0];
      if (initSub) {
        setSelectedSubjectId(initSub.id);
        const chs = (initSub.chapters ?? []).slice().sort((a, b) => (a.chapter_no || 0) - (b.chapter_no || 0));
        if (chs.length > 0) {
          setSelectedChapterId(chs[0].id);
        }
      }
    }
  }, [subjects, selectedSubjectId]);

  // Sessions and messages state
  const [sessions, setSessions] = useState<SessionSummary[]>(initialSessions);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Socratic Scaffolding & Hint Ladder State
  const [activeHintRung, setActiveHintRung] = useState<HintRung>(0);
  const [isListening, setIsListening] = useState(false);
  const [ticketAnswers, setTicketAnswers] = useState<Record<string, { selected: string; isCorrect: boolean }>>({});
  const [showFormulaBar, setShowFormulaBar] = useState(false);

  // References
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatScrollContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Web Speech API Voice Recognition
  const handleVoiceInput = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      toast.error(
        language === 'bn'
          ? 'তোমার ব্রাউজারে স্পিচ রিকগনিশন সাপোর্ট নেই। অনুগ্রহ করে গুগল ক্রোম ব্যবহার করো।'
          : 'Speech recognition is not supported in this browser. Please use Google Chrome.'
      );
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onerror = () => setIsListening(false);

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  // Text-to-Speech audio reader
  const playBanglaSpeech = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const plain = text
      .replace(/\$\$[\s\S]*?\$\$/g, language === 'bn' ? 'সমীকরণ' : 'equation')
      .replace(/\$([^$]+)\$/g, '$1')
      .replace(/[*#_`]/g, '')
      .replace(/:::[\s\S]*?:::/g, '')
      .trim();
    const utterance = new SpeechSynthesisUtterance(plain);
    utterance.lang = language === 'bn' ? 'bn-BD' : 'en-US';
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Formula symbol inserter
  const handleInsertSymbol = (symbol: string) => {
    const el = textareaRef.current;
    if (!el) {
      setPrompt((prev) => `${prev} ${symbol}`.trim());
      return;
    }
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next = prompt.substring(0, start) + symbol + prompt.substring(end);
    setPrompt(next);
    setTimeout(() => {
      el.focus();
      el.selectionStart = el.selectionEnd = start + symbol.length;
    }, 0);
  };

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
    startNewSession();
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
    setActiveHintRung(0);
    setTicketAnswers({});
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
      toast.info(language === 'bn' ? 'উত্তর তৈরি বন্ধ করা হয়েছে' : 'Generation stopped');
    }
    if (activeSessionId) {
      fetch('/api/tutor-chat/abort', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { snapshotId: activeSessionId } }),
      }).catch(() => {});
    }
  };

  // The tutor defaults to Socratic scaffolding (nudging & step-by-step guidance).
  // Students can toggle to 'direct' if they need a fully worked explanation.
  const [scaffoldingStyle, setScaffoldingStyle] = useState<'socratic' | 'direct'>('socratic');


  // Submit Question with Real-time SSE Token Streaming
  const submitQuestion = async (textToSend?: string, rungToUse?: HintRung) => {
    const query = (textToSend ?? prompt).trim();
    if (!query || isGenerating) return;

    const targetRung = rungToUse !== undefined ? rungToUse : activeHintRung;

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

    // Setup abort controller + a hard client-side timeout. The route caps at
    // maxDuration=60s; give the stream a little past that, then surface a clear
    // "took too long" message instead of leaving the bubble stuck on
    // "Generating response…" forever. `streamFlow` does not reliably honour
    // `abortSignal`, so the real unblock is the Promise.race below — the
    // AbortController is just a best-effort cancel of the underlying fetch.
    const controller = new AbortController();
    abortControllerRef.current = controller;
    let timedOut = false;
    const TUTOR_TIMEOUT_MS = 72_000;

    try {
      const { stream, output } = streamFlow({
        url: '/api/tutor-chat',
        input: {
          message: {
            role: 'user',
            content: [{ text: query }],
          },
          metadata: {
            mode: 'general',
            subjectId: currentSubject?.id,
            subjectCode: currentSubject?.code,
            subjectName: currentSubject ? (language === 'bn' ? currentSubject.name_bn : currentSubject.name_en) : undefined,
            chapterId: currentChapter?.id,
            chapterName: currentChapter ? (language === 'bn' ? currentChapter.title_bn : currentChapter.title_en) : undefined,
            studentMessage: query,
            languagePreference: language === 'en' ? 'en' : 'bn',
            scaffoldingStyle,
            hintRung: targetRung,
          },
        },
        init: {
          sessionId: activeSessionId ?? undefined,
        },
        abortSignal: controller.signal,
      });

      let accumulatedText = '';
      type FinalOutput = {
        sessionId?: string;
        finishReason?: string;
        message?: {
          role?: string;
          content?: Array<{
            text?: string;
            toolRequest?: { name?: string; input?: { topic?: string; reason?: string } };
          }>;
        };
      } | null;
      const outBox: { value: FinalOutput } = { value: null };

      // `streamFlow`'s abortSignal is unreliable, so race the whole
      // consume-the-stream operation against a wall-clock timeout. If the
      // timeout wins we throw TIMEOUT (handled in catch); the background
      // consume promise is left to settle on its own and ignored.
      const TIMEOUT = Symbol('tutor-timeout');
      const consume = (async () => {
        for await (const chunk of stream) {
          let textPart = '';
          if (typeof chunk === 'string') {
            textPart = chunk;
          } else if (chunk && typeof chunk === 'object') {
            const chunkObj = chunk as Record<string, unknown>;
            const msgObj = chunkObj.message as Record<string, unknown> | undefined;
            const modelChunk = (chunkObj.modelChunk || msgObj?.modelChunk) as { content?: Array<{ text?: string }> } | undefined;
            if (Array.isArray(modelChunk?.content)) {
              textPart = modelChunk.content.map((c) => c.text || '').join('');
            } else if (typeof chunkObj.text === 'string') {
              textPart = chunkObj.text;
            } else if (Array.isArray(chunkObj.content)) {
              textPart = (chunkObj.content as Array<{ text?: string }>).map((c) => c.text || '').join('');
            } else if (typeof msgObj?.text === 'string') {
              textPart = msgObj.text;
            }
          }

          if (textPart) {
            accumulatedText += textPart;
            setMessages((prev) => {
              const newArr = [...prev];
              const lastIdx = newArr.length - 1;
              if (lastIdx >= 0 && newArr[lastIdx].role === 'assistant') {
                newArr[lastIdx] = { ...newArr[lastIdx], text: accumulatedText, isStreaming: true };
              }
              return newArr;
            });
          }
        }
        outBox.value = (await output) as FinalOutput;
      })();

      await Promise.race([
        consume,
        new Promise((_, reject) =>
          setTimeout(() => {
            timedOut = true;
            try {
              controller.abort();
            } catch {
              /* ignore */
            }
            reject(TIMEOUT);
          }, TUTOR_TIMEOUT_MS)
        ),
      ]);

      const fo = outBox.value;
      const finalMsg = fo?.message;
      let finalReply = '';

      if (typeof finalMsg === 'string') {
        finalReply = finalMsg;
      } else if (Array.isArray(finalMsg?.content)) {
        finalReply = finalMsg.content.map((c) => c.text || '').join('');
      } else if (fo && typeof (fo as Record<string, unknown>).text === 'string') {
        finalReply = (fo as Record<string, unknown>).text as string;
      }

      if (!finalReply) {
        // If an interrupt occurred (such as practice quiz proposal), surface it politely
        const toolReq = finalMsg?.content?.find((c) => c.toolRequest)?.toolRequest;
        if (toolReq?.name === 'requestPracticeQuizInterrupt') {
          const reason = toolReq.input?.reason || (language === 'bn' ? 'তুমি কি এই বিষয়ে একটি ছোট প্র্যাকটিস কুইজ দিতে চাও?' : 'Would you like to take a quick practice quiz on this topic?');
          const topic = toolReq.input?.topic ? `[${toolReq.input.topic}] ` : '';
          finalReply = `${topic}${reason}\n\n${language === 'bn' ? '(কুইজ শুরু করতে "হ্যাঁ" অথবা চালিয়ে যেতে "না" লিখো)' : '(Reply "yes" to begin or "no" to continue discussion)'}`;
        } else {
          finalReply = accumulatedText;
        }
      }

      const resolvedSessionId = fo?.sessionId || activeSessionId;
      if (resolvedSessionId) {
        setActiveSessionId(resolvedSessionId);
      }

      const cleanedReply = sanitizeTutorReply(finalReply || accumulatedText);
      setMessages((prev) => {
        const newArr = [...prev];
        const lastIdx = newArr.length - 1;
        if (lastIdx >= 0 && newArr[lastIdx].role === 'assistant') {
          newArr[lastIdx] = {
            ...newArr[lastIdx],
            text:
              cleanedReply ||
              (language === 'bn'
                ? 'দুঃখিত, এই মুহূর্তে উত্তর তৈরি করা গেল না। আবার চেষ্টা করো।'
                : "Sorry, I couldn't put together an answer just now. Please try again."),
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
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError' && !timedOut) {
        // User pressed Stop — leave whatever streamed so far as-is.
        return;
      }
      const message = timedOut
        ? language === 'bn'
          ? 'উত্তর তৈরি করতে অনেক সময় লাগছে। একটু পরে আবার চেষ্টা করো, অথবা প্রশ্নটি ছোট করে জিজ্ঞাসা করো।'
          : 'This is taking too long to answer. Please try again in a moment, or ask a shorter question.'
        : language === 'bn'
          ? 'দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।'
          : 'Sorry, a connection error occurred. Please try again.';
      setMessages((prev) => {
        const newArr = [...prev];
        const lastIdx = newArr.length - 1;
        if (lastIdx >= 0 && newArr[lastIdx].role === 'assistant') {
          newArr[lastIdx] = { ...newArr[lastIdx], text: message, isStreaming: false };
        }
        return newArr;
      });
      toast.error(
        timedOut
          ? language === 'bn' ? 'সময় শেষ হয়ে গেছে' : 'Request timed out'
          : language === 'bn' ? 'সংযোগ সমস্যা হয়েছে' : 'Connection error'
      );
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
              className="w-full rounded-lg border border-border bg-background text-foreground px-3 py-2 text-sm font-medium outline-none transition-colors focus:border-cta"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id} className="bg-background text-foreground">
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
                      if (c.id !== selectedChapterId) {
                        setSelectedChapterId(c.id);
                        startNewSession();
                      }
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
            <p className="mt-0.5 text-xs text-muted-foreground">NCTB Curriculum • Google Gemini & Genkit</p>
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

          {/* Hint Ladder Stepper & Formula Bar Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 bg-surface-2/40 px-4 py-2 sm:px-6 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <span className="font-mono text-2xs font-bold uppercase tracking-wider text-muted-foreground shrink-0">
                {language === 'bn' ? 'সহায়তা স্তর:' : 'Ladder:'}
              </span>
              {[
                { rung: 1, label: language === 'bn' ? '১. ধারণা ও সূত্র' : '1. Concept' },
                { rung: 3, label: language === 'bn' ? '২. মান বসানো' : '2. Values' },
                { rung: 5, label: language === 'bn' ? '৩. বিকল্প উদাহরণ' : '3. Analogous' },
                { rung: 7, label: language === 'bn' ? '৪. কুইজ ও সমাপ্তি' : '4. Exit Quiz' },
              ].map((step) => {
                const isReached = activeHintRung >= step.rung;
                return (
                  <button
                    key={step.rung}
                    type="button"
                    onClick={() => setActiveHintRung(step.rung as HintRung)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-2xs font-medium transition-colors shrink-0',
                      isReached
                        ? 'border border-cta/40 bg-cta/15 text-cta font-semibold shadow-xs'
                        : 'border border-border/80 bg-surface-1 text-muted-foreground hover:bg-surface-2'
                    )}
                  >
                    <span>{step.label}</span>
                    {isReached && <Check size={11} />}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 ml-auto shrink-0">
              <div className="flex items-center rounded-lg border border-border bg-surface-1 p-0.5 text-2xs">
                <button
                  type="button"
                  onClick={() => setScaffoldingStyle('socratic')}
                  className={cn(
                    'rounded-md px-2 py-0.5 font-medium transition-colors',
                    scaffoldingStyle === 'socratic'
                      ? 'bg-cta text-cta-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title={language === 'bn' ? 'সক্রেটিক গাইড (ধাপে ধাপে ক্লু)' : 'Socratic Guide (Step-by-step)'}
                >
                  {language === 'bn' ? 'সক্রেটিক গাইড' : 'Socratic'}
                </button>
                <button
                  type="button"
                  onClick={() => setScaffoldingStyle('direct')}
                  className={cn(
                    'rounded-md px-2 py-0.5 font-medium transition-colors',
                    scaffoldingStyle === 'direct'
                      ? 'bg-cta text-cta-foreground font-semibold shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                  title={language === 'bn' ? 'সরাসরি ব্যাখ্যা (সম্পূর্ণ উত্তর)' : 'Direct Explanation (Full answer)'}
                >
                  {language === 'bn' ? 'সরাসরি ব্যাখ্যা' : 'Direct'}
                </button>
              </div>

              <button
                type="button"
                onClick={() => setShowFormulaBar((v) => !v)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-2xs font-medium transition-colors shrink-0',
                  showFormulaBar
                    ? 'border-mint bg-mint-soft text-mint font-semibold'
                    : 'border-border bg-surface-1 text-muted-foreground hover:bg-surface-2 hover:text-foreground'
                )}
              >
                <Calculator size={13} />
                <span>{language === 'bn' ? 'টুলবার' : 'Toolbar'}</span>
              </button>
            </div>
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
                      {currentSubject?.code === 'SSC-CHEM' ? (
                        <>
                          <RenderMathText text={`$$2H_2(g) + O_2(g) \\rightarrow 2H_2O(l) \\quad [\\Delta H = -572\\text{ kJ}]$$`} inline={false} />
                          <RenderMathText text={`$$n = \\frac{W}{M} = \\frac{V}{22.4\\text{ L}} = \\frac{N}{N_A} = S \\times V_{(L)}$$`} inline={false} />
                        </>
                      ) : currentSubject?.code === 'SSC-MATH' ? (
                        <>
                          <RenderMathText text={`$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$`} inline={false} />
                          <RenderMathText text={`$$\\sin^2\\theta + \\cos^2\\theta = 1, \\quad A = \\pi r^2$$`} inline={false} />
                        </>
                      ) : (
                        <>
                          <RenderMathText text={`$$W = \\vec{F} \\cdot \\vec{s} = F s \\cos\\theta$$`} inline={false} />
                          <RenderMathText text={`$$\\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$`} inline={false} />
                        </>
                      )}
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
              const { cleanText, exitTicket, diagrams, analogousExamples } = isAssistant
                ? parseTutorDirectives(m.text)
                : { cleanText: m.text, exitTicket: undefined, diagrams: [], analogousExamples: [] };

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
                        <div className="break-words space-y-3">
                          <RenderMathText text={cleanText} inline={false} />

                          {/* Analogous Example Cards */}
                          {analogousExamples.map((ex, exIdx) => (
                            <div key={exIdx} className="rounded-xl border border-ochre/30 bg-ochre-soft/30 p-3 text-xs text-foreground">
                              <div className="mb-1.5 flex items-center gap-1.5 font-semibold text-ochre">
                                <RotateCcw size={13} />
                                <span>{ex.title || (language === 'bn' ? 'অনুরূপ উদাহরণ (ভিন্ন সংখ্যা দিয়ে)' : 'Analogous Example')}</span>
                              </div>
                              <div className="rounded-lg bg-background/80 p-2.5 leading-relaxed font-mono text-xs border border-border/50">
                                <RenderMathText text={ex.content} inline={false} />
                              </div>
                            </div>
                          ))}

                          {/* Diagram Directive Callouts */}
                          {diagrams.map((diag, dIdx) => (
                            <div key={dIdx} className="rounded-xl border border-border/70 bg-surface-1 p-3 text-xs text-foreground">
                              <div className="mb-1 flex items-center gap-1.5 font-semibold text-cta">
                                <BookOpen size={13} />
                                <span>{diag.caption || (language === 'bn' ? 'পাঠ্যবইয়ের চিত্র' : 'Textbook Diagram')}</span>
                              </div>
                              {diag.url && (
                                <img src={diag.url} alt={diag.caption} className="mt-1.5 max-h-48 rounded-lg object-contain border border-border/50" />
                              )}
                            </div>
                          ))}

                          {/* Exit Ticket Micro-Quiz Card */}
                          {exitTicket && (
                            <div className="rounded-xl border border-mint/30 bg-mint-soft/20 p-3.5 text-xs text-foreground">
                              <div className="mb-2 flex items-center justify-between">
                                <div className="flex items-center gap-1.5 font-semibold text-mint">
                                  <CheckCircle2 size={14} />
                                  <span>{language === 'bn' ? 'যাচাই কুইজ' : 'Quick Check'}</span>
                                </div>
                                {ticketAnswers[exitTicket.id]?.isCorrect && (
                                  <span className="rounded-full bg-mint/20 px-2 py-0.5 text-2xs font-bold text-mint">
                                    🎉 +15 XP
                                  </span>
                                )}
                              </div>
                              <p className="mb-2.5 font-medium leading-relaxed">{exitTicket.question}</p>
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
                                        if (opt.isCorrect) {
                                          toast.success(language === 'bn' ? 'চমৎকার! সঠিক উত্তর (+১৫ XP)' : 'Brilliant! Correct answer (+15 XP)');
                                        }
                                      }}
                                      className={cn(
                                        'flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-xs transition-all',
                                        isSelected
                                          ? opt.isCorrect
                                            ? 'border-mint bg-mint-soft text-mint font-semibold'
                                            : 'border-destructive bg-destructive/10 text-destructive font-semibold'
                                          : 'border-border bg-background hover:bg-surface-2 text-foreground'
                                      )}
                                    >
                                      <span>
                                        <strong className="mr-1.5 font-mono">{opt.id})</strong> {opt.label}
                                      </span>
                                      {isSelected && (opt.isCorrect ? <Check size={13} className="text-mint shrink-0" /> : <AlertCircle size={13} className="text-destructive shrink-0" />)}
                                    </button>
                                  );
                                })}
                              </div>
                              {exitTicket.explanation && ticketAnswers[exitTicket.id]?.isCorrect && (
                                <p className="mt-2.5 rounded bg-background/80 p-2.5 text-2xs text-muted-foreground border border-border/50">
                                  💡 {exitTicket.explanation}
                                </p>
                              )}
                            </div>
                          )}

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
                          onClick={() => copyMessage(cleanText, idx)}
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
                        <button
                          type="button"
                          onClick={() => playBanglaSpeech(cleanText)}
                          className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs text-muted-foreground transition-colors hover:bg-accent"
                          title={language === 'bn' ? 'অডিও শুনুন' : 'Listen audio'}
                        >
                          <Volume2 size={12} />
                          <span>{language === 'bn' ? 'শুনুন' : 'Listen'}</span>
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

          {/* Dynamic Scaffolding Action Chips */}
          <div className="flex-shrink-0 border-t border-border bg-surface-2/30 px-4 py-2 sm:px-6">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              {[
                {
                  label: language === 'bn' ? '💡 ছোট ক্লু দাও' : '💡 Give Clue',
                  icon: Lightbulb,
                  action: () => {
                    const nextRung = Math.min(activeHintRung + 1, 7) as HintRung;
                    setActiveHintRung(nextRung);
                    submitQuestion(
                      language === 'bn'
                        ? 'আমাকে পরবর্তী ছোট ক্লু বা সূত্রের ইঙ্গিত দাও।'
                        : 'Give me a small clue for the next step.',
                      nextRung
                    );
                  },
                },
                {
                  label: language === 'bn' ? '🔄 অন্য উদাহরণ দেখাও' : '🔄 Analogous Example',
                  icon: RotateCcw,
                  action: () => {
                    setActiveHintRung(5 as HintRung);
                    submitQuestion(
                      language === 'bn'
                        ? 'এই নিয়মের অন্য একটি উদাহরণ আলাদা সংখ্যা দিয়ে সম্পূর্ণ সমাধান করে দেখাও।'
                        : 'Show me an analogous example with different numbers fully worked out.',
                      5 as HintRung
                    );
                  },
                },
                {
                  label: language === 'bn' ? '📖 মূল ধারণা ও ডায়াগ্রাম' : '📖 Diagram & Concept',
                  icon: BookOpen,
                  action: () => {
                    submitQuestion(
                      language === 'bn'
                        ? 'এই ধারণার মূল কনসেপ্ট ও বইয়ের চিত্র বা ডায়াগ্রাম ব্যাখ্যা করো।'
                        : 'Explain the core concept and textbook diagram for this.'
                    );
                  },
                },
                {
                  label: language === 'bn' ? '✍️ আমার সূত্র চেক করো' : '✍️ Check Formula',
                  icon: HelpCircle,
                  action: () => {
                    setPrompt(language === 'bn' ? 'আমি ভাবছি সূত্রটি হবে: ' : 'I think the formula is: ');
                    textareaRef.current?.focus();
                  },
                },
              ].map((chip, idx) => {
                const Icon = chip.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isGenerating}
                    onClick={chip.action}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-surface-1 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:border-cta/50 hover:bg-surface-2 disabled:opacity-50"
                  >
                    <Icon size={12} className="text-cta" />
                    <span>{chip.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Formula & Symbol Palette Toolbar */}
          {showFormulaBar && (
            <div className="flex items-center gap-1 overflow-x-auto border-t border-border/40 bg-surface-2/60 px-4 py-1.5 sm:px-6 scrollbar-none text-2xs">
              <span className="font-mono text-muted-foreground shrink-0 mr-1">
                {language === 'bn' ? 'প্রতীক:' : 'Symbols:'}
              </span>
              {MATH_SYMBOLS.map((s, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleInsertSymbol(s.insert)}
                  className="shrink-0 rounded border border-border/70 bg-surface-1 px-2 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  {s.label}
                </button>
              ))}
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
              <button
                type="button"
                onClick={handleVoiceInput}
                title={
                  isListening
                    ? language === 'bn'
                      ? 'রেকর্ডিং থামাও'
                      : 'Stop recording'
                    : language === 'bn'
                    ? 'মুখে বলো (বাংলা)'
                    : 'Voice input'
                }
                className={cn(
                  'grid size-8 shrink-0 place-items-center rounded-lg transition-colors',
                  isListening
                    ? 'bg-destructive text-destructive-foreground animate-pulse'
                    : 'border border-border/80 bg-surface-2 text-muted-foreground hover:bg-surface-3 hover:text-foreground'
                )}
              >
                {isListening ? <MicOff size={15} /> : <Mic size={15} />}
              </button>

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
                placeholder={
                  isListening
                    ? language === 'bn'
                      ? 'শুনছি... মুখে বলো...'
                      : 'Listening... speak now...'
                    : t('tutor.ask_placeholder')
                }
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
