/**
 * A simple wrapper arounf the "Like" button, that handles the liking of a thread
 *
 * (obviously, if the user is not logged in, the button will not do anything)
 */

import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { $profile, $uid } from '@stores/session';
import { type Component, createMemo } from 'solid-js';
import { loveThread, unloveThread } from 'src/stores/threadsStore/reactions';

export const ThreadLikeButton: Component<{ thread?: Thread }> = (props) => {
  const uid = useStore($uid);
  const profile = useStore($profile);

  const disabled = createMemo(
    () => !uid() || props.thread?.owners.includes(uid()),
  );

  const loves = createMemo(
    () => profile()?.lovedThreads?.includes(props.thread?.key || '') || false,
  );

  function toggleLove() {
    if (!props.thread) return;
    if (!loves()) {
      loveThread(uid(), props.thread.key);
    } else {
      unloveThread(uid(), props.thread.key);
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
