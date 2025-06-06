<script lang="ts">
import { deleteNotification } from '@firebase/client/inbox/deleteNotification';
import { markRead } from '@firebase/client/inbox/markRead';
import type { Notification } from '@schemas/NotificationSchema';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';

/**
 * A Line item in the notifications list.
 */
interface Props {
  notification: Notification;
}
const { notification }: Props = $props();

const noun = $derived.by(() => {
  if (notification.targetType.endsWith('.loved')) return 'love';
  if (notification.targetType.endsWith('.reply')) return 'discussion';
  if (notification.targetType.endsWith('.invited')) return 'adventurer';
  if (notification.targetType.startsWith('handout.')) return 'books';
  return 'info';
});

const href = $derived.by(() => {
  if (notification.targetType === 'thread.loved')
    return `/threads/${notification.targetKey}`;
  if (notification.targetType === 'site.invited')
    return `/sites/${notification.targetKey}`;
  if (notification.targetType === 'site.loved')
    return `/sites/${notification.targetKey}`;
  if (notification.targetType === 'thread.reply')
    return `/threads/${notification.targetKey}`;
  if (notification.targetType.startsWith('handout.')) {
    const keys = notification.targetKey.split('/');
    return `/sites/${keys[0]}/handouts/${keys[1]}`;
  }
});

async function read() {
  markRead(notification.key, true);
}
async function remove() {
  deleteNotification(notification.key);
}
</script>

<article
  class={`notification-item flex flex-no-wrap mb-1 p-1 border-radius ${notification.read ? '' : 'elevation-4'}`}>
  <cn-icon {noun} small class="mt-1 flex-none"></cn-icon>
  <div class="grow">
    <p class="m-0">
      <ProfileLink uid={notification.from} />
      {t(`social:notification.${notification.targetType}`)}
    </p>
    <p class="m-0">
      <a {href}>{notification.targetTitle}</a>
    </p>
    <p class="m-0 text-caption">
      {toDisplayString(notification.createdAt)}
    {notification.targetType}
    </p>
  </div>

  {#if !notification.read}
  <button class="text flex-none" onclick={read} aria-label={t('actions:markRead')}>
    <cn-icon noun="check"></cn-icon>
  </button>
  {:else}
  <button class="text flex-none" aria-label="delete" onclick={remove}>
    <cn-icon noun="delete"></cn-icon>
  </button>
  {/if}
</article>