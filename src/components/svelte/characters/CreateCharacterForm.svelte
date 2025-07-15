<script lang="ts">
/**
 * A Simple Svelte component for creating a new character entry to the DB.
 * 1. Choose character sheet (or plain un-sheeted character).
 * 2. Press create.
 */

import type { Character } from '@schemas/CharacterSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { pushSessionSnack, pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';
import CharacterSheetSelect from './CharacterSheetSelect.svelte';

// Data states
const characterData: Partial<Character> = $state({
  name: '',
  description: '',
  owners: [$uid],
});

// UX states
let selectedSheetKey = $state('');
let selectedSheet: CharacterSheet | null = $state(null);

const allow = $derived.by(() => {
  return !!$uid;
});

const valid = $derived.by(() => {
  return characterData.name && characterData.name.length > 0;
});

function setSelectedSheet(sheetKey: string, sheet: CharacterSheet | null) {
  selectedSheetKey = sheetKey;
  selectedSheet = sheet;
}

function setName(e: Event) {
  characterData.name = (e.target as HTMLInputElement).value;
}

function setDescription(e: Event) {
  characterData.description = (e.target as HTMLTextAreaElement).value;
}

async function onsubmit(e: Event) {
  e.preventDefault();

  const { createCharacter } = await import(
    '@firebase/client/characters/createCharacter'
  );

  try {
    const data: Partial<Character> = {
      ...characterData,
      owners: [$uid],
    };
    if (selectedSheet) {
      data.sheet = selectedSheet;
    }

    const key = await createCharacter(data);
    pushSessionSnack(
      t('character:snacks.characterCreated', {
        charactername: `${characterData.name}`,
      }),
    );
    window.location.href = '/library/characters';
  } catch (error) {
    pushSnack(t('character:create.snacks.errorCreatingCharacter'));
    logError('CreateCharacterForm', 'Error creating character:', error);
  }
}
</script>

<WithAuth {allow}>
  <div class="content-columns">
    <section class="column">
      <h1>{t('characters:create.title')}</h1>
      <p class="downscaled">
        {t('characters:create.description')}
        <a href="/docs/characters">{t('actions:learnMore')}</a>
      </p>
      <form onsubmit={onsubmit}>

        <label>
          {t('characters:create.name.label')}
          <input 
            type="text" 
            placeholder={t('characters:create.name.placeholder')} 
            value={characterData.name} 
            oninput={setName} 
            required />
        </label>

        <CharacterSheetSelect 
          {selectedSheetKey}
          {setSelectedSheet}
        />
        
        <div class="toolbar justify-end">
          <a href="/library/characters" class="button text">
            {t('actions:cancel')}
          </a>
          <button 
            type="submit" 
            class="call-to-action">
            {t('actions:create.character')}
          </button>
        </div>

      </form>
      <!--div class="debug">
        <pre>{JSON.stringify({ characterData, selectedSheet }, null, 2)}</pre>
      </div-->    
    </section>
  </div>
</WithAuth>
