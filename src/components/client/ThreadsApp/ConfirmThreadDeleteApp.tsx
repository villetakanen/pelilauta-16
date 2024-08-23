import { deleteThread } from '@stores/ThreadsApp/deleteThread';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

export const ConfirmThreadDeleteApp: Component<{ threadKey: string }> = (
  props,
) => {
  async function handleSubmit(e: Event) {
    e.preventDefault();

    await deleteThread(props.threadKey);

    // Add a Snackbar notification to confirm the deletion.
    pushSessionSnack({
      message: t('threads:confirmDelete.success'),
    });

    // Redirect to the forum page.
    window.location.href = '/';
  }

  return (
    <div class="content-columns">
      <section>
        <h1 class="downscaled">{t('threads:confirmDelete.title')}</h1>
        <p>{t('threads:confirmDelete.message')}</p>
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
