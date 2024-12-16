<script lang="ts">
import type { CnEditor } from '@11thdeg/cyan-next';
import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { onMount } from 'svelte';

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

function handleChange(event: Event) {
  logDebug('Field changed', event);
  hasChanges = true;
}

function handleContentChange(event: CustomEvent<string>) {
  logDebug('Content changed', event.detail);
  editorValue = event.detail;
  hasChanges = true;
}

function handleSubmission(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  logDebug('Form data', data);
}

onMount(() => {
  const editorElement = document.getElementById('page-editor');
  if (editorElement as CnEditor) {
    editorElement?.addEventListener('change', (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      editorValue = (customEvent.target as CnEditor).value;
      hasChanges = true;
    });
  }
});
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
    <section class="grow">
      <cn-editor
        id="page-editor"
        value={editorValue}
        onchange={(e: CustomEvent) => console.log(e.detail)}
      ></cn-editor>
    </section>

    {editorValue}

    {#if page.tags && page.tags.length > 0}
    <section class="tags">
      <p>{t('entries:page.tags')}</p>
      <ul>
        {#each page.tags as tag}
          <li>{tag}</li>
        {/each}
      </ul>
    </section>
    {/if}

    <section class="toolbar justify-between">
      <a href={`/site/${site.key}/page/${page.key}/delete`} class="button text">
        {t('actions:delete')}
      </a>
      <button type="submit" class="button cta" data-testid="save-button" disabled={!hasChanges}>
        {t('actions:save')}
      </button>
    </section>
  </form>
</WithAuth>