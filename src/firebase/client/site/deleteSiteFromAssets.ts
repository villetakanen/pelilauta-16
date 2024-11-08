import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logError } from '@utils/logHelpers';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { deleteObject, getStorage, ref } from 'firebase/storage';
import { db } from '..';

/**
 * Deletes a specific asset from Firebase Storage and updates the site's document in Firestore.
 *
 * @param site [Site] The site containing the asset.
 * @param storagePath [string] The storage path of the asset to delete.
 */
export async function deleteSiteAsset(site: Site, storagePath: string) {
  const storage = getStorage();
  const assetRef = ref(storage, storagePath); // Reference to the asset in Storage
  const siteRef = doc(db, SITES_COLLECTION_NAME, site.key);

  try {
    // 1. Delete asset from Storage
    await deleteObject(assetRef);

    // 2. Update Firestore document
    const siteDoc = await getDoc(siteRef);
    if (siteDoc.exists()) {
      // Find the asset in the site's assets array
      const remoteSite = parseSite(toClientEntry(siteDoc.data()), site.key);
      const assets = remoteSite.assets ?? [];
      const assetIndex = assets.findIndex(
        (asset) => asset.storagePath === storagePath,
      );

      if (assetIndex > -1) {
        // Remove the asset from the array
        assets.slice(assetIndex, 1);
        await updateDoc(siteRef, {
          assets: assets,
        });
      } else {
        console.warn('Asset not found in Firestore document');
      }
    }
  } catch (error) {
    logError('Error deleting site asset:', error);
    throw error;
  }
}
