<script lang="ts">
import WithLoader from '@svelte/app/WithLoader.svelte';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { logDebug, logError } from '@utils/logHelpers';
import { onMount } from 'svelte';
import {
  clearCurrentSheet,
  currentSheet,
  loadCurrentSheet,
  isLoadingSheet as loading,
  saveCurrentSheet,
  updateCurrentSheetField,
} from './characterSheetStore';

interface Props {
  sheetKey: string;
}
const { sheetKey }: Props = $props();

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

function addStat() {
  const stats = $currentSheet?.stats ? [...$currentSheet.stats] : [];
  stats.push({ key: '', description: '' });
  updateCurrentSheetField('stats', stats);
}

function updateStat(
  index: number,
  field: 'key' | 'description',
  value: string,
) {
  if (!$currentSheet?.stats) return;
  const stats = [...$currentSheet.stats];
  stats[index] = { ...stats[index], [field]: value };
  updateCurrentSheetField('stats', stats);
}

function removeStat(index: number) {
  if (!$currentSheet?.stats) return;
  const stats = [...$currentSheet.stats];
  stats.splice(index, 1);
  updateCurrentSheetField('stats', stats);
}

onMount(() => {
  loadCurrentSheet(sheetKey);

  // Clear the current sheet when component unmounts
  return () => {
    clearCurrentSheet();
  };
});
</script>
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
          <button type="submit" class="button primary" disabled={$loading}>
            {#if $loading} Saving... {:else} Save {/if}
          </button>
        </div>        
      </form>
      {:else}
        <p>Sheet not found</p>
      {/if}
    </WithLoader>
  </section>
  <section class="column-l">
    <WithLoader loading={$loading}>
      {#if $currentSheet}
        <form onsubmit={saveSheet}>
          <fieldset class="border-radius px-2 mt-2">
          <legend>Character Stats</legend>
            {#if $currentSheet.stats && $currentSheet.stats.length > 0}
              {#each $currentSheet.stats as stat, i}
                <div class="flex gap-2 mb-2">
                  <label class="grow">
                    Name:
                    <input 
                      type="text" 
                      placeholder="Stat name (e.g., strength)"
                      value={stat.key}
                      oninput={(e) => updateStat(i, 'key', (e.target as HTMLInputElement).value)}
                    />
                  </label>
                  <label class="grow">
                    Description:
                    <input 
                      type="text" 
                      placeholder="Stat description"
                      value={stat.description || ''}
                      oninput={(e) => updateStat(i, 'description', (e.target as HTMLInputElement).value)}
                    />
                  </label>
                  <button 
                    aria-label="Remove Stat"
                    type="button" class="button flex-none text" onclick={() => removeStat(i)}>
                    <cn-icon noun="delete"></cn-icon>
                  </button>
              </div>
            {/each}
          {:else}
            <p class="text-low">No stats defined yet.</p>
          {/if}
          <div class="toolbar justify-end mb-2">
           
            <button type="button" class="button secondary" onclick={addStat}>
              Add Stat
            </button>
            <button type="submit" class="button primary" disabled={$loading}>
              {#if $loading} Saving... {:else} Save {/if}
            </button>
          </div>
        </fieldset>'
      </form>
      {:else}
        <p>Sheet not found</p>
      {/if}
    </WithLoader>
  </section>
</div>