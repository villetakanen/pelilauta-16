<script lang="ts">
import type { Handout } from '@schemas/HandoutSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { site } from '@stores/site';
import { update } from '@stores/site/handouts';
import UserSelect from '@svelte/app/UserSelect.svelte';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

interface Props {
  site: Site;
  handout: Handout;
}
const { site: initialSite, handout }: Props = $props();
let newReader = $state('');
let readers = $state(handout.readers ?? new Array<string>());

/**
 * Handout Metadata editor
 */
const visible = $derived.by(() => {
  if ($site?.owners?.includes($uid)) return true;
  return false;
});
const omit = $derived.by(() => {
  const omitted = new Set($site?.owners);
  for (const reader of readers ?? []) {
    omitted.add(reader);
  }
  return Array.from(omitted);
});

$site = initialSite;

function onUserSelect(e: Event) {
  const target = e.target as HTMLSelectElement;
  newReader = target.value;
}

async function onSubmit(e: Event) {
  e.preventDefault();
  logDebug('HandoutMeta.onSubmit', newReader);
  const r = new Set(handout.readers ?? []);
  r.add(newReader);
  await update({
    ...handout,
    readers: Array.from(r),
  });
  readers = Array.from(r);
}
</script>

{#if visible}
  <section class="surface p-1">
    <h3>{t('site:handouts.metadata.title')}</h3>
    {#if readers?.length }
      <ul>
        {#each readers as reader}
          <li>{reader}</li>  
        {/each}
      </ul>
    {/if}

    <form onsubmit={onSubmit}>
      <h4>{t('sites:handouts.add.reader')}</h4>
      <UserSelect 
        value=''
        {omit}
        onchange={onUserSelect}
        label={t('sites:handouts.add.reader')}/>
      <button type="submit">{t('actions:add')}</button>
    </form>

  </section>
{/if}

