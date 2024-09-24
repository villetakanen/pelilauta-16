/**
 * A CSR microfrontend for reading threads,
 *
 * Shows the thread post, and a list of comments.
 */
import { WithLoader } from '@client/shared/WithLoader';
import { useStore } from '@nanostores/solid';
import { subscribeThread } from '@stores/ThreadsApp';
import { type Component, createMemo } from 'solid-js';
import { ThreadInfoCard } from '../../ThreadsApp/ThreadInfoCard';
import { ThreadArticle } from './ThreadArticle';

export const ThreadApp: Component<{ thread: string }> = (props) => {
  const thread = useStore(subscribeThread(props.thread));
  const loading = createMemo(() => !thread()?.key);

  return (
    <>
      <div class="content-columns">
        <WithLoader loading={loading()}>
          {thread() && <ThreadArticle thread={thread() || undefined} />}
        </WithLoader>
        {thread() && (
          <ThreadInfoCard
            thread={thread() || undefined}
            author={thread()?.owners[0] || ''}
          />
        )}
      </div>
    </>
  );
};
