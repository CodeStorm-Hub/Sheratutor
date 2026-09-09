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
