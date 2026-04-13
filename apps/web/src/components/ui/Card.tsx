import type { HTMLAttributes, ReactNode } from 'react';

export function Card({
  children,
  className = '',
  ...rest
}: { children: ReactNode; className?: string } & HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-woof-border bg-tg-secondary-bg/60 px-4 py-3 ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
