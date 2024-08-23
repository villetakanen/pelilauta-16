/**
 * A Solid-js component that displays an info card for a thread.
 */
import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { $account } from '@stores/sessionStore';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { ThreadLikeButton } from '../threads/ThreadLikeButton';

export const ThreadInfoCard: Component<{ thread?: Thread; author: string }> = (
  props,
) => {
  const thread = createMemo(() => props.thread);
  const account = useStore($account);

  const showEditTools = () =>
    (props.thread?.owners || []).includes(account().uid);

  return (
    <cn-card class="column-s">
      <h3>{t('threads:info.title')}</h3>
      <p>
        <span>{t('threads:info.author')} </span>
        <ProfileLink uid={props.author} />
        <span> {t('threads:info.inTopic')} </span>
        {thread()?.channel}
      </p>

      {showEditTools() && (
        <section class="flex flex-col">
          <h4>{t('actions:title')}</h4>
          <a href={`/threads/${thread()?.key}/edit`} class="button text-center">
            {t('actions:edit')}
          </a>
          <a
            href={`/threads/${thread()?.key}/confirmDelete`}
            class="button text-center"
          >
            {t('actions:delete')}
          </a>
        </section>
      )}

      <p>
        {thread()?.replyCount || 0} {t('threads:info.replies')}
      </p>

      <div class="toolbar justify-space-between" slot="actions">
        <p>{toDisplayString(thread()?.flowTime)}</p>
        <ThreadLikeButton thread={thread()} />
      </div>
    </cn-card>
  );
};
