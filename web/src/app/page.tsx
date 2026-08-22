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
    <div className="landing-container" style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '18px clamp(16px, 4vw, 40px)',
          borderBottom: '1px solid var(--border)',
          gap: 12,
        }}
      >
        <Logo tagline />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link
            href="/login"
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--navy)',
              textDecoration: 'none',
              padding: '8px 12px',
            }}
          >
            Sign in
          </Link>
          <Link
            href="/dashboard"
            className="primary-btn"
            style={{ textDecoration: 'none', padding: '9px 14px' }}
          >
            Open Workspace <ArrowRight size={15} />
          </Link>
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '0 clamp(16px, 4vw, 40px)',
          maxWidth: 1240,
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Hero Section */}
        <section
          className="landing-hero"
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 420px), 1fr))',
            alignItems: 'center',
            gap: 'clamp(28px, 5vw, 50px)',
            padding: 'clamp(32px, 6vw, 64px) 0',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 18 }}>
            <Tag color="sun">বাংলাদেশে আসছে</Tag>

            <h1
              style={{
                font: "800 clamp(28px, 5.5vw, 46px)/1.15 'Baloo 2', sans-serif",
                margin: 0,
                color: 'var(--navy)',
                letterSpacing: '-0.5px',
              }}
            >
              বোর্ড পরীক্ষকের মতোই মূল্যায়ন।{' '}
              <span style={{ color: 'var(--coral)' }}>
                প্রতিটি শিক্ষার্থীর জন্য চিরকাল বিনামূল্যে।
              </span>
            </h1>

            <p style={{ fontSize: 'clamp(14px, 2vw, 16px)', color: 'var(--muted)', lineHeight: 1.6, margin: 0, maxWidth: 520 }}>
              তোমার হাতে লেখা উত্তরপত্রের ছবি তোলো। SheraTutor তোমার বাংলা ও ইংরেজি
              পড়ে, আসল NCTB রুব্রিক অনুযায়ী মূল্যায়ন করে, আর ঠিক কোন ধাপে নম্বর
              কাটা গেছে তা সঙ্গে সঙ্গে দেখায়।
            </p>

            <div style={{ width: '100%', maxWidth: 460 }}>
              <WaitlistForm />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <KhataPreview className="w-full max-w-sm drop-shadow-sm" />
          </div>
        </section>

        {/* How it works */}
        <section
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 260px), 1fr))',
            gap: 20,
            paddingBottom: 'clamp(36px, 5vw, 60px)',
          }}
        >
          {HOW_IT_WORKS.map((step, i) => (
            <div
              key={step.title}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 16,
                padding: 22,
                background: 'var(--paper)',
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontWeight: 700, color: 'var(--coral)', fontSize: 13 }}>
                  {`0${i + 1}`}
                </span>
                <step.icon size={18} color="var(--mint)" />
              </div>
              <h3 style={{ font: "700 18px 'Baloo 2', sans-serif", margin: 0 }}>
                {step.title}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0, lineHeight: 1.55 }}>
                {step.body}
              </p>
            </div>
          ))}
        </section>

        {/* Problem / Solution / Promise */}
        <section
          style={{
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: 20,
            paddingBottom: 'clamp(40px, 6vw, 70px)',
          }}
        >
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
              style={{
                borderLeft: '4px solid var(--coral)',
                borderTop: '1px solid var(--border)',
                borderRight: '1px solid var(--border)',
                borderBottom: '1px solid var(--border)',
                borderRadius: '0 16px 16px 0',
                padding: '24px 22px',
                background: '#fff',
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: 'var(--coral)', fontWeight: 700 }}>
                {card.eyebrow}
              </span>
              <h3 style={{ font: "700 18px 'Baloo 2', sans-serif", margin: 0 }}>
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
      <footer
        style={{
          borderTop: '1px solid var(--border)',
          padding: '24px clamp(16px, 4vw, 40px)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12,
          fontSize: 12,
          color: 'var(--muted)',
        }}
      >
        <Logo tagline />
        <p style={{ margin: 0 }}>
          &copy; {new Date().getFullYear()} SheraTutor &middot; বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য তৈরি।
        </p>
      </footer>
    </div>
  );
}
