import { ProfileLink } from '@client/shared/ProfileLink';
import type { Thread } from '@schemas/ThreadSchema';
import { toDisplayString } from '@utils/contentHelpers';
import { type Component, For, createSignal, onMount } from 'solid-js';

import { fetchPage } from '@stores/channelStore/channelStore';

export const ThreadList: Component<{ channel: string; page: number }> = (
  props,
) => {
  const [threads, setThreads] = createSignal<Thread[]>([]);

  onMount(async () => {
    setThreads(await fetchPage(props.channel, props.page));
  });

  return (
    <For each={threads()}>
      {(thread) => (
        <div class="elevation-2 border-radius my-1 p-1">
          <p class="downscaled m-0">
            <strong>
              <a href={`/threads/${thread.key}`}>{thread.title}</a>
            </strong>
          </p>
          <p class="m-0 downscaled">
            <ProfileLink uid={thread.owners[0]} /> –
            {toDisplayString(thread.createdAt)}
          </p>
        </div>
      )}
    </For>
  );
};
