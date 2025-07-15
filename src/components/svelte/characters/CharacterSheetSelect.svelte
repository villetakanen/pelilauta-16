<script lang="ts">
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { CHARACTER_SHEETS_COLLECTION_NAME } from '@schemas/CharacterSheetSchema';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';

interface Props {
  selectedSheetKey?: string;
  setSelectedSheet: (sheetKey: string, sheet: CharacterSheet | null) => void;
}

const { selectedSheetKey, setSelectedSheet }: Props = $props();

let characterSheets: CharacterSheet[] = $state([]);
let loading = $state(true);

// Load available character sheets on mount
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
      return CharacterSheetSchema.parse({
        ...rawData,
        key: doc.id,
      });
    });

    logDebug(
      'CharacterSheetSelect',
      'Loaded character sheets:',
      characterSheets,
    );
  } catch (error) {
    logError('CharacterSheetSelect', 'Failed to load character sheets:', error);
  } finally {
    loading = false;
  }
}

function handleSelectionChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const selectedKey = select.value;

  if (selectedKey === '') {
    setSelectedSheet('', null);
    return;
  }

  const selectedSheet =
    characterSheets.find((sheet) => sheet.key === selectedKey) || null;
  setSelectedSheet(selectedKey, selectedSheet);
}
</script>

<label>
  {t('characters:sheets.select.label')}
  <select
    value={selectedSheetKey || ''}
    onchange={handleSelectionChange}
    disabled={loading}
  >
    <option value="">{loading ? t('actions:loading') : t('characters:create.noSheet')}</option>
    {#each characterSheets as sheet}
      <option value={sheet.key}>{sheet.name} ({sheet.system})</option>
    {/each}
  </select>
</label>

{#if loading}
  <p class="downscaled text-low">{t('characters:sheets.select.loading')}</p>
{:else if characterSheets.length === 0}
  <p class="downscaled text-low">{t('characters:sheets.select.empty')}</p>
{/if}
