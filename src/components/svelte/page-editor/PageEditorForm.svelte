<script lang="ts">
import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { pushSessionSnack, pushSnack } from '@utils/client/snackUtils';
import { extractTags } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import type { CnEditor } from 'cn-editor/src/cn-editor';
import { onMount } from 'svelte';
import { submitPageUpdate } from './submitPageUpdate';

/**
 * This _client side_ component is used to render the form for editing a page.
 *
 * Fields supported
 * - title (textfield)
 * - page-category (select, if categories are available)
 * - content (cn-editor)
 * - tags (auto-generated from content)
 * - insert an asset from the site media library
 *
 * Actions supported
 * - Delete page
 * - Cancel
 * - Save
 */

interface Props {
  site: Site;
  page: Page;
}
const { site, page }: Props = $props();

let hasChanges = $state(false);
let editorValue = $state(page.markdownContent);
let tags = $state<string[]>(page.tags || []);
let contentMigrated = $state(false);
let saving = $state(false);

function handleChange(event: Event) {
  hasChanges = true;
}

async function migrateLegacyContent() {
  const { convertToMarkdown } = await import('./migrateContent');
  const md = page.htmlContent
    ? convertToMarkdown(page.htmlContent)
    : page.content || '';
  if (md) contentMigrated = true;
  editorValue = md;
}

onMount(() => {
  if (!page.markdownContent && (page.content || page.htmlContent)) {
    migrateLegacyContent();
  }
});

async function handleSubmission(event: Event) {
  event.preventDefault();
  if (saving || !hasChanges) {
    return;
  }
  saving = true;
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const changes: Partial<Page> = Object.fromEntries(formData.entries());
  changes.markdownContent = editorValue;
  changes.tags = tags;
  changes.owners = page.owners || [uid];
  try {
    await submitPageUpdate(page, changes);
    pushSessionSnack(t('site:snacks.pageUpdated'));
    window.location.href = `/sites/${site.key}/${page.key}`;
  } catch (error) {
    pushSnack(t('snacks:pageUpdateError'));
    logError('Error updating page', error);
    saving = false;
  }
}

function handleEditorChange(event: Event) {
  hasChanges = true;
  editorValue = (event.target as CnEditor).value;
  tags = extractTags(editorValue || '');
}
</script>

<WithAuth allow={true}>
  <form class="content-editor" onsubmit={handleSubmission}>
    <section class="toolbar">
      <label class="grow">
        {t('entries:page.name')}
        <input
          type="text"
          value={page.name}
          name="name"
          required
          maxlength="42"
          disabled={saving}
          data-testid="page-name"
          oninput={handleChange}
        />
      </label>

      {#if site.pageCategories && site.pageCategories.length > 0}
      <label>
        {t('entries:page.category')}
        <select name="category" value={page.category} oninput={handleChange} data-testid="page-category">
          {#each site.pageCategories as category}
            <option value={category.slug}>{category.name}</option>
          {/each}
        </select>
      </label>
      {/if}

    </section>

    {#if contentMigrated}
      <div class="alert warning flex flex-row items-center px-1">
        <cn-icon noun="info"></cn-icon>
        <p>{t('site:page.editor.contentMigrateWarning')}</p>
      </div>
    {/if}


      <cn-editor
        id="page-editor"
        gutter
        disabled={saving}
        value={editorValue}
        oninput={handleEditorChange}
        onchange={handleEditorChange}
        placeholder={t('entries:page.markdownContent')}
      ></cn-editor>

    {#if tags && tags.length > 0}
    <section class="tags py-1 elevation-1 flex">
        {#each tags as tag}
          <span class="cn-tag">{tag}</span>
        {/each}
    </section>
    {/if}

    <section class="toolbar">
      <a href={`/sites/${site.key}/${page.key}/delete`} class="button text">
        {t('actions:delete')}
      </a>
      <div class="grow"></div>
      <a href={`/sites/${site.key}/${page.key}`} class="button text">
        {t('actions:cancel')}
      </a>
      <button type="submit" class="button cta" data-testid="save-button" disabled={!hasChanges || saving}>
        {#if saving}
          <cn-loader noun="save"></cn-loader>
        {:else}
          <cn-icon noun="save"></cn-icon>
        {/if}
        <span>{t('actions:save')}</span>
      </button>
    </section>
  </form>
</WithAuth>