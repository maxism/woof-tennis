import type { BookingDetailed, UserPublic } from '@wooftennis/shared';

export function coachFromBooking(booking: BookingDetailed): UserPublic | undefined {
  const b = booking as BookingDetailed & { coach?: UserPublic };
  if (b.coach) return b.coach;
  const slot = booking.slot as { coach?: UserPublic } | undefined;
  return slot?.coach;
}
