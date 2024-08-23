import { persistentAtom } from '@nanostores/persistent';
import { logDebug } from '@utils/logHelpers';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import {
  SUBSCRIPTIONS_FIRESTORE_PATH,
  type Subscription,
  createSubscription,
  parseSubscription,
} from '../../schemas/SubscriberSchema';

export const $subscriber = persistentAtom<Subscription>(
  'subscriberStore',
  createSubscription(''),
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return parseSubscription(object, object.key);
    },
  },
);

let unsubscribe: () => void;

export async function initSubscriberStore(uid: string) {
  if (!uid) {
    unsubscribe();
    return;
  }
  logDebug('initSubscriberStore', 'loading subscriber');
  unsubscribe = onSnapshot(
    doc(db, `${SUBSCRIPTIONS_FIRESTORE_PATH}/${uid}`),
    (doc) => {
      if (doc.exists()) {
        logDebug('initSubscriberStore', 'subscriber loaded', doc.data());
        $subscriber.set(parseSubscription(doc.data(), doc.id));
      }
    },
  );
}

export function hasSeenEntry(entryKey: string, timestamp: number) {
  const subscriber = $subscriber.get();
  return subscriber.seenEntities[entryKey] >= timestamp;
}

export async function markEntrySeen(entryKey: string, timestamp: number) {
  const subscriber = $subscriber.get();
  subscriber.seenEntities[entryKey] = timestamp;
  await updateDoc(
    doc(db, `${SUBSCRIPTIONS_FIRESTORE_PATH}/${subscriber.key}`),
    {
      seenEntities: {
        ...subscriber.seenEntities,
      },
    },
  );
}
