import React from 'react';

interface ScoreRingProps {
  value: number | string;
}

export const ScoreRing: React.FC<ScoreRingProps> = ({ value }) => {
  const pct = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div
      className="relative grid size-[98px] shrink-0 place-items-center rounded-full"
      style={{
        background: `conic-gradient(var(--mint) ${pct}%, var(--surface-2) 0)`,
      }}
    >
      <div className="absolute inset-2 rounded-full bg-surface-1" />
      <div className="relative z-10 flex items-baseline font-mono">
        <strong className="text-2xl font-bold">{value}</strong>
        <span className="text-xs">%</span>
      </div>
    </div>
  );
};
