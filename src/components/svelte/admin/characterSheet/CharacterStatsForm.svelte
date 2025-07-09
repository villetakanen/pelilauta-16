<script lang="ts">
import type { CharacterStat } from '@schemas/CharacterSheetSchema';
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
  field: 'key' | 'description' | 'group',
  value: string,
) {
  if (!$currentSheet?.stats) return;
  const stats = [...$currentSheet.stats];
  if (field === 'group') {
    stats[index] = {
      ...stats[index],
      [field]: value === '' ? undefined : value,
    };
  } else {
    stats[index] = { ...stats[index], [field]: value };
  }
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

// Group stats by their group property
const groupedStats = $derived.by(() => {
  if (!$currentSheet?.stats) return { grouped: {}, ungrouped: [] };

  const grouped: Record<
    string,
    Array<{ stat: CharacterStat; index: number }>
  > = {};
  const ungrouped: Array<{ stat: CharacterStat; index: number }> = [];

  $currentSheet.stats.forEach((stat, index) => {
    if (stat.group && $currentSheet?.statGroups?.includes(stat.group)) {
      if (!grouped[stat.group]) grouped[stat.group] = [];
      grouped[stat.group].push({ stat, index });
    } else {
      ungrouped.push({ stat, index });
    }
  });

  return { grouped, ungrouped };
});

const availableGroups = $derived.by(() => $currentSheet?.statGroups || []);
</script>

<form onsubmit={saveSheet}>
  <fieldset class="border-radius px-2 mt-2">
    <legend>Character Stats</legend>
    
    {#if $currentSheet?.stats && $currentSheet.stats.length > 0}
      <!-- Grouped Stats -->
      {#each availableGroups as groupName}
        {#if groupedStats.grouped[groupName] && groupedStats.grouped[groupName].length > 0}
          <div class="flex flex-col">
            <h4 class="text-low mb-2">{groupName}</h4>
            {#each groupedStats.grouped[groupName] as { stat, index }}
              <div class="elevation-1 p-1">
              <div class="flex flex-no-wrap m-0">
                <label class="grow">
                  Name:
                  <input 
                    type="text" 
                    placeholder="Stat name (e.g., strength)"
                    value={stat.key}
                    oninput={(e) => updateStat(index, 'key', (e.target as HTMLInputElement).value)}
                  />
                </label>
                <label>
                  Group:
                  <select 
                    value={stat.group || ''}
                    onchange={(e) => updateStat(index, 'group', (e.target as HTMLSelectElement).value)}
                  >
                    <option value="">Ungrouped</option>
                    {#each availableGroups as group}
                      <option value={group}>{group}</option>
                    {/each}
                  </select>
                </label>
                <div class="flex flex-none gap-1">
                  <button 
                    aria-label="Move Stat Up"
                    type="button" 
                    class="button text" 
                    disabled={index === 0}
                    onclick={() => moveStatUp(index)}
                  >
                    <cn-icon noun="arrow-up"></cn-icon>
                  </button>
                  <button 
                    aria-label="Move Stat Down"
                    type="button" 
                    class="button text" 
                    disabled={index === ($currentSheet?.stats?.length || 0) - 1}
                    onclick={() => moveStatDown(index)}
                  >
                    <cn-icon noun="arrow-down"></cn-icon>
                  </button>
                  <button 
                    aria-label="Remove Stat"
                    type="button" 
                    class="button flex-none text" 
                    onclick={() => removeStat(index)}
                  >
                    <cn-icon noun="delete"></cn-icon>
                  </button>
                </div>
                </div>
             
              <label class="m-0 full-width">
                  Description:
                  <input 
                    type="text" 
                    placeholder="Stat description"
                    value={stat.description || ''}
                    oninput={(e) => updateStat(index, 'description', (e.target as HTMLInputElement).value)}
                  />
                </label>
                </div>
            {/each}
          </div>
        {/if}
      {/each}
      
      <!-- Ungrouped Stats -->
      {#if groupedStats.ungrouped.length > 0}
        <div class="mb-4">
          <h4 class="text-low mb-2">Ungrouped</h4>
          {#each groupedStats.ungrouped as { stat, index }}
            <div class="elevation-1 p-1">
              <div class="flex flex-no-wrap m-0">
              <label class="grow">
                Name:
                <input 
                  type="text" 
                  placeholder="Stat name (e.g., strength)"
                  value={stat.key}
                  oninput={(e) => updateStat(index, 'key', (e.target as HTMLInputElement).value)}
                />
              </label>
              <label class="grow">
                Description:
                <input 
                  type="text" 
                  placeholder="Stat description"
                  value={stat.description || ''}
                  oninput={(e) => updateStat(index, 'description', (e.target as HTMLInputElement).value)}
                />
              </label>
              <label>
                Group:
                <select 
                  value={stat.group || ''}
                  onchange={(e) => updateStat(index, 'group', (e.target as HTMLSelectElement).value)}
                >
                  <option value="">Ungrouped</option>
                  {#each availableGroups as group}
                    <option value={group}>{group}</option>
                  {/each}
                </select>
              </label>
              <div class="flex flex-none gap-1">
                <button 
                  aria-label="Move Stat Up"
                  type="button" 
                  class="button text" 
                  disabled={index === 0}
                  onclick={() => moveStatUp(index)}
                >
                  <cn-icon noun="arrow-up"></cn-icon>
                </button>
                <button 
                  aria-label="Move Stat Down"
                  type="button" 
                  class="button text" 
                  disabled={index === ($currentSheet?.stats?.length || 0) - 1}
                  onclick={() => moveStatDown(index)}
                >
                  <cn-icon noun="arrow-down"></cn-icon>
                </button>
                <button 
                  aria-label="Remove Stat"
                  type="button" 
                  class="button flex-none text" 
                  onclick={() => removeStat(index)}
                >
                  <cn-icon noun="delete"></cn-icon>
                </button>
              </div>
            </div>
            </div>
          {/each}
        </div>
      {/if}
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