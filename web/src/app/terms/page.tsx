import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Logo } from '@/components/logo';
import { FileText, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms of Service — SheraTutor',
  description: 'Terms of Service and terms of use for SheraTutor educational platform.',
};

export default function TermsPage() {
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
          <span className="inline-flex size-10 items-center justify-center rounded-xl bg-sun/15 text-sun">
            <FileText size={24} />
          </span>
          <div>
            <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
              Terms of Service
            </h1>
            <p className="text-xs text-muted-foreground">
              Effective Date: September 1, 2026
            </p>
          </div>
        </div>

        <article className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-muted-foreground space-y-6">
          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the SheraTutor website (<strong>sheratutor.tech</strong>), joining our waitlist, or using our AI-driven learning tools, you agree to comply with and be bound by these Terms of Service and our Privacy Policy.
            </p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              2. Educational Purpose & AI Evaluations
            </h2>
            <p>
              SheraTutor provides supplementary diagnostic feedback based on official NCTB marking principles. While our models are rigorously evaluated against human examiner consensus:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>SheraTutor scores are intended for formative learning and practice, not official certification.</li>
              <li>Final official grades in secondary/higher-secondary exams remain solely determined by the respective Bangladesh Education Boards.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              3. User Conduct & Acceptable Use
            </h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Submit automated, bot-driven requests, or attempt to overwhelm our API and waitlist systems.</li>
              <li>Upload malicious code, harmful imagery, or non-educational content.</li>
              <li>Attempt to bypass access controls, authentication checks, or security measures.</li>
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6">
            <h2 className="font-heading text-lg font-bold text-foreground mb-3">
              4. Contact & Support
            </h2>
            <p>
              If you have any questions or feedback regarding these terms, please contact our team at{' '}
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
