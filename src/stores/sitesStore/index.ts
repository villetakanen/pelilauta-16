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
  const q = query(
    collection(db, SITES_COLLECTION_NAME),
    where('owners', 'array-contains', uid),
  );
  const snapshot = await getDocs(q);

  logDebug(`Fetched ${snapshot.size} sites for uid: ${uid}`);

  const sites: Site[] = [];
  for (const doc of snapshot.docs) {
    sites.push(parseSite(doc.data(), doc.id));
  }
  sites.sort((a, b) => b.flowTime - a.flowTime);
  $sites.set(sites);
}
