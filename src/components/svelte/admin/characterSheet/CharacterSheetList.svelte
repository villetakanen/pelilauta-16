<script lang="ts">
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { CHARACTER_SHEETS_COLLECTION_NAME } from '@schemas/CharacterSheetSchema';
import { pushSnack } from '@utils/client/snackUtils';
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
    const { db } = await import('@firebase/client');
    const { collection, getDocs } = await import('firebase/firestore');
    const { CharacterSheetSchema } = await import(
      '@schemas/CharacterSheetSchema'
    );

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
    const { db } = await import('@firebase/client');
    const { doc, deleteDoc } = await import('firebase/firestore');
    await deleteDoc(doc(db, CHARACTER_SHEETS_COLLECTION_NAME, sheetKey));

    // Optimistic update: remove from local array for instant UI feedback
    characterSheets = characterSheets.filter((sheet) => sheet.key !== sheetKey);

    pushSnack('Character sheet deleted successfully');
  } catch (error) {
    logError('CharacterSheetList', 'Failed to delete character sheet:', error);
    pushSnack('Failed to delete character sheet');
  }
}
</script>

<section class="content-columns">
  <article class="column-l">
    <h1>Character Sheets</h1>
    <p>Manage character sheets that contain character information, stats, and abilities.</p>

    <div class="mb-2">
      <button class="button" onclick={handleCreateCharacterSheet} disabled={creating}>
        {creating ? 'Creating...' : 'Create New Character Sheet'}
      </button>
    </div>
  </article>
</section>
<section  class="content-cards">
    {#if loading}
      <div class="p-4 text-center">
        <p>Loading character sheets...</p>
      </div>
    {:else if characterSheets.length === 0}
      <div class="surface p-4 text-center">
        <h2 class="mb-2">No Character Sheets Found</h2>
      </div>
    {:else}
        {#each characterSheets as characterSheet}
          <cn-card 
            noun={systemToNoun(characterSheet.system)}
            title={characterSheet.name || 'Unnamed Sheet Schema'}>
            <div class="toolbar" slot="actions">
              <button 
                onclick={() => deleteCharacterSheet(characterSheet.key, characterSheet.name)}
                class="button text"
                aria-label="Delete Character Sheet"
              >
                <cn-icon noun="delete"></cn-icon>
              </button>
              <a href={`/admin/characterSheet/${characterSheet.key}`} class="button text">
                <cn-icon noun="edit"></cn-icon>
                <span>Edit</span>
              </a>
            </div>
          </cn-card>
        {/each}
    {/if}
  </section>


