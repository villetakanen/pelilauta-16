import { deleteReply } from '@stores/ThreadsApp/deleteReply';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

type Props = {
  threadKey: string;
  replyKey: string;
};

export const ConfirmReplyDeleteApp: Component<Props> = (props) => {
  async function handleSubmit(e: Event) {
    e.preventDefault();

    await deleteReply(props.threadKey, props.replyKey);

    // Add a Snackbar notification to confirm the deletion.
    pushSessionSnack({
      message: t('threads:snacks.replyDeleted'),
    });

    // Redirect to the forum page.
    window.location.href = `/threads/${props.threadKey}`;
  }

  return (
    <div class="content-columns">
      <section>
        <h1 class="downscaled">{t('threads:confirmDelete.title')}</h1>
        <p>{t('threads:confirmDelete.message')}</p>

        <p>{props.threadKey}</p>

        <p>{props.replyKey}</p>

        <form class="toolbar" onsubmit={handleSubmit}>
          <a href={`/threads/${props.threadKey}`} class="button text">
            {t('actions:cancel')}
          </a>
          <button type="submit" class="button">
            {t('actions:confirm.delete')}
          </button>
        </form>
      </section>
    </div>
  );
};
