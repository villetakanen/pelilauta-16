import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import type { Thread } from '@schemas/ThreadSchema';
import { createEventDispatcher } from '@solid-primitives/event-dispatcher';
import { subscribeToDiscussion } from '@stores/ThreadsApp/discussion';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Atom, atom } from 'nanostores';
import { type Component, createMemo, createSignal } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  quoteRef?: string;
  thread?: Thread;
  discussion?: Atom<Reply[]>;
  onQuote: (evt: CustomEvent<string>) => void;
}

export const ReplyForm: Component<Props> = (props) => {
  const dispatch = createEventDispatcher(props);

  const [message, setMessage] = createSignal<string | null>(null);
  const discussion = useStore(props.discussion || atom([]));
  const quote = () =>
    discussion().find((reply) => reply.key === props.quoteRef);

  async function send(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    logDebug('ReplyForm', 'send', e);
  }

  function resetQuote(e: Event) {
    logDebug('ReplyBubble', 'handleQuote', e);
    dispatch('quote', '');
  }

  return (
    <form class="border border-radius p-1 mt-1" onsubmit={send}>
      <h4>{t('threads:discussion.reply')}</h4>
      {quote() && (
        <div class="elevation-1 p-1 border-radius mb-1">
          <button
            type="button"
            style="float: right;"
            class="btn btn-clear"
            onClick={resetQuote}
          >
            <cn-icon noun="delete" />
          </button>
          <p class="p-0 m-0">
            <ProfileLink uid={quote()?.owners[0]} />
          </p>
          <MarkdownSection content={quote()?.markdownContent} />
        </div>
      )}
      <textarea class="textarea" placeholder="Reply to this thread" />
      <div class="toolbar justify-end">
        <button type="submit" class="btn btn-primary">
          <cn-icon noun="send" />
          <span>{t('actions:send')}</span>
        </button>
      </div>
    </form>
  );
};
