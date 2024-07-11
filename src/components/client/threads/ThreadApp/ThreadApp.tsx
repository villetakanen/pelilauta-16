/**
 * A CSR microfrontend for reading threads,
 *
 * Shows the thread post, and a list of comments.
 */
import { WithLoader } from '@client/shared/WithLoader';
import { useStore } from '@nanostores/solid';
import { type Component, onMount } from 'solid-js';
import { $thread, load, loadingState } from 'src/stores/activeThreadStore';
import { ThreadArticle } from './ThreadArticle';
import { ThreadDiscussion } from './ThreadDiscussion';
import { ThreadInfoCard } from './ThreadInfoCard';

export const ThreadApp: Component<{ thread: string }> = (props) => {
  const thread = useStore($thread);
  const loading = useStore(loadingState);

  onMount(() => {
    load(props.thread);
  });

  return (
    <>
      <div class="content-columns">
        <WithLoader loading={loading() !== 'active'}>
          <ThreadArticle thread={thread()} />
        </WithLoader>
        <ThreadInfoCard thread={thread()} author={thread().owners[0]} />
      </div>
      <div class="content-columns">
        <ThreadDiscussion />
      </div>
    </>
  );
};
