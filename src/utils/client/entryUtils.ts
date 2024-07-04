import type { Entry } from '@schemas/ContentEntry';
import { toDate } from '@utils/schemaHelpers';
import { Timestamp, serverTimestamp } from 'firebase/firestore';
import { object } from 'zod';

/**
 * Firestore handles dates as Timestamps, so we need to convert them from Date/number to Timestamp
 *
 * Sometimes, we want to do a silent conversion, where we don't want to update the
 * fields createdAt, updatedAt and flowTime - thus they are deleted from the object
 *
 * @param entry A partial entry or a an object that extends Entry
 * @param params { silent: boolean }, if silent is true, the fields createdAt, updatedAt and flowTime will be deleted
 * @returns A Record with the entry fields converted to a format suported by the Firestore
 */
export function toFirestoreEntry(
  entry: Partial<Entry>,
  params = { silent: false },
) {
  if (!params.silent)
    return {
      ...entry,
      createdAt: entry.createdAt
        ? new Timestamp(entry.createdAt.getTime() / 1000, 0)
        : serverTimestamp(),
      updatedAt: serverTimestamp(),
      flowTime: serverTimestamp(),
    };

  // We want to return the entry, and delete the fields createdAt, updatedAt and flowTime if they are present
  const { createdAt, updatedAt, flowTime, ...rest } = entry;

  return rest;
}

/**
 * Firestore handles dates as Timestamps, so we need to convert them from Timestamp to Date or number.
 *
 * Due to historical reasons, the owners field can be a string or an array of strings,
 * so we need to normalize it to always be an array of strings.
 */
export function toClientEntry(entry: Record<string, unknown>) {
  const flowTime = entry.flowTime
    ? toDate(entry.flowTime).getTime()
    : entry.updatedAt
      ? toDate(entry.updatedAt).getTime()
      : entry.createdAt
        ? toDate(entry.createdAt).getTime()
        : 0;

  const owners = entry.owners
    ? typeof entry.owners === 'string'
      ? [entry.owners]
      : entry.owners
    : [];

  return {
    ...entry,
    createdAt: toDate(entry.createdAt),
    updatedAt: toDate(entry.updatedAt),
    flowTime,
    owners,
  } as Entry;
}
