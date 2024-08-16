import { ProfileLink } from '@client/shared/ProfileLink';
import type { Notification } from '@schemas/NotificationSchema';
import { updateNotification } from '@stores/SocialApp/notificationsStore';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const NotificationItem: Component<{ notification: Notification }> = (
  props,
) => {
  const notification = createMemo(() => props.notification);

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

  function markAsRead() {
    updateNotification({ read: true }, notification().key);
  }

  return (
    <div class="flex flex-no-wrap line-between">
      <cn-icon noun={parseNoun(notification().targetType)} class="no-shrink" />
      <div class="grow">
        <h4 class="downscaled m-0">
          <a href={`/threads/${notification().targetKey.split('/')[0]}`}>
            {`${notification().message}`}
          </a>
        </h4>
        <p class="mt-0">
          <ProfileLink uid={notification().from} />{' '}
          {t(`social:notification.${notification().targetType}`)}
        </p>
      </div>
      <button class="no-shrink" type="button" onclick={markAsRead}>
        <cn-icon noun="check" class="no-shrink" />
      </button>
    </div>
  );
};
