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
    logDebug('StatGroupsForm', 'Sheet saved successfully');
  } catch (error) {
    logError('StatGroupsForm', 'Error saving sheet:', error);
  }
}

function addGroup() {
  const groups = $currentSheet?.statGroups ? [...$currentSheet.statGroups] : [];
  groups.push('');
  updateCurrentSheetField('statGroups', groups);
}

function updateGroup(index: number, value: string) {
  if (!$currentSheet?.statGroups) return;
  const groups = [...$currentSheet.statGroups];
  groups[index] = value;
  updateCurrentSheetField('statGroups', groups);
}

function removeGroup(index: number) {
  if (!$currentSheet?.statGroups) return;
  const groups = [...$currentSheet.statGroups];
  groups.splice(index, 1);
  updateCurrentSheetField('statGroups', groups);
}

function moveGroupUp(index: number) {
  if (!$currentSheet?.statGroups || index === 0) return;
  const groups = [...$currentSheet.statGroups];
  [groups[index - 1], groups[index]] = [groups[index], groups[index - 1]];
  updateCurrentSheetField('statGroups', groups);
}

function moveGroupDown(index: number) {
  if (
    !$currentSheet?.statGroups ||
    index === $currentSheet.statGroups.length - 1
  )
    return;
  const groups = [...$currentSheet.statGroups];
  [groups[index], groups[index + 1]] = [groups[index + 1], groups[index]];
  updateCurrentSheetField('statGroups', groups);
}
</script>

<form onsubmit={saveSheet}>
  <fieldset class="border-radius px-2 mt-2">
    <legend>Stat Groups</legend>
    <p class="text-low downscaled mb-2">
      Groups are used to organize stats in the character sheet UI. Create groups like "Attributes", "Skills", etc.
    </p>
    
    {#if $currentSheet?.statGroups && $currentSheet.statGroups.length > 0}
      {#each $currentSheet.statGroups as group, i}
        <div class="flex gap-2 mb-2">
          <label class="grow">
            Group Name:
            <input 
              type="text" 
              placeholder="e.g., Attributes, Skills, Combat"
              value={group}
              oninput={(e) => updateGroup(i, (e.target as HTMLInputElement).value)}
              required
            />
          </label>
          <div class="flex flex-none gap-1">
            <button 
              aria-label="Move Group Up"
              type="button" 
              class="button text" 
              disabled={i === 0}
              onclick={() => moveGroupUp(i)}
            >
              <cn-icon noun="arrow-up"></cn-icon>
            </button>
            <button 
              aria-label="Move Group Down"
              type="button" 
              class="button text" 
              disabled={i === ($currentSheet?.statGroups?.length || 0) - 1}
              onclick={() => moveGroupDown(i)}
            >
              <cn-icon noun="arrow-down"></cn-icon>
            </button>
            <button 
              aria-label="Remove Group"
              type="button" 
              class="button flex-none text" 
              onclick={() => removeGroup(i)}
            >
              <cn-icon noun="delete"></cn-icon>
            </button>
          </div>
        </div>
      {/each}
    {:else}
      <p class="text-low">No stat groups defined yet.</p>
    {/if}
    
    <div class="toolbar justify-end mb-2">
      <button type="button" class="text" onclick={addGroup}>
        <cn-icon noun="add"></cn-icon>
        <span>Add Group</span>
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
