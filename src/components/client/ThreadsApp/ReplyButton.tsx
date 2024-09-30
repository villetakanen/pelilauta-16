import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import type { Atom } from 'nanostores';
/**
 * A Solid-js component that renders a button that opens a dialog to reply to a thread.
 *
 * This component is used in the ThreadsApp component, it injects the ReplyDialog component
 * to the #base-tail div at the end of each astro-layout component.
 */
import { type Component, createSignal } from 'solid-js';
import { ReplyDialog } from './ReplyDialog';

interface Props {
  quoteRef?: string;
  threadKey: string;
  discussion?: Atom<Reply[]>;
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

  return (
    <>
      {uid() && (
        <>
          <button type="button" onClick={() => setShowModal(true)}>
            <cn-icon noun="send" />
            <span class="hide-on-mobile">{t('actions:reply')}</span>
          </button>
          <ReplyDialog {...props} open={showModal()} onClose={handleClose}/>
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
