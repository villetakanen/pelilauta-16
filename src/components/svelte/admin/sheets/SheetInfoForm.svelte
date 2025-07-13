<script lang="ts">
import { loading, sheet } from '@stores/characters/characterSheetStore';
import SystemSelect from '@svelte/sites/SystemSelect.svelte';
import { t } from '@utils/i18n';

let name = $state('');
let system = $state('');

const dirty = $derived.by(() => {
  return $sheet && ($sheet.name !== name || $sheet.system !== system);
});

$effect(() => {
  // On update of the sheet, override the local state
  if ($sheet) {
    name = $sheet.name;
    system = $sheet.system;
  }
});

async function handleSubmit(event: SubmitEvent) {
  event.preventDefault();
}
</script>

<section class="surface">
  {#if $loading}
    <cn-loader></cn-loader>
  {:else if $sheet}
    <h2 class="downscaled">{t('characters:sheets.editor.info.title')}</h2>

    <fieldset class:elevation-1={dirty}>
      <label>
        <span class="label">{t('characters:sheets.fields.name')}</span>
        <input
          type="text"
          bind:value={name}
          placeholder={t('characters:sheets.placeholders.name')}
          required />
      </label>


        <SystemSelect 
          system={system}
          setSystem={(value: string) => {
            system = value;
          }} />


    <form onsubmit={handleSubmit}>
      <div class="toolbar justify-end">
        <button
          type="button"
          class="text"
          disabled={!dirty}>
          <cn-icon noun="undo"></cn-icon>
          <span>{t('actions:reset')}</span>
        </button>
        <button
          type="submit"
          disabled={!dirty}>
          <cn-icon noun="save"></cn-icon>
          <span>{t('actions:save')}</span>
        </button>
      </div>
    </form>
    </fieldset>
  {/if}
  <!-- note: error state for not-loading, but no sheet, is handled by the parent, thus we do not need
       to care about it here -->
</section>



