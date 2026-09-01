interface WaitlistVerificationTemplateOptions {
  fullName: string;
  verifyUrl: string;
  examType?: string | null;
  targetExamYear?: number | null;
}

export function renderWaitlistVerificationEmail({
  fullName,
  verifyUrl,
  examType = 'HSC',
  targetExamYear = 2026,
}: WaitlistVerificationTemplateOptions) {
  const subject = 'Confirm your SheraTutor priority waitlist spot | সেরাটিউটর ওয়েটলিস্ট নিশ্চিত করুন';

  // 'ADMISSION' aspirants have no board exam; keep the target line readable.
  const targetLabel =
    examType === 'ADMISSION'
      ? `University Admission (${targetExamYear || 2026})`
      : `${examType || 'HSC'} Examination (${targetExamYear || 2026})`;

  const html = `
<!DOCTYPE html>
<html lang="bn">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #f1f5f9;
    }
    .wrapper {
      width: 100%;
      background-color: #0b0f19;
      padding: 40px 16px;
      box-sizing: border-box;
    }
    .card {
      max-width: 560px;
      margin: 0 auto;
      background-color: #111827;
      border: 1px solid #1f293d;
      border-radius: 16px;
      padding: 36px 28px;
      box-sizing: border-box;
    }
    .brand {
      font-size: 22px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin-bottom: 24px;
      display: inline-block;
    }
    .brand span {
      color: #10b981;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      background-color: rgba(16, 185, 129, 0.12);
      border: 1px solid rgba(16, 185, 129, 0.3);
      color: #34d399;
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 20px;
    }
    h1 {
      font-size: 20px;
      font-weight: 700;
      color: #ffffff;
      margin: 0 0 16px;
      line-height: 1.4;
    }
    p {
      font-size: 14px;
      line-height: 1.6;
      color: #94a3b8;
      margin: 0 0 16px;
    }
    .highlight-box {
      background-color: #1a2234;
      border-left: 4px solid #10b981;
      padding: 12px 16px;
      border-radius: 6px;
      margin: 20px 0;
      font-size: 13px;
      color: #cbd5e1;
    }
    .btn-wrap {
      margin: 28px 0;
      text-align: center;
    }
    .cta-btn {
      display: inline-block;
      background-color: #10b981;
      color: #0b0f19 !important;
      text-decoration: none;
      font-weight: 700;
      font-size: 15px;
      padding: 14px 28px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
    }
    .alt-link {
      font-size: 11px;
      color: #64748b;
      word-break: break-all;
      margin-top: 20px;
      line-height: 1.5;
    }
    .alt-link a {
      color: #38bdf8;
      text-decoration: none;
    }
    .footer {
      max-width: 560px;
      margin: 24px auto 0;
      text-align: center;
      font-size: 12px;
      color: #64748b;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="card">
      <div class="brand">Shera<span>Tutor</span></div>
      <br />
      <div class="badge">Early Access Verification · আর্লি অ্যাক্সেস যাচাইকরণ</div>
      
      <h1>প্রিয় ${fullName || 'শিক্ষার্থী/অভিভাবক'},</h1>
      
      <p>
        SheraTutor-এর অগ্রাধিকার ওয়েটলিস্টে যোগ দেওয়ার জন্য ধন্যবাদ! আমরা বাংলাদেশের প্রতিটি SSC ও HSC শিক্ষার্থীর হাতে বোর্ডের মানসম্মত নিখুঁত এআই মূল্যায়ন ও পার্সোনালাইজড টিউটরিং পৌঁছে দিতে কাজ করছি।
      </p>

      <p>
        তোমার ওয়েটলিস্ট স্পট নিশ্চিত করতে নিচের বোতামটিতে ক্লিক করে ইমেইল ভেরিফাই করো:
      </p>

      <div class="highlight-box">
        <strong>Selected Target:</strong> ${targetLabel}
      </div>

      <div class="btn-wrap">
        <a href="${verifyUrl}" class="cta-btn" target="_blank" rel="noopener noreferrer">
          Confirm My Waitlist Spot &rarr;
        </a>
      </div>

      <p style="font-size: 13px; color: #94a3b8;">
        (If you did not request to join the SheraTutor waitlist, you can safely ignore this email.)
      </p>

      <div class="alt-link">
        বাটন কাজ না করলে এই লিঙ্কটি ব্রাউজারে পেস্ট করুন:<br />
        <a href="${verifyUrl}">${verifyUrl}</a>
      </div>
    </div>

    <div class="footer">
      &copy; 2026 SheraTutor (sheratutor.tech). All rights reserved.<br />
      Bangladesh Personal Data Protection Act (PDPA 2026) Compliant.
    </div>
  </div>
</body>
</html>
  `.trim();

  const text = `
SheraTutor — Confirm your priority waitlist spot

Hello ${fullName || 'there'},

Thank you for requesting early access to SheraTutor (${targetLabel}).

Please verify your email to secure your priority waitlist position:
${verifyUrl}

If you didn't request this, please ignore this email.

---
SheraTutor (https://sheratutor.tech)
Bangladesh Personal Data Protection Act (PDPA 2026) Compliant.
  `.trim();

  return { subject, html, text };
}
