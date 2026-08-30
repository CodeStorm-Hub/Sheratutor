import { describe, it, expect } from 'vitest';
import { levelFromScore, markGlyphLabel, markGlyphClasses } from './mark-glyph';

describe('levelFromScore', () => {
  it('classifies by the documented thresholds (score = weakness ratio)', () => {
    expect(levelFromScore(0)).toBe('mastered');
    expect(levelFromScore(0.33)).toBe('mastered');
    expect(levelFromScore(0.34)).toBe('review');
    expect(levelFromScore(0.5)).toBe('review');
    expect(levelFromScore(0.66)).toBe('review');
    expect(levelFromScore(0.67)).toBe('gap');
    expect(levelFromScore(1)).toBe('gap');
  });

  it('pairs every level with a distinct glyph colour + a label', () => {
    const levels = ['mastered', 'review', 'gap'] as const;
    const classes = levels.map(markGlyphClasses);
    expect(new Set(classes).size).toBe(3);
    for (const l of levels) expect(markGlyphLabel(l)).toBeTruthy();
  });
});
