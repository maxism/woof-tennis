import type { SelectHTMLAttributes } from 'react';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export function Select({ label, className = '', id, children, ...rest }: SelectProps) {
  const sid = id ?? rest.name;
  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label htmlFor={sid} className="text-sm text-tg-hint">
          {label}
        </label>
      ) : null}
      <select
        id={sid}
        className={`min-h-11 w-full rounded-xl border border-woof-border bg-tg-bg px-3 text-tg-text outline-none focus:border-woof-accent focus:ring-1 focus:ring-woof-accent ${className}`}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
}
