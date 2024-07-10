/**
 * A CSR microfrontend for reading threads,
 *
 * Shows the thread post, and a list of comments.
 */
import { WithLoader } from '@client/shared/WithLoader';
import { useStore } from '@nanostores/solid';
import { type Component, type JSX, createEffect, onMount } from 'solid-js';
import { $thread, load, loadingState } from 'src/stores/activeThreadStore';
import { ThreadArticle } from './ThreadArticle';

export const ThreadApp: Component<{ thread: string }> = (props) => {
  const thread = useStore($thread);
  const loading = useStore(loadingState);

  onMount(() => {
    load(props.thread);
  });

  return (
    <div class="content-columns">
      <WithLoader loading={loading() !== 'active'}>
        <ThreadArticle thread={thread()} />
      </WithLoader>
      {loading()}
      <div class="debug">ThreadApp: {props.thread}</div>
      ...
    </div>
  );
};
