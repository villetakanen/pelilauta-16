import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import { type Component, For } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { $replies } from 'src/stores/activeThreadStore/replies';

export const ThreadDiscussion: Component = () => {
  const replies = useStore($replies);

  return (
    <div class="column-l">
      <For each={replies()} fallback={<p>No replies yet.</p>}>
        {(reply) => (
          <div>
            <MarkdownSection content={`${reply.markdownContent}`} />
            <ProfileLink uid={reply.owners[0]} />
          </div>
        )}
      </For>
    </div>
  );
};
