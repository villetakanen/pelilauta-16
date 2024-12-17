import type { Page } from '@schemas/PageSchema';
import { toDate } from '@utils/schemaHelpers';
import { addPageRef } from './addPageRef';

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

  const pageData = pageDoc.data();

  // Then we need to update the page references
  await addPageRef(
    {
      key: pageKey,
      name: pageData.name,
      category: pageData.category || '-',
      flowTime: toDate(pageData.flowTime).getTime(),
      author: pageData.owners[0] || '-',
    },
    siteKey,
  );
}
