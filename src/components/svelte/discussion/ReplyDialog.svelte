<script lang="ts">
import { addReply } from '@firebase/client/threads/addReply';
import type { Thread } from '@schemas/ThreadSchema';
import { uid } from '@stores/session';
import { t } from '@utils/i18n';

interface Props {
  thread: Thread;
}
const { thread }: Props = $props();
const dialogId = `reply-dialog-${thread.key}`;
let replyContent = $state<string>('');

function showDialog() {
  const dialog = document.getElementById(dialogId) as HTMLDialogElement;
  dialog.showModal();
}

function handleClose() {
  const dialog = document.getElementById(dialogId) as HTMLDialogElement;
  replyContent = '';
  dialog.close();
}

async function onsubmit(e: Event) {
  // TODO: Send the reply
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const formData = new FormData(form);
  const markdownContent = formData.get('reply') as string;

  await addReply(thread, $uid, markdownContent);

  handleClose();
}
</script>
<div class="toolbar justify-center">
<button type="button" onclick={showDialog}>
  <cn-icon noun="send"></cn-icon>
  <span>{t('threads:discussion.reply')}</span>
</button>
</div>

<dialog id={dialogId}>

  <div class="header">
    <button type="button" onclick={handleClose} aria-label="Close dialog">
      <cn-icon noun="close"></cn-icon>
    </button>
    <h3>{t('threads:discussion.reply')}</h3>
  </div>

  <form {onsubmit}>
    <textarea
      placeholder={t('entries:reply.markdownContent')}
      rows="5"
      name="reply"
      required
      class="reply-textarea"
      bind:value={replyContent}
    ></textarea>
    
    <div class="toolbar justify-end">
      <button type="button" class="text" onclick={handleClose}>
        {t('actions:cancel')}
      </button>
      <button type="submit" class="call-to-action">
        {t('actions:send')}
      </button>
    </div>
  </form>
</dialog>

<style>
.reply-textarea {
  min-width: 85dvw;
}
@media screen and (min-width: 621px) {
  .reply-textarea {
    min-width: 620px;
  }
}

</style>