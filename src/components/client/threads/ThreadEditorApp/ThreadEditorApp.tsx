import { useStore } from '@nanostores/solid';
import { $topics } from '@stores/ThreadsApp/topics';
import { t } from '@utils/i18n';
import { type Component, For, createSignal } from 'solid-js';

export const ThreadEditorApp: Component<{ threadKey?: string }> = () => {
  const topics = useStore($topics);

  const [topic, setTopic] = createSignal<string>();

  return (
    <form class="content-editor">
      <div class="toolbar">
        <label class="flex-grow">
          {t('entries:thread.title')}
          <input
            type="text"
            placeholder={t('entries:thread.placeholders.title')}
          />
        </label>
        <label>
          {t('entries:thread.channel')}
          <select
            value={topic()}
            onChange={(e) => setTopic(e.currentTarget.value)}
          >
            <For each={topics()}>
              {(topic) => <option value={topic.slug}>{topic.name}</option>}
            </For>
          </select>
        </label>
        <button type="button">
          <cn-icon noun="add" />
        </button>
      </div>

      <textarea />

      <div class="debug">topic: ({topic()})</div>

      <div class="toolbar">
        <button type="reset" class="text">
          {t('actions:cancel')}
        </button>
        <button type="submit">
          <cn-icon noun="send" />
          <span>{t('actions:send')}</span>
        </button>
      </div>
    </form>
  );
};
