import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { type Component, For } from 'solid-js';

export const ForumTray: Component = () => {
  const topics = useStore($topics);

  return (
    <nav>
      Count of topics: {topics().length}
      <For each={topics()}>{(topic) => <div>{topic.name}</div>}</For>
    </nav>
  );
};
