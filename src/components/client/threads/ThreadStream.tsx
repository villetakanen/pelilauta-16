import { useStore } from '@nanostores/solid';
import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { type Component, createSignal, onMount } from 'solid-js';
import { db } from 'src/firebase/client';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
} from 'src/schemas/ThreadSchema';
import { hasSeenEntry } from 'src/stores/sessionStore';
import { ThreadCard } from './ThreadCard';

export const ThreadStream: Component = () => {
  const [threads, setThreads] = createSignal(new Array<Thread>());

  onMount(async () => {
    const q = query(
      collection(db, THREADS_COLLECTION_NAME),
      orderBy('flowTime', 'desc'),
      limit(3),
    );
    const querySnapshot = await getDocs(q);
    const threads = querySnapshot.docs.map((doc) =>
      ParseThread(doc.data(), doc.id),
    );
    setThreads(threads);
  });
  return (
    <div class="flex flex-column">
      {threads().map((thread) => (
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
