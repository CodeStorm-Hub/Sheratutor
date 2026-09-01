import React from 'react';
import { cn } from '@/lib/utils';

interface TagProps {
  children: React.ReactNode;
  color?: 'mint' | 'sun' | 'coral' | 'lilac';
  className?: string;
}

const COLORS: Record<NonNullable<TagProps['color']>, string> = {
  mint: 'bg-surface-2 text-green',
  sun: 'bg-coral-soft text-ochre',
  coral: 'bg-coral-soft text-mark',
  lilac: 'bg-background text-foreground',
};

export const Tag: React.FC<TagProps> = ({ children, color = 'mint', className }) => {
  return (
    <span
      className={cn(
        'inline-block rounded-md px-[7px] py-[5px] font-mono text-3xs font-bold tracking-[0.05em]',
        COLORS[color],
        className,
      )}
    >
      {children}
    </span>
  );
};
