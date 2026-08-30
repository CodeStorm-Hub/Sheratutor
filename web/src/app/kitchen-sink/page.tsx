import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag } from '@/components/Tag';
import { ScoreRing } from '@/components/ScoreRing';
import { MarkGlyph } from '@/components/mark-glyph';

export const metadata: Metadata = {
  title: 'Kitchen Sink — SheraTutor Design System',
  robots: { index: false, follow: false },
};

const SURFACE_TOKENS = [
  'background',
  'surface-1',
  'surface-2',
  'surface-3',
  'card',
  'popover',
  'muted',
  'accent',
];
const TEXT_TOKENS = ['foreground', 'heading', 'muted-foreground', 'primary', 'cta'];
const ACCENT_TOKENS = [
  'primary',
  'cta',
  'accent2',
  'success',
  'warning',
  'destructive',
  'mark',
  'green',
  'ochre',
  'red',
  'navy',
  'coral',
  'mint',
  'sun',
];

function Swatch({ token }: { token: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className="size-9 flex-none rounded-lg border border-border"
        style={{ background: `var(--color-${token}, var(--${token}))` }}
      />
      <code className="font-mono text-xs">--{token}</code>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4 border-t border-border pt-8">
      <h2 className="font-heading text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function KitchenSinkPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <header>
        <p className="font-mono text-2xs font-bold tracking-[0.12em] text-muted-foreground uppercase">
          Design system reference
        </p>
        <h1 className="mt-1 font-heading text-3xl font-extrabold">Kitchen Sink</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Every semantic token and shared primitive, rendered in the current theme. Toggle your OS /
          browser theme to check both. Source of truth: <code>src/app/globals.css</code>.
        </p>
      </header>

      <Section title="Surfaces & text">
        <div className="grid gap-3 sm:grid-cols-2">
          {SURFACE_TOKENS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {TEXT_TOKENS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
      </Section>

      <Section title="Accents & status">
        <div className="grid gap-3 sm:grid-cols-3">
          {ACCENT_TOKENS.map((t) => (
            <Swatch key={t} token={t} />
          ))}
        </div>
      </Section>

      <Section title="Type scale">
        <p className="text-display">Display — clamp(2rem, 5vw, 3.25rem)</p>
        <p className="text-headline">Headline — clamp(1.5rem, 3.5vw, 2.25rem)</p>
        <p className="font-heading text-xl font-bold">Title — 1.25rem</p>
        <p className="text-sm">Body — 0.875rem. অনুচ্ছেদ বাংলায়ও পড়া যায়।</p>
        <p className="font-mono text-2xs font-bold tracking-[0.12em] uppercase">Label — Space Mono</p>
        <p className="font-tabular text-lg">Tabular nums: 1,234,567 · 98.6% · 7/10</p>
      </Section>

      <Section title="Buttons">
        <div className="flex flex-wrap gap-3">
          <Button>Default (primary)</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-cta px-4 py-2.5 text-sm font-semibold text-cta-foreground shadow-xs transition-colors hover:opacity-90">
            App CTA pattern
          </button>
        </div>
      </Section>

      <Section title="Cards, badges, tags">
        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Card</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              rounded-2xl · border-border · bg-surface-1
            </CardContent>
          </Card>
          <div className="rounded-2xl border border-l-2 border-border border-l-mark bg-card p-5">
            <p className="text-sm">Examiner margin-rule card (<code>border-l-mark</code>)</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Badge</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="outline">Outline</Badge>
          <Tag color="mint">TAG MINT</Tag>
          <Tag color="sun">TAG SUN</Tag>
          <Tag color="coral">TAG CORAL</Tag>
        </div>
        <div className="flex items-center gap-3">
          <MarkGlyph level="mastered" />
          <MarkGlyph level="review" />
          <MarkGlyph level="gap" />
          <ScoreRing value={72} />
        </div>
      </Section>

      <Section title="Focus ring">
        <p className="text-sm text-muted-foreground">
          Tab through — the ring (<code>--ring</code>) must stay visible on coral controls.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Focus me</Button>
          <input
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Focus me"
          />
        </div>
      </Section>
    </div>
  );
}
