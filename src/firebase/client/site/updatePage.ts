import { type Page, pageFrom } from '@schemas/PageSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import { updatePageRef } from './updatePageRef';
import { updatePageTags } from './updatePageTags';

export async function updatePage(
  siteKey: string,
  pageKey: string,
  changes: Partial<Page>,
) {
  const { getFirestore, doc, updateDoc, getDoc } = await import(
    'firebase/firestore'
  );
  const { toFirestoreEntry } = await import('@utils/client/toFirestoreEntry');
  const db = getFirestore();

  // First we need to update the page
  const pageRef = doc(db, 'sites', siteKey, 'pages', pageKey);
  await updateDoc(pageRef, toFirestoreEntry(changes));

  logDebug('Page updated', { siteKey, pageKey, changes });

  const pageDoc = await getDoc(pageRef);
  if (!pageDoc.exists()) throw new Error('updatePage: Page not found');

  // Then we need to update the page references
  const updatedPage = pageFrom(
    toClientEntry(pageDoc.data() as Record<string, unknown>),
    pageKey,
    siteKey,
  );

  await updatePageRef(updatedPage);

  logDebug('Page references updated', { siteKey, pageKey });

  await updatePageTags(updatedPage);

  logDebug('Page tags updated', { siteKey, pageKey });
}
