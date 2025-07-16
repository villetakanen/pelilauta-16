<script lang="ts">
import { canEdit, character, update } from '@stores/characters/characterStore';
import { pushSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logError } from '@utils/logHelpers';

type modes = 'view' | 'edit';

let mode: modes = $state('view'); // Default mode is view
let name = $state('');
let description = $state('');

$effect(() => {
  if ($character) {
    name = $character.name;
    description = $character.description ?? '';
  }
});

function toggleMode() {
  mode = mode === 'view' ? 'edit' : 'view';
}

async function saveChanges(e: Event) {
  e.preventDefault();
  try {
    await update({
      name,
      description,
    });
    mode = 'view'; // Switch back to view mode after saving
    pushSnack(t('character:snacks:changesSaved'));
  } catch (error) {
    logError('CharacterInfo', 'Failed to save changes:', error);
    pushSnack(t('character:snacks:changesSaveFailed'));
  }
}
</script>
{#if $character}
<article class="elevation-1 p-2">
  <!-- View Mode!-->
  {#if mode === 'view'}
    <span class="text-caption">{t('entries:character.name')}</span>
    <h2 class="downscaled m-0">
      {$character.name || t('character:fields:noName')}
    </h2>
    <hr>
    <span class="text-caption">{t('entries:character.description')}</span>
    <p class="downscaled text-low">
      {$character.description || t('character:fields:noDescription')}
    </p>
    <hr>
    {#if $canEdit}
      <div class="toolbar justify-end">
      
        <button class="text" onclick={toggleMode}>
          {t('actions:edit')}
        </button>
      </div>
    {/if}
  <!-- Edit Mode!-->
  {:else}
    <form onsubmit={saveChanges}>
      <label>
        {t('entries:character:name')}
        <input type="text" bind:value={name} />
      </label>
      <label>
        {t('character:fields:description')}
        <textarea bind:value={description}></textarea>
      </label>
      <div class="toolbar justify-end">
        <button type="button" class="button text" onclick={toggleMode}>
          {t('actions:cancel')}
        </button>
        <button type="submit" class="button primary">
          {t('actions:save')}
        </button>
        </div>
    </form>
  {/if}

</article>
{/if}