/**
 * A simple wrapper arounf the "Like" button, that handles the liking of a thread
 *
 * (obviously, if the user is not logged in, the button will not do anything)
 */

import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { type Component, createMemo } from 'solid-js';
import { $account, $profile } from 'src/stores/sessionStore';
import { loveThread, unloveThread } from 'src/stores/threadsStore/reactions';

export const ThreadLikeButton: Component<{ thread?: Thread }> = (props) => {
  const account = useStore($account);
  const profile = useStore($profile);

  const disabled = createMemo(
    () => !account().uid || props.thread?.owners.includes(account().uid),
  );

  const loves = createMemo(() =>
    profile().lovedThreads?.includes(props.thread?.key || ''),
  );

  function toggleLove() {
    if (!props.thread) return;
    if (!loves()) {
      loveThread(account().uid, props.thread.key);
    } else {
      unloveThread(account().uid, props.thread.key);
    }
  }

  return (
    <cn-reaction-button
      onClick={toggleLove}
      onKeyUp={(e: Event) =>
        (e as KeyboardEvent).key === 'Enter' && toggleLove()
      }
      disabled={disabled()}
      count={props.thread?.lovedCount || 0}
      checked={loves()}
      noun="love"
    />
  );
};
