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
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { type Atom, atom } from 'nanostores';
// import { atom, onSet } from 'nanostores';
import { db } from 'src/firebase/client';
import { $site, updateSite } from '.';
// import { $site } from '.';

// export const $loadingState = atom<'initial' | 'loading' | 'active'>('initial');

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

let unsubscribePage: () => void;
const pageStore = atom<Page | null>(null);

/**
 * Subscribe to a page, this will load the page from the local store to a nanostore
 *
 * After loading the page, it will subscribe to the page in the Firestore
 */
export function subscribePage(key: string): Atom<Page | null> {
  if (pageStore.get()?.key === key) {
    return pageStore;
  }

  unsubscribePage?.();

  // add the page from the local store
  const page = $pages.get().find((page) => page.key === key);
  page ? pageStore.set({ ...page }) : pageStore.set(null);

  // subscribe to the page in Firestore, the updates are async!
  unsubscribePage = onSnapshot(
    doc(db, SITES_COLLECTION_NAME, $site.get().key, PAGES_COLLECTION_NAME, key),
    (snapshot) => {
      if (snapshot.exists()) {
        const page = parsePage(
          toClientEntry(snapshot.data()),
          snapshot.id,
          $site.get().key,
        );
        patchToPages(page);
        pageStore.set(page);
      } else {
        removePage(key);
        pageStore.set(null);
      }
    },
  );

  return pageStore;
}

function removePage(key: string) {
  const pages = $pages.get().filter((page) => page.key !== key);
  $pages.set([...pages]);
}

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

export async function addPage(
  siteKey: string,
  page: Partial<Page>,
  slug?: string,
) {
  const fsPage = toFirestoreEntry(page, { silent: true });

  let key = slug || '';
  if (slug) {
    const existingPage = $pages.get().find((p) => p.key === slug);

    if (existingPage) {
      logError('createPage', 'slug already exists');
      throw new Error(`Page slug ${slug} already exists`);
    }

    await setDoc(
      doc(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME, slug),
      fsPage,
    );
  } else {
    const newPageRef = await addDoc(
      collection(db, SITES_COLLECTION_NAME, siteKey, PAGES_COLLECTION_NAME),
      fsPage,
    );
    key = newPageRef.id;
  }

  fsPage.key = key;
  const newPage = parsePage(toClientEntry(fsPage), key, siteKey);
  patchToPages(newPage);
  await updatePageRefs(newPage);

  return key;
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
