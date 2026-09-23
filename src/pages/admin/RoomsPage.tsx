import { useMemo, useState } from 'react';
import { Plus, Search, Pencil, Trash2, Users, MapPin } from 'lucide-react';
import DotLoader from '@/components/shared/DotLoader';
import RoomFormModal from '@/components/rooms/RoomFormModal';
import { useCreateRoom, useDeleteRoom, useRooms, useUpdateRoom } from '@/hooks/useRooms';
import { confirmDialog, notify } from '@/lib/alert';
import type { Room, RoomInput } from '@/types/boardroom';

function errMsg(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? 'Please try again.';
}

function RoomsPage() {
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Room | null>(null);

  const { data: rooms = [], isLoading, isError } = useRooms();
  const createRoom = useCreateRoom();
  const updateRoom = useUpdateRoom();
  const deleteRoom = useDeleteRoom();

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rooms;
    return rooms.filter((r) => r.name.toLowerCase().includes(q) || (r.location ?? '').toLowerCase().includes(q));
  }, [rooms, search]);

  const saving = createRoom.isPending || updateRoom.isPending;

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (room: Room) => {
    setEditing(room);
    setModalOpen(true);
  };

  const handleSubmit = (input: RoomInput) => {
    if (editing) {
      updateRoom.mutate(
        { id: editing.id, fields: input },
        {
          onSuccess: () => {
            notify('success', 'Room updated');
            setModalOpen(false);
          },
          onError: (err) => notify('error', 'Could not update room', errMsg(err)),
        },
      );
    } else {
      createRoom.mutate(input, {
        onSuccess: () => {
          notify('success', 'Room added');
          setModalOpen(false);
        },
        onError: (err) => notify('error', 'Could not add room', errMsg(err)),
      });
    }
  };

  const toggleActive = (room: Room) => {
    updateRoom.mutate(
      { id: room.id, fields: { isActive: !room.isActive } },
      { onError: (err) => notify('error', 'Could not change availability', errMsg(err)) },
    );
  };

  const handleDelete = async (room: Room) => {
    const confirmed = await confirmDialog({
      title: 'Delete room',
      text: `Delete "${room.name}"? Existing bookings for this room may be affected.`,
      confirmLabel: 'Delete',
      danger: true,
    });
    if (!confirmed) return;
    deleteRoom.mutate(room.id, {
      onSuccess: () => notify('success', 'Room deleted'),
      onError: (err) => notify('error', 'Could not delete room', errMsg(err)),
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Rooms</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Manage boardrooms and meeting spaces.</p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: '#1e40af' }}
        >
          <Plus size={16} /> Add room
        </button>
      </div>

      <div className="relative mb-5 max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted)' }} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search rooms or locations"
          className="w-full border rounded-xl pl-9 pr-4 py-2.5 text-sm font-semibold outline-none"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
        />
      </div>

      {isLoading && (
        <div className="flex justify-center py-16" style={{ color: 'var(--muted)' }}>
          <DotLoader size={22} />
        </div>
      )}

      {isError && (
        <p className="text-sm font-semibold" style={{ color: '#B91C1C' }}>
          Could not load rooms. Check the API connection and try again.
        </p>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <p className="text-sm py-10 text-center" style={{ color: 'var(--muted)' }}>
          {rooms.length === 0 ? 'No rooms yet. Add the first one.' : 'No rooms match your search.'}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((room) => (
          <div
            key={room.id}
            className="rounded-2xl p-4"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', opacity: room.isActive ? 1 : 0.65 }}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold" style={{ color: 'var(--ink)' }}>{room.name}</h3>
              <div className="flex items-center gap-1">
                <button onClick={() => openEdit(room)} aria-label="Edit room" style={{ color: 'var(--muted)' }}>
                  <Pencil size={15} />
                </button>
                <button onClick={() => handleDelete(room)} aria-label="Delete room" style={{ color: '#B91C1C' }}>
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            <div className="mt-2 space-y-1 text-sm" style={{ color: 'var(--muted)' }}>
              <div className="flex items-center gap-2"><Users size={14} /> Up to {room.capacity} people</div>
              {room.location && <div className="flex items-center gap-2"><MapPin size={14} /> {room.location}</div>}
            </div>

            {room.amenities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {room.amenities.map((a) => (
                  <span key={a} className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>
                    {a}
                  </span>
                ))}
              </div>
            )}

            <button
              onClick={() => toggleActive(room)}
              className="mt-4 text-xs font-bold px-3 py-1 rounded-full"
              style={{
                background: room.isActive ? '#DCFCE7' : 'var(--surface-2)',
                color: room.isActive ? '#166534' : 'var(--muted)',
              }}
            >
              {room.isActive ? 'Available' : 'Unavailable'}
            </button>
          </div>
        ))}
      </div>

      <RoomFormModal open={modalOpen} room={editing} saving={saving} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} />
    </div>
  );
}

export default RoomsPage;