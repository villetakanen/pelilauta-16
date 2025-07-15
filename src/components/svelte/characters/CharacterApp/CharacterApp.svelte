<script lang="ts">
/*
 * A microfrontend/app for displaying a character's details with auto-updating.
 *
 * This component subscribes to a character's data and mounts the components
 * to display and interact with the character.
 */
import { subscribe } from '@stores/characters/characterStore';
import { logDebug } from '@utils/logHelpers';
import CharacterInfo from './CharacterInfo.svelte';

interface Props {
  characterKey: string;
}

const { characterKey }: Props = $props();

$effect(() => {
  logDebug('CharacterApp', 'Subscribing to character:', characterKey);
  subscribe(characterKey);
});
</script>

<div class="content-columns">
  <CharacterInfo />
  <section class="debug column-s">
    {characterKey}
  </section>
</div>