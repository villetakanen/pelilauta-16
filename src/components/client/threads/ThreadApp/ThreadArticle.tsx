import type { Thread } from '@schemas/ThreadSchema';
import { markEntrySeen } from '@stores/sessionStore';
import { type Component, createMemo, onMount } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { ImagesSection } from './ImagesSection';
import { ReplySection } from './ReplySection';

export const ThreadArticle: Component<{ thread?: Thread }> = (props) => {
  const thread = createMemo(() => props.thread);

  onMount(() => {
    const key = thread()?.key;
    key && markEntrySeen(key, Date.now());
  });

  return (
    <article class="column-l">
      <h1 class="downscaled">{thread()?.title}</h1>
      {props.thread?.quoteRef && (
        <ReplySection thread={props.thread} quoteKey={props.thread.quoteRef} />
      )}
      <ImagesSection thread={thread()} />
      <MarkdownSection content={`${thread()?.markdownContent}`} />
    </article>
  );
};
