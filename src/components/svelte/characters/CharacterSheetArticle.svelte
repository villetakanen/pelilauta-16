<script lang="ts">
import {
  characterSheet,
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

// Group stats by their group property
const groupedStats = $derived.by(() => {
  if (!$compiledCharacterSheet?.stats)
    return { grouped: {}, ungrouped: [], availableGroups: [] };

  const grouped: Record<string, typeof $compiledCharacterSheet.stats> = {};
  const ungrouped: typeof $compiledCharacterSheet.stats = [];
  const availableGroups = $compiledCharacterSheet.statGroups || [];

  for (const stat of $compiledCharacterSheet.stats) {
    if (stat.group && availableGroups.includes(stat.group)) {
      if (!grouped[stat.group]) grouped[stat.group] = [];
      grouped[stat.group].push(stat);
    } else {
      ungrouped.push(stat);
    }
  }

  return { grouped, ungrouped, availableGroups };
});
</script>

<article class="column-s flex flex-col">
  {#if active && $compiledCharacterSheet}
    <div class="surface p-1">
      <p class="downscaled text-center">
        <cn-icon noun="adventurer"></cn-icon><br/>
        {$compiledCharacterSheet.meta?.characterName || t('characters:builder.characterSheet')}
      </p>

      <hr>

      <!-- Grouped Stats -->
      {#each groupedStats.availableGroups as groupName}
        {#if groupedStats.grouped[groupName] && groupedStats.grouped[groupName].length > 0}
          <div class="mb-2">
            <p class="text-caption text-low mb-1"><strong>{groupName}</strong></p>
            {#each groupedStats.grouped[groupName] as stat}
              <p class="text-caption mb-1 flex justify-space-between full-width ml-2">
                <span>{stat.key}</span>
                <span class="text-low">{stat.value}</span>
              </p>
            {/each}
          </div>
        {/if}
      {/each}
      
      <!-- Ungrouped Stats -->
      {#if groupedStats.ungrouped.length > 0}
        <div class="mb-2">
          {#if groupedStats.availableGroups.length > 0}
            <p class="text-caption text-low mb-1"><strong>Other</strong></p>
          {/if}
          {#each groupedStats.ungrouped as stat}
            <p class="text-caption mb-1 flex justify-space-between full-width {groupedStats.availableGroups.length > 0 ? 'ml-2' : ''}">
              <span>{stat.key}</span>
              <span class="text-low">{stat.value}</span>
            </p>
          {/each}
        </div>
      {/if}

      <hr>

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


  