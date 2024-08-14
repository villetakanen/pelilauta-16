import { useStore } from '@nanostores/solid';
import { $account } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

export const InboxRailButton: Component = () => {
  const account = useStore($account);

  return (
    <>
      {account()?.uid && (
        <a href="/inbox" style="display:block; position:relative">
          <cn-navigation-icon noun="send" label={t('navigation:inbox')} />
          <span class="pill notification-pill">1</span>
        </a>
      )}
    </>
  );
};
