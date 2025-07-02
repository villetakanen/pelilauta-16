<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import { onMount } from 'svelte';
import { builder } from './builderStore';

let saving = $state(false);
let loadingSheets = $state(false);
let formData = $state<Partial<CharacterBuilder>>({});
let characterSheets = $state<CharacterSheet[]>([]);

let formDataInitialized = $state(false);

$effect(() => {
  // When the builder from the store changes, update our local form data
  if ($builder && !formDataInitialized) {
    formData = {
      name: $builder.name,
      description: $builder.description,
      system: $builder.system,
      characterSheetKey: $builder.characterSheetKey,
    };
    formDataInitialized = true;
  }
});

async function loadCharacterSheets() {
  loadingSheets = true;
  try {
    const { getAllCharacterSheets } = await import(
      '../admin/characterSheet/characterSheetStore'
    );
    characterSheets = await getAllCharacterSheets();
  } catch (error) {
    logError('BuilderInfoForm', 'Failed to load character sheets:', error);
    pushSnack('Failed to load character sheets');
  } finally {
    loadingSheets = false;
  }
}

onMount(() => {
  loadCharacterSheets();
});

function setSystem(system: string) {
  formData.system = system;
}

function setSheetBuilder(sheetBuilderKey: string) {
  formData.characterSheetKey = sheetBuilderKey;
}

function handleSheetChange(event: Event) {
  const target = event.target as HTMLSelectElement;
  logDebug('BuilderInfoForm', 'Character sheet changed:', target.value);
  formData.characterSheetKey = target.value;
}

const hasChanges = $derived.by(() => {
  if (!$builder) return false;

  // Check if any of the form fields have changed
  return (
    formData.name !== $builder.name ||
    formData.description !== $builder.description ||
    formData.system !== $builder.system ||
    formData.characterSheetKey !== $builder.characterSheetKey
  );
});

async function handleSubmit(event: Event) {
  event.preventDefault();
  if (saving || !$builder) return;

  saving = true;

  try {
    const { updateBuilder } = await import(
      '@firebase/client/builders/updateBuilder'
    );
    const updatePayload = {
      key: $builder.key,
      name: formData.name,
      description: formData.description,
      system: formData.system,
      characterSheetKey: formData.characterSheetKey,
    };
    logDebug('BuilderInfoForm', 'Saving builder info', updatePayload);

    // Use merge to only update the fields we're editing in this form
    await updateBuilder(
      updatePayload,
      false, // Not silent - this is a user action
    );

    pushSnack(t('characters:builder.snacks.saved'));
  } catch (error) {
    logError('BuilderInfoForm', 'Failed to save builder info:', error);
    pushSnack(t('characters:builder.snacks.saveError'));
  } finally {
    saving = false;
  }
}
</script>

<form onsubmit={handleSubmit}>
  {#if $builder}
  <h2 class="m-0">{t('characters:builder.editor.info.title')}</h2>
  <fieldset class="elevation-1 border-radius px-2">
  
    <label class="grow">
      {t('characters:builder.fields.name')}
      <input type="text" bind:value={formData.name} placeholder={t('characters:builder.fields.namePlaceholder')} required />
    </label>
    <SystemSelect system={formData.system} {setSystem} />
  
    <label>
      {t('characters:builder.fields.characterSheet')}
      <select value={formData.characterSheetKey} onchange={handleSheetChange} disabled={loadingSheets}>
        <option value="">Select a character sheet...</option>
        {#if loadingSheets}
          <option disabled>Loading sheets...</option>
        {:else}
          {#each characterSheets as sheet}
            <option value={sheet.key}>{sheet.name} ({sheet.system})</option>
          {/each}
        {/if}
      </select>
    </label>
  
    <label>
        {t('characters:builder.fields.description')}
        <textarea rows="3"
          bind:value={formData.description} 
          placeholder={t('characters:builder.fields.descriptionPlaceholder')}></textarea>
    </label>
  </fieldset>  
  <div class="toolbar justify-end">
    <button type="submit" class="button primary" disabled={saving || !hasChanges}>
      {saving ? t('actions:saving') : t('actions:save')}
    </button>
  </div>
  {:else}
    <p>{t('characters:builder.editor.info.noBuilder')}</p>
  {/if}
</form>

