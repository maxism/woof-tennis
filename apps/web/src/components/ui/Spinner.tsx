import { t } from '@/utils/i18n';

export function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-tg-hint">
      <div
        className="h-8 w-8 animate-spin rounded-full border-2 border-woof-border border-t-woof-accent"
        role="status"
        aria-label={label ?? t('common', 'loading')}
      />
      {label ? <span className="text-sm">{label}</span> : null}
    </div>
  );
}
