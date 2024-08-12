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
        <label>
          {t('entries:thread.title')}
          <input
            type="text"
            placeholder={t('entries:thread.placeholders.title')}
          />
        </label>
        <label>
          {t('entries:thread.title')}
          <select value={topic()}>
            <For each={topics()}>
              {(topic) => <option value={topic.slug}>{topic.name}</option>}
            </For>
          </select>
        </label>
      </div>

      <label>
        {t('entries:thread.content')}
        <textarea />
      </label>
      <div class="toolbar">
        <button type="reset">{t('actions:cancel')}</button>
        <button type="submit">{t('actions:send')}</button>
      </div>
    </form>
  );
};
