import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export function Input({ label, error, className = '', id, ...rest }: InputProps) {
  const inputId = id ?? rest.name;
  return (
    <div className="flex w-full flex-col gap-1">
      {label ? (
        <label htmlFor={inputId} className="text-sm text-tg-hint">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        className={`min-h-11 w-full rounded-xl border bg-tg-bg px-3 text-tg-text outline-none transition-colors placeholder:text-tg-hint focus:border-woof-accent focus:ring-1 focus:ring-woof-accent ${
          error ? 'border-woof-danger' : 'border-woof-border'
        } ${className}`}
        {...rest}
      />
      {error ? <p className="text-xs text-woof-danger">{error}</p> : null}
    </div>
  );
}
