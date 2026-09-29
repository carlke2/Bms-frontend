import { useEffect, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import DotLoader from '@/components/shared/DotLoader';

interface Props {
  open: boolean;
  bookingTitle: string;
  saving: boolean;
  onClose: () => void;
  onSubmit: (reason?: string) => void;
}

function RejectReasonModal({ open, bookingTitle, saving, onClose, onSubmit }: Props) {
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.45)' }}>
      <div className="w-full max-w-md rounded-2xl p-6 shadow-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold" style={{ color: 'var(--ink)' }}>Reject booking</h2>
          <button onClick={onClose} aria-label="Close" style={{ color: 'var(--muted)' }}>
            <XIcon size={18} />
          </button>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--muted)' }}>
          "{bookingTitle}". The requester will see your reason under My Bookings.
        </p>
        <textarea
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Optional reason, for example the room is reserved for a board meeting"
          className="w-full border rounded-xl px-4 py-3 text-sm font-semibold outline-none"
          style={{ background: 'var(--surface)', borderColor: 'var(--border)', color: 'var(--ink)' }}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded-xl text-sm font-bold" style={{ background: 'var(--surface-2)', color: 'var(--ink)' }}>
            Cancel
          </button>
          <button
            onClick={() => onSubmit(reason.trim() || undefined)}
            disabled={saving}
            className="px-4 py-2 rounded-xl text-sm font-bold text-white flex items-center gap-2 disabled:opacity-60"
            style={{ background: '#B91C1C' }}
          >
            {saving && <DotLoader size={14} />}
            Reject booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default RejectReasonModal;