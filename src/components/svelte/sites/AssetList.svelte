<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { site } from '@stores/site';
import { t } from '@utils/i18n';
import AssetArticle from './AssetArticle.svelte';

type Props = {
  site: Site;
};
const { site: ssrSite }: Props = $props();
$site = ssrSite;

const assets = $derived.by(() => {
  return $site.assets || [];
});
</script>

<div class="content-columns">
  <section class="column-l surface p-2">
    <h1>{t('site:assets.title')}</h1>
    <p>{t('site:assets.description')}</p>

    {#each assets as asset}
      <AssetArticle {asset} site={$site}/>
    {/each}
      
  </section>
</div>
