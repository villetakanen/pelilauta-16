import { persistentAtom } from '@nanostores/persistent';
import {
  PAGES_COLLECTION_NAME,
  type Page,
  parsePage,
} from '@schemas/PageSchema';
import {
  PageRefSchema,
  SITES_COLLECTION_NAME,
  parseSite,
} from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { logError, logWarn } from '@utils/logHelpers';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import { updateSite } from '.';

const $pages = persistentAtom<Page[]>('pages', [], {
  encode: (value) => JSON.stringify(value),
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return parsePage(
        toClientEntry(entry),
        entry.key as string,
        entry.siteKey as string,
      );
    });
  },
});

function patchToPages(page: Page) {
  const pages = [...$pages.get()];
  const index = pages.findIndex((p) => p.key === page.key);
  if (index === -1) {
    $pages.set([...pages, page]);
  } else {
    pages[index] = page;
    $pages.set(pages);
  }
}

export async function updatePage(
  siteKey: string,
  pageKey: string,
  updates: Partial<Page>,
  options = { silent: false },
) {
  logWarn('updatePage', `silent: ${options.silent}`);

  const fsUpdate = toFirestoreEntry(updates, { silent: options.silent });

  // Update the local store for immediate update on local store
  const page = $pages.get().find((page) => page.key === pageKey);
  if (page) {
    page.updatedAt = new Date();
    page.flowTime = new Date().getTime();
    page.markdownContent = updates.markdownContent || page.markdownContent;
    page.name = updates.name || page.name;
    patchToPages(page);
  }

  // Update the Firestore, this will trigger the onSnapshot listener
  await updateDoc(
    doc(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME, pageKey),
    fsUpdate,
  );

  if (!options.silent) {
    const pageDoc = await getDoc(
      doc(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME, pageKey),
    );
    if (pageDoc.exists()) {
      await updatePageRefs(
        parsePage(toClientEntry(pageDoc.data()), pageKey, siteKey),
      );
    }
  }
}

async function updatePageRefs(page: Page) {
  const siteDoc = await getDoc(doc(db, SITES_COLLECTION_NAME, page.siteKey));
  if (!siteDoc.exists()) {
    logError('updatePageRefs', 'site not found');
    return;
  }
  const site = parseSite(toClientEntry(siteDoc.data()), page.siteKey);
  const refs = site.pageRefs || [];
  // remove the page from the refs, if it exists
  const filteredRefs = refs.filter((ref) => ref.key !== page.key);
  // add the page to the refs
  filteredRefs.push(
    PageRefSchema.parse({
      ...page,
      author: page.owners[0] || site.owners[0] || '-',
    }),
  );
  await updateSite({ pageRefs: filteredRefs }, site.key);
}
