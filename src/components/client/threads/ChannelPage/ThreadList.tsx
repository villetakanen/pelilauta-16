import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { type Component, createMemo } from 'solid-js';
import { PaginationToolbar } from './PaginationToolbar';

export const ThreadList: Component<{ channelKey: string; offSet?: number }> = (
  props,
) => {
  const topics = useStore($topics);

  const pageCount = createMemo(() => {
    const topic = topics().find((topic) => topic.slug === props.channelKey);
    return topic?.threadCount ? Math.ceil(topic.threadCount / 10) : 1;
  });

  return (
    <article class="column-l elevation-1 p-2">
      <PaginationToolbar
        channelKey={props.channelKey}
        offSet={props.offSet}
        pageCount={pageCount()}
      />
      ...
      <PaginationToolbar
        channelKey={props.channelKey}
        offSet={props.offSet}
        pageCount={pageCount()}
      />
    </article>
  );
};
