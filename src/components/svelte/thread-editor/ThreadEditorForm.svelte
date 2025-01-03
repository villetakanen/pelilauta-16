<script lang="ts">
import type { Channel } from '@schemas/ChannelSchema';
import type { Thread } from '@schemas/ThreadSchema';
import { uid } from '@stores/sessionStore';
import AddFilesButton from '@svelte/app/AddFilesButton.svelte';
import { pushSnack } from '@utils/client/snackUtils';
import { extractTags } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import type { CnEditor } from 'cn-editor/src/cn-editor';
import { onMount } from 'svelte';
import { submitThreadUpdate } from './submitThreadUpdate';

interface Props {
  thread?: Thread;
  channelKey: string;
  channels: Channel[];
}

const { thread, channelKey, channels }: Props = $props();
let saving = $state(false);
let changed = $state(false);
let files = $state<File[]>([]);
const previews = $derived(
  files.map((file) => ({ src: URL.createObjectURL(file), caption: file.name })),
);
let tags = $state<string[]>(thread?.tags || []);

async function handleSubmit(event: Event) {
  event.preventDefault();
  if (thread?.key) {
    throw new Error('Editing existing threads is not supported yet');
  }
  saving = true;
  const data = new FormData(event.target as HTMLFormElement);
  try {
    const slug = await submitThreadUpdate(data, $uid, tags, files);
    saving = false;
    window.location.href = `/threads/${slug}`;
  } catch (error) {
    logError('Error saving thread', error);
    pushSnack(t('threads:editor.error.save'));
    saving = false;
  }
}
async function handleChange() {
  if (!changed) {
    changed = true;
  }
}

async function handleContentChange(event: InputEvent) {
  const editor = event.target as CnEditor;
  const content = editor.value;
  tags = extractTags(content);
  handleChange();
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
        onchange={handleChange}
      />
    </label>
    <label>
      {t('entries:thread.channel')}
      <select
        name="channel"
        onchange={handleChange}
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
        changed = true;
      }}
      disabled={saving}
    />
  </section>
  {#if files.length > 0}
    <section style="container: images / inline-size; width: min(420px,90vw); margin: 0 auto; margin-bottom: var(--cn-gap)">
      <cn-lightbox images={previews}></cn-lightbox>
    </section>
  {/if}
  <section class="grow">
    <cn-editor
      value={thread?.markdownContent || ''}
      name="markdownContent"
      disabled={saving}
      oninput={handleContentChange}
      placeholder={t('entries:thread.placeholders.content')}
    ></cn-editor>
  </section>

  {#if tags.length > 0}
    <section class="flex elevation-1 p-1">
      {#each tags as tag}
        <span class="cn-tag">{tag}</span>
      {/each}
    </section>
  {/if}

  <section class="toolbar">
    {#if thread?.key}
      <button type="button" disabled={saving} class="text">
        {t('actions:delete')}
      </button>
    {/if}
    <button type="button" disabled={saving} class="text">
      {t('actions:cancel')}
    </button>
    <div class="grow"></div>
    <button type="submit" disabled={saving || !changed} data-testid="send-thread-button">
      <cn-icon noun="send"></cn-icon>
      <span>{t('actions:send')}</span>
    </button>
  </section>
</form>

