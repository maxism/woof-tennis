import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants';
import { t } from '@/utils/i18n';

function IconSchedule({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? '' : 'text-tg-hint'}
    >
      <rect x="3" y="4" width="18" height="18" rx="3" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" strokeWidth="2.2" />
    </svg>
  );
}

function IconProfile({ active }: { active: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? 'var(--woof-accent)' : 'currentColor'}
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={active ? '' : 'text-tg-hint'}
    >
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c0-4 3.6-6 8-6s8 2 8 6" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TabBar() {
  const navigate = useNavigate();

  return (
    <nav className="safe-pb fixed bottom-0 left-0 right-0 z-40">
      {/* FAB — floats above the bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex -translate-y-7 justify-center">
        <button
          type="button"
          onClick={() => navigate(ROUTES.play.create)}
          className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-woof-accent text-white shadow-lg shadow-woof-accent/40 transition-transform duration-150 active:scale-95"
          aria-label="Создать событие"
        >
          <IconPlus />
        </button>
      </div>

      {/* Bar strip */}
      <div className="border-t border-woof-border bg-tg-bg/95 backdrop-blur-md">
        <ul className="mx-auto flex max-w-lg px-1 pt-1">
          <li className="flex-1">
            <NavLink
              to={ROUTES.home}
              end
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[10px] leading-tight ${
                  isActive ? 'font-semibold text-woof-accent' : 'font-medium text-tg-hint'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconSchedule active={isActive} />
                  <span>{t('nav', 'schedule')}</span>
                </>
              )}
            </NavLink>
          </li>

          {/* Centre gap so FAB doesn't overlap labels */}
          <li className="flex-1" aria-hidden="true" />

          <li className="flex-1">
            <NavLink
              to={ROUTES.profile}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[10px] leading-tight ${
                  isActive ? 'font-semibold text-woof-accent' : 'font-medium text-tg-hint'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconProfile active={isActive} />
                  <span>{t('nav', 'profile')}</span>
                </>
              )}
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
