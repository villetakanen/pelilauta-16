//import type { Timestamp } from 'firebase/firestore';
import { logWarn } from './logHelpers';

type Timestamp = {
  seconds: number;
  nanoseconds: number;
};

export function toDate(variable: unknown): Date {
  if (!variable) return new Date();
  if (variable instanceof Date) return variable;
  if (typeof variable === 'string') return new Date(variable);
  if (typeof variable === 'number') return new Date(variable);

  const virtual = variable as Timestamp;
  if (virtual.seconds) return new Date(virtual.seconds * 1000);

  return new Date();
}

export function topicToNoun(topic: string | undefined): string {
  logWarn(
    'topicToNoun is a development time helper, it should be replaced with a meta-store mapping in production',
  );

  switch (topic) {
    case 'Roolipelit':
      return 'd20';
    case 'Yleinen':
      return 'discussion';
    case 'Videot':
      return 'youtube';
    default:
      return 'fox';
  }
}
