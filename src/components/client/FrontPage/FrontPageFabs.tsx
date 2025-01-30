import { useStore } from '@nanostores/solid';
import { $isAnonymous } from '@stores/session';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

/**
 * Fabs available for the site owners and players
 */
export const FrontPageFabs: Component = () => {
  const anonymous = useStore($isAnonymous);

  return (
    <>
      {!anonymous() && (
        <Portal mount={document.querySelector('#fab-tray') || document.body}>
          <a
            href="/create/thread"
            class="fab"
            data-testid="createDiscussionFab"
          >
            <cn-icon noun="send" small />
            <span class="sm-hidden">{t('actions:create.thread')}</span>
          </a>
        </Portal>
      )}
    </>
  );
};
