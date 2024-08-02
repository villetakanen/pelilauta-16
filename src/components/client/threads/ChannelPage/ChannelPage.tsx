import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { type Component, createMemo } from 'solid-js';
import { ThreadsArticle } from './ThreadsArticle';

export const ChannelPage: Component<{ channel: string; page?: number }> = (
  props,
) => {
  // Force lowercase channel name
  const channel = createMemo(() =>
    (props.channel || 'pelilauta').toLowerCase(),
  );
  const page = createMemo(() => props.page || 1);

  const topics = useStore($topics);

  const topic = createMemo(() => {
    return topics().find((topic) => topic.slug === channel());
  });

  return (
    <div class="content-columns">
      <ThreadsArticle channel={channel()} page={page()} />

      <article class="column-s debug">
        [ChannelPage]
        <br />
        Key: {channel()}
        <br />
        Page: {page()}
        <br />
        Topic: {topic()?.name}
        <br />
        Threads: {topic()?.threadCount}
        <br />
        Pages: {Math.ceil((topic()?.threadCount || 0) / 10)}
        <br />
      </article>
    </div>
  );
};
