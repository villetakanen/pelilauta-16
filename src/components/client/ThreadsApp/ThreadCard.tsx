import { ProfileLink } from '@client/shared/ProfileLink';
import { topicToNoun } from '@stores/ThreadsApp/topics';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
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
    <div style="flex-basis: auto;">
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

        <p class="text-right downscaled">
          <ProfileLink uid={props.thread.owners[0]} />
        </p>

        <div slot="actions">
          <div class="toolbar px-0">
            <p class="m-0 px-1">{toDisplayString(props.thread.flowTime)}</p>
            <div class="grow" />
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
