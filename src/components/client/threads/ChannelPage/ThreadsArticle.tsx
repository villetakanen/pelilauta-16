import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { type Component, createMemo } from 'solid-js';
import { PaginationToolbar } from './PaginationToolbar';
import { ThreadList } from './ThreadList';

export const ThreadsArticle: Component<{ channel: string; page: number }> = (
  props,
) => {
  const topics = useStore($topics);

  const topic = createMemo(() => {
    return (
      topics().find((topic) => topic.slug === props.channel) || {
        threadCount: 0,
        name: '-',
      }
    );
  });

  const pageCount = createMemo(() => {
    return Math.ceil(topic()?.threadCount / 10);
  });

  return (
    <article class="column-l elevation-1 p-2">
      <h3 class="downscaled">{topic()?.name}</h3>

      <PaginationToolbar
        channel={props.channel}
        page={props.page}
        pageCount={pageCount()}
      />

      <ThreadList channel={props.channel} page={props.page} />

      <PaginationToolbar
        channel={props.channel}
        page={props.page}
        pageCount={pageCount()}
      />
    </article>
  );
};
