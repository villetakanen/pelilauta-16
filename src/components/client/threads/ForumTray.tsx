import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

export const ForumTray: Component = () => {
  const topics = useStore($topics);

  return (
    <nav>
      <h3>{t('threads:tray.title')}</h3>
      <ul>
        <For each={topics()}>
          {(topic) => (
            <li>
              <a href={`/topics/${topic.slug}`} class="tray-button">
                <cn-icon noun={topic.icon} xsmall />
                <span>
                  {topic.name} ({topic.threadCount})
                </span>
              </a>
            </li>
          )}
        </For>
      </ul>
    </nav>
  );
};
