import { collection, getDocs, limit, orderBy, query } from 'firebase/firestore';
import { type Component, createSignal, onMount } from 'solid-js';
import { db } from 'src/firebase/client';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
} from 'src/schemas/ThreadSchema';
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
        <ThreadCard {...thread} key={thread.key} />
      ))}
    </div>
  );
};
