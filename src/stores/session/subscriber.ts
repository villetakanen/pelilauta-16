import { persistentAtom } from '@nanostores/persistent';
import { logError } from '@utils/logHelpers';
import { onMount } from 'nanostores';
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

onMount($subscriber, () => {
  const uid = $uid.get();
  if (uid) initSubscriberStore(uid);
});

export async function initSubscriberStore(uid: string) {
  if (!uid) {
    unsubscribe();
    return;
  }
  const { onSnapshot, doc } = await import('firebase/firestore');
  unsubscribe = onSnapshot(
    doc(db, `${SUBSCRIPTIONS_FIRESTORE_PATH}/${uid}`),
    (doc) => {
      if (doc.exists()) {
        $subscriber.set(parseSubscription(doc.data(), doc.id));
      } else {
        createSubscriptionEntry(uid);
      }
    },
  );
  //logDebug('subscriber', 'Firestore subscription of subscriber set up');
}

async function createSubscriptionEntry(uid: string) {
  if (!uid) {
    throw new Error('an uid is required to create a subscription');
  }
  const subscription = createSubscription(uid);
  const { getDoc, setDoc, doc } = await import('firebase/firestore');
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
  const uid = $uid.get();
  subscriber.seenEntities[entryKey] = timestamp;
  const { updateDoc, doc } = await import('firebase/firestore');
  try {
    await updateDoc(doc(db, `${SUBSCRIPTIONS_FIRESTORE_PATH}/${uid}`), {
      seenEntities: {
        ...subscriber.seenEntities,
      },
    });
  } catch (e: unknown) {
    logError(e);
  }
}
