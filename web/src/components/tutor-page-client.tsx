'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import {
  Check,
  Lightbulb,
  MoreHorizontal,
  Plus,
  Send,
  Sparkles,
  Loader2,
} from 'lucide-react';
import { Tag } from '@/components/Tag';
import { PageHeader } from '@/components/PageHeader';

type Chapter = { id: string; chapter_no: number; title_en: string; title_bn: string };
type Subject = { id: string; name_en: string; name_bn: string; chapters: Chapter[] };
type SessionSummary = {
  id: string;
  title: string | null;
  context_json: { subjectName?: string; chapterName?: string } | null;
  updated_at: string;
};

interface Message {
  role: 'student' | 'assistant';
  text: string;
}

export function TutorPageClient({
  subjects,
}: {
  subjects: Subject[];
  initialSessions?: SessionSummary[];
}) {
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(
    subjects[0]?.id ?? ''
  );
  const currentSubject =
    subjects.find((s) => s.id === selectedSubjectId) || subjects[0];
  const [selectedChapterId, setSelectedChapterId] = useState<string>(
    currentSubject?.chapters?.[0]?.id ?? ''
  );

  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [pending, setPending] = useState(false);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const currentChapter =
    currentSubject?.chapters?.find((c) => c.id === selectedChapterId) ||
    currentSubject?.chapters?.[0];

  const handleSubjectChange = (id: string) => {
    setSelectedSubjectId(id);
    const sub = subjects.find((s) => s.id === id);
    if (sub?.chapters?.length) {
      setSelectedChapterId(sub.chapters[0].id);
    }
  };

  const startNewSession = () => {
    setActiveSessionId(null);
    setMessages([]);
    setPrompt('');
  };

  const submitQuestion = async (textToSend?: string) => {
    const query = (textToSend ?? prompt).trim();
    if (!query || pending) return;

    const userMessage: Message = { role: 'student', text: query };
    const updated = [...messages, userMessage];
    setMessages(updated);
    setPrompt('');
    setPending(true);

    try {
      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: activeSessionId,
          mode: 'general',
          subjectId: selectedSubjectId,
          chapterId: selectedChapterId,
          studentMessage: query,
          languagePreference: 'bn',
        }),
      });

      if (!res.ok) throw new Error('Chat failed');
      const json = await res.json();
      if (!activeSessionId && json.sessionId) {
        setActiveSessionId(json.sessionId);
      }
      setMessages([...updated, { role: 'assistant', text: json.reply }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          text: 'দুঃখিত, সংযোগে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করো।',
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Your AI tutor"
        description="A focused workspace that adapts to the way you learn."
      >
        <button
          type="button"
          className="primary-btn"
          onClick={startNewSession}
        >
          <Sparkles size={16} /> New learning session
        </button>
      </PageHeader>

      <div className="tutor-layout">
        <aside className="chapter-list">
          <Tag color="mint">
            {(currentSubject?.name_en || 'PHYSICS').toUpperCase()} · 1ST PAPER
          </Tag>
          <h3>{currentChapter?.title_en || 'Work, Energy & Power'}</h3>

          <div style={{ marginBottom: 12 }}>
            <select
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 10px',
                borderRadius: 8,
                border: '1px solid #e9ebf3',
                background: '#fff',
                fontSize: 12,
                marginBottom: 10,
                color: 'var(--navy)',
              }}
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name_en}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {currentSubject?.chapters?.map((c, i) => (
              <div
                key={c.id}
                className={`chapter-item ${
                  c.id === selectedChapterId ? 'active' : ''
                }`}
                onClick={() => setSelectedChapterId(c.id)}
              >
                <span>{String(i + 1).padStart(2, '0')}</span>
                {c.title_en}
                {c.id === selectedChapterId && <Check size={15} />}
              </div>
            ))}
          </div>

          <hr />
          <small>YOUR RECENT TOPICS</small>
          <button
            type="button"
            onClick={() =>
              submitQuestion('Why do students usually lose marks in this chapter?')
            }
          >
            Why did I lose marks here?
          </button>
          <button
            type="button"
            onClick={() =>
              submitQuestion('Give me 5 board-standard practice questions.')
            }
          >
            Generate board questions
          </button>
        </aside>

        <section className="tutor-workspace">
          <div className="tutor-top">
            <span>
              <Sparkles size={15} /> Shera, your examiner
            </span>
            <button type="button" aria-label="Tutor workspace options">
              <MoreHorizontal size={18} />
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              padding: '10px 0',
            }}
          >
            {/* Default Shera explanation bubble */}
            <div className="tutor-message">
              <div className="shera-avatar">S</div>
              <div>
                <p>
                  Let&apos;s make <b>{currentChapter?.title_en || 'Work & Energy'}</b> feel
                  intuitive.
                </p>
                <p>
                  Energy is the capacity to do work. When a force moves an object,
                  it transfers energy — just like you transfer effort into
                  progress.
                </p>
                <div className="equation">W = F × s × cos θ</div>
                <div className="insight">
                  <Lightbulb size={17} />
                  <span>
                    <b>Board tip</b> Always write the unit (Joule / ms⁻¹) after
                    your final answer.
                  </span>
                </div>
              </div>
            </div>

            {/* Conversation turns */}
            {messages.map((m, idx) =>
              m.role === 'student' ? (
                <div className="student-question" key={idx}>
                  <span>You</span>
                  <p>{m.text}</p>
                </div>
              ) : (
                <div className="tutor-message" key={idx} style={{ marginTop: 16 }}>
                  <div className="shera-avatar">S</div>
                  <div style={{ flex: 1, fontSize: 13, lineHeight: 1.6 }}>
                    <ReactMarkdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {m.text}
                    </ReactMarkdown>
                  </div>
                </div>
              )
            )}

            {pending && (
              <div className="student-question" style={{ opacity: 0.8 }}>
                <small style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Loader2 size={12} className="animate-spin" />
                  Shera is preparing a board-style explanation…
                </small>
              </div>
            )}
          </div>

          <div className="suggestions">
            <button
              type="button"
              onClick={() => submitQuestion("Explain resonance like I'm 15")}
            >
              Explain resonance like I&apos;m 15
            </button>
            <button
              type="button"
              onClick={() => submitQuestion('Give me 10 board questions')}
            >
              Give me 10 board questions
            </button>
            <button
              type="button"
              onClick={() => submitQuestion('Show a visual example')}
            >
              Show a visual example
            </button>
          </div>

          <div className="tutor-input">
            <button type="button" aria-label="Add attachment">
              <Plus size={18} />
            </button>
            <input
              value={prompt}
              onKeyDown={(e) => e.key === 'Enter' && submitQuestion()}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ask anything about this chapter…"
              disabled={pending}
            />
            <button
              type="button"
              className="send"
              onClick={() => submitQuestion()}
              aria-label="Send message"
              disabled={pending}
            >
              <Send size={16} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
