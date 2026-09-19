import api from '@/api/client';
import { BOARDROOM_PATHS as P } from '@/api/boardroomPaths';
import type { Room, RoomInput } from '@/types/boardroom';

export async function listRooms(): Promise<Room[]> {
  const res = await api.get(P.rooms);
  return res.data.data as Room[];
}

export async function getRoom(id: string): Promise<Room> {
  const res = await api.get(P.room(id));
  return res.data.data as Room;
}

export async function createRoom(input: RoomInput): Promise<Room> {
  const res = await api.post(P.rooms, input);
  return res.data.data as Room;
}

export async function updateRoom(id: string, fields: Partial<RoomInput>): Promise<Room> {
  const res = await api.put(P.room(id), fields);
  return res.data.data as Room;
}

export async function deleteRoom(id: string): Promise<void> {
  await api.delete(P.room(id));
}