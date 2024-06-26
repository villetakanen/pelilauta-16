export function toDisplayString(date: Date | number | undefined): string {
  if (!date) return 'N/A';
  if (typeof date === 'number')
    return new Date(date).toISOString().substring(0, 10);
  return date.toISOString().substring(0, 10);
}
