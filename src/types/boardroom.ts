export type BookingStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  location?: string | null;
  amenities: string[];
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Booking {
  id: string;
  roomId: string;
  room?: Room;
  title: string;
  organizer: string;
  organizerId?: string;
  start: string;
  end: string;
  attendees: number;
  status: BookingStatus;
  notes?: string | null;
  rejectionReason?: string | null;
  createdAt?: string;
}

export interface RoomInput {
  name: string;
  capacity: number;
  location?: string;
  amenities?: string[];
  isActive?: boolean;
}

export interface BookingInput {
  roomId: string;
  title: string;
  start: string;
  end: string;
  attendees: number;
  notes?: string;
}

export interface BookingFilters {
  roomId?: string;
  status?: BookingStatus;
  from?: string;
  to?: string;
  mine?: boolean;
}