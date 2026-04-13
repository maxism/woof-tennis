import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-woof-accent text-white hover:opacity-90 active:opacity-80 disabled:opacity-40',
  secondary:
    'bg-tg-secondary-bg text-tg-text border border-woof-border hover:bg-woof-secondary-bg/80',
  ghost: 'text-woof-accent hover:bg-tg-secondary-bg active:bg-tg-secondary-bg',
  danger: 'bg-woof-danger text-white hover:opacity-90 active:opacity-80 disabled:opacity-40',
};

const sizeClass: Record<Size, string> = {
  sm: 'min-h-9 px-3 text-sm rounded-lg',
  md: 'min-h-11 px-4 text-[15px] rounded-xl',
  lg: 'min-h-12 px-5 text-base rounded-xl',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
  /** Если задано, рендерится как ссылка (для «Войти через Telegram» и т.п.). */
  href?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  href,
  ...rest
}: ButtonProps) {
  const cls = `inline-flex items-center justify-center font-medium transition-opacity focus:outline-none focus-visible:ring-2 focus-visible:ring-woof-accent focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--woof-bg)] disabled:pointer-events-none ${variantClass[variant]} ${sizeClass[size]} ${className}`;

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={cls}
      {...rest}
    >
      {children}
    </button>
  );
}
