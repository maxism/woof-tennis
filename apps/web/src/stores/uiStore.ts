import { create } from 'zustand';

export type ActiveRole = 'player' | 'coach';
export type ThemeOverride = 'system' | 'light' | 'dark';

function applyThemeOverride(theme: ThemeOverride) {
  if (theme === 'system') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.dataset.theme = theme;
  }
}

interface UIState {
  activeRole: ActiveRole;
  homeScrollYByRole: Partial<Record<ActiveRole, number>>;
  themeOverride: ThemeOverride;
  setActiveRole: (role: ActiveRole) => void;
  setHomeScrollY: (role: ActiveRole, y: number) => void;
  setThemeOverride: (theme: ThemeOverride) => void;
}

const storedTheme = (localStorage.getItem('woof-theme') as ThemeOverride | null) ?? 'system';
if (storedTheme !== 'system') applyThemeOverride(storedTheme);

export const useUIStore = create<UIState>((set) => ({
  activeRole: 'player',
  homeScrollYByRole: {},
  themeOverride: storedTheme,
  setActiveRole: (role) => set({ activeRole: role }),
  setHomeScrollY: (role, y) =>
    set((state) => ({ homeScrollYByRole: { ...state.homeScrollYByRole, [role]: y } })),
  setThemeOverride: (theme) => {
    localStorage.setItem('woof-theme', theme);
    applyThemeOverride(theme);
    set({ themeOverride: theme });
  },
}));
