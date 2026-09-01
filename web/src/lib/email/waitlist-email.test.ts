import { describe, it, expect } from 'vitest';
import { renderWaitlistVerificationEmail } from './templates/waitlist-verification';

describe('renderWaitlistVerificationEmail', () => {
  it('generates HTML and plain text containing the verification link and recipient name', () => {
    const verifyUrl = 'https://sheratutor.tech/waitlist/verify?token=123e4567-e89b-12d3-a456-426614174000';
    const email = renderWaitlistVerificationEmail({
      fullName: 'Tanvir Ahmed',
      verifyUrl,
      examType: 'HSC',
      targetExamYear: 2026,
    });

    expect(email.subject).toContain('SheraTutor');
    expect(email.html).toContain('Tanvir Ahmed');
    expect(email.html).toContain(verifyUrl);
    expect(email.html).toContain('HSC');
    expect(email.text).toContain(verifyUrl);
    expect(email.text).toContain('Tanvir Ahmed');
  });

  it('handles fallback name gracefully', () => {
    const verifyUrl = 'https://sheratutor.tech/waitlist/verify?token=123e4567-e89b-12d3-a456-426614174000';
    const email = renderWaitlistVerificationEmail({
      fullName: '',
      verifyUrl,
    });

    expect(email.html).toContain(verifyUrl);
    expect(email.text).toContain('there');
  });
});
