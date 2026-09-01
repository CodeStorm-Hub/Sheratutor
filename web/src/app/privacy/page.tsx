import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/logo';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy (PDPA 2026) — SheraTutor',
  description: 'Privacy Policy and data protection practices for SheraTutor in compliance with Bangladesh Personal Data Protection Act 2026.',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-6 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Logo tagline />
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft size={14} /> Back to Home
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mint/15 text-mint">
            <ShieldCheck size={24} />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Privacy Policy
            </h1>
            <p className="text-xs text-muted-foreground">
              Compliance with Bangladesh Personal Data Protection Act (PDPA) 2026 &middot; Last updated: September 1, 2026
            </p>
          </div>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              1. Overview & Our Commitment
            </h2>
            <p>
              SheraTutor (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting the privacy and personal data of students, parents, and guardians across Bangladesh. This policy explains how we collect, store, process, and protect your information in accordance with the <strong>Bangladesh Personal Data Protection Act (PDPA) 2026</strong>.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              2. Minor Privacy & Verifiable Guardian Consent
            </h2>
            <p>
              Most HSC and SSC students in Bangladesh are under 18 years of age. Under the PDPA 2026, collecting contact data from minors requires explicit, verifiable consent from a parent or legal guardian.
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Waitlist and early-access forms require explicit parental/guardian consent acknowledgment before contact details are recorded.</li>
              <li>Guardians can sign up directly on behalf of students.</li>
              <li>We never sell, lease, or monetize student or guardian data.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              3. Information We Collect
            </h2>
            <p>During waitlist registration and account creation, we collect only strictly necessary data:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Contact Information:</strong> Full name, email address, and optional Bangladeshi mobile number.</li>
              <li><strong>Academic Context:</strong> Target examination (HSC/SSC), education board, and exam year.</li>
              <li><strong>Verification Records:</strong> Email verification status, timestamped guardian consent record, and consent notice version.</li>
              <li><strong>Exam Scripts (Active Platform):</strong> Handwritten khata photographs uploaded specifically for diagnostic AI grading.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              4. How We Use Your Data
            </h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>To notify you about priority early-access availability and platform launches.</li>
              <li>To verify your waitlist status and prevent automated spam submissions.</li>
              <li>To provide rubric-aligned educational evaluations tailored to your education board.</li>
              <li>To continually enhance the accuracy of OCR and grading models using de-identified data.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              5. Third-Party Processors & Infrastructure
            </h2>
            <p>We work with trusted enterprise service providers that maintain strict security standards:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Supabase:</strong> Encrypted database and authentication hosting (Row Level Security enforced).</li>
              <li><strong>Zoho (ZeptoMail / Mail):</strong> Transactional email delivery for double opt-in verification.</li>
              <li><strong>Vercel:</strong> Secure global web hosting and performance analytics.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              6. Your Rights under PDPA 2026
            </h2>
            <p>You and your legal guardian possess full rights over your personal data:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Right of Access:</strong> Request a copy of all stored personal records.</li>
              <li><strong>Right to Rectification:</strong> Update or correct inaccurate details.</li>
              <li><strong>Right to Erasure (&quot;Right to be Forgotten&quot;):</strong> Request permanent deletion of your waitlist or user profile.</li>
              <li><strong>Right to Withdraw Consent:</strong> Revoke guardian consent at any time.</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, please contact our Data Protection Officer at{' '}
              <a href="mailto:support@sheratutor.tech" className="text-primary font-medium hover:underline">
                support@sheratutor.tech
              </a>.
            </p>
          </section>
        </article>
      </main>

      <footer className="w-full border-t border-border py-6 text-center text-xs text-muted-foreground">
        &copy; 2026 SheraTutor &middot; <Link href="/" className="hover:underline">sheratutor.tech</Link>
      </footer>
    </div>
  );
}
