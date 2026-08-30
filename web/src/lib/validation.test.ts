import { describe, it, expect } from 'vitest';
import { credentials, bdPhone, targetExamYear, educationBoard } from './validation';

describe('credentials', () => {
  it('accepts a valid email + 8+ char password', () => {
    expect(credentials.safeParse({ email: 'a@b.com', password: '12345678' }).success).toBe(true);
  });
  it('rejects a bad email', () => {
    expect(credentials.safeParse({ email: 'nope', password: '12345678' }).success).toBe(false);
  });
  it('rejects a short password', () => {
    expect(credentials.safeParse({ email: 'a@b.com', password: 'short' }).success).toBe(false);
  });
});

describe('bdPhone', () => {
  it.each(['+8801712345678', '8801912345678', '01712345678'])('accepts %s', (p) => {
    expect(bdPhone.safeParse(p).success).toBe(true);
  });
  it.each(['1712345678', '019123456', '+8801212345678', 'abc'])('rejects %s', (p) => {
    expect(bdPhone.safeParse(p).success).toBe(false);
  });
});

describe('targetExamYear', () => {
  it('coerces a string and bounds it to 2026..2030', () => {
    expect(targetExamYear.parse('2027')).toBe(2027);
    expect(targetExamYear.safeParse(2025).success).toBe(false);
    expect(targetExamYear.safeParse(2031).success).toBe(false);
  });
});

describe('educationBoard', () => {
  it('rejects an unknown board', () => {
    expect(educationBoard.safeParse('LONDON').success).toBe(false);
    expect(educationBoard.safeParse('DHAKA').success).toBe(true);
  });
});
