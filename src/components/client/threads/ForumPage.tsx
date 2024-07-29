import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { toDisplayString } from '@utils/contentHelpers';
import { type Component, For, createMemo } from 'solid-js';

export const ForumPage: Component = () => {
  const topics = useStore($topics);

  const categories = createMemo(() => {
    const cat = new Array<string>();
    for (const topic of topics()) {
      if (
        Object.keys(topic).includes('category') &&
        !cat.includes(`${topic.category}`)
      ) {
        cat.push(`${topic.category}`);
      }
    }
    return cat;
  });

  return (
    <div class="content-columns">
      <div class="column-l">
        <For each={categories()}>
          {(category) => (
            <section class="elevation-1 border-radius p-2 mb-2">
              <h4>{category}</h4>
              <For
                each={topics().filter((topic) => topic.category === category)}
              >
                {(topic) => (
                  <div class="flex flex-row">
                    <cn-icon noun={topic.icon} />
                    <div class="flex-grow">
                      <h4 class="downscaled mb-1">{topic.name}</h4>
                      <p class="mt-0">{topic.description}</p>
                    </div>
                    <div class="downscaled">
                      <p class="m-0">
                        {topic.threadCount}&nbsp;
                        <cn-icon xsmall noun="discussion" />
                        <br />
                        {toDisplayString(topic.flowTime)}
                      </p>
                    </div>
                  </div>
                )}
              </For>
            </section>
          )}
        </For>
      </div>
    </div>
  );
};
