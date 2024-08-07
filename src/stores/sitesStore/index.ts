import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { logDebug, logError } from '@utils/logHelpers';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';
import { $uid } from '../sessionStore';

// *** Store loading state *************************************************
type LoadingStateValue = 'initial' | 'loading' | 'active';
export const $loadingState = persistentAtom<LoadingStateValue>(
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

export async function deleteSite(key: string) {
  const site = $sites.get().find((s) => s.key === key);
  if (!site) {
    logError(`Site with key ${key} not found`);
    return;
  }
  if (site.owners.includes($uid.get())) {
    logDebug(`Deleting site with key ${key}`);
    await deleteDoc(doc(db, SITES_COLLECTION_NAME, key));
    // remove the site from the store
    const sites = [...$sites.get()];
    const index = sites.findIndex((s) => s.key === key);
    if (index !== -1) {
      sites.splice(index, 1);
    }
    $sites.set(sites);
  }
}

export async function createSite(site: Partial<Site>): Promise<string> {
  const uid = $uid.get();
  if (!uid) {
    logError('createSite: uid is not set');
    throw new Error('Site creation aborted, user not logged in');
  }
  const fullSite = parseSite(site, site.key || '');
  logDebug('createSite', fullSite);

  const siteData = toFirestoreEntry(fullSite);

  let key = site.key || '';

  if (site.key) {
    logDebug('createSite', 'Creating site with custom key', siteData);
    await setDoc(doc(db, SITES_COLLECTION_NAME, site.key), siteData);
  } else {
    logDebug('createSite', 'Creating site with auto key', siteData);
    const { id } = await addDoc(
      collection(db, SITES_COLLECTION_NAME),
      siteData,
    );
    key = id;
  }

  const updatedSiteDoc = await getDoc(doc(db, SITES_COLLECTION_NAME, key));
  const updatedSite = parseSite(
    updatedSiteDoc.data() as Record<string, unknown>,
    updatedSiteDoc.id,
  );

  patch(updatedSite);

  return key;
}
