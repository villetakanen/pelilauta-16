import { type Page, parsePage } from '@schemas/PageSchema';
import { toClientEntry } from '@utils/client/entryUtils';
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

  const pageDoc = await getDoc(pageRef);
  if (!pageDoc.exists()) throw new Error('updatePage: Page not found');

  // Then we need to update the page references
  const updatedPage = parsePage(
    toClientEntry(pageDoc.data() as Record<string, unknown>),
    pageKey,
  );

  await updatePageRef(updatedPage);
  await updatePageTags(updatedPage);
}
