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

export const $channelKey = persistentAtom<string>('active-channel-key', '');

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
  if (!channelKey || page < 1) {
    logWarn(
      'fetchPage',
      'Invalid channel or page provided, returning empty array',
    );
    return atom([]);
  }

  const topic = $topics.get().find((t) => t.slug === channelKey);
  if (!topic) {
    logWarn('fetchPage', 'Invalid channel key provided, returning empty array');
    return atom([]);
  }
  if (page > topic.threadCount / CHANNEL_PAGE_SIZE) {
    logWarn('fetchPage', 'Invalid page number provided, returning empty array');
    return atom([]);
  }

  // If the channel has not changed, we'll need to reset the cache
  if ($channelKey.get() !== channelKey) {
    logDebug('fetchPage', 'channel key has changed, resetting cache');
    $channelKey.set(channelKey);
    $channel.set([]);
  } else {
    $channelKey.set(channelKey);
  }

  const threads = atom<Thread[]>([]);

  // We'll start backgroung fetching the data from Firestore
  if (page === 1) {
    fetchPageFromFirestore(channelKey).then((newThreads) => {
      // We'll merge the new threads with the current cache, and set
      // the reactive atom with the new data
      $channel.set(mergeThreads($channel.get(), newThreads));
      threads.set(newThreads);
    });
    logDebug(
      'fetchPage',
      'fetching the first page of the channel from Firestore, cache size is:',
      $channel.get().length,
    );
  }
  // Else we'll need to fetch the requested page by fetching from firestore, untill we have the requested page
  else {
    getChannelPage(channelKey, page).then((newThreads) => {
      threads.set(newThreads);
    });
  }

  const cachedPage =
    $channel.get().length > (page - 1) * CHANNEL_PAGE_SIZE
      ? $channel
          .get()
          .slice(CHANNEL_PAGE_SIZE * (page - 1), CHANNEL_PAGE_SIZE * page)
      : [];
  threads.set(cachedPage);

  return threads;
}

async function getChannelPage(channelKey: string, page: number) {
  // Lets see if we have the last thread of previous page
  // in the cache, if so, we'll start from there
  // If not, we'll fetch the previous page (assuming, its not the first page)
  const lastThread = $channel.get()[(page - 1) * CHANNEL_PAGE_SIZE - 1];
  const fromThreadKey = lastThread ? lastThread.key : undefined;

  if (page < 2) {
    logWarn(
      'getChannelPage',
      'Can not fetch the first page, please use fetchPage instead',
    );
    return [];
  }

  if (!fromThreadKey) {
    logDebug(
      'getChannelPage',
      'we do not have the previous thread, fetching the previous page',
    );
    if (page > 1) await getChannelPage(channelKey, page - 1);
    else
      throw new Error(
        'Can not fetch the a page without the previous page, please fetch the first page before calling this function',
      );
  }

  // Fetch the page from Firestore
  const newThreads = await fetchPageFromFirestore(channelKey, fromThreadKey);
  $channel.set(mergeThreads($channel.get(), newThreads));
  return newThreads;
}

function mergeThreads(currentThreads: Thread[], newThreads: Thread[]) {
  logDebug('mergeThreads', currentThreads.length, newThreads.length);

  const threadsMap = new Map<string, Thread>();
  for (const thread of currentThreads) {
    threadsMap.set(thread.key, thread);
  }
  for (const thread of newThreads) {
    threadsMap.set(thread.key, thread);
  }
  const merged = Array.from(threadsMap.values());
  merged.sort((a, b) => b.flowTime - a.flowTime);
  return merged;
}

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

  logDebug('fetching threads from the db, starting from:', fromThreadKey);

  // We'll fetch the data from Firestore
  const q = query(
    collection(db, THREADS_COLLECTION_NAME),
    orderBy('flowTime', 'desc'),
    where('channel', '==', channelKey),
    startAfter(startRef),
    limit(CHANNEL_PAGE_SIZE),
  );

  const pageResults = await getDocs(q);

  const newThreads: Thread[] = [];
  for (const doc of pageResults.docs) {
    newThreads.push(parseThread(toClientEntry(doc.data()), doc.id));
  }

  return newThreads;
}
