import { persistentAtom } from '@nanostores/persistent';
import {
  NOTIFICATION_FIRESTORE_COLLECTION,
  type Notification,
  parseNotification,
} from '@schemas/NotificationSchema';
import { logWarn } from '@utils/logHelpers';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';

export const $notifications = persistentAtom<Notification[]>(
  'notifications',
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      return JSON.parse(data).map((entry: Record<string, unknown>) => {
        return parseNotification(entry, entry.key as string);
      });
    },
  },
);

export async function updateNotification(
  data: Partial<Notification>,
  key?: string,
) {
  const entryKey = key || data.key || '';
  if (!entryKey) {
    logWarn('No key provided for notification update, aborting');
    return;
  }
  updateDoc(doc(db, NOTIFICATION_FIRESTORE_COLLECTION, entryKey), data);
}
