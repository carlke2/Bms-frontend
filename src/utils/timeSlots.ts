import { areIntervalsOverlapping, isValid, parseISO } from 'date-fns';
import type { Booking } from '@/types/boardroom';

// Back-to-back meetings (one ends exactly when the next starts) are allowed.
export function overlaps(aStart: string, aEnd: string, bStart: string, bEnd: string): boolean {
  const a = { start: parseISO(aStart), end: parseISO(aEnd) };
  const b = { start: parseISO(bStart), end: parseISO(bEnd) };
  if (![a.start, a.end, b.start, b.end].every(isValid)) return false;
  if (a.start >= a.end || b.start >= b.end) return false;
  return areIntervalsOverlapping(a, b);
}

// Only pending and approved bookings block a room.
export function findConflict(
  bookings: Booking[],
  roomId: string,
  start: string,
  end: string,
  ignoreId?: string,
): Booking | undefined {
  return bookings.find(
    (b) =>
      b.roomId === roomId &&
      b.id !== ignoreId &&
      (b.status === 'PENDING' || b.status === 'APPROVED') &&
      overlaps(start, end, b.start, b.end),
  );
}