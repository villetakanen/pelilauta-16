/**
 * A Solid-js reactive component for showing a thread card.
 *
 * We take in subscriber-store, and see if the user is logged in, and if they
 * have read the thread. If they have not, we show the card-notification.
 */

import { ProfileLink } from '@client/shared/ProfileLink';
import { ThreadLikeButton } from '@client/threads/ThreadLikeButton';
import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { MarkdownSnippetSection } from '@shared/MarkdownSnippetSection';
import { ThreadRepliesButton } from '@shared/ThreadsApp/ThreadRepliesButton';
import { topicToNoun } from '@stores/ThreadsApp/topics';
import { $subscriber, $uid } from '@stores/sessionStore';
import { toDisplayString } from '@utils/contentHelpers';
import type { Component } from 'solid-js';

interface ThreadCardProps {
  thread: Thread;
}

export const ThreadCard: Component<ThreadCardProps> = (props) => {
  const subscriber = useStore($subscriber);
  const uid = useStore($uid);

  const hasSeen = () =>
    subscriber().seenEntities[props.thread.key] >= props.thread.flowTime ||
    !uid();

  const poster =
    props.thread.poster || props.thread.images?.[0].url || undefined;

  return (
    <div style="flex-basis: auto; width: 100%">
      <cn-card
        notify={!hasSeen()}
        href={`/threads/${props.thread.key}`}
        title={props.thread.title}
        cover={poster}
        elevation="1"
        noun={topicToNoun(props.thread.channel)}
      >
        <div class="downscaled">
          <MarkdownSnippetSection content={`${props.thread.markdownContent}`} />
        </div>

        <div slot="actions" class="toolbar items-center">
          <div class="grow downscaled">
            <p class="m-0 px-1">
              <ProfileLink uid={props.thread.owners[0]} /> <br />
              {toDisplayString(props.thread.flowTime)}
            </p>
          </div>
          <ThreadLikeButton thread={props.thread} />

          <div>
            <a
              href={`/threads/${props.thread.key}#discussion`}
              class="decoration-none"
            >
              <ThreadRepliesButton thread={props.thread} />
            </a>
          </div>
        </div>
      </cn-card>
    </div>
  );
};
