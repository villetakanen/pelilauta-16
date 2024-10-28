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
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import { type Reply, createReply } from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { createEventDispatcher } from '@solid-primitives/event-dispatcher';
import { addReply } from '@stores/ThreadsApp/discussion';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { type Component, createEffect, createSignal } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  open: boolean;
  quoteRef?: string;
  threadKey: string;
  discussion?: Reply[];
  onQuote: (evt: CustomEvent<string>) => void;
  onClose?: () => void;
}

export const ReplyDialog: Component<Props> = (props) => {
  const uid = useStore($uid);
  let dialog: HTMLDialogElement | undefined;
  let replyTextArea: HTMLTextAreaElement | undefined;
  const [message, setMessage] = createSignal<string | null>(null);
  const dispatch = createEventDispatcher(props);
  const quote = () =>
    props.discussion?.find((reply) => reply.key === props.quoteRef);

  createEffect(() => {
    if (props.open) {
      setMessage('');
      dialog?.showModal();
      if (replyTextArea) {
        replyTextArea.value = '';
        replyTextArea.focus();
      }
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

    if (props.quoteRef) {
      reply.quoteref = props.quoteRef;
    }

    logDebug(await addReply(reply));

    // This is a temporary workaround to increase the replyCount of the thread.
    updateDoc(doc(db, THREADS_COLLECTION_NAME, props.threadKey), {
      replyCount: increment(1),
    });

    handleClose();
  }

  return (
    <dialog ref={dialog} style="width: min(95vh, 700px)">
      <div class="header">
        <button type="button" onClick={handleClose} aria-label="Close dialog">
          <cn-icon noun="close" />
        </button>
        <h3>{t('threads:discussion.reply')}</h3>
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
          ref={replyTextArea}
          placeholder={t('entries:reply.markdownContent')}
          rows="5"
          onBlur={(e) => setMessage(e.currentTarget.value)}
        />
        <div class="toolbar justify-end">
          <button type="button" class="text" onClick={handleClose}>
            {t('actions:cancel')}
          </button>
          <button type="submit" class="call-to-action">
            {t('actions:send')}
          </button>
        </div>
      </form>
    </dialog>
  );
};
