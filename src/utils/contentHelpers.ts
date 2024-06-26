export function toDisplayString(date: Date | number | undefined): string {
  if (!date) return 'N/A';
  return new Date(date).toISOString().substring(0, 10);
}
