import { PAGES_COLLECTION_NAME, type Page } from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { toDate } from '@utils/schemaHelpers';
import { db } from '..';
import { addPageRef } from './addPageRef';

async function setPageToFirestore(
  siteKey: string,
  page: Partial<Page>,
  key: string,
) {
  const { setDoc, doc } = await import('firebase/firestore');
  const fsPage = toFirestoreEntry(page);
  await setDoc(
    doc(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME, key),
    fsPage,
  );
}

export async function setPage(
  siteKey: string,
  page: Partial<Page>,
  key: string,
) {
  const { getDoc, doc } = await import('firebase/firestore');
  await setPageToFirestore(siteKey, page, key);

  const pageDoc = await getDoc(
    doc(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME, key),
  );
  const { name, flowTime, category, owners } = pageDoc.data() as Page;

  await addPageRef(
    {
      key,
      name,
      flowTime: toDate(flowTime).getTime(),
      category: category || '-',
      author: owners[0] || '-',
    },
    siteKey,
  );
  return key;
}
