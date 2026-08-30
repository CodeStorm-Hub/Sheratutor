import React from 'react';

interface PageHeaderProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description, children }) => {
  return (
    <section className="flex flex-col gap-4 pt-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="font-heading text-[clamp(1.75rem,4vw,2rem)] leading-tight font-extrabold">
          {title}
        </h1>
        <p className="mt-1.5 text-xs text-muted-foreground">{description}</p>
      </div>
      {children}
    </section>
  );
};
