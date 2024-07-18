/**
 * A nanostores persistent store for the recent threads list
 */

import { persistentAtom } from '@nanostores/persistent';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
} from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { atom, onMount } from 'nanostores';
import { db } from 'src/firebase/client';

const LOCAL_CACHE_SIZE = 11;
const REMOTE_SUBSCRIPTION_SIZE = 3;

const RECENT_THREADS_QUERY = query(
  collection(db, THREADS_COLLECTION_NAME),
  limit(REMOTE_SUBSCRIPTION_SIZE),
  orderBy('flowTime', 'desc'),
  where('public', '==', true),
);

const loadingState = atom<'initial' | 'loading' | 'active'>('initial');

export const $recentThreads = persistentAtom<Thread[]>('recent-threads', [], {
  encode: JSON.stringify,
  decode: (data) => {
    const threads = JSON.parse(data).map((entry: Record<string, unknown>) => {
      return ParseThread(toClientEntry(entry), entry.key as string);
    });
    return threads.slice(0, LOCAL_CACHE_SIZE);
  },
});

onMount($recentThreads, () => {
  subscribeToThreads();
});

let unsubscribe: (() => void) | null = null;

async function subscribeToThreads() {
  if (loadingState.get() !== 'initial') return;
  loadingState.set('loading');

  unsubscribe?.();
  unsubscribe = onSnapshot(RECENT_THREADS_QUERY, (snapshot) => {
    for (const thread of snapshot.docChanges()) {
      if (thread.type === 'removed') {
        removeThread(thread.doc.id);
      } else {
        patchThread(
          ParseThread(toClientEntry(thread.doc.data()), thread.doc.id),
        );
      }
    }
  });
  loadingState.set('active');
}

export function patchThread(thread: Thread) {
  logDebug(
    'patchThread',
    thread.key,
    $recentThreads.get().findIndex((t) => t.key === thread.key),
  );
  const threads = $recentThreads.get().filter((t) => t.key !== thread.key);
  threads.push(thread);
  threads.sort((a, b) => b.flowTime - a.flowTime);
  $recentThreads.set(threads.slice(0, LOCAL_CACHE_SIZE));
}

export function removeThread(key: string) {
  const threads = $recentThreads.get().filter((t) => t.key !== key);
  $recentThreads.set(threads);
}
