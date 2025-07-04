<script lang="ts">
import {
  compiledCharacterSheet,
  featuresArray,
  modifiersArray,
  stepsArray,
} from '@stores/characters/sheetStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

const active = $derived.by(() => {
  logDebug(
    'CharacterSheetArticle',
    'Checking if character sheet is active',
    $featuresArray.length,
  );
  const name = $compiledCharacterSheet?.meta?.characterName ?? '';
  return name.length > 0 || $featuresArray.length > 0;
});
</script>

<article class="column-s flex flex-col">
  {#if active && $compiledCharacterSheet}
    <div class="surface p-1">
      <p class="downscaled text-center">
        <cn-icon noun="adventurer"></cn-icon><br/>
        {$compiledCharacterSheet.meta?.characterName || t('characters:builder.characterSheet')}
      </p>
      <p>
        {$stepsArray.length} | {$featuresArray.length} | {$modifiersArray.length}
      </p>
    </div>
    <div class="surface p-1">
      {t('characters:builder.features')}
      {#each $modifiersArray as modifier}
        <p class="text-caption mb-1">
          <strong>{modifier.title}</strong>
          <span class="text-low">{modifier.description}</span>
        </p>
      {/each}
    </div>
  {:else}
    <div class="surface p-2">
      <p class="downscaled text-center">
        <cn-icon noun="adventurer"></cn-icon><br/>
        {t('characters:builder.noCharacterSheet')}
      </p>
    </div>
  {/if}
</article>


  