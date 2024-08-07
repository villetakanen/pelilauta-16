import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { Portal } from 'solid-js/web';
import { $account } from 'src/stores/sessionStore';

/**
 * Fabs available for the site owners and players
 */
export const FrontPageFabs: Component = () => {
  const account = useStore($account);

  const visible = createMemo(() => !!account().uid);

  return (
    <>
      {visible() && (
        <Portal mount={document.querySelector('#fab-tray') || document.body}>
          <a href="/create/thread" class="fab">
            <cn-icon noun="send" small />
            <span>{t('actions:create.thread')}</span>
          </a>
        </Portal>
      )}
    </>
  );
};
