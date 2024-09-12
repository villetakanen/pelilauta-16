import { persistentAtom } from '@nanostores/persistent';
import { logDebug, logError } from '@utils/logHelpers';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import { $uid } from '.';
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
      } else {
        logDebug(
          'initSubscriberStore',
          'user has no subscription, creating it',
        );
        createSubscriptionEntry(uid);
      }
    },
  );
}

async function createSubscriptionEntry(uid: string) {
  if (!uid) {
    throw new Error('an uid is required to create a subscription');
  }
  const subscription = createSubscription(uid);
  const subscriberRef = doc(db, `${SUBSCRIPTIONS_FIRESTORE_PATH}/${uid}`);

  const subscriberDoc = await getDoc(subscriberRef);
  if (subscriberDoc.exists()) {
    throw new Error('subscriber doc already exists, aborting');
  }

  await setDoc(subscriberRef, subscription);
}

export function hasSeenEntry(entryKey: string, timestamp: number) {
  const uid = $uid.get();
  if (!uid) {
    return true;
  }

  const subscriber = $subscriber.get();
  return subscriber.seenEntities[entryKey] >= timestamp;
}

export async function markEntrySeen(entryKey: string, timestamp: number) {
  const subscriber = $subscriber.get();
  subscriber.seenEntities[entryKey] = timestamp;
  try {
    await updateDoc(
      doc(db, `${SUBSCRIPTIONS_FIRESTORE_PATH}/${subscriber.uid}`),
      {
        seenEntities: {
          ...subscriber.seenEntities,
        },
      },
    );
  } catch (e: unknown) {
    logError(e);
  }
}
