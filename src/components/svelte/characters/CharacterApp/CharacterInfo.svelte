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
<article class="column-s elevation-1 border-radius p-2">
  <div class="toolbar">
    <h2 class="downscaled">{$character.name}</h2>
    {#if $canEdit && mode === 'view'}
      <button class="text" onclick={toggleMode}>
          {t('actions:edit')}
      </button>
    {/if}
  </div>

  {#if mode === 'edit'}
    <form onsubmit={saveChanges}>
      <label>
        {t('character:fields:name')}
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
    {:else}
    <p class="downscaled text-low">
      <strong>{t('character:fields:description')}:</strong> {$character.description ?? t('character:fields:noDescription')}
    </p>
  {/if}

</article>
{/if}