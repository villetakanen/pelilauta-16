<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import { builder } from './builderStore';

let saving = $state(false);
let formData = $state<Partial<CharacterBuilder>>({});

$effect(() => {
  // When the builder from the store changes, update our local form data
  if ($builder) {
    formData = {
      name: $builder.name,
      description: $builder.description,
      system: $builder.system,
    };
  }
});

function setSystem(system: string) {
  formData.system = system;
}

const hasChanges = $derived.by(() => {
  if (!$builder) return false;

  // Check if any of the form fields have changed
  return (
    formData.name !== $builder.name ||
    formData.description !== $builder.description ||
    formData.system !== $builder.system
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

