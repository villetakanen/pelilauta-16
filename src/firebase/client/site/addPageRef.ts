import {
  type PageRef,
  SITES_COLLECTION_NAME,
  parseSite,
} from '@schemas/SiteSchema';
import { updateSite } from '@stores/SitesApp';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import { db } from '..';

export async function addPageRef(pageRef: PageRef, siteKey: string) {
  logDebug('addPageRef', pageRef, siteKey);
  // Get the siteDoc and Site from the firestore
  const { getDoc, doc } = await import('firebase/firestore');
  const siteDoc = await getDoc(doc(db, SITES_COLLECTION_NAME, siteKey));
  if (!siteDoc.exists()) throw new Error('addPageRef: Site not found');
  const site = parseSite(toClientEntry(siteDoc.data()), siteKey);

  // Clone the pageRefs array and add the new pageRef
  const refs: PageRef[] = site.pageRefs ? [...site.pageRefs] : [];

  // Check if this slug exists in the pageRefs, if it does, throw an error
  if (refs.find((ref) => ref.key === pageRef.key)) {
    throw new Error('addPageRef: PageRef already exists');
  }

  // Add the new pageRef to the refs
  refs.push(pageRef);

  // Update the site with the new pageRefs
  await updateSite({ pageRefs: refs }, siteKey);
}
