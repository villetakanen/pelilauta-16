import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import { $notifications } from '@stores/SocialApp/notificationsStore';
import { t } from '@utils/i18n';
import { parse } from 'marked';
import { type Component, For } from 'solid-js';

export const SocialApp: Component = () => {
  const notifications = useStore($notifications);

  function parseNoun(notificationType: string) {
    const typeArray = notificationType.split('.');
    if (typeArray.length > 1) {
      const type = typeArray[1];
      if (type === 'loved') {
        return 'love';
      }
    }
    return 'send';
  }

  return (
    <div class="content-columns">
      <article>
        <h1 class="head-4">{t('social:inbox.title')}</h1>
        <section class="elevation-1 p-2 border-radius">
          <For each={notifications().filter((n) => !n.read)}>
            {(notification) => (
              <div class="flex flex-no-wrap line-between">
                <cn-icon
                  noun={parseNoun(notification.targetType)}
                  class="no-shrink"
                />
                <div class="grow">
                  <h4 class="downscaled m-0">
                    <a
                      href={`/threads/${notification.targetKey.split('/')[0]}`}
                    >
                      {`${notification.message}`}
                    </a>
                  </h4>
                  <p class="mt-0">
                    <ProfileLink uid={notification.from} />{' '}
                    {t(`social:notification.${notification.targetType}`)}
                  </p>
                </div>
                <button class="no-shrink" type="button">
                  <cn-icon noun="delete" class="no-shrink" />
                </button>
              </div>
            )}
          </For>
          <p class="mb-0 text-right">
            {notifications().filter((n) => !n.read).length}{' '}
            {t('social:inbox.notificationCount')}
          </p>
        </section>
      </article>
    </div>
  );
};
