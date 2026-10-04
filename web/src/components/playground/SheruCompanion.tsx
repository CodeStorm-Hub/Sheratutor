'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  MessageCircle,
  X,
  Send,
  Bot,
  Lightbulb,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';

interface Message {
  role: 'sheru' | 'student';
  text: string;
}

const CHAPTER_1_PRESET_QUESTIONS = [
  '√২ কেন অমূলদ সংখ্যা?',
  '০.৩৩৩... কেন ১/৩ এর সমান?',
  '০ কি স্বাভাবিক সংখ্যা নাকি পূর্ণসংখ্যা?',
  'সহমৌলিক সংখ্যা কীভাবে চিনব?',
  'সব মূলদ সংখ্যাই কি বাস্তব সংখ্যা?',
];

export function SheruCompanion({
  currentQuestTitle,
  chapterName = 'Chapter 1: Real Numbers (বাস্তব সংখ্যা)',
  greetingBn,
  greetingEn,
  presetQuestions,
}: {
  currentQuestTitle: string;
  chapterName?: string;
  greetingBn?: string;
  greetingEn?: string;
  presetQuestions?: string[];
}) {
  const { language } = useLanguage();
  const isBn = language === 'bn';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const activePresetQuestions = presetQuestions && presetQuestions.length > 0 ? presetQuestions : CHAPTER_1_PRESET_QUESTIONS;

  const defaultGreeting = isBn
    ? (greetingBn || `আরে দোস্ত! আমি তোমার গণিত খেলার সাথী **শেরু**। ${chapterName} বুঝতে কোনো সমস্যা হলে আমাকে যেকোনো প্রশ্ন করো!`)
    : (greetingEn || `Hey there! I am **Sheru**, your math playground buddy. Stuck on ${chapterName}? Ask me anything!`);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'sheru',
      text: defaultGreeting,
    },
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = { role: 'student', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/tutor-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: 'general',
          subjectName: 'General Mathematics',
          chapterName,
          studentMessage: textToSend,
          languagePreference: isBn ? 'bn' : 'en',
          history: messages.slice(-4).map((m) => ({
            role: m.role === 'sheru' ? 'tutor' : 'student',
            text: m.text,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error('Tutor response failed');
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let sheruReply = '';

      setMessages((prev) => [...prev, { role: 'sheru', text: '' }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              try {
                const parsed = JSON.parse(data);
                if (parsed.text) {
                  sheruReply += parsed.text;
                  setMessages((prev) => {
                    const next = [...prev];
                    next[next.length - 1] = { role: 'sheru', text: sheruReply };
                    return next;
                  });
                }
              } catch {
                // partial chunk
              }
            }
          }
        }
      }

      if (!sheruReply) {
        // Fallback friendly explanation if streaming didn't return text
        const fallback = isBn
          ? `খুব সুন্দর প্রশ্ন! বাস্তব সংখ্যায় মনে রাখবে: যে সংখ্যাকে দুইটি পূর্ণসংখ্যার অনুপাতে ($p/q$, যেখানে $q \\neq 0$) প্রকাশ করা যায়, সেটাই **মূলদ**। আর যাকে এভাবে লেখা যায় না (যেমন $\\sqrt{2}, \\pi$), সেটাই **অমূলদ**!`
          : `Great question! Remember: any number expressible as a fraction of two integers ($p/q$, $q \\neq 0$) is **Rational**. Non-repeating infinite decimals like $\\sqrt{2}$ and $\\pi$ are **Irrational**!`;
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { role: 'sheru', text: fallback };
          return next;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'sheru',
          text: isBn
            ? 'আরে! নেটওয়ার্কে একটু গোলমাল হয়েছে। তবে সংক্ষেপে জেনে রাখো—মূলদ আর অমূলদ সংখ্যা মিলেই তৈরি হয় পুরো বাস্তব সংখ্যার জগৎ!'
            : "Oops! Quick connection hiccup. Just remember: Rational and Irrational numbers together form the entire Real Number universe!",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-full bg-gradient-to-r from-amber-500 via-primary to-cta p-3.5 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-primary/50 group"
          aria-label="Ask Sheru AI Math Buddy"
        >
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <Bot className="h-5 w-5" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-75" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400" />
            </span>
          </div>
          <span className="hidden sm:inline font-bold text-sm tracking-wide pr-1">
            {isBn ? 'শেরুকে জিজ্ঞাসা করো' : 'Ask Sheru AI'}
          </span>
        </button>
      )}

      {/* Floating Companion Drawer / Modal */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[520px] w-[360px] sm:w-[400px] flex-col overflow-hidden rounded-3xl border border-primary/30 bg-card shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border/60 bg-gradient-to-r from-primary/15 via-background to-amber-500/10 p-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="font-extrabold text-sm text-foreground">
                    {isBn ? 'শেরু • গণিত খেলার সাথী' : 'Sheru • Math Buddy'}
                  </h4>
                  <span className="rounded-full bg-emerald-500/10 px-1.5 py-0.2 text-[10px] font-semibold text-emerald-500">
                    Live AI
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate max-w-[200px]">
                  {currentQuestTitle}
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Quick Preset Prompts */}
          <div className="flex gap-1.5 overflow-x-auto p-2.5 border-b border-border/30 bg-muted/20 scrollbar-none">
            {activePresetQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="whitespace-nowrap rounded-lg border border-border/50 bg-background/80 px-2.5 py-1 text-[11px] font-medium text-foreground hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center gap-1"
              >
                <Lightbulb className="h-3 w-3 text-amber-500" />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex gap-2.5 ${m.role === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                {m.role === 'sheru' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary mt-0.5">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] rounded-2xl p-3 leading-relaxed ${
                    m.role === 'student'
                      ? 'bg-primary text-primary-foreground font-medium rounded-tr-none'
                      : 'bg-muted/60 text-foreground border border-border/40 rounded-tl-none'
                  }`}
                >
                  <RenderMathText text={m.text} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground p-2">
                <Sparkles className="h-4 w-4 animate-spin text-primary" />
                <span>{isBn ? 'শেরু ভাবছে...' : 'Sheru is thinking...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Box */}
          <div className="border-t border-border/50 bg-background p-3">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isBn ? `${chapterName} নিয়ে প্রশ্ন করো...` : `Ask about ${chapterName}...`}
                className="flex-1 rounded-xl border border-border/60 bg-muted/30 px-3.5 py-2 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-opacity"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
