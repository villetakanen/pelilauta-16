import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { $uid } from '@stores/session';
import { t } from '@utils/i18n';
/**
 * A Solid-js component that renders a button that opens a dialog to reply to a thread.
 *
 * This component is used in the ThreadsApp component, it injects the ReplyDialog component
 * to the #base-tail div at the end of each astro-layout component.
 */
import { type Component, createEffect, createSignal } from 'solid-js';
import { ReplyDialog } from './ReplyDialog';

interface Props {
  quoteRef?: string;
  threadKey: string;
  discussion?: Reply[];
  onQuote: (evt: CustomEvent<string>) => void;
  onClose?: () => void;
}

export const ReplyButton: Component<Props> = (props) => {
  const uid = useStore($uid);
  const [showModal, setShowModal] = createSignal(false);

  function handleClose() {
    setShowModal(false);
    props.onClose?.();
  }

  createEffect(() => {
    if (props.quoteRef) {
      setShowModal(true);
    }
  });

  return (
    <>
      {uid() && (
        <>
          <button type="button" onClick={() => setShowModal(true)}>
            <cn-icon noun="send" />
            <span class="hide-on-mobile">{t('threads:discussion.reply')}</span>
          </button>
          <ReplyDialog {...props} open={showModal()} onClose={handleClose} />
        </>
      )}
      {!uid() && (
        <a href="/login" class="button">
          <cn-icon noun="avatar" />
          <span class="hide-on-mobile">{t('actions:login')}</span>
        </a>
      )}
    </>
  );
};
