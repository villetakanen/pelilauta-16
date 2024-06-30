import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { logDebug } from '@utils/logHelpers';
import { doc, onSnapshot } from 'firebase/firestore';
import { atom } from 'nanostores';
import { db } from 'src/firebase/client';

export const $key = persistentAtom<string>('activeSiteKey', '');

export const loadingState = atom<'initial' | 'loading' | 'active'>('initial');

export const $site = persistentAtom<Site>(
  'activeSite',
  {
    key: '',
    flowTime: 0,
    name: '',
    owners: [],
    hidden: true,
  },
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      logDebug('activeSiteStore', 'decode', object);
      return parseSite(object, object.key);
    },
  },
);

let unsubscribe: () => void;

export async function load(key: string) {
  // Check if we are already subscribed to the site
  if (!key) return;
  if (loadingState.get() === 'loading') return;
  if ($key.get() === key) return;

  // Load the site from the server
  logDebug('activeSiteStore', 'load', key);

  // Unsubscribe from the current site
  if (unsubscribe) unsubscribe();

  $key.set(key);

  // Set the loading state
  loadingState.set('loading');

  // Subscribe to the site
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
