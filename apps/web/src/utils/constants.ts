export const ROUTES = {
  home: '/',
  profile: '/profile',
  notifications: '/profile/notifications',
  coach: {
    locations: '/coach/locations',
    locationNew: '/coach/locations/new',
    locationEdit: (id: string) => `/coach/locations/${id}/edit`,
  },
  play: {
    create: '/play/create',
  },
  invite: (code: string) => `/player/invite/${code}`,
} as const;
