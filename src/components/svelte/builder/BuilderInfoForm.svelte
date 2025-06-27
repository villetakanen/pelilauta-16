<script lang="ts">
import { updateBuilder } from '@firebase/client/builders/updateBuilder';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logDebug, logError } from '@utils/logHelpers';
import type { CharacterBuilder } from '../../../schemas/CharacterBuilderSchema';

interface Props {
  builder: CharacterBuilder;
}
const { builder }: Props = $props();

let saving = $state(false);

async function handleSubmit(event: Event) {
  event.preventDefault();
  if (saving) return;

  saving = true;

  try {
    logDebug('BuilderInfoForm', 'Saving builder info', {
      key: builder.key,
      name: builder.name,
      description: builder.description,
      system: builder.system,
    });

    // Use merge to only update the fields we're editing in this form
    await updateBuilder(
      {
        key: builder.key,
        name: builder.name,
        description: builder.description,
        system: builder.system,
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
  <h2 class="m-0">{t('characters:builder.editor.info.title')}</h2>
  <fieldset class="elevation-1 border-radius px-2">
  <div class="toolbar px-0">
    <label class="grow">
      {t('characters:builder.fields.name')}
      <input type="text" bind:value={builder.name} />
    </label>
    <SystemSelect system={builder.system} setSystem={(system: string) => (builder.system = system)} />
  </div>
    <label>
        {t('characters:builder.fields.description')}
        <textarea bind:value={builder.description} rows="3" placeholder={t('characters:builder.fields.descriptionPlaceholder')}></textarea>
    </label>
  </fieldset>  
  <div class="toolbar justify-end">
    <button type="submit" class="button primary" disabled={saving}>
      {saving ? t('actions:saving') : t('actions:save')}
    </button>
  </div>
</form>

