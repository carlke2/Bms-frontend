import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createRoom, deleteRoom, listRooms, updateRoom } from '@/api/rooms';
import type { RoomInput } from '@/types/boardroom';

export const roomKeys = { all: ['rooms'] as const };

export function useRooms() {
  return useQuery({ queryKey: roomKeys.all, queryFn: listRooms });
}

export function useCreateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: RoomInput) => createRoom(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
  });
}

export function useUpdateRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, fields }: { id: string; fields: Partial<RoomInput> }) => updateRoom(id, fields),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
  });
}

export function useDeleteRoom() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteRoom(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: roomKeys.all }),
  });
}