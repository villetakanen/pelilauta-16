<script lang="ts">
import type { CyanToggleButton } from '@11thdeg/cyan-next';
import { uid } from '@stores/sessionStore';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import UserSelect from '@svelte/app/UserSelect.svelte';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { site, update } from './siteStore';

let selectedUid = $state('-');
let usePlayers = $state($site?.usePlayers ?? false);
const listedPlayers = $derived.by(() => {
  // Return all players, who are not in the owners list
  return (
    $site?.players?.filter((player) => !$site.owners?.includes(player)) ?? []
  );
});

function addPlayer(event: Event) {
  event.preventDefault();
  if (!$site || !selectedUid || $site.players?.includes(selectedUid)) {
    return;
  }
  const newPlayers = $site.players
    ? [...$site.players, selectedUid]
    : [selectedUid];
  update({ players: newPlayers });
}

function dropPlayer(playerUid: string) {
  if (!$site || !playerUid || !$site.players?.includes(selectedUid)) {
    return;
  }
  const newPlayers = $site.players.filter((id) => id !== playerUid);
  update({ players: newPlayers });
}

function setSelectedUid(e: Event) {
  selectedUid = (e.target as HTMLSelectElement).value;
}

function setUsePlayers(e: Event) {
  logDebug('setUsePlayers', (e.target as CyanToggleButton).pressed);
  usePlayers = (e.target as CyanToggleButton).pressed;
  update({ usePlayers });
}
</script>

<div>
  <h2>{t('site:players.title')}</h2>
  <p class="downscaled">{t('site:players.description')}</p>

  <cn-toggle-button
    label={t('site:players.usePlayers')}
    pressed={usePlayers}
    onchange={setUsePlayers}
  ></cn-toggle-button>

{#if $site && $site.usePlayers}
{#if $site.players?.length}

{#each listedPlayers as player}
  <div class="toolbar">
    <ProfileLink uid={player} />
    <button
      aria-label={t('actions:remove')}
      type="button"
      disabled={$uid === player}
      onclick={() => dropPlayer(player)}>
      <cn-icon noun="delete"></cn-icon>
    </button>
  </div>
{/each}

<hr>
{/if}

<form onsubmit={addPlayer} class="toolbar">
  <UserSelect
    omit={[...$site.owners, ...$site.players ?? []]}
    label={t('site:players.add')}
    value={selectedUid}
    onchange={setSelectedUid}
  />
  <button type="submit">{t('actions:add')}</button>
</form>

{/if}
</div>