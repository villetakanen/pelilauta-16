<script lang="ts">

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
import WithAuth from "@svelte/app/WithAuth.svelte";
import type { Page } from "@schemas/PageSchema";
import type { Site } from "@schemas/SiteSchema";
import { t } from "@utils/i18n";
import { logDebug } from "@utils/logHelpers";

interface Props {
  site: Site;
  page: Page;
}
const { site, page }: Props = $props();

function handleSubmission(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  logDebug('Form data', data);
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
        />
      </label>
    </section>
    <section class="toolbar justify-between">
      <a href={`/site/${site.key}/page/${page.key}/delete`} class="button text">
        {t('actions:delete')}
      </a>
      <button type="submit" class="button cta">
        {t('actions:save')}
      </button>
    </section>
  </form>
</WithAuth>