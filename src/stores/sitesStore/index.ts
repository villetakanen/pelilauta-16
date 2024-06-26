import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { logDebug } from '@utils/logHelpers';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';
import { $uid } from '../sessionStore';

// *** Store loading state *************************************************
type LoadingStateValue = 'initial' | 'loading' | 'active';
const $loadingState = persistentAtom<LoadingStateValue>(
  'sites-store',
  'initial',
);

export const $sites = persistentAtom<Site[]>(`${SITES_COLLECTION_NAME}`, [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return parseSite(entry, entry.key as string);
    });
  },
});

onMount($sites, () => {
  const uid = $uid.get();
  console.log(`Sites store mounted for uid: ${uid}`);

  fetchSites(uid);
});

async function fetchSites(uid: string) {
  if (!uid) return;
  if ($loadingState.get() !== 'initial') return;
  $sites.set([]);
  $loadingState.set('loading');
  const q = query(
    collection(db, SITES_COLLECTION_NAME),
    where('owners', 'array-contains', uid),
  );
  const snapshot = await getDocs(q);

  logDebug(`Fetched ${snapshot.size} sites for uid: ${uid}`);

  for (const doc of snapshot.docs) {
    patch(parseSite(doc.data(), doc.id));
  }

  await fetchPlayerSites(uid);

  $loadingState.set('active');
}

async function fetchPlayerSites(uid: string) {
  const q = query(
    collection(db, SITES_COLLECTION_NAME),
    where('players', 'array-contains', uid),
  );
  const snapshot = await getDocs(q);
  for (const doc of snapshot.docs) {
    patch(parseSite(doc.data(), doc.id));
  }
}
/**
 * Add a site to the store, if a site with the same key already exists, it will be replaced.
 *
 * @param site A Site object to add to the store
 */
function patch(site: Site) {
  const sites = [...$sites.get()];
  const index = sites.findIndex((s) => s.key === site.key);
  // if we have it, remove it from the array
  if (index !== -1) {
    sites.splice(index, 1);
  }
  sites.push(site);
  $sites.set(sites);
}
