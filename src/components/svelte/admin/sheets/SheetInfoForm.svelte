<script lang="ts">
import { loading, sheet } from '@stores/characters/characterSheetStore';
import { t } from '@utils/i18n';

const dirty = $derived.by(() => {
  return false;
});
</script>

<section class="surface">
  {#if $loading}
    <cn-loader></cn-loader>
  {:else if $sheet}
    <h2 class="downscaled">{t('characters:sheets.editor.info.title')}</h2>
    <form >
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
  {/if}
  <!-- note: error state for not-loading, but no sheet, is handled by the parent, thus we do not need
       to care about it here -->
</section>



