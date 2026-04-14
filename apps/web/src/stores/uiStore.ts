import { create } from 'zustand';

export type ActiveRole = 'player' | 'coach';

interface UIState {
  activeRole: ActiveRole;
  homeLocationId: string | null;
  homeScrollYByRole: Partial<Record<ActiveRole, number>>;
  setActiveRole: (role: ActiveRole) => void;
  setHomeLocationId: (locationId: string | null) => void;
  setHomeScrollY: (role: ActiveRole, y: number) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeRole: 'player',
  homeLocationId: null,
  homeScrollYByRole: {},
  setActiveRole: (role) => set({ activeRole: role }),
  setHomeLocationId: (locationId) => set({ homeLocationId: locationId }),
  setHomeScrollY: (role, y) =>
    set((state) => ({ homeScrollYByRole: { ...state.homeScrollYByRole, [role]: y } })),
}));
