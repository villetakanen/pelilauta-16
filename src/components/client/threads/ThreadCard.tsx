import { ProfileLink } from '@client/shared/ProfileLink';
import { topicToNoun } from '@stores/ThreadsApp/topics';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSnippetSection } from 'src/components/shared/MarkdownSnippetSection';
import type { Thread } from 'src/schemas/ThreadSchema';
import { ThreadLikeButton } from './ThreadLikeButton';

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
          <p class="align-right">
            <a href={`/threads/${props.thread.key}`}>{t('actions:readMore')}</a>
          </p>
        </div>

        <div slot="actions">
          <div class="toolbar justify-space-between downscaled border-top">
            <p>
              <ProfileLink uid={props.thread.owners[0]} />
            </p>
            <p>{toDisplayString(props.thread.flowTime)}</p>
          </div>
          <div class="toolbar justify-space-between ">
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
