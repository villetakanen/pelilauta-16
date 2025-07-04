import type { CharacterFeature } from '@schemas/CharacterBuilderSchema';
import type {
  CharacterSheet,
  CharacterStat,
} from '@schemas/CharacterSheetSchema';

/**
 * Composes a character sheet from selected character features.
 *
 * Takes a character builder and selected features, processes all modifiers:
 * - BASE_STAT and STAT_BONUS modifiers become stats in the character sheet
 * - FEATURE modifiers become extras (features with title/description only)
 *
 * @param sheet - The character sheet to populate, features not in the sheet will be added as extras
 * @param selectedFeatures - Array of selected character features
 * @returns A complete character sheet object
 */
export function composeCharacterFeatures(
  sheet: CharacterSheet,
  selectedFeatures: CharacterFeature[],
): CharacterSheet {
  // Track stats with their values - using Map to handle cumulative bonuses
  const statsMap = new Map<string, number>();

  // Collect all features that are purely descriptive (FEATURE type modifiers)
  const extras: CharacterFeature[] = [];

  // Process all selected features
  for (const feature of selectedFeatures) {
    if (!feature.modifiers) continue;

    // Track if this feature has any FEATURE-type modifiers
    const featureModifiers = feature.modifiers.filter(
      (mod) => mod.type === 'FEATURE',
    );

    // Process each modifier
    for (const modifier of feature.modifiers) {
      switch (modifier.type) {
        case 'BASE_STAT':
        case 'STAT_BONUS':
          if (modifier.target && modifier.value !== undefined) {
            const currentValue = statsMap.get(modifier.target) || 0;
            statsMap.set(modifier.target, currentValue + modifier.value);
          }
          break;

        case 'FEATURE':
          // FEATURE modifiers will be added to extras as part of their parent feature
          break;
      }
    }

    // If this feature has FEATURE-type modifiers, add it to extras
    if (featureModifiers.length > 0) {
      extras.push({
        key: feature.key,
        characterBuilderKey: feature.characterBuilderKey,
        name: feature.name,
        modifiers: featureModifiers,
      });
    }
  }

  // Convert stats map to CharacterStat array
  const stats: CharacterStat[] = Array.from(statsMap.entries()).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  return {
    key: `${sheet.key}-${Date.now()}`, // Unique key based on builder key and timestamp
    name: '',
    system: sheet.system,
    stats,
    extras,
  };
}
