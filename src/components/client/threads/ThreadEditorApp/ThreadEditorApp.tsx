import { WithLoader } from '@client/shared/WithLoader';
import { useStore } from '@nanostores/solid';
import { createThread } from '@schemas/ThreadSchema';
import { fetchThread } from '@stores/ThreadsApp';
import { $topics } from '@stores/ThreadsApp/topics';
import { updateThread } from '@stores/ThreadsApp/updateThread';
import { $account, markEntrySeen } from '@stores/sessionStore';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { extractTags } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { addDoc, collection } from 'firebase/firestore';
import {
  type Component,
  For,
  createEffect,
  createSignal,
  onMount,
} from 'solid-js';
import { db } from 'src/firebase/client';

export const ThreadEditorApp: Component<{
  threadKey?: string;
  topic?: string;
}> = (props) => {
  const topics = useStore($topics);
  const account = useStore($account);

  const [topic, setTopic] = createSignal<string>(props.topic || 'yleinen');
  const [tags, setTags] = createSignal<string[]>([]);
  const [title, setTitle] = createSignal<string>('');
  const [markdownContent, setMarkdownContent] = createSignal<string>('');
  const [suspend, setSuspend] = createSignal<boolean>(false);

  createEffect(() => {
    setTags(extractTags(markdownContent()));
  });

  onMount(() => {
    if (props.threadKey) {
      setSuspend(true);
      // Load the thread
      fetchThread(props.threadKey).then((thread) => {
        if (thread) {
          setTitle(thread.title);
          setTopic(thread.channel || 'yleinen');
          setMarkdownContent(thread.markdownContent || '');
          setTags(thread.tags || []);
          setSuspend(false);
        } else {
          pushSessionSnack({
            message: t('snacks:threadNotFound'),
          });
          // Redirect to the thread
          window.location.href = `/threads/${props.threadKey}`;
        }
      });
    }
  });

  async function send(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      tags: tags(),
      topic: topic(),
      markdownContent: markdownContent(),
      owners: [account().uid],
    };

    let key = props.threadKey;
    // If we dont have a threadKey, we are creating a new thread
    if (!props.threadKey) {
      console.log('Creating new thread', data);

      const thread = toFirestoreEntry(createThread(data));
      key = (await addDoc(collection(db, 'stream'), thread)).id;
      await markEntrySeen(key, Date.now());
    } else {
      console.log('Updating thread', props.threadKey, data);
      await updateThread(props.threadKey, data);
    }

    // Redirect to the thread
    window.location.href = `/threads/${key}`;
  }

  return (
    <WithLoader loading={suspend()}>
      <form class="content-editor" onsubmit={send}>
        <div class="toolbar">
          <label class="grow">
            {t('entries:thread.title')}
            <input
              name="title"
              type="text"
              value={title()}
              onInput={(e) => setTitle(e.currentTarget.value)}
              placeholder={t('entries:thread.placeholders.title')}
            />
          </label>
          <label>
            {t('entries:thread.channel')}
            <select
              name="channel"
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

        <textarea
          name="markdownContent"
          value={markdownContent()}
          onInput={(e) => setMarkdownContent(e.currentTarget.value)}
          placeholder={t('entries:thread.placeholders.content')}
        />

        <p>
          <For each={tags()}>{(tag) => <span class="pill">{tag}</span>}</For>
        </p>

        <div class="debug">
          title: ({title()}) <br />
          topic: ({topic()})<br />
          markdownContent: ({markdownContent()})<br />
          tags: ({tags()})<br />
        </div>

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
    </WithLoader>
  );
};
