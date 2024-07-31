import { persistentAtom } from '@nanostores/persistent';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
} from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logWarn } from '@utils/logHelpers';
import { doc, onSnapshot } from 'firebase/firestore';
import { type Atom, atom } from 'nanostores';
import { db } from 'src/firebase/client';

/**
 * This is a local storage cache for the latest threads, either by flowTime or by recently read by the user.
 */
export const $threads = persistentAtom<Thread[]>('threads-cache', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return ParseThread(toClientEntry(entry), entry.key as string);
    });
  },
});

const LOCAL_CACHE_SIZE = 42;

/**
 * Adds a thread to the cache, updating it if it already exists, or removing the
 * "oldest" (FIFO) thread if the cache is full.
 *
 * @param thread
 */
export function cacheThread(thread: Thread) {
  const threads = [...$threads.get()];

  // Check if the thread is already in the cache
  const index = threads.findIndex((t) => t.key === thread.key);

  // If the thread is already in the cache, update it, and break
  if (index > -1) {
    threads[index] = thread;
  } else {
    // If the cache is full, remove the oldest thread
    if (threads.length >= LOCAL_CACHE_SIZE) {
      threads.pop();
    }

    // Add the new thread to the cache
    threads.push(thread);
  }

  // Save the updated cache
  $threads.set(threads);
}

let unsubscribe = () => {};

/**
 * Subscribe to a thread, this will load the thread from the local store to a nanostore
 *
 * After loading the thread, it will subscribe to the thread in the Firestore DB
 */
export function subscribeThread(key: string): Atom<Thread | null> {
  // add the thread from the local store
  const thread = $threads.get().find((thread) => thread.key === key);

  const threadStore = atom<Thread | null>(thread ? thread : null);

  unsubscribe();

  // subscribe to the thread in Firestore, the updates are async!
  unsubscribe = onSnapshot(
    doc(db, THREADS_COLLECTION_NAME, key),
    (snapshot) => {
      if (snapshot.exists()) {
        const thread = ParseThread(toClientEntry(snapshot.data()), snapshot.id);
        cacheThread(thread);
        threadStore.set(thread);
      } else {
        logWarn(
          'subscribeThread',
          'Thread not found in Firestore, it has been deleted.',
        );
        threadStore.set(null);
        $threads.set($threads.get().filter((t) => t.key !== key));
      }
    },
  );
  return threadStore;
}
