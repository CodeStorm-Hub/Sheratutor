import { Logo } from "@/components/logo";
import { WaitlistForm } from "@/components/waitlist-form";
import { Badge } from "@/components/ui/badge";

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
        <section className="w-full max-w-5xl flex flex-col items-center text-center pt-12 pb-16 gap-6">
          <Badge className="eyebrow bg-sunshine/20 text-ink-navy dark:text-sunshine border-sunshine/40">
            Coming to Bangladesh
          </Badge>

          <h1 className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.05] max-w-3xl text-balance">
            Graded like a real board examiner.{" "}
            <span className="text-primary">Free, for every student.</span>
          </h1>

          <p className="text-lg sm:text-xl md:text-xl text-muted-foreground max-w-2xl text-balance">
            Photograph your handwritten answer script. SheraTutor reads your
            Bangla and English, grades it against the actual NCTB rubric, and
            shows you exactly which step cost you the mark — instantly.
          </p>

          <div className="pt-6 w-full flex justify-center">
            <WaitlistForm />
          </div>
        </section>

        <section className="w-full max-w-5xl grid sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {[
            {
              eyebrow: "The Problem",
              title: "Feedback only the wealthy can buy",
              body: "Private tutors give granular, board-standard feedback. Everyone else gets a bare pass/fail mark.",
              accent: "coral",
            },
            {
              eyebrow: "The Solution",
              title: "An AI examiner in your pocket",
              body: "Vision-grounded grading against the real NCTB curriculum and official board rubrics — not a generic LLM guess.",
              accent: "mint",
            },
            {
              eyebrow: "The Promise",
              title: "Free means free. Permanently.",
              body: "No premium tier, no ad paywall, no '3 free tests' limit. Funded entirely by institutions, not students.",
              accent: "sunshine",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-border bg-card p-6 text-left flex flex-col gap-2 shadow-sm"
            >
              <span className="eyebrow text-xs text-primary">{card.eyebrow}</span>
              <h3 className="font-heading font-bold text-xl">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.body}</p>
            </div>
          ))}
        </section>
      </main>

      <footer className="px-6 md:px-12 py-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <Logo tagline />
        <p>&copy; {new Date().getFullYear()} SheraTutor. Made for Bangladesh&apos;s SSC &amp; HSC students.</p>
      </footer>
    </div>
  );
}
