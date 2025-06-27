<script lang="ts">
import { updateBuilder } from '@firebase/client/builders/updateBuilder';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import { builder } from './builderStore';

let saving = $state(false);

function setSystem(system: string) {
  if (!$builder) return;
  builder.set({
    ...$builder,
    system: system,
  });
}

async function handleSubmit(event: Event) {
  event.preventDefault();
  if (saving) return;

  const currentBuilder = $builder;
  if (!currentBuilder) return;

  saving = true;

  try {
    logDebug('BuilderInfoForm', 'Saving builder info', {
      key: currentBuilder.key,
      name: currentBuilder.name,
      description: currentBuilder.description,
      system: currentBuilder.system,
    });

    // Use merge to only update the fields we're editing in this form
    await updateBuilder(
      {
        key: currentBuilder.key,
        name: currentBuilder.name,
        description: currentBuilder.description,
        system: currentBuilder.system,
      },
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
  <div class="toolbar px-0">
    <label class="grow">
      {t('characters:builder.fields.name')}
      <input type="text" bind:value={$builder.name} placeholder={t('characters:builder.fields.namePlaceholder')} required />
    </label>
    <SystemSelect system={$builder.system} {setSystem} />
  </div>
    <label>
        {t('characters:builder.fields.description')}
        <textarea rows="3"
          bind:value={$builder.description} 
          placeholder={t('characters:builder.fields.descriptionPlaceholder')}></textarea>
    </label>
  </fieldset>  
  <div class="toolbar justify-end">
    <button type="submit" class="button primary" disabled={saving}>
      {saving ? t('actions:saving') : t('actions:save')}
    </button>
  </div>
  {:else}
    <p>{t('characters:builder.editor.info.noBuilder')}</p>
  {/if}
</form>

