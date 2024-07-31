import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import { ParseThread, type Thread } from '@schemas/ThreadSchema';
import { $topics } from '@stores/ThreadsApp/topics';
import { toClientEntry } from '@utils/client/entryUtils';
import { toDisplayString } from '@utils/contentHelpers';
import { logDebug } from '@utils/logHelpers';
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
  where,
} from 'firebase/firestore';
import {
  type Component,
  For,
  createMemo,
  createSignal,
  onMount,
} from 'solid-js';
import { db } from 'src/firebase/client';
import { PaginationToolbar } from './PaginationToolbar';

export const ThreadList: Component<{ channel: string; page: number }> = (
  props,
) => {
  const topics = useStore($topics);

  const pageCount = createMemo(() => {
    const topic = topics().find((topic) => topic.slug === props.channel);
    return topic?.threadCount ? Math.ceil(topic.threadCount / 10) : 1;
  });

  const [threads, setTheads] = createSignal(new Array<Thread>());

  const topic = createMemo(() => {
    return topics().find((topic) => topic.slug === props.channel);
  });

  onMount(async () => {
    const topicName = props.channel === 'yleinen' ? 'Yleinen' : props.channel;

    const q = query(
      collection(db, 'stream'),
      orderBy('public', 'desc'),
      orderBy('topic', 'desc'),
      orderBy('flowTime', 'desc'),
      // startAt(false, 'Yleinen', 0),
      startAt('Roolipelit'),
      limit(10),
      // startAt(0)
      // startAt(10 * (props.page - 1)),
    );
    const pageResults = await getDocs(q);

    const newThreads: Thread[] = [];

    logDebug('ThreadList', 'onMount', 'pageResults', pageResults.docs.length);

    for (const doc of pageResults.docs) {
      newThreads.push(ParseThread(toClientEntry(doc.data()), doc.id));
    }

    setTheads(newThreads);
  });

  return (
    <article class="column-l elevation-1 p-2">
      <h3 class="downscaled">{topic()?.name}</h3>

      <PaginationToolbar
        channel={props.channel}
        page={props.page}
        pageCount={pageCount()}
      />

      <For each={threads()}>
        {(thread) => (
          <div class="elevation-2 border-radius my-1 p-1">
            <p class="downscaled m-0">
              <strong>
                <a href={`/threads/${thread.key}`}>{thread.title}</a>
              </strong>
            </p>
            <p class="m-0 downscaled">
              <ProfileLink uid={thread.owners[0]} /> –
              {toDisplayString(thread.createdAt)}
            </p>
          </div>
        )}
      </For>

      <PaginationToolbar
        channel={props.channel}
        page={props.page}
        pageCount={pageCount()}
      />
    </article>
  );
};
