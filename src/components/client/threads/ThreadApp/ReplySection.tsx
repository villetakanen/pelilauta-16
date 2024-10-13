/**
 * A Solid-js component for showing a reply-bubble, without the actions
 */

import { ProfileAvatar } from '@client/shared/ProfileAvatar';
import { ProfileLink } from '@client/shared/ProfileLink';
import { parseReply } from '@schemas/ReplySchema';
import { type Thread, parseThread } from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { type Component, Show, createMemo, createResource } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  thread: Thread;
}

export const ReplySection: Component<Props> = (props) => {
  const fetchReply = async (quoteRef: string) => {
    const origin = document.location.origin;
    const response = await fetch(`${origin}/api/replies/${quoteRef}.json`);
    return response.json();
  };
  const fetchThread = async (threadKey: string) => {
    const origin = document.location.origin;
    const response = await fetch(`${origin}/api/threads/${threadKey}.json`);
    return response.json();
  };

  const [replyData] = createResource(() => props.thread.quoteRef, fetchReply);
  const [threadData] = createResource(
    () => props.thread.quoteRef?.split('/')[0],
    fetchThread,
  );

  const reply = createMemo(() => {
    const threadKey = props.thread.quoteRef?.split('/')[0];
    const replyKey = props.thread.quoteRef?.split('/')[1];
    return replyData.loading
      ? null
      : parseReply(toClientEntry(replyData()), replyKey, threadKey);
  });

  const originalThread = createMemo(() => {
    const threadKey = props.thread.quoteRef?.split('/')[0];
    return threadData.loading
      ? null
      : parseThread(toClientEntry(threadData()), threadKey);
  });

  return (
    <section class="quote p-1">
      <div class="flex-no-wrap" style="display:flex">
        <Show when={replyData.loading}>
          <cn-loader />
        </Show>
        <Show when={!replyData.loading}>
          <div class="sm-hidden">
            <ProfileAvatar uid={`${reply()?.owners[0]}`} />
          </div>
          <cn-bubble>
            <div
              class="toolbar"
              style="margin-top: -16px; height: calc(6 * var(--cn-grid))"
            >
              <p class="grow">
                <ProfileLink uid={reply()?.owners[0]} />
              </p>
            </div>
            <MarkdownSection content={`${reply()?.markdownContent}`} />
          </cn-bubble>
        </Show>
      </div>
      <p class="text-caption mt-2">
        <i>
          {t('threads:quote.fromThread')}{' '}
          <a href={`/threads/${originalThread()?.key}`}>
            {originalThread()?.title}
          </a>
        </i>
      </p>
    </section>
  );
};
