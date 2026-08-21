import type { Metadata } from "next";
import { Anek_Bangla, Anek_Latin, Noto_Sans_Bengali, Noto_Sans, Tiro_Bangla, Space_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "katex/dist/katex.min.css";
import "./globals.css";

// Display/UI: Anek Bangla + Anek Latin — one variable superfamily (wght
// 100–800, wdth 75–125) across both scripts, replacing the old Baloo
// pairing. Chosen for the "খাতা" redesign: a contemporary, exam-neutral
// voice rather than the previous bouncy/youthful brand.
const anekBangla = Anek_Bangla({
  variable: "--font-display-bn",
  weight: ["600", "700", "800"],
  subsets: ["bengali"],
  display: "swap",
});

const anekLatin = Anek_Latin({
  variable: "--font-display",
  weight: ["600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
});

// Body: Noto Sans Bengali has the most reliable conjunct (যুক্তাক্ষর)
// rendering at small sizes of any Bengali web font; Noto Sans is its Latin
// sibling for shared x-height and stroke weight.
const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-body-bn",
  weight: ["400", "500", "600", "700"],
  subsets: ["bengali"],
  display: "swap",
});

const notoSans = Noto_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

// Editorial serif: landing-page hero only, the "textbook" voice.
const tiroBangla = Tiro_Bangla({
  variable: "--font-serif-bn",
  weight: ["400"],
  subsets: ["bengali"],
  display: "swap",
});

// Labels/stats/eyebrows: Space Mono, Latin-only by design (used for numerals
// and short English eyebrow labels even in the Bangla UI).
const spaceMono = Space_Mono({
  variable: "--font-mono-eyebrow",
  weight: ["700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "শেরাটিউটর — SheraTutor",
  description: "বাংলাদেশের প্রথম AI বোর্ড পরীক্ষক — প্রতিটি শিক্ষার্থীর জন্য চিরকাল বিনামূল্যে।",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="bn"
      suppressHydrationWarning
      className={`${anekBangla.variable} ${anekLatin.variable} ${notoSansBengali.variable} ${notoSans.variable} ${tiroBangla.variable} ${spaceMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-body">
        <ThemeProvider>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
