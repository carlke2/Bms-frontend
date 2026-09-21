import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { approveBooking, cancelBooking, createBooking, listBookings, rejectBooking } from '@/api/bookings';
import type { BookingFilters, BookingInput } from '@/types/boardroom';

export const bookingKeys = {
  all: ['bookings'] as const,
  list: (filters: BookingFilters) => ['bookings', filters] as const,
};

export function useBookings(filters: BookingFilters = {}) {
  return useQuery({ queryKey: bookingKeys.list(filters), queryFn: () => listBookings(filters) });
}

function useRefreshBookings() {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: bookingKeys.all });
}

export function useCreateBooking() {
  const refresh = useRefreshBookings();
  return useMutation({ mutationFn: (input: BookingInput) => createBooking(input), onSuccess: refresh });
}

export function useApproveBooking() {
  const refresh = useRefreshBookings();
  return useMutation({ mutationFn: (id: string) => approveBooking(id), onSuccess: refresh });
}

export function useRejectBooking() {
  const refresh = useRefreshBookings();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => rejectBooking(id, reason),
    onSuccess: refresh,
  });
}

export function useCancelBooking() {
  const refresh = useRefreshBookings();
  return useMutation({ mutationFn: (id: string) => cancelBooking(id), onSuccess: refresh });
}