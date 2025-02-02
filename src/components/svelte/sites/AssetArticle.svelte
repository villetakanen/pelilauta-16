<script lang="ts">
import { deleteSiteAsset } from '@firebase/client/site/deleteSiteFromAssets';
import type { Asset } from '@schemas/AssetSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { t } from '@utils/i18n';

type Props = {
  asset: Asset;
  site: Site;
};
const { asset, site }: Props = $props();
const showActions = $derived.by(() => {
  return site.owners.includes($uid);
});

async function deleteAsset() {
  deleteSiteAsset(site, `${asset.storagePath}`);
}
</script>

<article class="asset">
  {#if asset.mimetype?.includes('image')}
    <img src={asset.url} alt={asset.name} />
  {:else if asset.mimetype?.includes('/pdf')}
    <cn-icon noun="pdf"></cn-icon>
  {:else}
    <cn-icon noun="assets"></cn-icon>
  {/if}
  <div>
    <p class="m-0">
        <a href={asset.url} target="_blank">{asset.name}</a>
    </p>
    <p class="downscaled m-0">
      {asset.mimetype} 
      {asset.description}</p>
  </div>
  <div class="flex m-0 p-0">
    {#if showActions}
    <a
      aria-label={t('actions:edit')}
      href={`/sites/${site?.key}/assets/${asset.name}`}
      class="button"
      >
      <cn-icon noun="edit"></cn-icon>
    </a>
    <button 
      onclick={deleteAsset}
      aria-label={t('actions:delete')}
      onkeydown={(e) => e.key === 'Enter' && deleteAsset()}
      type="button">
      <cn-icon noun="delete"></cn-icon>
    </button>
    {/if}
  </div>
</article>

<style>
.asset {
  display: grid;
  gap: var(--cn-gap);
  grid-template-columns: calc(8 * var(--cn-grid)) 1fr calc(12 * var(--cn-grid));
  margin-bottom: var(--cn-gap);
}
.asset img {
  max-height: calc(8 * var(--cn-grid));
  justify-self: center;
}
.asset > cn-icon {
  justify-self: center;
}
</style>


