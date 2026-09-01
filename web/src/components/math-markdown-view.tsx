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
  const sanitizedText = (text || '')
    .replace(/\\\[([\s\S]*?)\\\]/g, (_, inner) => `\n$$\n${inner.trim()}\n$$\n`)
    .replace(/\\\(([\s\S]*?)\\\)/g, (_, inner) => `$${inner.trim()}$`);

  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ ...props }) =>
          inline ? (
            <span className="inline leading-relaxed" {...props} />
          ) : (
            <p className="mb-2 last:mb-0" {...props} />
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
      }}
    >
      {sanitizedText}
    </ReactMarkdown>
  );
}
