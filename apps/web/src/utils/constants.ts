export const ROUTES = {
  home: '/',
  profile: '/profile',
  notifications: '/profile/notifications',
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
    create: '/play/create',
    join: (code: string) => `/play/${code}`,
  },
  invite: (code: string) => `/player/invite/${code}`,
  review: (bookingId: string) => `/review/${bookingId}`,
} as const;
