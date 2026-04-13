import { NavLink } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

function IconCalendar({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      className={active ? '' : 'text-tg-hint'}
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconSearch({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      className={active ? '' : 'text-tg-hint'}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function IconMap({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      className={active ? '' : 'text-tg-hint'}
    >
      <path d="M12 21s7-4.5 7-11a7 7 0 1 0-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function IconTennis({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      className={active ? '' : 'text-tg-hint'}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0 0 18" />
    </svg>
  );
}

function IconBell({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      className={active ? '' : 'text-tg-hint'}
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function IconUser({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      className={active ? '' : 'text-tg-hint'}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
    </svg>
  );
}

type Item = { to: string; label: string; Icon: (p: { active: boolean }) => JSX.Element };

export function TabBar() {
  const isCoach = useAuthStore((s) => s.user?.isCoach);

  const playerItems: Item[] = [
    { to: ROUTES.home, label: t('nav', 'myTrainings'), Icon: IconCalendar },
    { to: ROUTES.player.search, label: t('nav', 'coaches'), Icon: IconSearch },
    { to: ROUTES.play.new, label: t('nav', 'play'), Icon: IconTennis },
    { to: ROUTES.notifications, label: t('nav', 'notifications'), Icon: IconBell },
    { to: ROUTES.profile, label: t('nav', 'profile'), Icon: IconUser },
  ];

  const coachItems: Item[] = [
    { to: ROUTES.home, label: t('nav', 'schedule'), Icon: IconCalendar },
    { to: ROUTES.coach.locations, label: t('nav', 'locations'), Icon: IconMap },
    { to: ROUTES.player.search, label: t('nav', 'coaches'), Icon: IconSearch },
    { to: ROUTES.notifications, label: t('nav', 'notifications'), Icon: IconBell },
    { to: ROUTES.profile, label: t('nav', 'profile'), Icon: IconUser },
  ];

  const items = isCoach ? coachItems : playerItems;

  return (
    <nav className="safe-pb fixed bottom-0 left-0 right-0 z-40 border-t border-woof-border bg-tg-bg/95 backdrop-blur-md">
      <ul className="mx-auto flex max-w-lg justify-around px-1 pt-1">
        {items.map(({ to, label, Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              end={to === ROUTES.home}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[10px] leading-tight ${
                  isActive ? 'font-semibold text-woof-accent' : 'font-medium text-tg-hint'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon active={isActive} />
                  <span className="line-clamp-2 text-center">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
