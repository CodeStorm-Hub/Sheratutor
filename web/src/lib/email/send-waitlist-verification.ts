import { getEmailTransporter } from './transporter';
import { renderWaitlistVerificationEmail } from './templates/waitlist-verification';

interface SendWaitlistVerificationOptions {
  to: string;
  fullName: string;
  verifyToken: string;
  examType?: string | null;
  targetExamYear?: number | null;
}

export async function sendWaitlistVerification({
  to,
  fullName,
  verifyToken,
  examType,
  targetExamYear,
}: SendWaitlistVerificationOptions) {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://sheratutor.tech').replace(/\/$/, '');
  const verifyUrl = `${siteUrl}/waitlist/verify?token=${encodeURIComponent(verifyToken)}`;

  const { subject, html, text } = renderWaitlistVerificationEmail({
    fullName,
    verifyUrl,
    examType,
    targetExamYear,
  });

  const transporter = getEmailTransporter();
  const fromUser = process.env.ZOHO_SMTP_USER || 'support@sheratutor.tech';

  return await transporter.sendMail({
    from: `"SheraTutor" <${fromUser}>`,
    to,
    replyTo: 'support@sheratutor.tech',
    subject,
    text,
    html,
  });
}
