import api from '@/api/client';
import { BOARDROOM_PATHS as P } from '@/api/boardroomPaths';
import type { Booking, BookingFilters, BookingInput } from '@/types/boardroom';

export async function listBookings(filters: BookingFilters = {}): Promise<Booking[]> {
  const res = await api.get(P.bookings, { params: filters });
  return res.data.data as Booking[];
}

export async function getBooking(id: string): Promise<Booking> {
  const res = await api.get(P.booking(id));
  return res.data.data as Booking;
}

export async function createBooking(input: BookingInput): Promise<Booking> {
  const res = await api.post(P.bookings, input);
  return res.data.data as Booking;
}

export async function approveBooking(id: string): Promise<Booking> {
  const res = await api.post(P.approve(id));
  return res.data.data as Booking;
}

export async function rejectBooking(id: string, reason?: string): Promise<Booking> {
  const res = await api.post(P.reject(id), { reason });
  return res.data.data as Booking;
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await api.post(P.cancel(id));
  return res.data.data as Booking;
}