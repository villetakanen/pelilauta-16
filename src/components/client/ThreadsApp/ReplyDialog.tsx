/**
 * A dialog component that allows the user to reply to a thread.
 *
 * Do note: we moved replying to a dialog to match the design of Threads, Linker,
 * and other social media platforms.
 *
 * The theory here is that people find it more intuitive to use a similar interface
 * across different platforms.
 */
import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import { type Reply, createReply } from '@schemas/ReplySchema';
import { createEventDispatcher } from '@solid-primitives/event-dispatcher';
import { addReply } from '@stores/ThreadsApp/discussion';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Atom, atom } from 'nanostores';
import { type Component, createEffect, createSignal } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  open: boolean;
  quoteRef?: string;
  threadKey: string;
  discussion?: Atom<Reply[]>;
  onQuote: (evt: CustomEvent<string>) => void;
  onClose?: () => void;
}

export const ReplyDialog: Component<Props> = (props) => {
  const uid = useStore($uid);
  let dialog: HTMLDialogElement | undefined;
  const [message, setMessage] = createSignal<string | null>(null);
  const dispatch = createEventDispatcher(props);
  const discussion = useStore(props.discussion || atom([]));
  const quote = () =>
    discussion().find((reply) => reply.key === props.quoteRef);

  createEffect(() => {
    if (props.open) {
      dialog?.showModal();
    } else {
      dialog?.close();
    }
  });

  function handleClose() {
    dialog?.close();
    setMessage('');
    dispatch('quote', '');
    props.onClose?.();
  }

  function resetQuote(e: Event) {
    logDebug('ReplyDialog', 'resetQuote', e);
    dispatch('quote', '');
  }

  async function send(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    logDebug('ReplyForm', 'send', e);

    const reply = createReply({
      markdownContent: message() || '',
      owners: [uid()],
      threadKey: props.threadKey,
    });

    logDebug(await addReply(reply));

    handleClose();
  }

  return (
    <dialog ref={dialog}>
      <div class="header">
        <button type="button" onClick={handleClose} aria-label="Close dialog">
          <cn-icon noun="close" />
        </button>
        <h3>{t('disccussion:reply')}</h3>
      </div>

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

      <form onsubmit={send}>
        <textarea
          placeholder={t('disccussion:replyPlaceholder')}
          rows="5"
          onBlur={(e) => setMessage(e.currentTarget.value)}
        >
          {message()}
        </textarea>
        <button type="submit">{t('disccussion:reply')}</button>
      </form>
    </dialog>
  );
};
