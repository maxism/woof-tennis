import type { ReactNode } from 'react';
import { Button } from './Button';
import { t } from '@/utils/i18n';

export function Modal({
  open,
  title,
  children,
  onClose,
}: {
  open: boolean;
  title?: string;
  children: ReactNode;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md rounded-t-3xl border border-woof-border bg-tg-bg p-4 shadow-xl sm:rounded-3xl">
        {title ? <h2 className="mb-3 text-lg font-semibold text-tg-text">{title}</h2> : null}
        {children}
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            {t('common', 'cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
}
