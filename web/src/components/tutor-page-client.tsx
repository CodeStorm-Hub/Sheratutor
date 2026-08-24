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
import { useLanguage } from '@/context/LanguageContext';

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
  const { language, t } = useLanguage();
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
          mode: 'general',
          sessionId: activeSessionId,
          subjectId: currentSubject?.id,
          chapterId: currentChapter?.id,
          studentMessage: query,
          languagePreference: language === 'en' ? 'en' : 'bn',
        }),
      });

      if (!res.ok) {
        throw new Error('Chat API returned an error');
      }

      const data = await res.json();
      if (data.sessionId) {
        setActiveSessionId(data.sessionId);
      }

      const assistantReply =
        data.reply ||
        (language === 'bn'
          ? 'এখানে কাজ ও শক্তির উপপাদ্য প্রয়োগ করে পাই: $\\Delta K = W_{\\text{net}}$।'
          : 'Applying the work-energy theorem: $\\Delta K = W_{\\text{net}}$.');

      setMessages([...updated, { role: 'assistant', text: assistantReply }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          text: t('tutor.connection_error'),
        },
      ]);
    } finally {
      setPending(false);
    }
  };

  const subjectDisplayName =
    language === 'bn'
      ? currentSubject?.name_bn || currentSubject?.name_en || 'পদার্থবিজ্ঞান'
      : currentSubject?.name_en || 'Physics';

  const chapterDisplayName =
    language === 'bn'
      ? currentChapter?.title_bn || currentChapter?.title_en || 'কাজ, ক্ষমতা ও শক্তি'
      : currentChapter?.title_en || 'Work, Energy & Power';

  return (
    <>
      <PageHeader
        title={t('tutor.title')}
        description={t('tutor.desc')}
      >
        <button
          type="button"
          className="primary-btn"
          onClick={startNewSession}
        >
          <Plus size={15} /> {t('tutor.new_session')}
        </button>
      </PageHeader>

      <div className="tutor-grid">
        <aside className="chapter-list">
          <Tag color="mint">
            {subjectDisplayName.toUpperCase()}
          </Tag>
          <h3>{chapterDisplayName}</h3>

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
                  {language === 'bn' ? (s.name_bn || s.name_en) : s.name_en}
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
                {language === 'bn' ? (c.title_bn || c.title_en) : c.title_en}
                {c.id === selectedChapterId && <Check size={15} />}
              </div>
            ))}
          </div>

          <hr />
          <small>{language === 'bn' ? 'প্রস্তাবিত প্রশ্নসমূহ' : 'SUGGESTED TOPICS'}</small>
          <button
            type="button"
            onClick={() =>
              submitQuestion(
                language === 'bn'
                  ? 'এই অধ্যায়ে শিক্ষার্থীরা সাধারণত কোথায় নম্বর হারায়?'
                  : 'Why do students usually lose marks in this chapter?'
              )
            }
          >
            {language === 'bn' ? 'কোথায় নম্বর কাটা যায়?' : 'Why did I lose marks here?'}
          </button>
          <button
            type="button"
            onClick={() =>
              submitQuestion(
                language === 'bn'
                  ? 'আমাকে ৫টি বোর্ড স্ট্যান্ডার্ড প্রশ্ন তৈরি করে দাও।'
                  : 'Give me 5 board-standard practice questions.'
              )
            }
          >
            {language === 'bn' ? 'বোর্ড মানের প্রশ্ন তৈরি' : 'Generate board questions'}
          </button>
        </aside>

        <section className="tutor-workspace">
          <div className="tutor-top">
            <span>
              <Sparkles size={15} /> {language === 'bn' ? 'সেরা, তোমার এআই পরীক্ষক' : 'Shera, your examiner'}
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
            {/* Default Shera explanation bubble if no messages */}
            {messages.length === 0 && (
              <div className="tutor-message">
                <div className="shera-avatar">S</div>
                <div>
                  <p>
                    {language === 'bn' ? (
                      <>
                        চলো <b>{chapterDisplayName}</b> অধ্যায়টি সহজভাবে বুঝে নিই।
                      </>
                    ) : (
                      <>
                        Let&apos;s make <b>{chapterDisplayName}</b> feel intuitive.
                      </>
                    )}
                  </p>
                  <p>
                    {language === 'bn'
                      ? 'কাজ-শক্তি উপপাদ্যটি মনে রাখো: কৃতকাজ হলো গতিশক্তির পরিবর্তনের সমান।'
                      : 'Remember the core work-energy relation: Work done on an object equals its change in kinetic energy.'}
                  </p>

                  <div className="formula-block">
                    {`$$W = \\Delta K = \\frac{1}{2}m v_f^2 - \\frac{1}{2}m v_i^2$$`}
                  </div>

                  <p>
                    {language === 'bn'
                      ? 'বোর্ড পরীক্ষায় সাধারণ ভুল হলো বেগ ($v$) এর বর্গ করতে ভুলে যাওয়া বা ঋণাত্মক কাজ বাদ দেওয়া।'
                      : 'Common board exam mistake: Missing the square on velocity ($v$) or ignoring negative work by friction.'}
                  </p>

                  <div className="tag-row">
                    <Tag color="mint">{language === 'bn' ? 'বোর্ড রুব্রিক' : 'Board Rubric'}</Tag>
                    <Tag color="sun">{language === 'bn' ? 'সচরাচর ভুল' : 'Common Pitfall'}</Tag>
                    <Tag color="coral">{language === 'bn' ? 'মার্কস পুনরুদ্ধার' : '+3 Marks'}</Tag>
                  </div>
                </div>
              </div>
            )}

            {/* Conversation History */}
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={
                  m.role === 'student' ? 'user-message' : 'tutor-message'
                }
              >
                {m.role === 'assistant' && <div className="shera-avatar">S</div>}
                <div>
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {m.text}
                  </ReactMarkdown>
                </div>
              </div>
            ))}

            {pending && (
              <div className="tutor-message">
                <div className="shera-avatar">S</div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: 'var(--muted)',
                  }}
                >
                  <Loader2 size={16} className="animate-spin" />
                  <span>{language === 'bn' ? 'উত্তর বিশ্লেষণ করা হচ্ছে…' : 'Thinking & verifying board rubric…'}</span>
                </div>
              </div>
            )}
          </div>

          <div className="tutor-prompt-pills">
            <button
              type="button"
              className="prompt-pill"
              onClick={() => submitQuestion(t('tutor.prompt1'))}
            >
              <Lightbulb size={13} /> {t('tutor.prompt1')}
            </button>
            <button
              type="button"
              className="prompt-pill"
              onClick={() => submitQuestion(t('tutor.prompt2'))}
            >
              <Lightbulb size={13} /> {t('tutor.prompt2')}
            </button>
            <button
              type="button"
              className="prompt-pill"
              onClick={() => submitQuestion(t('tutor.prompt3'))}
            >
              <Lightbulb size={13} /> {t('tutor.prompt3')}
            </button>
          </div>

          <div className="tutor-input-box">
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') submitQuestion();
              }}
              placeholder={t('tutor.ask_placeholder')}
              disabled={pending}
            />
            <button
              type="button"
              onClick={() => submitQuestion()}
              disabled={pending || !prompt.trim()}
              aria-label="Send prompt"
            >
              <Send size={15} />
            </button>
          </div>
        </section>
      </div>
    </>
  );
}
