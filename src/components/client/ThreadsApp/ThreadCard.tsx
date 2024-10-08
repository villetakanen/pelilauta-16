import { ProfileLink } from '@client/shared/ProfileLink';
import { topicToNoun } from '@stores/ThreadsApp/topics';
import { toDisplayString } from '@utils/contentHelpers';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSnippetSection } from 'src/components/shared/MarkdownSnippetSection';
import type { Thread } from 'src/schemas/ThreadSchema';
import { ThreadLikeButton } from '../threads/ThreadLikeButton';

export const ThreadCard: Component<{
  thread: Thread;
  notify?: boolean;
  key: string;
  elevation?: number;
}> = (props) => {
  const notify = createMemo(() => props.notify);

  return (
    <div style="flex-basis: auto; width: 100%">
      <cn-card
        notify={notify()}
        href={`/threads/${props.thread.key}`}
        title={props.thread.title}
        cover={props.thread.poster || undefined}
        elevation={props.elevation}
        noun={topicToNoun(props.thread.channel)}
      >
        <div class="downscaled">
          <MarkdownSnippetSection content={`${props.thread.markdownContent}`} />
        </div>

        <div slot="actions">
          <div class="toolbar px-0">
            <div class="grow downscaled">
              <p class="m-0 px-1">
                <ProfileLink uid={props.thread.owners[0]} /> <br />
                {toDisplayString(props.thread.flowTime)}
              </p>
            </div>
            <ThreadLikeButton thread={props.thread} />

            <a href={`/threads/${props.thread.key}#discussion`}>
              <cn-reaction-button
                noun="discussion"
                count={props.thread.replyCount || 0}
              />
            </a>
          </div>
        </div>
      </cn-card>
    </div>
  );
};
