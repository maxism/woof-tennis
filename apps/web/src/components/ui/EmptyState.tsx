import type { ReactNode } from 'react';
import { t } from '@/utils/i18n';

export function EmptyState({
  title,
  description,
  action,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-4 py-12 text-center">
      <p className="text-base font-medium text-tg-text">{title ?? t('common', 'empty')}</p>
      {description ? <p className="text-sm text-tg-hint">{description}</p> : null}
      {action}
    </div>
  );
}
