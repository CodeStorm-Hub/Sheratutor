import { describe, it, expect } from 'vitest';
import { translations } from './translations';

describe('translations', () => {
  const bnKeys = Object.keys(translations.bn).sort();
  const enKeys = Object.keys(translations.en).sort();

  it('bn and en have identical key sets', () => {
    expect(enKeys).toEqual(bnKeys);
  });

  it('no value is an empty string', () => {
    for (const [lang, dict] of Object.entries(translations)) {
      for (const [key, value] of Object.entries(dict)) {
        expect(value, `${lang}.${key}`).not.toBe('');
      }
    }
  });

  it('bn values are not just copied from en (spot check a sample)', () => {
    // Bengali strings should differ from English for translated content.
    const sample = ['nav.home', 'nav.tutor', 'common.sign_in'];
    for (const key of sample) {
      const bn = (translations.bn as Record<string, string>)[key];
      const en = (translations.en as Record<string, string>)[key];
      expect(bn, key).toBeTruthy();
      expect(en, key).toBeTruthy();
      expect(bn, key).not.toBe(en);
    }
  });
});
