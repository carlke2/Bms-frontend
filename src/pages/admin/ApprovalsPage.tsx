import { useMemo, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { CalendarClock, Check, Users, X as XIcon } from 'lucide-react';
import DotLoader from '@/components/shared/DotLoader';
import BookingStatusBadge from '@/components/bookings/BookingStatusBadge';
import RejectReasonModal from '@/components/bookings/RejectReasonModal';
import { useApproveBooking, useBookings, useRejectBooking } from '@/hooks/useBookings';
import { confirmDialog, notify } from '@/lib/alert';
import { errMsg } from '@/utils/apiError';
import type { Booking, BookingStatus } from '@/types/boardroom';

type Tab = BookingStatus | 'ALL';

const TABS: { key: Tab; label: string }[] = [
  { key: 'PENDING', label: 'Pending' },
  { key: 'APPROVED', label: 'Approved' },
  { key: 'REJECTED', label: 'Rejected' },
  { key: 'ALL', label: 'All' },
];

function ApprovalsPage() {
  const [tab, setTab] = useState<Tab>('PENDING');
  const [rejecting, setRejecting] = useState<Booking | null>(null);

  const { data: bookings = [], isLoading, isError } = useBookings(tab === 'ALL' ? {} : { status: tab });
  const approveBooking = useApproveBooking();
  const rejectBooking = useRejectBooking();

  const sorted = useMemo(
    () => [...bookings].sort((a, b) => (tab === 'PENDING' ? a.start.localeCompare(b.start) : b.start.localeCompare(a.start))),
    [bookings, tab],
  );

  const handleApprove = async (b: Booking) => {
    const confirmed = await confirmDialog({
      title: 'Approve booking',
      text: `Approve "${b.title}" for ${b.organizer}?`,
      confirmLabel: 'Approve',
    });
    if (!confirmed) return;
    approveBooking.mutate(b.id, {
      onSuccess: () => notify('success', 'Booking approved'),
      onError: (err) => notify('error', 'Could not approve booking', errMsg(err)),
    });
  };

  const handleReject = (reason?: string) => {
    if (!rejecting) return;
    rejectBooking.mutate(
      { id: rejecting.id, reason },
      {
        onSuccess: () => {
          notify('success', 'Booking rejected');
          setRejecting(null);
        },
        onError: (err) => notify('error', 'Could not reject booking', errMsg(err)),
      },
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold" style={{ color: 'var(--ink)' }}>Approvals</h1>
      <p className="text-sm mb-5" style={{ color: 'var(--muted)' }}>Review room requests from staff.</p>

      <div className="flex flex-wrap gap-2 mb-5">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="px-4 py-1.5 rounded-full text-sm font-bold"
            style={{
              background: tab === t.key ? '#1e40af' : 'var(--surface-2)',
              color: tab === t.key ? '#fff' : 'var(--ink)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {isLoading && <div className="flex justify-center py-16" style={{ color: 'var(--muted)' }}><DotLoader size={22} /></div>}
      {isError && <p className="text-sm font-semibold" style={{ color: '#B91C1C' }}>Could not load bookings.</p>}
      {!isLoading && !isError && sorted.length === 0 && (
        <p className="text-sm py-10 text-center" style={{ color: 'var(--muted)' }}>Nothing in this list.</p>
      )}

      <div className="space-y-3">
        {sorted.map((b) => (
          <div key={b.id} className="rounded-2xl p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="font-bold" style={{ color: 'var(--ink)' }}>{b.title}</h3>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  {b.room?.name ?? 'Room'} · requested by {b.organizer}
                </p>
              </div>
              <BookingStatusBadge status={b.status} />
            </div>

            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm" style={{ color: 'var(--muted)' }}>
              <span className="flex items-center gap-1.5">
                <CalendarClock size={14} />
                {format(parseISO(b.start), 'EEE d MMM yyyy, HH:mm')} to {format(parseISO(b.end), 'HH:mm')}
              </span>
              <span className="flex items-center gap-1.5"><Users size={14} /> {b.attendees} attendees</span>
            </div>

            {b.notes && <p className="mt-2 text-sm" style={{ color: 'var(--ink)' }}>{b.notes}</p>}
            {b.status === 'REJECTED' && b.rejectionReason && (
              <p className="mt-2 text-sm font-semibold" style={{ color: '#B91C1C' }}>Reason: {b.rejectionReason}</p>
            )}

            {b.status === 'PENDING' && (
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleApprove(b)}
                  disabled={approveBooking.isPending}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full disabled:opacity-60"
                  style={{ background: '#DCFCE7', color: '#166534' }}
                >
                  <Check size={13} /> Approve
                </button>
                <button
                  onClick={() => setRejecting(b)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                  style={{ background: '#FEE2E2', color: '#991B1B' }}
                >
                  <XIcon size={13} /> Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <RejectReasonModal
        open={rejecting !== null}
        bookingTitle={rejecting?.title ?? ''}
        saving={rejectBooking.isPending}
        onClose={() => setRejecting(null)}
        onSubmit={handleReject}
      />
    </div>
  );
}

export default ApprovalsPage;