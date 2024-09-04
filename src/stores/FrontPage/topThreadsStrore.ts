import { persistentAtom } from '@nanostores/persistent';
import {
  THREADS_COLLECTION_NAME,
  type Thread,
  parseThread,
} from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';

export const $topThreads = persistentAtom<Thread[]>(
  'frontpage-top-threads',
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      return JSON.parse(data).map((entry: Record<string, unknown>) => {
        return parseThread(entry, entry.key as string);
      });
    },
  },
);

async function fetchTopThreads() {
  const q = query(
    collection(db, THREADS_COLLECTION_NAME),
    orderBy('flowTime', 'desc'),
    limit(11),
  );

  const threadDocs = await getDocs(q);

  const threads: Thread[] = [];

  for (const thread of threadDocs.docs) {
    threads.push(parseThread(toClientEntry(thread.data()), thread.id));
  }

  $topThreads.set(threads);
}

onMount($topThreads, () => {
  fetchTopThreads();
});
