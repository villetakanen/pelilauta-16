<script lang="ts">
import {
  compiledCharacterSheet,
  featuresList,
} from '@stores/characters/sheetStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';

const active = $derived.by(() => {
  const name = $compiledCharacterSheet?.meta?.characterName ?? '';
  logDebug('CharacterSheetArticle', 'Checking if character sheet is active', {
    compiledCharacterSheet: name,
    featuresList: $featuresList,
  });
  return name.length > 0 || $featuresList.length > 0;
});
</script>

<article class="column-s flex flex-col">
  {#if active && $compiledCharacterSheet}
    <div class="surface p-1">
      <p class="downscaled text-center">
        <cn-icon noun="adventurer"></cn-icon><br/>
        {$compiledCharacterSheet.meta?.characterName || t('characters:builder.characterSheet')}
      </p>
    </div>
  {:else}
    <div class="surface p-2">
      <p class="downscaled text-center">
        <cn-icon noun="adventurer"></cn-icon><br/>
        {t('characters:builder.noCharacterSheet')}
      </p>
    </div>
  {/if}
  {$compiledCharacterSheet?.features?.length ?? 0}
</article>


  