import { create } from 'zustand';

export type ActiveRole = 'player' | 'coach';

interface UIState {
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeRole: 'player',
  setActiveRole: (role) => set({ activeRole: role }),
}));
