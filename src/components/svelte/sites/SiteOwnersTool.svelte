<script lang="ts">
import { SITES_COLLECTION_NAME, type Site } from '@schemas/SiteSchema';
import { uid } from '@stores/sessionStore';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import UserSelect from '@svelte/app/UserSelect.svelte';
import { t } from '@utils/i18n';

/**
 * This is a svelte port of the SiteMembersApp solid-js component.
 */
interface Props {
  site: Site;
}
const { site }: Props = $props();
let owners = $state(site.owners);
let selectedUid = $state('-');

async function dropOwner(ownerUid: string) {
  const newOwners = owners.filter((id) => id !== ownerUid);

  const { getFirestore, doc, updateDoc } = await import('firebase/firestore');

  await updateDoc(doc(getFirestore(), SITES_COLLECTION_NAME, site.key), {
    owners: newOwners,
  });
  owners = newOwners;
}

async function addOwner(event: Event) {
  event.preventDefault();

  if (owners.includes(selectedUid)) {
    return;
  }

  const newOwners = [...owners, selectedUid];

  const { getFirestore, doc, updateDoc } = await import('firebase/firestore');

  await updateDoc(doc(getFirestore(), SITES_COLLECTION_NAME, site.key), {
    owners: newOwners,
  });
  owners = newOwners;
}

function setSelectedUid(e: Event) {
  selectedUid = (e.target as HTMLSelectElement).value;
}
</script>

<h2>{t('site:owners.title')}</h2>

<p class="downscaled">{t('site:owners.description')}</p>

{#each owners as owner}
  <div class="toolbar">
    <ProfileLink uid={owner} />
    <button
      aria-label={t('actions:remove')}
      type="button"
      disabled={$uid === owner}
      onclick={() => dropOwner(owner)}>
      <cn-icon noun="delete"></cn-icon>
    </button>
  </div>
{/each}

<hr>

<form onsubmit={addOwner} class="toolbar">
  <UserSelect
    label={t('site:owners.add')}
    value={selectedUid}
    onchange={setSelectedUid}
  />
  <button type="submit">{t('actions:add')}</button>
</form>
