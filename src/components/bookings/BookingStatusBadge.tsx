import { BOOKING_STATUS_LABEL, BOOKING_STATUS_STYLE } from '@/utils/bookingStatus';
import type { BookingStatus } from '@/types/boardroom';

function BookingStatusBadge({ status }: { status: BookingStatus }) {
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${BOOKING_STATUS_STYLE[status]}`}>
      {BOOKING_STATUS_LABEL[status]}
    </span>
  );
}

export default BookingStatusBadge;