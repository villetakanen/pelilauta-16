import { useStore } from '@nanostores/solid';
import { $notifications } from '@stores/SocialApp/notificationsStore';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const InboxRailButton: Component = () => {
  const uid = useStore($uid);
  const notifications = useStore($notifications);

  const unreadNotifications = createMemo(() => {
    return notifications().filter((n) => !n.read).length;
  });

  const showPill = createMemo(() => unreadNotifications() > 0);

  return (
    <>
      {uid() && (
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
