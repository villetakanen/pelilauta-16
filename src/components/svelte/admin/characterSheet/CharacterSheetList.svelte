<script lang="ts">
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { CHARACTER_SHEETS_COLLECTION_NAME } from '@schemas/CharacterSheetSchema';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import { systemToNoun } from '@utils/schemaHelpers';
import { createCharacterSheet } from './characterSheetStore';

let characterSheets = $state<CharacterSheet[]>([]);
let loading = $state(true);
let creating = $state(false);

// Load character sheets on mount
$effect(() => {
  loadCharacterSheets();
});

async function loadCharacterSheets() {
  try {
    const { getFirestore, collection, getDocs } = await import(
      'firebase/firestore'
    );
    const { CharacterSheetSchema } = await import(
      '@schemas/CharacterSheetSchema'
    );
    const db = getFirestore();
    const snapshot = await getDocs(
      collection(db, CHARACTER_SHEETS_COLLECTION_NAME),
    );

    characterSheets = snapshot.docs.map((doc) => {
      const rawData = { key: doc.id, ...doc.data() };
      // Validate and parse the data with the schema
      return CharacterSheetSchema.parse({
        ...rawData,
        key: doc.id,
      });
    });

    logDebug('CharacterSheetList', 'Loaded character sheets:', characterSheets);
  } catch (error) {
    logError('CharacterSheetList', 'Failed to load character sheets:', error);
    pushSnack('Failed to load character sheets');
  } finally {
    loading = false;
  }
}

async function handleCreateCharacterSheet() {
  creating = true;

  try {
    const newCharacterSheet = {
      name: 'New Character Sheet Schema',
      system: '-',
      stats: [],
      extras: [],
    };

    const newKey = await createCharacterSheet(newCharacterSheet);

    // Navigate to the new character sheet editor
    window.location.href = `/admin/characterSheet/${newKey}`;

    pushSnack('Character sheet created successfully');
  } catch (error) {
    logError('CharacterSheetList', 'Failed to create character sheet:', error);
    pushSnack('Failed to create character sheet');
  } finally {
    creating = false;
  }
}

async function deleteCharacterSheet(sheetKey: string, sheetName: string) {
  if (
    !confirm(
      `Are you sure you want to delete "${sheetName}"? This cannot be undone.`,
    )
  ) {
    return;
  }

  try {
    const { getFirestore, doc, deleteDoc } = await import('firebase/firestore');
    const db = getFirestore();
    await deleteDoc(doc(db, CHARACTER_SHEETS_COLLECTION_NAME, sheetKey));

    // Reload the list
    await loadCharacterSheets();

    pushSnack('Character sheet deleted successfully');
  } catch (error) {
    logError('CharacterSheetList', 'Failed to delete character sheet:', error);
    pushSnack('Failed to delete character sheet');
  }
}
</script>

<div class="content-columns">
  <section class="column-l">
    <h1>Character Sheets</h1>
    <p>Manage character sheets that contain character information, stats, and abilities.</p>

    <div class="mb-2">
      <button class="button" onclick={handleCreateCharacterSheet} disabled={creating}>
        {creating ? 'Creating...' : 'Create New Character Sheet'}
      </button>
    </div>

    {#if loading}
      <div class="p-4 text-center">
        <p>Loading character sheets...</p>
      </div>
    {:else if characterSheets.length === 0}
      <div class="surface p-4 text-center">
        <h2 class="mb-2">No Character Sheets Found</h2>
      </div>
    {:else}
      <div class="grid gap-3 mt-2" style="grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));">
        {#each characterSheets as characterSheet}
          <div class="elevation-1 p-2 border-radius">

              <h3 class="mb-1">
                <cn-icon noun={systemToNoun(characterSheet.system)}></cn-icon>
                <a href={`/admin/characterSheet/${characterSheet.key}`} class="text-accent">
                  {characterSheet.name || 'Unnamed Sheet Schema'}
                </a>
              </h3>
 
           

            <div class="mb-3">
              <div class="flex gap-4 mb-2">
                <div class="downscaled">
                  <strong>{characterSheet.stats?.length || 0}</strong> stats
                </div>
                <div class="downscaled">
                  <strong>{characterSheet.extras?.length || 0}</strong> features
                </div>
              </div>

              
            </div>

            <div class="toolbar">
              <a href={`/admin/sheets/${characterSheet.key}`} class="button">
                Edit
              </a>
              <button 
                onclick={() => deleteCharacterSheet(characterSheet.key, characterSheet.name)}
                class="button text-error"
              >
                Delete
              </button>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </section>
</div>


