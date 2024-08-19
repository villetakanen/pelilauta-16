import { useStore } from '@nanostores/solid';
import { subscribeToDiscussion } from '@stores/ThreadsApp/discussion';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';
import { ReplyBubble } from './ReplyBubble';

export const ThreadDiscussion: Component<{ threadKey: string }> = (props) => {
  const discussion = useStore(subscribeToDiscussion(props.threadKey));

  return (
    <div class="column-l">
      <h3>{t('threads:discussion.title')}</h3>
      <div class="flex flex-col downscaled">
        <For each={discussion()} fallback={<p>No replies yet.</p>}>
          {(reply) => <ReplyBubble reply={reply} />}
        </For>
      </div>
    </div>
  );
};
