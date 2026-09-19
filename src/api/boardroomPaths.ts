// Every boardroom endpoint lives here. If the backend uses different paths,
// change them in this one file and nothing else needs to move.
export const BOARDROOM_PATHS = {
  rooms: '/rooms',
  room: (id: string) => `/rooms/${id}`,
  bookings: '/bookings',
  booking: (id: string) => `/bookings/${id}`,
  approve: (id: string) => `/bookings/${id}/approve`,
  reject: (id: string) => `/bookings/${id}/reject`,
  cancel: (id: string) => `/bookings/${id}/cancel`,
} as const;