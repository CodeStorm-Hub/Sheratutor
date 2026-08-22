import Link from 'next/link';
import { Logo } from '@/components/logo';
import { WaitlistForm } from '@/components/waitlist-form';
import { KhataPreview } from '@/components/khata-preview';
import { Tag } from '@/components/Tag';
import { Camera, ScanText, ClipboardCheck, ArrowRight } from 'lucide-react';

const HOW_IT_WORKS = [
  { icon: Camera, title: 'ছবি তোলো', body: 'তোমার হাতে লেখা উত্তরপত্র মোবাইলে ছবি তুলে জমা দাও।' },
  { icon: ScanText, title: 'AI পরীক্ষক পড়ে', body: 'বাংলা ও ইংরেজি হাতের লেখা পড়ে NCTB রুব্রিক অনুযায়ী মূল্যায়ন করে।' },
  { icon: ClipboardCheck, title: 'ধাপে ধাপে ফল', body: 'প্রতিটি ধাপে কোথায় নম্বর কাটা গেল, সঙ্গে সঙ্গে দেখো।' },
];

export default function LandingPage() {
  return (
    <div className="landing-container">
      {/* Responsive Header */}
      <header className="landing-header">
        <Logo tagline />
        <div className="landing-nav-actions">
          <Link href="/login" className="landing-signin-btn">
            Sign in
          </Link>
          <Link href="/dashboard" className="primary-btn landing-cta-btn">
            Open Workspace <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="landing-main">
        {/* Hero Section */}
        <section className="landing-hero">
          <div className="landing-hero-left">
            <Tag color="sun">বাংলাদেশে আসছে</Tag>

            <h1 className="landing-hero-title">
              বোর্ড পরীক্ষকের মতোই মূল্যায়ন।{' '}
              <span style={{ color: 'var(--coral)' }}>
                প্রতিটি শিক্ষার্থীর জন্য চিরকাল বিনামূল্যে।
              </span>
            </h1>

            <p className="landing-hero-desc">
              তোমার হাতে লেখা উত্তরপত্রের ছবি তোলো। SheraTutor তোমার বাংলা ও ইংরেজি
              পড়ে, আসল NCTB রুব্রিক অনুযায়ী মূল্যায়ন করে, আর ঠিক কোন ধাপে নম্বর
              কাটা গেছে তা সঙ্গে সঙ্গে দেখায়।
            </p>

            <div className="landing-form-box">
              <WaitlistForm />
            </div>
          </div>

          <div className="landing-paper-preview">
            <KhataPreview className="w-full max-w-sm drop-shadow-sm" />
          </div>
        </section>

        {/* How it works */}
        <section className="landing-cards-grid">
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.title}
              className="landing-feature-card"
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: 'var(--coral)', fontSize: 13 }}>
                  {`0${i + 1}`}
                </span>
                <step.icon size={18} color="var(--mint)" />
              </div>
              <h3 style={{ font: "700 18px 'Baloo 2', sans-serif", margin: 0, color: 'var(--navy)' }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                {step.body}
              </p>
            </div>
          ))}
        </section>

        {/* Problem / Solution / Promise */}
        <section className="landing-cards-grid">
          {[
            {
              eyebrow: 'সমস্যা',
              title: 'টাকা থাকলেই মেলে সূক্ষ্ম ফিডব্যাক',
              body: 'প্রাইভেট টিউটর বোর্ড-মানের বিস্তারিত ফিডব্যাক দেয়। বাকিরা পায় শুধু পাস/ফেল নম্বর।',
            },
            {
              eyebrow: 'সমাধান',
              title: 'পকেটে একজন AI পরীক্ষক',
              body: 'আসল NCTB পাঠ্যক্রম ও বোর্ডের অফিসিয়াল রুব্রিক দিয়ে মূল্যায়ন — সাধারণ কোনো AI অনুমান নয়।',
            },
            {
              eyebrow: 'প্রতিশ্রুতি',
              title: 'বিনামূল্যে মানে সত্যিই বিনামূল্যে',
              body: 'কোনো প্রিমিয়াম প্ল্যান নেই, বিজ্ঞাপন নেই, ৩টি ফ্রি টেস্ট সীমা নেই। শিক্ষার্থী নয়, প্রতিষ্ঠান খরচ বহন করে।',
            },
          ].map((card) => (
            <div
              key={card.title}
              className="landing-promise-card"
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--coral)', fontWeight: 700 }}>
                {card.eyebrow}
              </span>
              <h3 style={{ font: "700 18px 'Baloo 2', sans-serif", margin: 0, color: 'var(--navy)' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                {card.body}
              </p>
            </div>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <Logo tagline />
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} SheraTutor &middot; বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য তৈরি।
        </p>
      </footer>
    </div>
  );
}
