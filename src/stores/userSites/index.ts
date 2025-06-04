import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { toClientEntry } from '@utils/client/entryUtils';
import { type WritableAtom, onMount } from 'nanostores';

/**
 * A nanostore for caching the user's sites.
 */
export const userSites: WritableAtom<Site[]> = persistentAtom(
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

onMount(userSites, () => {
  const u = uid.get();
  if (!u) {
    userSites.set([]);
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
      where('owners', 'array-contains', uid.get()),
    ),
  );

  const sitesArray = siteDocs.docs.map((doc) => {
    return parseSite(toClientEntry(doc.data()), doc.id);
  });

  // get sites the user is an player of
  const playerSiteDocs = await getDocs(
    query(
      collection(getFirestore(), SITES_COLLECTION_NAME),
      where('players', 'array-contains', uid.get()),
    ),
  );

  for (const doc of playerSiteDocs.docs) {
    const site = parseSite(toClientEntry(doc.data()), doc.id);
    if (!sitesArray.find((s) => s.key === site.key)) {
      sitesArray.push(site);
    }
  }

  userSites.set(sitesArray);
}
