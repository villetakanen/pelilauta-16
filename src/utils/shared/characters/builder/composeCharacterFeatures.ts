import type {
  CharacterBuilder,
  CharacterFeature,
} from '@schemas/CharacterBuilderSchema';
import type {
  CharacterSheet,
  CharacterStat,
} from '@schemas/CharacterSheetSchema';

// More flexible type to handle both strict CharacterFeature and similar objects
type FeatureLike = Pick<
  CharacterFeature,
  'key' | 'name' | 'characterBuilderKey'
> & {
  modifiers?: Array<{
    type: 'BASE_STAT' | 'STAT_BONUS' | 'FEATURE';
    target: string;
    value?: number;
    title?: string;
    description?: string;
    source?: string;
  }>;
};

/**
 * Composes a character sheet from selected character features.
 *
 * Takes a character builder and selected features, processes all modifiers:
 * - BASE_STAT and STAT_BONUS modifiers become stats in the character sheet
 * - FEATURE modifiers become extras (features with title/description only)
 *
 * @param builder - The character builder configuration
 * @param selectedFeatures - Array of selected character features
 * @param characterName - Optional name for the character (defaults to empty string)
 * @returns A complete character sheet object
 */
export function composeCharacterFeatures(
  builder: CharacterBuilder,
  selectedFeatures: FeatureLike[],
  characterName = '',
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
    name: characterName,
    system: builder.system,
    stats,
    extras,
  };
}
