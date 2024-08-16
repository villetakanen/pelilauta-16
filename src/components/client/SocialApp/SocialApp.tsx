import { useStore } from '@nanostores/solid';
import { $notifications } from '@stores/SocialApp/notificationsStore';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { NotificationItem } from './NotificationItem';

export const SocialApp: Component = () => {
  const notifications = useStore($notifications);

  const unread = createMemo(() => notifications().filter((n) => !n.read));

  return (
    <div class="content-columns">
      <article>
        <h1 class="head-4">{t('social:inbox.title')}</h1>
        <section class="elevation-1 p-2 border-radius">
          <For each={unread()}>
            {(notification) => <NotificationItem notification={notification} />}
          </For>
          <p class="mb-0 text-right">
            {unread().length} {t('social:inbox.notificationCount')}
          </p>
        </section>
      </article>
    </div>
  );
};
