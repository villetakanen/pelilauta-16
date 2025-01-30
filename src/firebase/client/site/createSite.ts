import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/session';

/**
 * Creates a new site in the database, returns the key of the new site
 *
 * @param site: Partial<Site> - the site to create
 * @returns string - the key of the new site
 */
export async function createSite(site: Partial<Site>): Promise<string> {
  const { getFirestore, doc, getDoc, setDoc, addDoc, collection } =
    await import('firebase/firestore');
  const { toFirestoreEntry } = await import('@utils/client/toFirestoreEntry');

  // Get the current user's uid
  const uid = $uid.get();
  if (!uid) {
    throw new Error('Site creation aborted, session uid not set');
  }

  // Create a new site object based on the params
  const parsedSite = parseSite(site);
  const siteData = toFirestoreEntry(parsedSite);

  // Add the current user's uid to the site's owners
  siteData.owners = [uid];

  // If the site has a key, try to create the site with that given key
  if (site.key) {
    const siteRef = doc(getFirestore(), SITES_COLLECTION_NAME, site.key);
    const siteDoc = await getDoc(siteRef);
    if (siteDoc.exists()) {
      throw new Error(`Site with key ${site.key} already exists`);
    }
    await setDoc(siteRef, siteData);
    return site.key;
  }
  //logDebug('createSite', 'Creating site with automatic key', siteData);
  const { id } = await addDoc(
    collection(getFirestore(), SITES_COLLECTION_NAME),
    siteData,
  );
  return id;
}
