import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { $replies } from 'src/stores/activeThreadStore/replies';
import { $account } from 'src/stores/sessionStore';

export const ThreadDiscussion: Component = () => {
  const replies = useStore($replies);
  const account = useStore($account);
  const uid = createMemo(() => account()?.uid);

  function fromCurrentUser(reply: Reply) {
    return reply.owners.includes(uid()) || undefined;
  }

  return (
    <div class="column-l">
      <h3>{t('threads:discussion.title')}</h3>
      <div class="flex flex-column downscaled">
        <For each={replies()} fallback={<p>No replies yet.</p>}>
          {(reply) => (
            <cn-bubble reply={fromCurrentUser(reply)}>
              <MarkdownSection content={`${reply.markdownContent}`} />
              <ProfileLink uid={reply.owners[0]} />
            </cn-bubble>
          )}
        </For>
      </div>
    </div>
  );
};
