import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { toDisplayString } from '@utils/contentHelpers';
import { type Component, For } from 'solid-js';

export const ForumPage: Component = () => {
  const channels = useStore($topics);

  // We want to list each distinct channel.category value once
  const categories = () => {
    const cats = channels().map((channel) => channel.category);
    return [...new Set(cats)];
  };

  const categoryChannels = (category: string) => {
    return channels().filter((channel) => channel.category === category);
  };

  return (
    <div class="content-columns">
      <div class="column-l">
        <For each={categories()}>
          {(category) => (
            <section class="elevation-1 border-radius p-2 mb-2">
              <h4>{category}</h4>
              <div class="forum-topics">
                <For each={categoryChannels(category as string)}>
                  {(topic) => (
                    <>
                      <div>
                        <cn-icon noun={topic.icon} />
                      </div>
                      <div class="grow">
                        <h4 class="downscaled mb-1">
                          <a href={`/channels/${topic.slug}/1`}>{topic.name}</a>
                        </h4>
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
                    </>
                  )}
                </For>
              </div>
            </section>
          )}
        </For>
      </div>
    </div>
  );
};
