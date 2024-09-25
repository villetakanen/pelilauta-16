import { useStore } from '@nanostores/solid';
import { $topThreads } from '@stores/FrontPage/topThreadsStrore';
import { hasSeenEntry } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { ThreadCard } from '../ThreadsApp/ThreadCard';

export const ThreadStream: Component = () => {
  const topThreads = useStore($topThreads);

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
      <div class="flex justify-center border-top">
        <a href="/threads" class="button call-to-action">
          {t('actions:readMore')}
        </a>
      </div>
    </div>
  );
};
