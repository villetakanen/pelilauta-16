<script lang="ts">
import type { Page } from '@schemas/PageSchema';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';

interface Props {
  page: Page;
  revision: number;
}
const { page, revision }: Props = $props();
const revisionCount = page.revisionHistory?.length || 0;
</script>

<section class="column-s surface p-2">
  <h4 class="title is-3">
    {t('site:page.history.title')}
  </h4>
  <div class="revision-list">
    <a href="/sites/{page.siteKey}/{page.key}/history">
      {revisionCount + 1}
    </a>
    <span class="downscaled">
      {toDisplayString(page.updatedAt)}
    </span>
    <span class="downscaled text-right">
      <ProfileLink uid={`${page.owners[0]}`} />
    </span>
    {#each Array(revisionCount) as _, i}
      {@const rev = revisionCount - i}
        {#if rev === revision}
      <span class="current">
        {rev}
      </span>
        {:else}
      <a href="/sites/{page.siteKey}/{page.key}/history?revision={rev}">
        {rev} 
      </a>
        {/if}
      <span class="downscaled">
        {toDisplayString(page.revisionHistory?.[rev - 1]?.createdAt)}
      </span>
      <span class="downscaled text-right">
        <ProfileLink uid={`${page.revisionHistory?.[rev - 1]?.author}`} />
      </span>
    {/each}
  </div>
</section>

<style>
.revision-list {
  display: grid;
  grid-template-columns: calc(var(--cn-grid) * 4) 1fr 1fr;
}
</style>