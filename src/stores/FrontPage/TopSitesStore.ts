import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';

export const $topSites = persistentAtom<Site[]>('topSites', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return parseSite(entry, entry.key as string);
    });
  },
});

onMount($topSites, () => {
  fetchTopSites();
});

async function fetchTopSites() {
  const q = query(
    collection(db, SITES_COLLECTION_NAME),
    where('hidden', '==', false),
    orderBy('flowTime', 'desc'),
    limit(3),
  );

  const siteEntries = await getDocs(q);

  const sites: Site[] = [];

  for (const site of siteEntries.docs) {
    sites.push(parseSite(toClientEntry(site.data()), site.id));
  }

  $topSites.set(sites);
}
