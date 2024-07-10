import { ProfileLink } from '@client/shared/ProfileLink';
import type { Thread } from '@schemas/ThreadSchema';
import { toDisplayString } from '@utils/contentHelpers';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { ThreadLikeButton } from '../ThreadLikeButton';

export const ThreadArticle: Component<{ thread: Thread }> = (props) => {
  const thread = createMemo(() => props.thread);

  return (
    <article class="column-l">
      <h1 class="downscaled">{thread().title}</h1>
      <MarkdownSection content={`${thread().markdownContent}`} />
      <div class="toolbar">
        <p>
          <ProfileLink uid={thread().owners[0]} />
        </p>
        <p>{toDisplayString(thread().flowTime)}</p>
        <ThreadLikeButton thread={thread()} />
      </div>
    </article>
  );
};
