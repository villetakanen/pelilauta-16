import { ProfileLink } from '@client/shared/ProfileLink';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { topicToNoun } from '@utils/schemaHelpers';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { MarkdownSnippetSection } from 'src/components/shared/MarkdownSnippetSection';
import type { Thread } from 'src/schemas/ThreadSchema';

export const ThreadCard: Component<{
  thread: Thread;
  notify?: boolean;
  key: string;
  elevation?: number;
}> = (props) => {
  const notify = createMemo(() => props.notify);

  return (
    <div style="flex-grow: 0; flex-basis: auto; align-self: flex-start; width: 100%">
      <cn-card
        notify={notify()}
        href={`/threads/${props.thread.key}`}
        noun={topicToNoun(props.thread.topic)}
        title={props.thread.title}
        cover={props.thread.poster}
        elevation={props.elevation}
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
            <cn-reaction-button
              noun="love"
              count={props.thread.lovedCount || 0}
            />
            <cn-reaction-button
              noun="design"
              count={props.thread.replyCount || 0}
            />
          </div>
        </div>
      </cn-card>
    </div>
  );
};
