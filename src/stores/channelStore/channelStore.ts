import { persistentAtom } from '@nanostores/persistent';
import {
  THREADS_COLLECTION_NAME,
  type Thread,
  parseThread,
} from '@schemas/ThreadSchema';
import { $topics } from '@stores/ThreadsApp/topics';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug, logWarn } from '@utils/logHelpers';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from 'firebase/firestore';
import { type Atom, atom } from 'nanostores';
import { db } from 'src/firebase/client';

export const CHANNEL_PAGE_SIZE = 10;

export const $channel = persistentAtom<Thread[]>('active-channel', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return parseThread(toClientEntry(entry), entry.key as string);
    });
  },
});

export const $channelKey = atom<string | null>(null);

/**
 * Fetches a page of threads from Firestore. By default, it fetches the first page of the channel.
 *
 * if the channels is already in the cache, it will return the cached data, and update the
 * cache with the new data
 *
 * @param channelKey the key of the channel to fetch
 * @param page (default 1), the page number to fetch
 * @returns an Atom<Array<Thread>> with the requested page of threads
 */
export function fetchPage(channelKey: string, page = 1): Atom<Thread[]> {
  logDebug('fetchPage', channelKey, page);

  // if there is no channel key, we'll return an empty array
  if (!channelKey) {
    logWarn('fetchPage', 'no channel key provided, returning empty array');
    return atom([]);
  }

  // If the channel has not changed, we'll need to reset the cache
  if ($channelKey.get() !== channelKey) {
    logDebug('fetchPage', 'channel key has changed, resetting cache');
    $channelKey.set(channelKey);
    $channel.set([]);
  }

  const threads = atom<Thread[]>([]);

  // We'll start backgroung fetching the data from Firestore
  if (page === 1) {
    fetchPageFromFirestore(channelKey).then((newThreads) => {
      $channel.set([...$channel.get(), ...newThreads]);
      threads.set($channel.get().slice(0, CHANNEL_PAGE_SIZE));
    });
  }
  // Else we'll need to fetch the requested page by fetching from firestore, untill we have the requested page
  else {
    for (let i = 0; i < page; i++) {
      fetchPageFromFirestore(
        channelKey,
        $channel.get().slice(-1)[0].key || undefined,
      ).then((newThreads) => {
        if (newThreads.length === 0) {
          logWarn(
            'fetchPage',
            'no more data to fetch from Firestore, this is likely a network issue',
          );
          return;
        }
        $channel.set([...$channel.get(), ...newThreads]);
      });
    }
  }

  // We'll return the requested page from the cache
  threads.set(
    $channel
      .get()
      .slice(CHANNEL_PAGE_SIZE * (page - 1), CHANNEL_PAGE_SIZE * page),
  );

  return threads;
}

/*
export async function fetchPage(key: string, page = 1) {
  logDebug('fetchPage', key, page);
  if ($channelKey.get() === key) {
    logDebug('fetchPage', 'current channel key matches the requested key');
    // We'll check if we have the data in the cache, and if we do, we'll return it
    const requrestedCacheSize = CHANNEL_PAGE_SIZE * page;
    const maximumCacheSize =
      $topics.get().find((topic) => topic.slug === key)?.threadCount || 0;
    const expectedCacheSize = Math.min(requrestedCacheSize, maximumCacheSize);
    
    for (let i = 0; i < expectedCacheSize / 10; i++) {
      logDebug(
      'fetchPage',
      'fetching more data from Firestore, cache size:',
      $channel.get().length,
      );
      const page = await fetchPageFromFirestore(
      key,
      $channel.get().slice(-1)[0].key || undefined,
      );

      if (page.length === 0) {
      logWarn(
        'fetchPage',
        'no more data to fetch from Firestore, this is likely a network issue',
      );
      break;
      }

      $channel.set([...$channel.get(), ...page]);
    }

    return $channel
      .get()
      .slice(CHANNEL_PAGE_SIZE * (page - 1), CHANNEL_PAGE_SIZE * page);
  }
  if (!key) return [];

  logDebug('fetchPage', 'fetching new channel data from Firestore to cache');
  $channelKey.set(key);

  const newThreads = await fetchPageFromFirestore(key);
  $channel.set(newThreads);

  logDebug(
    'fetchPage',
    'returning the first page of the new channel data, cache size:',
    newThreads.length,
  );
  return newThreads;
}*/

async function fetchPageFromFirestore(
  channelKey: string,
  fromThreadKey?: string,
) {
  logDebug('fetchPageFromFirestore', channelKey, fromThreadKey);

  // if we do not have the fromThreadKey, we'll fetch the beginning of the channel
  if (!fromThreadKey) {
    logDebug(
      'fetchPageFromFirestore',
      'fetching the beginning of the channel',
      channelKey,
    );
    const q = query(
      collection(db, THREADS_COLLECTION_NAME),
      orderBy('flowTime', 'desc'),
      where('channel', '==', channelKey),
      limit(CHANNEL_PAGE_SIZE),
    );
    const pageResults = await getDocs(q);

    const newThreads: Thread[] = [];
    for (const doc of pageResults.docs) {
      newThreads.push(parseThread(toClientEntry(doc.data()), doc.id));
    }

    return newThreads;
  }

  // We'll need to have the thread ref form the DB
  const startRef = await getDoc(
    doc(db, THREADS_COLLECTION_NAME, fromThreadKey),
  );
  if (!startRef.exists())
    throw new Error('Can not start from a non-existing thread, aborting');

  // We'll fetch the data from Firestore
  const q = query(
    collection(db, THREADS_COLLECTION_NAME),
    orderBy('flowTime', 'desc'),
    where('channel', '==', channelKey),
    startAfter(fromThreadKey),
    limit(CHANNEL_PAGE_SIZE),
  );

  const pageResults = await getDocs(q);

  const newThreads: Thread[] = [];
  for (const doc of pageResults.docs) {
    newThreads.push(parseThread(toClientEntry(doc.data()), doc.id));
  }

  return newThreads;
}
