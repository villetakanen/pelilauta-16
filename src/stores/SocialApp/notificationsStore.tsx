import { persistentAtom } from '@nanostores/persistent';
import {
  NOTIFICATION_FIRESTORE_COLLECTION,
  type Notification,
  ParseNotification,
} from '@schemas/NotificationSchema';
import { $account } from '@stores/sessionStore';
import { logDebug, logWarn } from '@utils/logHelpers';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { computed, onMount } from 'nanostores';
import { db } from 'src/firebase/client';

export const $notifications = persistentAtom<Notification[]>(
  'notifications',
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      return JSON.parse(data).map((entry: Record<string, unknown>) => {
        return ParseNotification(entry, entry.key as string);
      });
    },
  },
);

let unsubscribe = () => {};

onMount($notifications, () => {
  unsubscribe();

  const account = $account.get();
  if (!account?.uid) {
    logDebug('No account, not loading notifications');
    return;
  }

  subscribeToNotifications(account.uid).then(() => {
    logDebug('Subscribed to notifications');
  });
});

async function subscribeToNotifications(accountUid: string) {
  const q = query(
    collection(db, NOTIFICATION_FIRESTORE_COLLECTION),
    where('to', '==', accountUid),
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    logDebug('Notifications snapshot received', snapshot.docChanges().length);
    for (const change of snapshot.docChanges()) {
      if (change.type === 'removed') {
        // Remove the notification
        $notifications.set(
          $notifications.get().filter((n) => n.key !== change.doc.id),
        );
      } else {
        pathcNotification(change.doc.id, change.doc.data());
      }
    }
  });
}

function pathcNotification(key: string, data: Record<string, unknown>) {
  const notifications = $notifications.get();
  const index = notifications.findIndex((n) => n.key === key);
  if (index > -1) {
    notifications[index] = ParseNotification(data, key);
  } else {
    notifications.push(ParseNotification(data, key));
  }
  $notifications.set(notifications);
}
