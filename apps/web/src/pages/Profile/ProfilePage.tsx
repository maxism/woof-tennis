import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/stores/authStore';
import { PageHeader } from '@/components/ui/PageHeader';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { updateMe } from '@/api/users';
import { useUIStore } from '@/stores/uiStore';
import type { ThemeOverride } from '@/stores/uiStore';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

// ─── Row item ─────────────────────────────────────────────────────────────────

function SettingsRow({
  label,
  hint,
  right,
  onClick,
}: {
  label: string;
  hint?: string;
  right?: React.ReactNode;
  onClick?: () => void;
}) {
  const inner = (
    <div className="flex items-center justify-between gap-3 px-4 py-3.5">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-tg-text">{label}</p>
        {hint ? <p className="mt-0.5 text-xs text-tg-hint">{hint}</p> : null}
      </div>
      {right ? <div className="flex-shrink-0">{right}</div> : null}
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="w-full text-left transition-colors active:bg-tg-secondary-bg/50"
      >
        {inner}
      </button>
    );
  }
  return <div>{inner}</div>;
}

function SettingsSection({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      {title ? (
        <p className="mb-1.5 px-1 text-xs font-semibold uppercase tracking-wider text-tg-hint">
          {title}
        </p>
      ) : null}
      <div className="overflow-hidden rounded-2xl border border-woof-border bg-tg-secondary-bg divide-y divide-woof-border">
        {children}
      </div>
    </div>
  );
}

// ─── Theme selector ───────────────────────────────────────────────────────────

const THEMES: { value: ThemeOverride; label: string }[] = [
  { value: 'system', label: t('profile', 'themeSystem') },
  { value: 'light', label: t('profile', 'themeLight') },
  { value: 'dark', label: t('profile', 'themeDark') },
];

function ThemeSelector() {
  const theme = useUIStore((s) => s.themeOverride);
  const setTheme = useUIStore((s) => s.setThemeOverride);

  return (
    <div className="flex gap-1.5 p-1">
      {THEMES.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => setTheme(opt.value)}
          className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
            theme === opt.value
              ? 'bg-woof-accent text-white shadow-sm'
              : 'text-tg-hint hover:text-tg-text'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export function ProfilePage() {
  const user = useAuthStore((s) => s.user);
  const updateUser = useAuthStore((s) => s.updateUser);
  const activeRole = useUIStore((s) => s.activeRole);
  const setActiveRole = useUIStore((s) => s.setActiveRole);
  const navigate = useNavigate();
  const qc = useQueryClient();

  const toggleCoach = useMutation({
    mutationFn: () => updateMe({ isCoach: !user?.isCoach }),
    onSuccess: (u) => {
      const cur = useAuthStore.getState().user;
      if (!cur) return;
      updateUser({ ...cur, ...u, stats: cur.stats });
      setActiveRole(u.isCoach ? 'coach' : 'player');
      void qc.invalidateQueries();
      toast.success(t('common', 'save'));
    },
    onError: () => toast.error(t('common', 'retry')),
  });

  if (!user) return null;

  const name = `${user.firstName} ${user.lastName ?? ''}`.trim();
  const isCoach = Boolean(user.isCoach);
  const isInCoachMode = isCoach && activeRole === 'coach';

  return (
    <div className="flex flex-col gap-5">
      <PageHeader title={t('profile', 'title')} />

      {/* ── Avatar card ── */}
      <div className="flex items-center gap-4 px-1">
        <Avatar src={user.photoUrl} name={user.firstName} size={64} />
        <div className="min-w-0 flex-1">
          <p className="text-lg font-bold text-tg-text">{name}</p>
          {user.username ? (
            <p className="text-sm text-tg-hint">@{user.username}</p>
          ) : null}
          {user.stats ? (
            <p className="mt-1 text-xs text-tg-hint">
              {user.stats.totalBookingsAsPlayer} как игрок
              {isCoach ? ` · ${user.stats.totalBookingsAsCoach} как тренер` : ''}
            </p>
          ) : null}
        </div>
      </div>

      {/* ── Role ── */}
      <SettingsSection title={t('profile', 'accountRole')}>
        <SettingsRow
          label={t('profile', 'coachMode')}
          hint={isCoach ? 'Режим тренера включён' : 'Станьте тренером чтобы создавать события'}
          right={
            <Checkbox
              checked={isCoach}
              onChange={() => toggleCoach.mutate()}
              disabled={toggleCoach.isPending}
            />
          }
        />
      </SettingsSection>

      {/* ── Coach cabinet (only in coach mode) ── */}
      {isInCoachMode ? (
        <SettingsSection title={t('profile', 'coachCabinet')}>
          <SettingsRow
            label={t('nav', 'locations')}
            hint={t('profile', 'coachToolsHint')}
            right={
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tg-hint">
                <path d="M9 18l6-6-6-6" />
              </svg>
            }
            onClick={() => navigate(ROUTES.coach.locations)}
          />
        </SettingsSection>
      ) : null}

      {/* ── Notifications ── */}
      <SettingsSection>
        <SettingsRow
          label={t('profile', 'notificationsArchive')}
          right={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-tg-hint">
              <path d="M9 18l6-6-6-6" />
            </svg>
          }
          onClick={() => navigate(ROUTES.notifications)}
        />
      </SettingsSection>

      {/* ── Theme ── */}
      <SettingsSection title={t('profile', 'themeTitle')}>
        <div className="px-1 py-1">
          <ThemeSelector />
        </div>
      </SettingsSection>
    </div>
  );
}
