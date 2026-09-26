// Pulls a readable message out of an axios-style error.
export function errMsg(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? 'Please try again.';
}