<script lang="ts">
import type { Page } from '@schemas/PageSchema';
import { t } from '@utils/i18n';

interface Props {
  page: Page;
  revision: number;
}
const { page, revision }: Props = $props();

const requestedRevisionIndex = $derived.by(() => {
  const countback = page.revisionHistory
    ? page.revisionHistory.length - revision
    : 0;
  return Math.max(-1, countback);
});
</script>

<section>
  <header class="surface mb-1 p-2">
    {t('site:page.history.revision', {index: requestedRevisionIndex + 1})}
  </header>

  <article class="surface p-2">
    {#if requestedRevisionIndex < 0}
      <p>Current!</p>
    {:else}
      <p>Revision {requestedRevisionIndex + 1} of {page.name}</p>
    {/if}
  </article>
</section>