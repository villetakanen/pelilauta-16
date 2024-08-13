import { useStore } from '@nanostores/solid';
import { THREADS_COLLECTION_NAME, parseThread } from '@schemas/ThreadSchema';
import { $threads, cacheThread } from '@stores/ThreadsApp';
import { hasSeenEntry } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import { type Component, createMemo, onCleanup, onMount } from 'solid-js';
import { db } from 'src/firebase/client';
import { ThreadCard } from '../threads/ThreadCard';

export const ThreadStream: Component = () => {
  const threadCache = useStore($threads);

  const topThreads = createMemo(() => {
    const sorted = [...threadCache()].sort((a, b) => {
      return b.flowTime - a.flowTime;
    });
    return sorted.slice(0, 11);
  });

  let unsubscribe = () => {};

  onMount(() => {
    // Subscribe to the thread stream from the firestore db. Add updates to the threadCache
    unsubscribe = onSnapshot(
      query(
        collection(db, THREADS_COLLECTION_NAME),
        orderBy('flowTime', 'desc'),
        limit(4),
      ),
      (snapshot) => {
        for (const threadChange of snapshot.docChanges()) {
          if (threadChange.type !== 'removed') {
            logDebug(
              'ThreadStream',
              'Received thread update',
              threadChange.doc.data(),
            );
            cacheThread(
              parseThread(
                toClientEntry(threadChange.doc.data()),
                threadChange.doc.id,
              ),
            );
          }
        }
      },
    );
  });

  onCleanup(() => {
    unsubscribe();
  });

  return (
    <div class="flex flex-col">
      {topThreads().map((thread) => (
        <ThreadCard
          elevation={!hasSeenEntry(thread.key, thread.flowTime) ? 2 : 1}
          thread={thread}
          key={thread.key}
          notify={!hasSeenEntry(thread.key, thread.flowTime)}
        />
      ))}
    </div>
  );
};
