import { persistentAtom } from '@nanostores/persistent';
import {
  SUBSCRIPTIONS_FIRESTORE_PATH,
  type Subscription,
  SubscriptionSchema,
} from '@schemas/SubscriberSchema';
import { uid } from '@stores/session';
import { toDisplayString } from '@utils/contentHelpers';
import { logDebug, logError } from '@utils/logHelpers';
import { type WritableAtom, computed, onMount, onStop } from 'nanostores';

/**
 * A Store for managing user subscriptions, read-states and new-notifications.
 */
export const subscription: WritableAtom<Subscription | null> = persistentAtom(
  'subscription',
  null,
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      try {
        return SubscriptionSchema.parse(object);
      } catch (_error) {
        return null;
      }
    },
  },
);

export const hasSeen = computed(subscription, (subscription) => {
  logDebug('hasSeen computed');
  if (!subscription) {
    logDebug('hasSeen computed: no subscription');
    return () => false;
  }
  return (entityKey: string, flowTime: number) => {
    if (subscription.allSeenAt >= flowTime) {
      logDebug(
        'hasSeen computed: allSeenAt',
        toDisplayString(subscription.allSeenAt),
      );
      return false;
    }
    logDebug('hasSeen computed: seen', subscription.seenEntities[entityKey]);
    return (subscription.seenEntities[entityKey] ?? 0) >= flowTime;
  };
});

onMount(subscription, () => {
  if (uid.get() == null) {
    subscription.set(null);
    return;
  }
  // refresh subscription for the user from the DB
  refreshSubscription();
});

let fsUnsubscribe: (() => void) | null = null;

async function refreshSubscription() {
  if (fsUnsubscribe) {
    logError('refreshSubscription called while already subscribed');
    return;
  }
  const { getFirestore, onSnapshot, doc } = await import('firebase/firestore');
  const docRef = doc(getFirestore(), SUBSCRIPTIONS_FIRESTORE_PATH, uid.get());
  fsUnsubscribe = onSnapshot(docRef, (snapshot) => {
    if (snapshot.exists()) {
      subscription.set(SubscriptionSchema.parse(snapshot.data()));
    } else {
      subscription.set(null);
    }
  });
}

onStop(subscription, () => {
  fsUnsubscribe?.();
});

/**
 * Direct write to the seenEntities field of the subscription.
 *
 * We are subscribing to the Firestore document, so we'll get the
 * latest data from the server as its written.
 *
 * @param entityKey the entry key to mark as seen
 * @param flowTime the flow time of the entry
 */
export async function setSeen(entityKey: string, flowTime: number) {
  const { getFirestore, setDoc, doc } = await import('firebase/firestore');
  const docRef = doc(getFirestore(), SUBSCRIPTIONS_FIRESTORE_PATH, uid.get());
  const data = subscription.get();
  if (!data) {
    return;
  }
  data.seenEntities[entityKey] = flowTime;
  setDoc(docRef, data);
}
