import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";
import { KhataPreview } from "@/components/khata-preview";
import { Badge } from "@/components/ui/badge";
import { Camera, ScanText, ClipboardCheck } from "lucide-react";

const HOW_IT_WORKS = [
  { icon: Camera, title: "ছবি তোলো", body: "তোমার হাতে লেখা উত্তরপত্র মোবাইলে ছবি তুলে জমা দাও।" },
  { icon: ScanText, title: "AI পরীক্ষক পড়ে", body: "বাংলা ও ইংরেজি হাতের লেখা পড়ে NCTB রুব্রিক অনুযায়ী মূল্যায়ন করে।" },
  { icon: ClipboardCheck, title: "ধাপে ধাপে ফল", body: "প্রতিটি ধাপে কোথায় নম্বর কাটা গেল, সঙ্গে সঙ্গে দেখো।" },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-full bg-background">
      <header className="flex items-center justify-between px-6 md:px-12 py-6">
        <Logo />
        <a
          href="https://sheratutor.ai"
          className="eyebrow text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          sheratutor.ai
        </a>
      </header>

      <main className="flex-1 flex flex-col items-center px-6 md:px-12">
        <section className="w-full max-w-5xl grid lg:grid-cols-[1.1fr_0.9fr] items-center gap-10 pt-8 pb-16">
          <div className="flex flex-col items-start text-left gap-6">
            <Badge className="eyebrow bg-ochre-soft text-ochre-deep dark:text-ochre border-ochre/40">
              বাংলাদেশে আসছে
            </Badge>

            <h1 className="font-serif font-normal text-4xl md:text-5xl leading-[1.15] text-balance">
              বোর্ড পরীক্ষকের মতোই মূল্যায়ন।{" "}
              <span className="text-primary">প্রতিটি শিক্ষার্থীর জন্য চিরকাল বিনামূল্যে।</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl text-balance">
              তোমার হাতে লেখা উত্তরপত্রের ছবি তোলো। SheraTutor তোমার বাংলা ও ইংরেজি
              পড়ে, আসল NCTB রুব্রিক অনুযায়ী মূল্যায়ন করে, আর ঠিক কোন ধাপে নম্বর
              কাটা গেছে তা সঙ্গে সঙ্গে দেখায়।
            </p>

            <div className="w-full max-w-md">
              <WaitlistForm />
            </div>
          </div>

          <KhataPreview className="w-full max-w-xs mx-auto lg:max-w-none drop-shadow-sm" />
        </section>

        <section className="w-full max-w-5xl grid sm:grid-cols-3 gap-6 pb-16">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <span className="eyebrow text-xs text-red font-tabular">{`0${i + 1}`}</span>
                <step.icon className="w-4 h-4 text-primary" />
              </div>
              <h3 className="font-heading font-bold text-lg">{step.title}</h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          ))}
        </section>

        <section className="w-full max-w-5xl grid md:grid-cols-3 gap-6 pb-20">
          {[
            {
              eyebrow: "সমস্যা",
              title: "টাকা থাকলেই মেলে সূক্ষ্ম ফিডব্যাক",
              body: "প্রাইভেট টিউটর বোর্ড-মানের বিস্তারিত ফিডব্যাক দেয়। বাকিরা পায় শুধু পাস/ফেল নম্বর।",
            },
            {
              eyebrow: "সমাধান",
              title: "পকেটে একজন AI পরীক্ষক",
              body: "আসল NCTB পাঠ্যক্রম ও বোর্ডের অফিসিয়াল রুব্রিক দিয়ে মূল্যায়ন — সাধারণ কোনো AI অনুমান নয়।",
            },
            {
              eyebrow: "প্রতিশ্রুতি",
              title: "বিনামূল্যে মানে সত্যিই বিনামূল্যে",
              body: "কোনো প্রিমিয়াম প্ল্যান নেই, বিজ্ঞাপন নেই, '৩টি ফ্রি টেস্ট' সীমা নেই। শিক্ষার্থী নয়, প্রতিষ্ঠান খরচ বহন করে।",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="margin-rule rounded-r-2xl border border-l-0 border-border bg-card py-5 pr-6 text-left flex flex-col gap-2"
            >
              <span className="eyebrow text-xs text-red">{card.eyebrow}</span>
              <h3 className="font-heading font-bold text-xl">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="px-6 md:px-12 py-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <Logo tagline />
        <p>&copy; {new Date().getFullYear()} SheraTutor &middot; বাংলাদেশের SSC ও HSC শিক্ষার্থীদের জন্য তৈরি।</p>
      </footer>
    </div>
  );
}
