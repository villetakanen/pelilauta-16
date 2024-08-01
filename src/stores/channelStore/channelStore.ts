import { persistentAtom } from '@nanostores/persistent';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
} from '@schemas/ThreadSchema';
import { $topics } from '@stores/ThreadsApp/topics';
import { toClientEntry } from '@utils/client/entryUtils';
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
  if ($channelKey.get() === key) {
    // We'll check if we have the data in the cache, and if we do, we'll return it
    const requrestedCacheSize = CHANNEL_PAGE_SIZE * page;
    const maximumCacheSize =
      $topics.get().find((topic) => topic.slug === key)?.threadCount || 0;
    const expectedCacheSize = Math.min(requrestedCacheSize, maximumCacheSize);

    while ($channel.get().length < expectedCacheSize) {
      $channel.set([
        ...$channel.get(),
        ...(await fetchPageFromFirestore(
          key,
          $channel.get().slice(-1)[0].key || undefined,
        )),
      ]);
    }

    return $channel
      .get()
      .slice(CHANNEL_PAGE_SIZE * (page - 1), CHANNEL_PAGE_SIZE * page);
  }
}
async function fetchPageFromFirestore(
  channelKey: string,
  fromThreadKey?: string,
) {
  // if we do not have the fromThreadKey, we'll fetch the beginning of the channel
  if (!fromThreadKey) {
    const q = query(
      collection(db, THREADS_COLLECTION_NAME),
      orderBy('flowTime', 'desc'),
      where('topic', '==', channelKey),
      limit(CHANNEL_PAGE_SIZE),
    );
    const pageResults = await getDocs(q);

    const newThreads: Thread[] = [];
    for (const doc of pageResults.docs) {
      newThreads.push(ParseThread(doc.data(), doc.id));
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
    where('topic', '==', channelKey),
    startAfter(fromThreadKey),
    limit(CHANNEL_PAGE_SIZE),
  );

  const pageResults = await getDocs(q);

  const newThreads: Thread[] = [];
  for (const doc of pageResults.docs) {
    newThreads.push(ParseThread(doc.data(), doc.id));
  }

  return newThreads;
}
