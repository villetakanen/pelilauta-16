<script lang="ts">
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { t } from '@utils/i18n';
import type { CharacterBuilder } from '../../../schemas/CharacterBuilderSchema';

interface Props {
  builder: CharacterBuilder;
}
const { builder }: Props = $props();
</script>

<form>
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
    <button type="submit" class="button primary">
      {t('actions:save')}
    </button>
  </div>
</form>

