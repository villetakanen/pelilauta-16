<script lang="ts">
import type { Handout } from '@schemas/HandoutSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { site } from '@stores/site';
import UserSelect from '@svelte/app/UserSelect.svelte';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

interface Props {
  site: Site;
  handout: Handout;
}
const { site: initialSite, handout }: Props = $props();
let newReader = $state('');

/**
 * Handout Metadata editor
 */
const visible = $derived.by(() => {
  if ($site?.owners?.includes($uid)) return true;
  return false;
});

$site = initialSite;

function onUserSelect(e: Event) {
  const target = e.target as HTMLSelectElement;
  newReader = target.value;
}

async function onSubmit(e: Event) {
  e.preventDefault();
  logDebug('HandoutMeta.onSubmit', handout, newReader);
}
</script>

{#if visible}
  <section class="surface p-1">
    <h3>{t('site:handouts.metadata.title')}</h3>
    {#if handout.readers?.length }
      <ul>
        {#each handout.readers as reader}
          <li>{reader}</li>  
        {/each}
      </ul>
    {/if}

    <form onsubmit={onSubmit}>
      <h4>{t('sites:handouts.add.reader')}</h4>
      <UserSelect 
        value=''
        onchange={onUserSelect}
        label={t('sites:handouts.add.reader')}/>
      <button type="submit">{t('actions:add')}</button>
    </form>

  </section>
{/if}

