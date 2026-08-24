'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
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
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';
import { useLanguage } from '@/context/LanguageContext';
import { toast } from 'sonner';

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

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() ?? '';

          for (const line of lines) {
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
              } catch (parseErr) {
                // Ignore parsing chunk split across network boundaries
              }
            }
          }
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

  return (
    <div className="tutor-workspace-root">
      <PageHeader
        title={t('tutor.title')}
        description={t('tutor.desc')}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="mobile-sidebar-toggle"
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            aria-label="Toggle navigation drawer"
          >
            {mobileSidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <button
            type="button"
            className="tutor-new-chat-btn"
            onClick={startNewSession}
          >
            <Plus size={16} />
            <span>{t('tutor.new_session')}</span>
          </button>
        </div>
      </PageHeader>

      <div className="tutor-layout-container">
        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div
            className="tutor-sidebar-backdrop"
            onClick={() => setMobileSidebarOpen(false)}
          />
        )}

        {/* Left Navigation Sidebar */}
        <aside className={`tutor-sidebar-panel ${mobileSidebarOpen ? 'open' : ''}`}>
          {/* Subject Selector */}
          <div className="tutor-subject-card">
            <div className="flex items-center justify-between mb-2">
              <span className="tutor-section-label">
                {language === 'bn' ? 'বিষয় নির্বাচন' : 'SELECT SUBJECT'}
              </span>
              <span className="tutor-pill-tag mint">{subjectDisplayName}</span>
            </div>

            <div className="relative">
              <select
                value={selectedSubjectId}
                onChange={(e) => handleSubjectChange(e.target.value)}
                className="tutor-subject-select"
                aria-label="Select Subject"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {language === 'bn' ? s.name_bn || s.name_en : s.name_en}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Chapters List */}
          <div className="tutor-section-header">
            <BookOpen size={14} />
            <span>{language === 'bn' ? 'অধ্যায়সমূহ' : 'CHAPTERS'}</span>
          </div>

          <div className="tutor-chapters-scroll">
            {sortedChapters.length === 0 ? (
              <div className="tutor-no-chapters">
                <Compass size={20} className="text-muted-foreground mb-1.5 opacity-60" />
                <p className="text-xs text-muted-foreground text-center leading-relaxed">
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
                    className={`tutor-chapter-card ${isSelected ? 'active' : ''}`}
                  >
                    <span className="chapter-badge">
                      {String(c.chapter_no || i + 1).padStart(2, '0')}
                    </span>
                    <span className="chapter-title">
                      {language === 'bn' ? c.title_bn || c.title_en : c.title_en}
                    </span>
                    {isSelected && <Check size={14} className="chapter-check" />}
                  </button>
                );
              })
            )}
          </div>

          {/* Recent Chat History */}
          {sessions.length > 0 && (
            <div className="tutor-recent-sessions">
              <div className="tutor-section-header mt-3">
                <Clock size={14} />
                <span>{language === 'bn' ? 'পূর্বের আলোচনা' : 'RECENT CHATS'}</span>
              </div>
              <div className="tutor-sessions-list">
                {sessions.slice(0, 8).map((sess) => {
                  const isActive = sess.id === activeSessionId;
                  return (
                    <button
                      key={sess.id}
                      type="button"
                      onClick={() => selectSession(sess)}
                      className={`tutor-session-item ${isActive ? 'active' : ''}`}
                    >
                      <MessageSquare size={13} className="shrink-0 opacity-70" />
                      <span className="truncate flex-1 text-left">
                        {sess.title || (language === 'bn' ? 'প্রশ্নোত্তর সেশন' : 'Tutoring session')}
                      </span>
                      <ChevronRight size={12} className="opacity-40 shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Tutor Info Badge */}
          <div className="tutor-model-badge mt-auto">
            <div className="flex items-center gap-2">
              <div className="status-dot online" />
              <span className="text-xs font-semibold text-foreground">Shera AI Engine</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              NCTB Curriculum • Llama 3.1 70B
            </p>
          </div>
        </aside>

        {/* Main Tutor Chat Canvas */}
        <section className="tutor-chat-canvas">
          {/* Chat Header Bar */}
          <div className="tutor-canvas-header">
            <div className="flex items-center gap-3">
              <div className="shera-glow-avatar">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="tutor-canvas-title">{chapterDisplayName}</h2>
                  <span className="tutor-pill-tag mint">{subjectDisplayName}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {language === 'bn'
                    ? 'সহজ উদাহরণ, নিখুঁত সূত্র ও বোর্ড রুব্রিকের সাহায্যে বোঝানো হবে'
                    : 'Interactive Socratic tutoring with KaTeX formula rendering & NCTB rubrics'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={startNewSession}
                  className="tutor-clear-btn"
                  title={language === 'bn' ? 'নতুন সেশন শুরু করুন' : 'New session'}
                >
                  <Plus size={14} />
                  <span className="hidden sm:inline">{language === 'bn' ? 'নতুন আলাপ' : 'New'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div
            ref={chatScrollContainerRef}
            onScroll={handleScroll}
            className="tutor-messages-scroll"
            role="log"
            aria-live="polite"
          >
            {/* Welcome State when no messages */}
            {messages.length === 0 && (
              <div className="tutor-welcome-wrapper">
                <div className="tutor-welcome-card">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="shera-glow-avatar-lg">
                      <GraduationCap size={22} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-foreground">
                        {language === 'bn'
                          ? `চলো "${chapterDisplayName}" অধ্যায়টি সহজভাবে বুঝে নিই!`
                          : `Let's master "${chapterDisplayName}" together!`}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {language === 'bn'
                          ? 'তোমার যেকোনো দ্বিধা বা জটিল সূত্রের ব্যাখ্যা জিজ্ঞেস করতে পারো।'
                          : 'Ask any concept, formula derivation, or board exam question.'}
                      </p>
                    </div>
                  </div>

                  <div className="tutor-formula-preview">
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground mb-1.5">
                      <Calculator size={14} className="text-emerald-500" />
                      <span>{language === 'bn' ? 'অধ্যায়ের মূল সূত্রমালা' : 'Core Concept Highlight'}</span>
                    </div>
                    <div className="formula-box">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {`$$W = \\vec{F} \\cdot \\vec{s} = F s \\cos\\theta$$`}
                      </ReactMarkdown>
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {`$$\\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$`}
                      </ReactMarkdown>
                    </div>
                  </div>

                  <div className="tutor-hints-row">
                    <span className="hint-tag mint">
                      <Check size={12} /> {language === 'bn' ? 'বোর্ড রুব্রিক মেনে ব্যাখ্যা' : 'NCTB Rubric Verified'}
                    </span>
                    <span className="hint-tag sun">
                      <Flame size={12} /> {language === 'bn' ? 'সচরাচর ভুলের সতর্কতা' : 'Mistake Detection'}
                    </span>
                    <span className="hint-tag coral">
                      <Sparkles size={12} /> {language === 'bn' ? 'রিয়েল-টাইম স্ট্রিমিং' : 'Real-time Streaming'}
                    </span>
                  </div>
                </div>

                {/* Quick starter question cards */}
                <div className="tutor-starter-prompts">
                  <span className="tutor-section-label">
                    {language === 'bn' ? 'প্রস্তাবিত কিছু প্রশ্ন' : 'SUGGESTED QUESTIONS'}
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mt-2">
                    {quickPrompts.map((qp, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => submitQuestion(qp.prompt)}
                        className="starter-prompt-card"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                          <Lightbulb size={14} />
                          <span>{qp.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {qp.prompt}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Conversation Messages */}
            {messages.map((m, idx) => {
              const isAssistant = m.role === 'assistant';
              return (
                <div
                  key={idx}
                  className={`tutor-message-row ${isAssistant ? 'assistant' : 'student'}`}
                >
                  <div className="message-avatar-wrap">
                    {isAssistant ? (
                      <div className="shera-chat-avatar">
                        <Bot size={15} />
                      </div>
                    ) : (
                      <div className="user-chat-avatar">
                        <User size={15} />
                      </div>
                    )}
                  </div>

                  <div className="message-content-wrap">
                    <div className="message-bubble">
                      {m.text ? (
                        <div className="prose-content">
                          <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                              p: ({ ...props }) => <p className="mb-2.5 last:mb-0 leading-relaxed" {...props} />,
                              ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2.5 space-y-1" {...props} />,
                              ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2.5 space-y-1" {...props} />,
                              li: ({ ...props }) => <li className="leading-relaxed" {...props} />,
                              code: ({ ...props }) => (
                                <code className="bg-muted/80 text-foreground px-1.5 py-0.5 rounded text-xs font-mono border border-border/40" {...props} />
                              ),
                              strong: ({ ...props }) => (
                                <strong className="font-semibold text-emerald-600 dark:text-emerald-400" {...props} />
                              ),
                            }}
                          >
                            {m.text}
                          </ReactMarkdown>
                          {m.isStreaming && <span className="streaming-cursor" />}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground py-1">
                          <div className="typing-indicator">
                            <span />
                            <span />
                            <span />
                          </div>
                          <span>{language === 'bn' ? 'টিউটর চিন্তা করছে ও লিখছে…' : 'Generating response…'}</span>
                        </div>
                      )}
                    </div>

                    {/* Actions row for assistant messages */}
                    {isAssistant && m.text && !m.isStreaming && (
                      <div className="message-actions-bar">
                        <button
                          type="button"
                          onClick={() => copyMessage(m.text, idx)}
                          className="msg-action-btn"
                          title="Copy response"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check size={12} className="text-emerald-500" />
                              <span className="text-emerald-500">{language === 'bn' ? 'কপি হয়েছে' : 'Copied'}</span>
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

          {/* Floating Scroll to Bottom Button */}
          {showScrollBottom && (
            <button
              type="button"
              onClick={() => scrollToBottom(true)}
              className="scroll-bottom-floating-btn"
              aria-label="Scroll to newest messages"
            >
              <ArrowDown size={16} />
            </button>
          )}

          {/* Quick Suggestions Chips above input */}
          {messages.length > 0 && !isGenerating && (
            <div className="tutor-chips-bar">
              <div className="chips-container">
                <span className="chips-label">
                  <HelpCircle size={12} /> {language === 'bn' ? 'পরবর্তী প্রশ্ন:' : 'Follow-up:'}
                </span>
                <button
                  type="button"
                  onClick={() => submitQuestion(language === 'bn' ? 'এটি একটি বাস্তব জীবনের উদাহরণ দিয়ে বুঝিয়ে দাও।' : 'Explain this with a real-life analogy.')}
                  className="quick-chip-btn"
                >
                  {language === 'bn' ? 'বাস্তব উদাহরণ' : 'Real-life example'}
                </button>
                <button
                  type="button"
                  onClick={() => submitQuestion(language === 'bn' ? 'এই সূত্রের একক ও মাত্রা কীভাবে বের করবো?' : 'How to derive the units and dimensions?')}
                  className="quick-chip-btn"
                >
                  {language === 'bn' ? 'একক ও মাত্রা' : 'Units & dimensions'}
                </button>
                <button
                  type="button"
                  onClick={() => submitQuestion(language === 'bn' ? 'বোর্ডে এই সংক্রান্ত ৩ বা ৪ নম্বরের প্রশ্ন কেমন হয়?' : 'What does a 3 or 4 mark board question look like?')}
                  className="quick-chip-btn"
                >
                  {language === 'bn' ? 'বোর্ড ৩/৪ নম্বর প্রশ্ন' : 'Board 3-4 mark CQ'}
                </button>
              </div>
            </div>
          )}

          {/* Bottom Input Dock */}
          <div className="tutor-input-dock">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitQuestion();
              }}
              className="tutor-input-wrapper"
            >
              <textarea
                ref={textareaRef}
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
                className="tutor-chat-textarea"
                aria-label="Type your message"
              />

              <div className="input-action-buttons">
                {isGenerating ? (
                  <button
                    type="button"
                    onClick={stopGeneration}
                    className="stop-gen-btn"
                    title={language === 'bn' ? 'উত্তর তৈরি থামান' : 'Stop generating'}
                  >
                    <Square size={14} />
                    <span className="text-xs">{language === 'bn' ? 'থামাও' : 'Stop'}</span>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={!prompt.trim()}
                    className="send-btn"
                    aria-label="Send message"
                  >
                    <Send size={15} />
                  </button>
                )}
              </div>
            </form>
            <div className="input-footer-hint">
              <span>{language === 'bn' ? 'Enter চাপুন পাঠাতে • Shift + Enter নতুন লাইনের জন্য' : 'Press Enter to send • Shift + Enter for new line'}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
