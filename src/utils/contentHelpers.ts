export function toDisplayString(date: Date | undefined): string {
  if (!date) return 'N/A';
  return date.toLocaleString();
}
