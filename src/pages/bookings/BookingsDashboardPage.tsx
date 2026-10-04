import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { addWeeks, endOfDay, endOfWeek, format, parseISO, startOfDay, startOfWeek } from 'date-fns';
import { Plus } from 'lucide-react';
import DotLoader from '@/components/shared/DotLoader';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';
import StatCard from '@/components/bookings/StatCard';
import WeekCalendar from '@/components/bookings/WeekCalendar';
import { useBookings } from '@/hooks/useBookings';
import { useRooms } from '@/hooks/useRooms';
import type { Booking } from '@/types/boardroom';

const isActive = (b: Booking) => b.status === 'PENDING' || b.status === 'APPROVED';

function BookingsDashboardPage() {
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));

  const weekRange = useMemo(
    () => ({ from: weekStart.toISOString(), to: endOfWeek(weekStart, { weekStartsOn: 1 }).toISOString() }),
    [weekStart],
  );
  const todayKey = format(new Date(), 'yyyy-MM-dd');
  const todayRange = useMemo(
    () => ({ from: startOfDay(new Date()).toISOString(), to: endOfDay(new Date()).toISOString() }),
    [todayKey],
  );

  const { data: rooms = [], isLoading: roomsLoading } = useRooms();
  const { data: weekBookings = [] } = useBookings(weekRange);
  const { data: todayBookings = [] } = useBookings(todayRange);
  const { data: pending = [] } = useBookings({ status: 'PENDING' });

  const now = new Date();
  const todayActive = todayBookings.filter(isActive).sort((a, b) => a.start.localeCompare(b.start));
  const activeRooms = rooms.filter((r) => r.isActive);
  const busyNow = new Set(
    todayActive.filter((b) => parseISO(b.start) <= now && now < parseISO(b.end)).map((b) => b.roomId),
  );
  const freeNow = activeRooms.filter((r) => !busyNow.has(r.id)).length;

  if (roomsLoading) {
    return <div className="flex justify-center py-20" style={{ color: 'var(--muted)' }}><DotLoader size={22} /></div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Dashboard</h1>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>{format(now, 'EEEE d MMMM yyyy')}</p>
        </div>
        <Link
          to="/bookings/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
          style={{ background: '#1e40af' }}
        >
          <Plus size={16} /> Add booking
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Bookings today" value={todayActive.length} />
        <StatCard label="Pending approvals" value={pending.length} accent="#B45309" hint={pending.length > 0 ? 'Review under Approvals' : undefined} />
        <StatCard label="Rooms free now" value={`${freeNow} / ${activeRooms.length}`} accent="#169A5B" />
        <StatCard label="Bookings this week" value={weekBookings.filter(isActive).length} accent="#7C3AED" />
      </div>

      <div className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <h2 className="font-bold mb-3" style={{ color: 'var(--ink)' }}>Today</h2>
        {todayActive.length === 0 ? (
          <p className="text-sm" style={{ color: 'var(--muted)' }}>No meetings scheduled for today.</p>
        ) : (
          <div className="space-y-2">
            {todayActive.map((b) => (
              <div key={b.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-2" style={{ background: 'var(--surface-2)' }}>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--ink)' }}>{b.title}</p>
                  <p className="text-xs" style={{ color: 'var(--muted)' }}>
                    {format(parseISO(b.start), 'HH:mm')} to {format(parseISO(b.end), 'HH:mm')} · {b.room?.name ?? rooms.find((r) => r.id === b.roomId)?.name ?? 'Room'}
                  </p>
                </div>
                <BookingStatusBadge status={b.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <WeekCalendar
        weekStart={weekStart}
        bookings={weekBookings}
        rooms={rooms}
        onPrev={() => setWeekStart((w) => addWeeks(w, -1))}
        onNext={() => setWeekStart((w) => addWeeks(w, 1))}
        onToday={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
      />
    </div>
  );
}

export default BookingsDashboardPage;