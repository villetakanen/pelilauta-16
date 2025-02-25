import { persistentAtom } from '@nanostores/persistent';
import {
  NOTIFICATION_FIRESTORE_COLLECTION,
  type Notification,
  parseNotification,
} from '@schemas/NotificationSchema';
import { uid } from '@stores/session';
import { logDebug } from '@utils/logHelpers';
import { computed, onMount, onStop } from 'nanostores';

export const notifications = persistentAtom<Notification[]>(
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

export const newCount = computed(notifications, (notifications) => {
  return notifications.filter((notification) => !notification.read).length;
});

let unsubscribe = () => {};

onMount(notifications, () => {
  const key = uid.get();
  // If we have no uid, we don't need to load notifications
  if (!key) return;

  // Start listening for notifications
  logDebug('Notifications mounted');
  subscribeToNotifications(key);
});

onStop(notifications, () => {
  unsubscribe();
  logDebug('Notifications stopped');
});

async function subscribeToNotifications(key: string) {
  unsubscribe();
  logDebug('Subscribing to notifications');

  const { getFirestore, onSnapshot, query, collection, where, orderBy, limit } =
    await import('firebase/firestore');

  const q = query(
    collection(getFirestore(), NOTIFICATION_FIRESTORE_COLLECTION),
    where('to', '==', key),
    orderBy('createdAt', 'desc'),
    limit(10),
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    logDebug('Notifications snapshot received', snapshot.docChanges().length);
    for (const change of snapshot.docChanges()) {
      if (change.type === 'removed') {
        popNotification(change.doc.id);
      }
      if (change.type === 'added' || change.type === 'modified') {
        patchNotification(change.doc.id, change.doc.data());
      }
    }
  });
}

function popNotification(key: string) {
  const current = notifications.get();
  notifications.set(current.filter((n) => n.key !== key));
}

function patchNotification(key: string, data: Record<string, unknown>) {
  const current = [...notifications.get()];
  const index = current.findIndex((n) => n.key === key);

  if (index === -1) {
    current.push(parseNotification(data, key));
  } else {
    current[index] = parseNotification(data, key);
  }

  notifications.set(current);
}
