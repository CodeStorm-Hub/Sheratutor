import { describe, it, expect } from 'vitest';
import { normalizeLatexDelimiters, stripLeadingGreeting } from './tutor-chat';

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
