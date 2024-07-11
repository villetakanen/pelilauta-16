import { useStore } from '@nanostores/solid';
import type { Component } from 'solid-js';
import { $recentThreads } from 'src/stores/recentThreadsStore';
import { hasSeenEntry } from 'src/stores/sessionStore';
import { ThreadCard } from './ThreadCard';

export const ThreadStream: Component = () => {
  const threads = useStore($recentThreads);

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
