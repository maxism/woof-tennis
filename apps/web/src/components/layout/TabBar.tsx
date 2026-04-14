import { NavLink } from 'react-router-dom';
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
  const items: Item[] = [
    { to: ROUTES.home, label: t('nav', 'home'), Icon: IconCalendar },
    { to: ROUTES.profile, label: t('nav', 'profile'), Icon: IconUser },
  ];

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
