/**
 * A simple solid-js component that displays an icon and thread reply count.
 *
 * This can be wrapped in a link to the thread replies page, or used as a
 * standalone component as thread info.
 */

import type { Thread } from '@schemas/ThreadSchema';
import type { Component } from 'solid-js';

interface ThreadRepliesButtonProps {
  thread: Thread;
}

export const ThreadRepliesButton: Component<ThreadRepliesButtonProps> = (
  props,
) => {
  return (
    <div class="flex align-center">
      <cn-icon noun="send" small />
      <span class="text-caption">{props.thread.replyCount}</span>
    </div>
  );
};
