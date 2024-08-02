import { persistentAtom } from '@nanostores/persistent';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
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
import { atom } from 'nanostores';
import { db } from 'src/firebase/client';

export const CHANNEL_PAGE_SIZE = 10;

export const $channel = persistentAtom<Thread[]>('active-channel', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return ParseThread(toClientEntry(entry), entry.key as string);
    });
  },
});

export const $channelKey = atom<string | null>(null);

export async function fetchPage(key: string, page = 1) {
  logDebug('fetchPage', key, page);
  if ($channelKey.get() === key) {
    logDebug('fetchPage', 'current channel key matches the requested key');
    // We'll check if we have the data in the cache, and if we do, we'll return it
    const requrestedCacheSize = CHANNEL_PAGE_SIZE * page;
    const maximumCacheSize =
      $topics.get().find((topic) => topic.slug === key)?.threadCount || 0;
    const expectedCacheSize = Math.min(requrestedCacheSize, maximumCacheSize);

    while ($channel.get().length < expectedCacheSize) {
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
      newThreads.push(ParseThread(toClientEntry(doc.data()), doc.id));
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
    newThreads.push(ParseThread(toClientEntry(doc.data()), doc.id));
  }

  return newThreads;
}
