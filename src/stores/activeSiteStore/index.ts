import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  emptySite,
  parseSite,
} from '@schemas/SiteSchema';
import { logDebug, logWarn } from '@utils/logHelpers';
import {
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/firebase/client';

export const $key = persistentAtom<string>('activeSiteKey', '');
export const loadingState = persistentAtom<'initial' | 'loading' | 'active'>(
  'initial',
);
export const $site = persistentAtom<Site>(
  'activeSite',
  {
    ...emptySite,
  },
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return parseSite(object, object.key);
    },
  },
);

let unsubscribe: CallableFunction | null = null;

export async function load(key: string) {
  // Check if we are already subscribed to the site
  if (!key) {
    logWarn('activeSiteStore', 'load', 'no key');
  }

  if (unsubscribe && $key.get() === key) {
    logDebug('activeSiteStore', 'load', key, 'already subscribed');
    return;
  }

  // Load the site from the server
  logDebug('activeSiteStore', { state: 'loading ', key: $key.get() });

  // Set the loading state
  loadingState.set('loading');

  // Unsubscribe from the previous site, this should always fire, so
  // we don't have multiple subscriptions running at the same time
  unsubscribe?.();

  // Initialize the store
  $key.set(key);
  $site.set(parseSite(emptySite, key));

  // Subscribe to the site, updates happen automatically through the subscription
  unsubscribe = await subscribeToSite(key);

  // Set the loading state
  loadingState.set('active');

  logDebug('activeSiteStore', 'load', key, 'done');
}

async function subscribeToSite(key: string) {
  // Subscribe to the site
  return onSnapshot(doc(db, SITES_COLLECTION_NAME, key), (snapshot) => {
    if (snapshot.exists()) {
      logDebug('activeSiteStore', 'subscribeToSite', snapshot.data());
      $site.set(parseSite(snapshot.data(), snapshot.id));
    }
  });
}

export async function updateSite(site: Partial<Site>) {
  const update = {
    ...site,
    updatedAt: serverTimestamp(),
  };
  await updateDoc(doc(db, SITES_COLLECTION_NAME, $key.get()), update);
}
