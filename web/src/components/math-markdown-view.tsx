'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export default function MathMarkdownView({
  text,
  inline = false,
}: {
  text: string;
  inline?: boolean;
}) {
  // Step 0: repair LaTeX corrupted by JSON string escapes (e.g. \t swallowed into tab + ext, \n into newline + ight, etc.)
  let sanitizedText = (text || '')
    .replace(/\t(ext|times|theta|Theta|tau|textbf|textit|to|tan|tilde|therefore|top)/g, '\\t$1')
    .replace(/\f(rac|forall|flat)/g, '\\f$1')
    .replace(/\x08(eta|bar|begin|bf|mathbf|bold)/g, '\\b$1')
    .replace(/[\r\n](ightarrow|ightleftharpoons|ight)/g, '\\r$1')
    .replace(/(?<![a-zA-Z\\])ight(arrow|leftharpoons)/g, '\\right$1')
    .replace(/(?<=[0-9\s$])ext\{/g, '\\text{');

  // Step 1: normalise TeX delimiters — convert \[…\] → $$…$$ and \(…\) → $…$
  sanitizedText = sanitizedText
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `\n$$\n${inner.trim()}\n$$\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner.trim()}$`);

  // Step 2: normalize double backslashes in math commands (e.g. \\Delta -> \Delta)
  sanitizedText = sanitizedText.replace(/\\\\([a-zA-Z]+)/g, '\\$1');

  // Step 3: wrap bare LaTeX commands that appear outside $…$ in inline math.
  // Strategy: split on existing $…$ blocks, then within non-math segments replace
  // bare LaTeX command sequences with $…$ wrapped versions.
  const BARE_LATEX_RE = /(?<!\\)(\\(?:Delta|delta|rightarrow|leftarrow|Rightarrow|Leftarrow|rightleftharpoons|leftrightarrow|to|gets|uparrow|downarrow|times|div|pm|mp|leq|geq|neq|approx|equiv|propto|cdot|cdots|ldots|infty|partial|nabla|forall|exists|alpha|beta|gamma|Gamma|theta|Theta|lambda|Lambda|mu|nu|xi|Xi|pi|Pi|rho|sigma|Sigma|tau|phi|Phi|chi|psi|Psi|omega|Omega|text|mathrm|mathbf|mathit|frac|sqrt|sum|prod|int|oint|lim|log|ln|sin|cos|tan|cot|sec|csc|exp|max|min|mod|gcd|lcm|det|dim|ker|hbar|quad|qquad|,|;|!|:|space)(?:\{[^}]*\})*(?:\^[{^]\S*[}]?)?(?:_[{_]\S*[}]?)?)/g;

  const mathSegmentRe = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  const parts = sanitizedText.split(mathSegmentRe);
  sanitizedText = parts
    .map((part, i) => {
      // Even-indexed parts are outside math delimiters — apply bare LaTeX wrapping
      if (i % 2 === 0) {
        return part.replace(BARE_LATEX_RE, (match) => `$${match}$`);
      }
      return part; // odd = already inside $…$ — leave as-is
    })
    .join('');


  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ ...props }) =>
          inline ? (
            <span className="inline leading-relaxed" {...props} />
          ) : (
            <div className="mb-2 last:mb-0 leading-relaxed" {...props} />
          ),
        ul: ({ ...props }) => (
          <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />
        ),
        ol: ({ ...props }) => (
          <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />
        ),
        li: ({ ...props }) => (
          <li className="text-xs leading-relaxed" {...props} />
        ),
        strong: ({ ...props }) => (
          <strong className="font-semibold text-green-deep dark:text-green" {...props} />
        ),
        code: ({ ...props }) => (
          <code className="bg-muted px-1 py-0.5 rounded text-xs font-mono" {...props} />
        ),
        img: ({ src, alt, ...props }) => {
          const imageSrc = typeof src === "string" ? src : undefined;
          return (
            <figure className="my-3 overflow-hidden rounded-xl border border-border/60 bg-muted/30 shadow-xs transition-all hover:shadow-md">
              <div className="relative group flex items-center justify-center p-2.5 bg-white dark:bg-zinc-950">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt={alt || "NCTB পাঠ্যবই চিত্র"}
                  className="max-h-72 w-auto object-contain rounded transition-transform duration-200 group-hover:scale-[1.02] cursor-zoom-in"
                  loading="lazy"
                  onClick={() => {
                    if (typeof window !== "undefined" && imageSrc) {
                      window.open(imageSrc, "_blank", "noopener,noreferrer");
                    }
                  }}
                  title="ক্লিক করে নতুন ট্যাবে বড় আকারে দেখো"
                  {...props}
                />
              </div>
              {alt && (
                <figcaption className="px-3 py-1.5 text-center text-xs font-medium text-muted-foreground border-t border-border/40 bg-muted/20 flex items-center justify-center gap-1.5">
                  <span>{alt}</span>
                  <span className="text-[10px] opacity-60">(বড় দেখতে ছবিতে ক্লিক করো)</span>
                </figcaption>
              )}
            </figure>
          );
        },
      }}
    >
      {sanitizedText}
    </ReactMarkdown>
  );
}
