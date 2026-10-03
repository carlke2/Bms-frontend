import { addDays, format, isSameDay, parseISO } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BOOKING_STATUS_STYLE } from '@/utils/bookingStatus';
import type { Booking, Room } from '@/types/boardroom';

interface Props {
  weekStart: Date;
  bookings: Booking[];
  rooms: Room[];
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

function WeekCalendar({ weekStart, bookings, rooms, onPrev, onNext, onToday }: Props) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const visible = bookings.filter((b) => b.status === 'PENDING' || b.status === 'APPROVED');
  const roomName = (b: Booking) => b.room?.name ?? rooms.find((r) => r.id === b.roomId)?.name ?? 'Room';

  return (
    <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <h2 className="font-bold" style={{ color: 'var(--ink)' }}>
          {format(days[0], 'd MMM')} to {format(days[6], 'd MMM yyyy')}
        </h2>
        <div className="flex items-center gap-1">
          <button onClick={onPrev} aria-label="Previous week" className="p-1.5 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>
            <ChevronLeft size={16} />
          </button>
          <button onClick={onToday} className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>
            This week
          </button>
          <button onClick={onNext} aria-label="Next week" className="p-1.5 rounded-lg" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-2">
        {days.map((day) => {
          const items = visible
            .filter((b) => isSameDay(parseISO(b.start), day))
            .sort((a, b) => a.start.localeCompare(b.start));
          const isToday = isSameDay(day, new Date());
          return (
            <div
              key={day.toISOString()}
              className="rounded-xl p-2 min-h-[110px]"
              style={{
                background: 'var(--surface-2)',
                border: isToday ? '2px solid #1e40af' : '1px solid var(--border)',
              }}
            >
              <p className="text-xs font-bold mb-2" style={{ color: isToday ? '#1e40af' : 'var(--muted)' }}>
                {format(day, 'EEE d')}
              </p>
              <div className="space-y-1">
                {items.map((b) => (
                  <div key={b.id} className={`rounded-lg px-2 py-1 text-xs font-semibold ${BOOKING_STATUS_STYLE[b.status]}`}>
                    <div>{format(parseISO(b.start), 'HH:mm')} {b.title}</div>
                    <div className="opacity-75">{roomName(b)}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default WeekCalendar;