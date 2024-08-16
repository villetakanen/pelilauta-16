import { useStore } from '@nanostores/solid';
import { $notifications } from '@stores/SocialApp/notificationsStore';
import { $account } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const InboxRailButton: Component = () => {
  const account = useStore($account);
  const notifications = useStore($notifications);

  const unreadNotifications = createMemo(() => {
    return notifications().filter((n) => n.to === account()?.uid && !n.read)
      .length;
  });

  const showPill = createMemo(() => unreadNotifications() > 0);

  return (
    <>
      {account()?.uid && (
        <a href="/inbox" style="display:block; position:relative">
          <cn-navigation-icon noun="send" label={t('navigation:inbox')} />
          {showPill() && (
            <span class="pill notification-pill">{unreadNotifications()}</span>
          )}
        </a>
      )}
    </>
  );
};
