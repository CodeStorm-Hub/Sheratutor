'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

/**
 * Renders a string that may contain inline/blocked LaTeX ($...$, $$...$$) plus
 * light Markdown. Paragraphs collapse to inline <span>s so the output sits
 * naturally inside prose, table cells, and flex rows.
 *
 * KaTeX's stylesheet is imported here (not in the root layout) so only the
 * routes that actually render math pull in ~25 KB of CSS.
 */
export function RenderMathText({ text }: { text: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ ...props }) => <span className="inline leading-relaxed" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
