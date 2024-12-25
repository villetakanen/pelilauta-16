<script lang="ts">
import type { Channel } from '@schemas/ChannelSchema';
import type { Thread } from '@schemas/ThreadSchema';
import { uid } from '@stores/sessionStore';
import AddFilesButton from '@svelte/app/AddFilesButton.svelte';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import { onMount } from 'svelte';

interface Props {
  thread?: Thread;
  channelKey: string;
  channels: Channel[];
}

const { thread, channelKey, channels }: Props = $props();
let saving = $state(false);
let files = $state<File[]>([]);

async function handleSubmit(event: Event) {
  event.preventDefault();
  const { title, content } = event.target as HTMLFormElement;
  if (!$uid) {
    logError('Trying to create a thread without a valid session');
    return;
  }
  if (!title.trim() || !content.trim()) {
    pushSnack(t('threads:editor.error.titleContentRequired'));
    return;
  }
  saving = true;
  let targetKey = thread?.key || '-';
  targetKey = targetKey.replace(/[^a-zA-Z0-9-]/g, '');

  saving = false;
  // window.location.href = `/threads/${targetKey}`;
}

onMount(() => {
  if (thread) {
    // Fetch all the files for this thread
    const urls = thread.images?.map((image) => image.url);
    if (urls) {
      files = urls.map((url) => new File([url], url));
    }
  }
});
</script>

<form
  id="thread-editor"
  class="content-editor"
  onsubmit={handleSubmit}>
  <section class="toolbar">
    <label class="grow">
    {t('entries:thread.title')}
      <input
        type="text"
        name="title"
        disabled={saving}
        placeholder={t('entries:thread.placeholders.title')}
      />
    </label>
    <label>
        {t('entries:thread.channel')}
        <select
          name="channel"
        >
          {#each channels as channel}
            <option value={channel.slug}
              selected={!!channelKey && channel.slug === channelKey}
              >{channel.name}</option>
          {/each}
        </select>
      </label>
      <AddFilesButton
        accept="image/*"
        multiple={true}
        addFiles={(newFiles: File[]) => {
          files = [...files, ...newFiles];
        }}
        disabled={saving}
      />
  </section>
  {#if files.length > 0}
    <section class="file-list">
        {#each files as file}
            <div class="file">
                <span>{file.name}</span>
                <button
                type="button"
                onclick={() => {
                    files = files.filter((f) => f !== file);
                }}
                >
                {t('actions:remove')}
                </button>
            </div>
            {/each}
    </section>
    {/if}
        

        <div class="form-group">
            <label for="content">Content</label>
            <textarea
                id="content"
                placeholder="Thread content"
                disabled={saving}
            ></textarea>
        </div>

      
        <div class="actions">
            <button type="button" disabled={saving}>
                Cancel
            </button>
            <button type="submit" disabled={saving}>
                {saving ? 'Saving...' : thread?.key ? 'Update Thread' : 'Create Thread'}
            </button>
        </div>
    </form>

