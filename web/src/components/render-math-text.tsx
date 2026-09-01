'use client';

import dynamic from 'next/dynamic';

const DynamicMathView = dynamic(() => import('./math-markdown-view'), {
  ssr: false,
  loading: () => <span className="inline leading-relaxed opacity-90" />,
});

/**
 * Renders a string that may contain inline/blocked LaTeX ($...$, $$...$$) plus
 * light Markdown. Paragraphs collapse to inline <span>s so the output sits
 * naturally inside prose, table cells, and flex rows.
 *
 * Dynamically loaded so KaTeX (~380 KB raw / ~110 KB gz) is code-split
 * and loaded asynchronously after initial page paint.
 */
export function RenderMathText({
  text,
  inline = true,
}: {
  text: string;
  inline?: boolean;
}) {
  return <DynamicMathView text={text} inline={inline} />;
}
