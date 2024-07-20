import type { Entry } from '@schemas/ContentEntry';
import { Timestamp, serverTimestamp } from 'firebase/firestore';

export interface Params {
  silent?: boolean;
}

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
  params: Params = { silent: false },
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
