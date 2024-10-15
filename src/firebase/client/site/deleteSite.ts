import { SITES_COLLECTION_NAME, type Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from '..';

export async function deleteSite(site: Site) {
  // Get the current user's uid
  const uid = $uid.get();
  if (!uid) {
    throw new Error('Site deletion aborted, session uid not set');
  }

  // Sanity check, the database will throw an error
  // if the uid is not in the owners list at the DB side
  if (!site.owners.includes(uid)) {
    throw new Error('Site deletion aborted, user is not an owner');
  }

  // Delete the site from the database
  await deleteDoc(doc(db, SITES_COLLECTION_NAME, site.key));
}
