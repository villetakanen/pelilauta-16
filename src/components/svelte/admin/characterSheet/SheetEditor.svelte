<script lang="ts">
import { logDebug, logError, logWarn } from '@utils/logHelpers';
import { onMount } from 'svelte';
import {
  clearCurrentSheet,
  currentSheet,
  isLoadingSheet,
  loadCurrentSheet,
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

onMount(() => {
  loadCurrentSheet(sheetKey);

  // Clear the current sheet when component unmounts
  return () => {
    clearCurrentSheet();
  };
});
</script>
<div class="content-columns">
  <section>
    <h1>Character Sheet Editor</h1>
    <p>Editing sheet: {sheetKey}</p>

    {#if $isLoadingSheet}
      <p>Loading sheet...</p>
    {:else if $currentSheet}
      <form onsubmit={saveSheet}>
        <label>
          Name:
          <input 
            type="text" 
            value={$currentSheet.name}
            oninput={(e) => {
              const target = e.target as HTMLInputElement;
              updateCurrentSheetField('name', target.value);
            }}
          />
        </label>
        <br />
        <label>
          System:
          <input 
            type="text" 
            value={$currentSheet.system}
            oninput={(e) => {
              const target = e.target as HTMLInputElement;
              updateCurrentSheetField('system', target.value);
            }}
          />
        </label>
        <br />
        <button type="submit">Save</button>
      </form>
    {:else}
      <p>Sheet not found.</p>
    {/if}
  </section>
</div>