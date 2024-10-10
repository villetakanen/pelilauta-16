import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

export const ForumTray: Component = () => {
  const channels = useStore($topics);

  // We want to list each distinct channel.category value once
  const categories = () => {
    const cats = channels().map((channel) => channel.category as string);
    return [...new Set(cats)];
  };

  const categoryChannels = (category: string) => {
    return channels().filter((channel) => channel.category === category);
  };

  return (
    <nav>
      <h3>{t('threads:tray.title')}</h3>
      <For each={categories()}>
        {(category) => (
          <section>
            <h4>{category}</h4>
            <ul>
              <For each={categoryChannels(category)}>
                {(topic) => (
                  <li>
                    <a href={`/channels/${topic.slug}/1`} class="tray-button">
                      <cn-icon noun={topic.icon} xsmall />
                      <span>
                        {topic.name} ({topic.threadCount})
                      </span>
                    </a>
                  </li>
                )}
              </For>
            </ul>
          </section>
        )}
      </For>
    </nav>
  );
};
