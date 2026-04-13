import type { ReactNode } from 'react';

export function PageHeader({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
}) {
  return (
    <header className="mb-4 flex items-start justify-between gap-3">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-tg-text">{title}</h1>
        {subtitle ? <p className="mt-0.5 text-sm text-tg-hint">{subtitle}</p> : null}
      </div>
      {right}
    </header>
  );
}
