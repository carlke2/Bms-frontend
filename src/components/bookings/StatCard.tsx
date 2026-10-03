interface Props {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
}

function StatCard({ label, value, hint, accent = '#1e40af' }: Props) {
  return (
    <div
      className="rounded-2xl p-4"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderLeft: `4px solid ${accent}` }}
    >
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--muted)' }}>{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color: 'var(--ink)' }}>{value}</p>
      {hint && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>{hint}</p>}
    </div>
  );
}

export default StatCard;