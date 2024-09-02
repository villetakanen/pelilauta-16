import { persistentAtom } from '@nanostores/persistent';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
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

export const $topSites = persistentAtom<Site[]>('frontpage-top-sites', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Partial<Site>) => {
      const site = parseSite(entry, entry.key as string);
      logDebug('Decoding top site', entry, site);

      return site;
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

  for (const siteDoc of siteEntries.docs) {
    const siteData = siteDoc.data();
    const site = parseSite(toClientEntry(siteData), siteDoc.id);
    sites.push(site);
  }

  $topSites.set(sites);
}
