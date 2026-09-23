import { useEffect, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import DotLoader from '@/components/shared/DotLoader';
import type { Room, RoomInput } from '@/types/boardroom';

interface Props {
  open: boolean;
  room: Room | null;
  saving: boolean;
  onClose: () => void;
  onSubmit: (input: RoomInput) => void;
}

const inputCls = 'w-full border rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all';
const inputStyle = {
  background: 'var(--surface)',
  borderColor: 'var(--border)',
  color: 'var(--ink)',
};
const labelStyle = { color: 'var(--muted)' };

function RoomFormModal({ open, room, saving, onClose, onSubmit }: Props) {
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('');
  const [location, setLocation] = useState('');
  const [amenities, setAmenities] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(room?.name ?? '');
    setCapacity(room ? String(room.capacity) : '');
    setLocation(room?.location ?? '');
    setAmenities(room ? room.amenities.join(', ') : '');
    setIsActive(room?.isActive ?? true);
    setError('');
  }, [open, room]);

  if (!open) return null;

  const handleSubmit = () => {
    const cap = Number(capacity);
    if (!name.trim()) {
      setError('Room name is required.');
      return;
    }
    if (!Number.isInteger(cap) || cap < 1) {
      setError('Capacity must be a whole number of at least 1.');
      return;
    }
    setError('');
    onSubmit({
      name: name.trim(),
      capacity: cap,
      location: location.trim() || undefined,
      amenities: amenities.split(',').map((a) => a.trim()).filter(Boolean),
      isActive,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div
        className="w-full max-w-md rounded-2xl p-6 shadow-xl"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>
            {room ? 'Edit room' : 'Add room'}
          </h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--muted)' }}>
            <XIcon size={18} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Room name</label>
            <input className={inputCls} style={inputStyle} value={name} onChange={(e) => setName(e.target.value)} placeholder="Main Boardroom" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Capacity (people)</label>
            <input className={inputCls} style={inputStyle} type="number" min={1} value={capacity} onChange={(e) => setCapacity(e.target.value)} placeholder="12" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Location</label>
            <input className={inputCls} style={inputStyle} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="2nd floor, East wing" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Amenities (comma separated)</label>
            <input className={inputCls} style={inputStyle} value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="Projector, Whiteboard, Video call" />
          </div>
          <label className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--ink)' }}>
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            Room is available for booking
          </label>
        </div>

        {error && <p className="mt-3 text-sm font-semibold" style={{ color: '#B91C1C' }}>{error}</p>}

        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2 disabled:opacity-60"
            style={{ background: '#1e40af' }}
          >
            {saving && <DotLoader size={14} />}
            {room ? 'Save changes' : 'Add room'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomFormModal;