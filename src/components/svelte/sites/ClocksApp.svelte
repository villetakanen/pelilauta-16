<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import StoryClock from './Clock.svelte';
import { clocks, loading } from './clocksStore';
import { site } from './siteStore';

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;
const empty = $derived.by(() => {
  return !$loading && $clocks.length === 0;
});
</script>

<div class="content-columns">
  <article class="column-l">
    <h2>{t('site:clocks.title')}</h2>
    <ul>
      {#each $clocks as clock, i}
        <StoryClock {clock} />
      {/each}
    </ul>
    {#if empty}
      <p>{t('site:clocks.empty')}</p>
    {/if}
  </article>
</div>