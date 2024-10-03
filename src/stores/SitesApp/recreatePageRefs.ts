import { PAGES_COLLECTION_NAME } from '@schemas/PageSchema';
import { type PageRef, SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { logDebug, logWarn } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/firebase/client';

/**
 * Recreates page references for a site. The site store is subscribed to site doc changes, so this will
 * trigger a site store update, when completed at the server.
 *
 * @param siteKey - The key of the site to recreate page references for.
 */
export async function recreatePageRefs(siteKey: string) {
  logWarn('Forcibly recreating page references for a site');

  const siteDoc = await getDoc(doc(db, SITES_COLLECTION_NAME, siteKey));

  if (!siteDoc.exists())
    throw new Error(
      `Site with a key ${siteKey} does not exist, aborting pageRefs recreation.`,
    );

  const refs = new Array<PageRef>();

  const pages = await getDocs(
    collection(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME),
  );

  for (const pageDoc of pages.docs) {
    const ref = {
      key: pageDoc.id,
      name: pageDoc.data().name,
      author: pageDoc.data().owners?.[0] || siteDoc.data().owners[0],
      category: pageDoc.data().category || '',
      flowTime: toDate(pageDoc.data().flowTime).getTime(),
    };
    refs.push(ref);
    logDebug(`Page reference for ${pageDoc.id} added to the list.`, ref);
  }

  if (!refs.length)
    throw new Error(
      'No pages found for the site, aborting pageRefs recreation.',
    );

  await updateDoc(doc(db, SITES_COLLECTION_NAME, siteKey), { pageRefs: refs });

  logWarn(
    `Page references for the site ${siteKey} have been recreated. We found ${refs.length + 1} pages.`,
  );
}
