import type { Metadata } from "next";
import { Baloo_2, Baloo_Da_2, Inter, Hind_Siliguri, Space_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "katex/dist/katex.min.css";
import "./globals.css";

// Display: Baloo 2 for Latin, Baloo Da 2 for Bengali — same superfamily, so
// the brand voice ("bouncy, youthful") stays consistent across languages
// instead of falling back to a generic Bengali system font (docs/review §8.6
// — the original design system named Baloo 2 with zero Bengali coverage).
const balooDisplay = Baloo_2({
  variable: "--font-display",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

const balooDisplayBn = Baloo_Da_2({
  variable: "--font-display-bn",
  weight: ["600", "700", "800"],
  subsets: ["bengali"],
  display: "swap",
});

// Body: Inter for Latin, Hind Siliguri for Bengali (Inter has no Bengali coverage).
const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-body-bn",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

// Labels/stats/eyebrows: Space Mono, Latin-only by design (used for numerals
// and short English eyebrow labels even in the Bangla UI, per the design system).
const spaceMono = Space_Mono({
  variable: "--font-mono-eyebrow",
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "SheraTutor — for SheraStudents",
  description: "Bangladesh's first AI board examiner — free for every student, forever.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      className={`${balooDisplay.variable} ${balooDisplayBn.variable} ${inter.variable} ${hindSiliguri.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
