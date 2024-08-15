import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import { $notifications } from '@stores/SocialApp/notificationsStore';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

export const SocialApp: Component = () => {
  const notifications = useStore($notifications);

  return (
    <div class="content-columns">
      <article>
        <h1 class="head-4">{t('social:inbox.title')}</h1>
        <section class="elevation-1 p-2 border-radius">
          <For each={notifications()}>
            {(notification) => (
              <div>
                <h4 class="downscaled">
                  {t(`social:${notification.message}`)}
                </h4>
                <p>
                  <ProfileLink uid={notification.from} />
                </p>
              </div>
            )}
          </For>
          <p class="mb-0 text-right">
            {notifications().length} {t('social:inbox.notificationCount')}
          </p>
        </section>
      </article>
    </div>
  );
};
