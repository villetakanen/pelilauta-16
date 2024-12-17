/**
 * A solid-js editor form, takes in a thread and a reply, and allows the user to
 * create a new Thread from the reply.
 */

import { ProfileLink } from '@client/shared/ProfileLink';
import { WithLoader } from '@client/shared/WithLoader';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import {
  REPLIES_COLLECTION,
  type Reply,
  createReply,
} from '@schemas/ReplySchema';
import {
  THREADS_COLLECTION_NAME,
  type Thread,
  createThread,
} from '@schemas/ThreadSchema';
import { $topics } from '@stores/ThreadsApp/topics';
import { $uid, markEntrySeen } from '@stores/sessionStore';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import { addDoc, collection } from 'firebase/firestore';
import { type Component, For, createSignal } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  thread: Thread;
  reply: Reply;
}

export const ForkThreadApp: Component<Props> = (props) => {
  const uid = useStore($uid);
  const [title, setTitle] = createSignal<string>(`Re: ${props.thread.title}`);
  const [topic, setTopic] = createSignal<string>(
    props.thread?.channel?.toLocaleLowerCase() ||
      props.thread.topic?.toLocaleLowerCase() ||
      'yleinen',
  );
  const topics = useStore($topics);
  const [markdownContent, setMarkdownContent] = createSignal<string>('');

  async function handleSubmit(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const data = Object.fromEntries(formData.entries());

    const thread = createThread({
      owners: [uid()],
      ...data,
      quoteRef: `${props.reply.threadKey}/${props.reply.key}`,
    });

    try {
      const cleaned = toFirestoreEntry(thread);
      const key = (
        await addDoc(collection(db, THREADS_COLLECTION_NAME), cleaned)
      ).id;
      await markEntrySeen(key, Date.now());

      const crossPostReply = createReply({
        owners: [uid()],
        threadKey: props.thread.key,
        markdownContent: t('threads:fork.crossPost', {
          link: `/threads/${key}`,
        }),
        quoteref: `${props.reply.key}`,
      });

      await addDoc(
        collection(
          db,
          `${THREADS_COLLECTION_NAME}/${props.thread.key}/${REPLIES_COLLECTION}`,
        ),
        toFirestoreEntry(crossPostReply),
      );

      pushSessionSnack('snacks:threadCreated');
      window.location.href = `/threads/${key}`;
    } catch (err: unknown) {
      logError('ForkThreadApp', err);
      pushSessionSnack('snacks:threadCreateFailed');
    }
  }

  return (
    <WithLoader loading={!uid()}>
      <form class="content-editor" onsubmit={handleSubmit}>
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

        <div>
          <p>{t('threads:fork.quoted')}</p>
          <div class="elevation-1 border-radius p-1 clip-after-3 secondary">
            <p class="m-0">
              <ProfileLink uid={props.reply.owners[0]} />
            </p>
            <p class="downscaled">
              <MarkdownSection content={props.reply.markdownContent} />
            </p>
          </div>
        </div>

        <div>
          <br />
        </div>

        <textarea
          name="markdownContent"
          value={markdownContent()}
          onInput={(e) => setMarkdownContent(e.currentTarget.value)}
          placeholder={t('entries:thread.placeholders.content')}
        />

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
