<script lang="ts">
import { logDebug, logError } from '@utils/logHelpers';
import {
  currentSheet,
  isSheetDirty,
  isLoadingSheet as loading,
  saveCurrentSheet,
  updateCurrentSheetField,
} from './characterSheetStore';

async function saveSheet(e: Event) {
  e.preventDefault();
  try {
    await saveCurrentSheet();
    logDebug('CharacterStatsForm', 'Sheet saved successfully');
  } catch (error) {
    logError('CharacterStatsForm', 'Error saving sheet:', error);
  }
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

function moveStatUp(index: number) {
  if (!$currentSheet?.stats || index === 0) return;
  const stats = [...$currentSheet.stats];
  [stats[index - 1], stats[index]] = [stats[index], stats[index - 1]];
  updateCurrentSheetField('stats', stats);
}

function moveStatDown(index: number) {
  if (!$currentSheet?.stats || index === $currentSheet.stats.length - 1) return;
  const stats = [...$currentSheet.stats];
  [stats[index], stats[index + 1]] = [stats[index + 1], stats[index]];
  updateCurrentSheetField('stats', stats);
}
</script>

<form onsubmit={saveSheet}>
  <fieldset class="border-radius px-2 mt-2">
    <legend>Character Stats</legend>
    {#if $currentSheet?.stats && $currentSheet.stats.length > 0}
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
          <div class="flex flex-none gap-1">
            <button 
              aria-label="Move Stat Up"
              type="button" 
              class="button text" 
              disabled={i === 0}
              onclick={() => moveStatUp(i)}
            >
              <cn-icon noun="arrow-up"></cn-icon>
            </button>
            <button 
              aria-label="Move Stat Down"
              type="button" 
              class="button text" 
              disabled={i === ($currentSheet?.stats?.length || 0) - 1}
              onclick={() => moveStatDown(i)}
            >
              <cn-icon noun="arrow-down"></cn-icon>
            </button>
            <button 
              aria-label="Remove Stat"
              type="button" 
              class="button flex-none text" 
              onclick={() => removeStat(i)}
            >
              <cn-icon noun="delete"></cn-icon>
            </button>
          </div>
        </div>
      {/each}
    {:else}
      <p class="text-low">No stats defined yet.</p>
    {/if}
    <div class="toolbar justify-end mb-2">
      <button type="button" class="text" onclick={addStat}>
        <cn-icon noun="add"></cn-icon>
        <span>Add Stat</span>
      </button>
      <button type="submit" class="button primary" disabled={$loading || !$isSheetDirty}>
        <cn-icon noun="save"></cn-icon>
        <span>
        {#if $loading} Saving... {:else} Save {/if}
        </span>
      </button>
    </div>
  </fieldset>
</form>