<script lang="ts">
import { setMeta } from '@stores/characters/sheetStore';
import { t } from '@utils/i18n';

// Character name input
let characterName = $state('');

// Update character sheet name when character name changes
$effect(() => {
  if (characterName) {
    setMeta('characterName', characterName);
  }
});
</script>

<div class="surface p-2">
    <label for="character-name" class="text-small font-medium mb-1 block">
      {t('characters:fields.name')}
    </label>
    <input 
      id="character-name"
      type="text" 
      bind:value={characterName} 
      placeholder={t('characters:placeHolders.name')}
      class="input w-full"
    />
</div>