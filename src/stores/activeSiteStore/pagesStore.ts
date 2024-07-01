import { persistentAtom } from '@nanostores/persistent';
import {
  PAGES_COLLECTION_NAME,
  type Page,
  parsePage,
} from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { logDebug, logWarn } from '@utils/logHelpers';
import { collection, onSnapshot } from 'firebase/firestore';
import { atom, onSet } from 'nanostores';
import { db } from 'src/firebase/client';
import { $site } from '.';

export const $loadingState = atom<'initial' | 'loading' | 'active'>('initial');

export const $pages = persistentAtom<Page[]>('pages', [], {
  encode: (value) => JSON.stringify(value),
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return parsePage(entry, entry.key as string, entry.siteKey as string);
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
        const page = parsePage(change.doc.data(), change.doc.id, siteKey);
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