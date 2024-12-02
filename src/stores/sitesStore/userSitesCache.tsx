import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { type Atom, type WritableAtom, onMount } from 'nanostores';

/**
 * A nanostore for caching the user's sites.
 */
export const $sitesCache: WritableAtom<Site[]> = persistentAtom(
  'user-site-cache',
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return object;
    },
  },
);

onMount($sitesCache, () => {
  const uid = $uid.get();
  if (!uid) {
    $sitesCache.set([]);
    return;
  }
  // refresh sites for the user from the DB
  refreshSites();
});

async function refreshSites() {
  const { getFirestore, getDocs, query, where, collection } = await import(
    'firebase/firestore'
  );
  const siteDocs = await getDocs(
    query(
      collection(getFirestore(), SITES_COLLECTION_NAME),
      where('owners', 'array-contains', $uid.get()),
    ),
  );

  const sitesArray = siteDocs.docs.map((doc) => {
    return parseSite(toClientEntry(doc.data()), doc.id);
  });

  $sitesCache.set(sitesArray);
}
