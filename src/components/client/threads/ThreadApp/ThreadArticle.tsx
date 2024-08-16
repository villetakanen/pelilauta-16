import type { Thread } from '@schemas/ThreadSchema';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { ImagesSection } from './ImagesSection';

export const ThreadArticle: Component<{ thread?: Thread }> = (props) => {
  const thread = createMemo(() => props.thread);

  return (
    <article class="column-l">
      <h1 class="downscaled">{thread()?.title}</h1>
      <ImagesSection thread={thread()} />
      <MarkdownSection content={`${thread()?.markdownContent}`} />
    </article>
  );
};
