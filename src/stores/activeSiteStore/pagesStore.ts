import { persistentAtom } from '@nanostores/persistent';
import {
  PAGES_COLLECTION_NAME,
  type Page,
  parsePage,
} from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { toClientEntry, toFirestoreEntry } from '@utils/client/entryUtils';
import { logDebug, logWarn } from '@utils/logHelpers';
import { collection, doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { atom, onSet } from 'nanostores';
import { db } from 'src/firebase/client';
import { $site } from '.';

export const $loadingState = atom<'initial' | 'loading' | 'active'>('initial');

export const $pages = persistentAtom<Page[]>('pages', [], {
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

onSet($site, (site) => {
  subscibeToPages(site.newValue.key);
});

let unsubscribePages: () => void;

async function subscibeToPages(siteKey: string) {
  if (!siteKey) {
    logWarn('subscibeToPages', 'siteKey is empty');
    return;
  }
  if ($loadingState.get() !== 'initial') {
    logWarn('subscibeToPages', 'trying to reinitialize pages store');
    return;
  }
  $loadingState.set('loading');

  logDebug('subscibeToPages', siteKey);
  unsubscribePages?.();
  $pages.set([]);

  const sitePagesRef = collection(
    db,
    SITES_COLLECTION_NAME,
    siteKey,
    PAGES_COLLECTION_NAME,
  );
  onSnapshot(sitePagesRef, (snapshot) => {
    for (const change of snapshot.docChanges()) {
      if (change.type === 'removed') removePage(change.doc.id);
      else {
        const page = parsePage(
          toClientEntry(change.doc.data()),
          change.doc.id,
          siteKey,
        );
        patchToPages(page);
      }
    }
  });
  $loadingState.set('active');
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
  logWarn('updatePage: experimental', `silent: ${options.silent}`);

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
}
