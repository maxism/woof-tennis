import type { ReactNode } from 'react';

type Tone = 'neutral' | 'accent' | 'warn' | 'danger' | 'success';

const toneMap: Record<Tone, string> = {
  neutral: 'bg-tg-secondary-bg text-tg-hint',
  accent: 'bg-woof-accent/15 text-woof-accent',
  warn: 'bg-woof-warn/15 text-woof-warn',
  danger: 'bg-woof-danger/15 text-woof-danger',
  success: 'bg-woof-success/15 text-woof-success',
};

export function Badge({
  tone = 'neutral',
  children,
  className = '',
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${toneMap[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
