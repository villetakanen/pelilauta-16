<script lang="ts">
import type { CyanToggleButton } from '@11thdeg/cyan-next';
import { updateSite } from '@firebase/client/site/updateSite';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/sessionStore';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import UserSelect from '@svelte/app/UserSelect.svelte';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

/**
 * This is a svelte port of the SiteMembersApp solid-js component.
 */
interface Props {
  site: Site;
}
const { site }: Props = $props();
let players = $state(site.players);
let selectedUid = $state('-');
let usePlayers = $state(site.usePlayers ?? false);

function addPlayer(event: Event) {
  event.preventDefault();

  if (players?.includes(selectedUid)) {
    return;
  }
  const newPlayers = players ? [...players, selectedUid] : [selectedUid];
  const newSite = { ...site, players: newPlayers };

  updateSite(newSite, true);
  players = newPlayers;
}

function dropPlayer(playerUid: string) {
  if (!players) {
    // nothing to do
    return;
  }
  const newPlayers = players.filter((id) => id !== playerUid);
  const newSite = { ...site, players: newPlayers };

  updateSite(newSite, true);
  players = newPlayers;
}

function setSelectedUid(e: Event) {
  selectedUid = (e.target as HTMLSelectElement).value;
}

function setUsePlayers(e: Event) {
  logDebug('setUsePlayers', (e.target as CyanToggleButton).pressed);
  usePlayers = (e.target as CyanToggleButton).pressed;
  const newSite = { ...site, usePlayers };
  updateSite(newSite, true);
}
</script>

<h2>{t('site:players.title')}</h2>

<p class="downscaled">{t('site:players.description')}</p>

<cn-toggle-button
  label={t('site:players.usePlayers')}
  pressed={usePlayers}
  onchange={setUsePlayers}
></cn-toggle-button>

{#if usePlayers}
{#if players?.length}

{#each players as owner}
  <div class="toolbar">
    <ProfileLink uid={owner} />
    <button
      aria-label={t('actions:remove')}
      type="button"
      disabled={$uid === owner}
      onclick={() => dropPlayer(owner)}>
      <cn-icon noun="delete"></cn-icon>
    </button>
  </div>
{/each}

<hr>
{/if}

<form onsubmit={addPlayer} class="toolbar">
  <UserSelect
    label={t('site:players.add')}
    value={selectedUid}
    onchange={setSelectedUid}
  />
  <button type="submit">{t('actions:add')}</button>
</form>

{/if}