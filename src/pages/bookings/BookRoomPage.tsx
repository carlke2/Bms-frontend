import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import DotLoader from '@/components/shared/DotLoader';
import { useBookings, useCreateBooking } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import { notify } from '@/lib/alert';
import { errMsg } from '@/utils/apiError';
import { findConflict } from '@/utils/timeSlots';

const inputCls = 'w-full border rounded-xl px-4 py-3 text-sm font-semibold outline-none transition-all';
const inputStyle = {
  background: 'var(--surface)',
  borderColor: 'var(--border)',
  color: 'var(--ink)',
};
const labelStyle = { color: 'var(--muted)' };

function BookRoomPage() {
  const navigate = useNavigate();
  const today = format(new Date(), 'yyyy-MM-dd');

  const [roomId, setRoomId] = useState('');
  const [date, setDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [title, setTitle] = useState('');
  const [attendees, setAttendees] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const { data: rooms = [], isLoading } = useRooms();
  const { data: bookings = [] } = useBookings(roomId ? { roomId } : {});
  const createBooking = useCreateBooking();

  const activeRooms = rooms.filter((r) => r.isActive);
  const room = rooms.find((r) => r.id === roomId);

  const slot = useMemo(() => {
    if (!date || !startTime || !endTime) return null;
    const s = new Date(`${date}T${startTime}`);
    const e = new Date(`${date}T${endTime}`);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;
    return { s, e, start: s.toISOString(), end: e.toISOString() };
  }, [date, startTime, endTime]);

  const conflict = slot && roomId && slot.s < slot.e ? findConflict(bookings, roomId, slot.start, slot.end) : undefined;

  const handleSubmit = () => {
    const count = Number(attendees);
    if (!roomId) return setError('Choose a room.');
    if (!title.trim()) return setError('Give the meeting a title.');
    if (!slot) return setError('Choose a date and valid times.');
    if (slot.s >= slot.e) return setError('The end time must be after the start time.');
    if (slot.s < new Date()) return setError('The meeting must start in the future.');
    if (!Number.isInteger(count) || count < 1) return setError('Enter the number of attendees.');
    if (room && count > room.capacity) return setError(`${room.name} holds up to ${room.capacity} people.`);
    if (conflict) return setError('That room is already booked for part of this time.');
    setError('');

    createBooking.mutate(
      { roomId, title: title.trim(), start: slot.start, end: slot.end, attendees: count, notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          notify('success', 'Booking requested', 'You will see its status under My Bookings.');
          navigate('/bookings/mine');
        },
        onError: (err) => notify('error', 'Could not create booking', errMsg(err)),
      },
    );
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Book a room</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Pick a room and a time. Some bookings need approval.</p>

      {isLoading ? (
        <div className="flex justify-center py-16" style={{ color: 'var(--muted)' }}><DotLoader size={22} /></div>
      ) : (
        <div className="space-y-4 rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Room</label>
            <select className={inputCls} style={inputStyle} value={roomId} onChange={(e) => setRoomId(e.target.value)}>
              <option value="">Select a room</option>
              {activeRooms.map((r) => (
                <option key={r.id} value={r.id}>{r.name} (up to {r.capacity})</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold mb-1" style={labelStyle}>Date</label>
              <input className={inputCls} style={inputStyle} type="date" min={today} value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={labelStyle}>Start</label>
              <input className={inputCls} style={inputStyle} type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-bold mb-1" style={labelStyle}>End</label>
              <input className={inputCls} style={inputStyle} type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
            </div>
          </div>

          {conflict && (
            <p className="text-sm font-semibold" style={{ color: '#B45309' }}>
              This room is already booked for "{conflict.title}" in that time.
            </p>
          )}

          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Meeting title</label>
            <input className={inputCls} style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Weekly planning" />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Attendees</label>
            <input className={inputCls} style={inputStyle} type="number" min={1} value={attendees} onChange={(e) => setAttendees(e.target.value)} placeholder="6" />
          </div>

          <div>
            <label className="block text-xs font-bold mb-1" style={labelStyle}>Notes (optional)</label>
            <textarea className={inputCls} style={inputStyle} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Projector needed, catering at 10:30" />
          </div>

          {error && <p className="text-sm font-semibold" style={{ color: '#B91C1C' }}>{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={createBooking.isPending}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 disabled:opacity-60"
              style={{ background: '#1e40af' }}
            >
              {createBooking.isPending && <DotLoader size={14} />}
              Request booking
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookRoomPage;