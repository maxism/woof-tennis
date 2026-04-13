export const ALLOWED_SLOT_DURATIONS = [30, 60, 90, 120] as const;
export type SlotDuration = (typeof ALLOWED_SLOT_DURATIONS)[number];
