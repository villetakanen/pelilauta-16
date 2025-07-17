<script lang="ts">
/*
 * A microfrontend/app for displaying a character's details with auto-updating.
 *
 * This component subscribes to a character's data and mounts the components
 * to display and interact with the character.
 */
import { character, subscribe } from '@stores/characters/characterStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import CharacterInfo from './CharacterInfo.svelte';
import StatBlock from './StatBlock.svelte';

interface Props {
  characterKey: string;
}

const { characterKey }: Props = $props();
const statBlocks = $derived.by(() => {
  return $character?.sheet?.statGroups || [];
});

$effect(() => {
  logDebug('CharacterApp', 'Subscribing to character:', characterKey);
  subscribe(characterKey);
});
</script>

<div class="content-columns">
  <div class="column-s">
    <CharacterInfo />
  </div>

  {#each statBlocks as group}
    <StatBlock {group} />
  {/each}

  {#if !$character}
    <section class="debug column-s">
      {t('character:snacks:characterNotFound')}
    </section>
  {/if}

  <section class="debug column-s">
    {characterKey}
  </section>
</div>