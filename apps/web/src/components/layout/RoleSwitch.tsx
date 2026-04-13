import { useUIStore } from '@/stores/uiStore';
import { useAuthStore } from '@/stores/authStore';
import { t } from '@/utils/i18n';

export function RoleSwitch() {
  const isCoach = useAuthStore((s) => s.user?.isCoach);
  const activeRole = useUIStore((s) => s.activeRole);
  const setActiveRole = useUIStore((s) => s.setActiveRole);

  if (!isCoach) return null;

  return (
    <div
      className="mb-4 flex rounded-xl border border-woof-border bg-tg-secondary-bg/50 p-1"
      role="tablist"
      aria-label="Роль"
    >
      <button
        type="button"
        role="tab"
        aria-selected={activeRole === 'player'}
        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
          activeRole === 'player'
            ? 'bg-tg-bg text-tg-text shadow-sm'
            : 'text-tg-hint'
        }`}
        onClick={() => setActiveRole('player')}
      >
        {t('roles', 'asPlayer')}
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={activeRole === 'coach'}
        className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
          activeRole === 'coach'
            ? 'bg-tg-bg text-tg-text shadow-sm'
            : 'text-tg-hint'
        }`}
        onClick={() => setActiveRole('coach')}
      >
        {t('roles', 'asCoach')}
      </button>
    </div>
  );
}
