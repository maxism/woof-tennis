export const ROUTES = {
  home: '/',
  profile: '/profile',
  notifications: '/notifications',
  coach: {
    locations: '/coach/locations',
    locationNew: '/coach/locations/new',
    locationEdit: (id: string) => `/coach/locations/${id}/edit`,
    schedule: '/coach/schedule',
    templateNew: '/coach/schedule/template/new',
    templateEdit: (id: string) => `/coach/schedule/template/${id}/edit`,
    slotNew: '/coach/schedule/slot/new',
    slot: (id: string) => `/coach/slot/${id}`,
  },
  player: {
    search: '/player/search',
    coach: (id: string) => `/player/coach/${id}`,
    booking: (id: string) => `/player/booking/${id}`,
  },
  play: {
    mine: '/play/mine',
    new: '/play/new',
    join: (code: string) => `/play/${code}`,
  },
  review: (bookingId: string) => `/review/${bookingId}`,
} as const;
