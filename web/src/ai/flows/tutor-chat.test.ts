import { describe, it, expect } from 'vitest';
import {
  normalizeLatexDelimiters,
  stripLeadingGreeting,
  detectSolutionLeak,
  parseTutorDirectives,
} from './tutor-chat';

describe('normalizeLatexDelimiters', () => {
  it('should not corrupt valid LaTeX parentheses like \\left( ... \\right)', () => {
    const input = `\\tan^{-1}\\!\\left(\\frac{1}{5}\\right)+\\tan^{-1}\\!\\left(\\frac{1}{7}\\right)=?`;
    const output = normalizeLatexDelimiters(input);
    expect(output).toBe(input);
    expect(output).not.toContain('\\left$');
  });

  it('should not wrap Bengali parenthetical phrases containing \\text into math delimiters', () => {
    const input = `(উত্তরটি \\text{m/s} এ লিখতে হবে।)`;
    const output = normalizeLatexDelimiters(input);
    expect(output).toBe(input);
    expect(output).not.toContain('$উত্তরটি');
  });

  it('should normalize standard \\[ ... \\] block delimiters to $$ ... $$', () => {
    const input = `\\[ E = mc^2 \\]`;
    const output = normalizeLatexDelimiters(input);
    expect(output).toContain('$$');
    expect(output).toContain('E = mc^2');
  });

  it('should normalize standard \\( ... \\) inline delimiters to $ ... $', () => {
    const input = `Formula: \\( a^2 + b^2 = c^2 \\)`;
    const output = normalizeLatexDelimiters(input);
    expect(output).toBe(`Formula: $a^2 + b^2 = c^2$`);
  });
});

describe('stripLeadingGreeting', () => {
  it('should strip leading greetings in Bengali', () => {
    expect(stripLeadingGreeting('হ্যালো, চল আমরা শুরু করি।')).toBe('চল আমরা শুরু করি।');
    expect(stripLeadingGreeting('আসসালামু আলাইকুম! এটি হলো উত্তর।')).toBe('এটি হলো উত্তর।');
    expect(stripLeadingGreeting('নমস্কার, সূত্রটি নিচে দেওয়া হলো।')).toBe('সূত্রটি নিচে দেওয়া হলো।');
  });

  it('should preserve answers that start directly with content', () => {
    const content = 'প্রশ্নে দেওয়া আছে $F = ma$।';
    expect(stripLeadingGreeting(content)).toBe(content);
  });
});

describe('detectSolutionLeak', () => {
  it('should redact leaked final answers when hintRung < 7', () => {
    const leaked = 'এখানে গণনা অনুযায়ী The final answer is $1250\\text{ J}$।';
    const result = detectSolutionLeak(leaked, 3);
    expect(result.hasLeak).toBe(true);
    expect(result.sanitizedText).toContain('মানটি সূত্রে বসিয়ে নিজেই চূড়ান্ত উত্তরটি বের করো');
    expect(result.sanitizedText).not.toContain('$1250\\text{ J}$');
  });

  it('should redact Bengali final answer statements when hintRung < 7', () => {
    const leakedBn = 'সুতরাং নির্ণেয় চূড়ান্ত উত্তর হলো ২৫ মিটার।';
    const result = detectSolutionLeak(leakedBn, 2);
    expect(result.hasLeak).toBe(true);
    expect(result.sanitizedText).toContain('মানটি সূত্রে বসিয়ে নিজেই চূড়ান্ত উত্তরটি বের করো');
  });

  it('should redact mathematical area and median leaks when hintRung < 7', () => {
    const leakedArea = 'সুতরাং নির্ণেয় ক্ষেত্রফল হলো ১৫৪ বর্গ সেন্টিমিটার।';
    const resArea = detectSolutionLeak(leakedArea, 3);
    expect(resArea.hasLeak).toBe(true);
    expect(resArea.sanitizedText).toContain('মানটি সূত্রে বসিয়ে নিজেই চূড়ান্ত উত্তরটি বের করো');

    const leakedMedian = 'প্রদত্ত উপাত্তের নির্ণেয় মধ্যক হলো ৪৫।';
    const resMedian = detectSolutionLeak(leakedMedian, 4);
    expect(resMedian.hasLeak).toBe(true);
    expect(resMedian.sanitizedText).toContain('মানটি সূত্রে বসিয়ে নিজেই চূড়ান্ত উত্তরটি বের করো');
  });

  it('should allow final answers when hintRung is 7', () => {
    const allowed = 'The final answer is $1250\\text{ J}$।';
    const result = detectSolutionLeak(allowed, 7);
    expect(result.hasLeak).toBe(false);
    expect(result.sanitizedText).toBe(allowed);
  });
});

describe('parseTutorDirectives', () => {
  it('should parse :::exitticket[...]::: cleanly', () => {
    const raw = `চমৎকার! তুমি বুঝতে পেরেছো।\n\n:::exitticket[id="et-1", q="বলের একক কী?", optA="নিউটন", optB="জুল", optC="প্যাসকেল", correct="A", exp="বলের এসআই একক নিউটন।"]:::`;
    const parsed = parseTutorDirectives(raw);
    expect(parsed.cleanText).toBe('চমৎকার! তুমি বুঝতে পেরেছো।');
    expect(parsed.exitTicket).toBeDefined();
    expect(parsed.exitTicket?.question).toBe('বলের একক কী?');
    expect(parsed.exitTicket?.options).toHaveLength(3);
    expect(parsed.exitTicket?.options[0].isCorrect).toBe(true);
    expect(parsed.exitTicket?.options[1].isCorrect).toBe(false);
  });

  it('should parse :::analogous[...]::: blocks', () => {
    const raw = `আসল অংকের বদলে এই উদাহরণটি দেখো:\n\n:::analogous[title="সমান্তরাল অংক"]\nধরি ভর m = 2 kg এবং ত্বরণ a = 3 ms^-2। তাহলে F = 6 N।\n:::`;
    const parsed = parseTutorDirectives(raw);
    expect(parsed.cleanText).toBe('আসল অংকের বদলে এই উদাহরণটি দেখো:');
    expect(parsed.analogousExamples).toHaveLength(1);
    expect(parsed.analogousExamples[0].title).toBe('সমান্তরাল অংক');
    expect(parsed.analogousExamples[0].content).toContain('F = 6 N');
  });
});

