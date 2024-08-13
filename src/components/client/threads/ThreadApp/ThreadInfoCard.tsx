/**
 * A Solid-js component that displays an info card for a thread.
 */
import { ProfileLink } from '@client/shared/ProfileLink';
import type { Thread } from '@schemas/ThreadSchema';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { ThreadLikeButton } from '../ThreadLikeButton';

export const ThreadInfoCard: Component<{ thread: Thread; author: string }> = (
  props,
) => {
  const thread = createMemo(() => props.thread);

  return (
    <cn-card class="column-s">
      <h3>{t('threads:info.title')}</h3>
      <p>
        <span>{t('threads:info.author')} </span>
        <ProfileLink uid={props.author} />
        <span> {t('threads:info.inTopic')} </span>
        {thread().channel}
      </p>
      <p>
        {thread().replyCount || 0} {t('threads:info.replies')}
      </p>

      <div class="toolbar justify-space-between" slot="actions">
        <p>{toDisplayString(thread().flowTime)}</p>
        <ThreadLikeButton thread={thread()} />
      </div>
    </cn-card>
  );
};
