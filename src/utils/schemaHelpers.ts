import type { Timestamp } from 'firebase/firestore';

export function toDate(variable: unknown): Date {
  if (!variable) return new Date();
  if (variable instanceof Date) return variable;
  if (typeof variable === 'string') return new Date(variable);
  if (typeof variable === 'number') return new Date(variable);

  const virtual = variable as Timestamp;
  if (virtual.seconds) return new Date(virtual.seconds * 1000);

  return new Date();
}
