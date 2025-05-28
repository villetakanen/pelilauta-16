<script lang="ts">
import type { Page } from '@schemas/PageSchema';
import { t } from '@utils/i18n';

interface Props {
  page: Page;
  revision: number;
}
const { page, revision }: Props = $props();
const revisionCount = page.revisionHistory?.length || 0;
</script>

<section>
  <header class="surface mb-1 p-2">
    {t('site:page.history.revision', {index: revision })}
  </header>

  <article class="surface p-2" style="overflow: auto; scroll-x: scroll;">
    {#if revision > revisionCount }
      <p>Current!</p>
    {:else}
      {#if (page.revisionHistory?.[revision - 1])}
        <pre>{page.revisionHistory[revision - 1].markdownContent}</pre>
      {/if}
    {/if}
  </article>
</section>