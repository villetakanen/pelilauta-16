import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { type Component, For, createMemo } from 'solid-js';

export const ForumPage: Component = () => {
  const topics = useStore($topics);

  const categories = createMemo(() => {
    const cat = ['Pelilauta'];
    for (const topic of topics()) {
      if (Object.keys(topic).includes('category')) {
        cat.push(`${topic.category}`);
      }
    }
    return cat;
  });

  return (
    <div class="content-columns">
      <div class="column-l">
        <For each={categories()}>{(category) => <p>{category}</p>}</For>
      </div>
    </div>
  );
};
