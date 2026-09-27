import { useMemo, useState } from 'react';
import { format, isAfter, parseISO } from 'date-fns';
import { CalendarClock, Users } from 'lucide-react';
import DotLoader from '@/components/shared/DotLoader';
import { useBookings, useCancelBooking } from '@/hooks/useBookings';
import { confirmDialog, notify } from '@/lib/alert';
import { errMsg } from '@/utils/apiError';
import { BOOKING_STATUS_LABEL, BOOKING_STATUS_STYLE } from '@/utils/bookingStatus';
import type { Booking } from '@/types/boardroom';

type Filter = 'upcoming' | 'past' | 'all';

function MyBookingsPage() {
  const [filter, setFilter] = useState<Filter>('upcoming');
  const { data: bookings = [], isLoading, isError } = useBookings({ mine: true });
  const cancelBooking = useCancelBooking();

  const visible = useMemo(() => {
    const now = new Date();
    const list = bookings.filter((b) => {
      const ended = !isAfter(parseISO(b.end), now);
      if (filter === 'upcoming') return !ended;
      if (filter === 'past') return ended;
      return true;
    });
    return [...list].sort((a, b) => (filter === 'past' ? b.start.localeCompare(a.start) : a.start.localeCompare(b.start)));
  }, [bookings, filter]);

  const canCancel = (b: Booking) => (b.status === 'PENDING' || b.status === 'APPROVED') && isAfter(parseISO(b.end), new Date());

  const handleCancel = async (b: Booking) => {
    const confirmed = await confirmDialog({
      title: 'Cancel booking',
      text: `Cancel "${b.title}"? The room will be released for others.`,
      confirmLabel: 'Cancel booking',
      danger: true,
    });
    if (!confirmed) return;
    cancelBooking.mutate(b.id, {
      onSuccess: () => notify('success', 'Booking cancelled'),
      onError: (err) => notify('error', 'Could not cancel booking', errMsg(err)),
    });
  };

  const tabs: { key: Filter; label: string }[] = [
    { key: 'upcoming', label: 'Upcoming' },
    { key: 'past', label: 'Past' },
    { key: 'all', label: 'All' },
  ];

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>My bookings</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Your room requests and their status.</p>

      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className="px-4 py-1.5 rounded-full text-sm font-bold"
            style={{
              background: filter === t.key ? '#1e40af' : 'var(--surface-2)',
              color: filter === t.key ? '#fff' : 'var(--ink)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-16" style={{ color: 'var(--muted)' }}><DotLoader size={22} /></div>}
      {isError && <p className="text-sm font-semibold" style={{ color: '#B91C1C' }}>Could not load your bookings.</p>}
      {!isLoading && !isError && visible.length === 0 && (
        <p className="text-sm py-10 text-center" style={{ color: 'var(--muted)' }}>Nothing here yet.</p>
      )}

      <div className="space-y-3">
        {visible.map((b) => (
          <div key={b.id} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold" style={{ color: 'var(--ink)' }}>{b.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>{b.room?.name ?? 'Room'}</p>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${BOOKING_STATUS_STYLE[b.status]}`}>
                {BOOKING_STATUS_LABEL[b.status]}
              </span>
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center gap-1.5">
                <CalendarClock size={14} />
                {format(parseISO(b.start), 'EEE d MMM yyyy, HH:mm')} to {format(parseISO(b.end), 'HH:mm')}
              </span>
              <span className="flex items-center gap-1.5"><Users size={14} /> {b.attendees} attendees</span>
            </div>

            {b.status === 'REJECTED' && b.rejectionReason && (
              <p className="mt-2 text-sm font-semibold" style={{ color: '#B91C1C' }}>Reason: {b.rejectionReason}</p>
            )}

            {canCancel(b) && (
              <button
                onClick={() => handleCancel(b)}
                disabled={cancelBooking.isPending}
                className="mt-3 text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-60"
                style={{ background: '#FEE2E2', color: '#991B1B' }}
              >
                Cancel booking
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookingsPage;