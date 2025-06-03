import {
  PAGE_HISTORY_COLLECTION_NAME,
  type PageHistory,
  PageHistorySchema,
} from '@schemas/PageHistorySchema';
import type { Page } from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { logWarn } from '@utils/logHelpers';

export async function addPageRevision(current: Page, incoming: Partial<Page>) {
  const { db } = await import('@firebase/client');
  const { getDoc, doc, setDoc } = await import('firebase/firestore');

  const history: PageHistory = {
    key: current.key,
    history: [],
  };

  // Lets get the revisions doc from the db (if any)
  const historyDocRef = doc(
    db,
    SITES_COLLECTION_NAME,
    current.siteKey,
    PAGE_HISTORY_COLLECTION_NAME,
    current.key,
  );
  const historyDoc = await getDoc(historyDocRef);
  try {
    if (historyDoc.exists()) {
      // If the history doc exists, we update it with the new revision
      const historyData = PageHistorySchema.parse(historyDoc.data());
      history.history = historyData.history;
    }
  } catch (err: unknown) {
    logWarn(
      'Error parsing page history, continuing with an empty history data',
      err,
    );
  }

  // Merge legacy history data if it exists, and there were no revisions in the history doc
  // This enables us to ship this as a minor update without breaking existing app
  if (
    history.history.length === 0 &&
    current.revisionHistory &&
    Array.isArray(current.revisionHistory)
  ) {
    logWarn('Legacy page history detected, merging into new history format');
    for (const revision of current.revisionHistory) {
      history.history.push({
        ...revision,
        createdAt: revision.createdAt.getTime(),
      });
    }
  }

  history.history.push({
    createdAt: new Date().getTime(),
    author: incoming.owners?.[0] ?? 'unknown',
    markdownContent: current.markdownContent,
  });

  // Set the history doc with the new revision
  await setDoc(historyDocRef, history, { merge: true });
}
