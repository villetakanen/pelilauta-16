<script lang="ts">
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import WithLoader from '@svelte/app/WithLoader.svelte';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { logDebug, logError } from '@utils/logHelpers';
import { onMount } from 'svelte';
import CharacterStatsForm from './CharacterStatsForm.svelte';
import StatGroupsForm from './StatGroupsForm.svelte';
import {
  clearCurrentSheet,
  currentSheet,
  isSheetDirty,
  loadCurrentSheet,
  isLoadingSheet as loading,
  saveCurrentSheet,
  updateCurrentSheetField,
} from './characterSheetStore';

interface Props {
  sheetKey: string;
}
const { sheetKey }: Props = $props();
const allow = $derived.by(() => $appMeta.admins.includes($uid));

async function saveSheet(e: Event) {
  e.preventDefault();
  try {
    await saveCurrentSheet();
    logDebug('SheetEditor', 'Sheet saved successfully');
  } catch (error) {
    logError('SheetEditor', 'Error saving sheet:', error);
  }
}

function setSystem(system: string) {
  updateCurrentSheetField('system', system);
}

onMount(() => {
  loadCurrentSheet(sheetKey);

  // Clear the current sheet when component unmounts
  return () => {
    clearCurrentSheet();
  };
});
</script>
<WithAuth {allow}>

<div class="content-columns">
  <section class="column-s">
    <h1>Character Sheet</h1>
    <p class="downscaled text-low">
      This is a mod/admin only character sheet editor. These character sheets provide the internal schema for user interfaces and character management in the game.
    </p>
  </section>

  <section>
    <WithLoader loading={$loading}>
      {#if $currentSheet}
      <form onsubmit={saveSheet}>
        <fieldset class="border-radius px-2">
          <label class="grow">
            Name:
            <input 
              type="text" 
              bind:value={$currentSheet.name} 
              placeholder="Enter sheet name"
              required
            />
          </label>
          <SystemSelect system={$currentSheet.system} {setSystem} />
        </fieldset>
        <div class="toolbar">
          <button type="submit" class="button primary" disabled={$loading || !$isSheetDirty}>
            <cn-icon noun="save"></cn-icon>
            <span>
              {#if $loading} Saving... {:else} Save {/if}
            </span>
          </button>
        </div>        
      </form>
      
      <StatGroupsForm />
      
      {:else}
        <p>Sheet not found</p>
      {/if}
    </WithLoader>
  </section>
  <section class="column-l">
    <WithLoader loading={$loading}>
      {#if $currentSheet}
        <CharacterStatsForm />
      {:else}
        <p>Sheet not found</p>
      {/if}
    </WithLoader>
  </section>
</div>
</WithAuth>