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
  const baseStats = new Map<string, number>();
  const statBonuses = new Map<string, number>();
  const finalStats = new Map<string, number>();

  // First pass: determine the largest base value for each stat
  for (const feature of selectedFeatures) {
    for (const modifier of feature.modifiers ?? []) {
      if (
        modifier.type === 'BASE_STAT' &&
        modifier.target &&
        modifier.value !== undefined
      ) {
        const currentBase =
          baseStats.get(modifier.target) ?? Number.NEGATIVE_INFINITY;
        baseStats.set(modifier.target, Math.max(currentBase, modifier.value));
      }
    }
  }

  // Second pass: determine the largest bonus for each stat
  for (const feature of selectedFeatures) {
    for (const modifier of feature.modifiers ?? []) {
      if (
        modifier.type === 'STAT_BONUS' &&
        modifier.target &&
        modifier.value !== undefined
      ) {
        const currentBonus = statBonuses.get(modifier.target) ?? 0;
        statBonuses.set(
          modifier.target,
          Math.max(currentBonus, modifier.value),
        );
      }
    }
  }

  // Combine base stats and bonuses
  const allStatKeys = new Set([...baseStats.keys(), ...statBonuses.keys()]);

  for (const key of allStatKeys) {
    const base = baseStats.get(key) || 0;
    const bonus = statBonuses.get(key) || 0;
    finalStats.set(key, base + bonus);
  }

  // Convert final stats map to CharacterStat array
  const stats: CharacterStat[] = Array.from(finalStats.entries()).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  return {
    key: `${sheet.key}-${Date.now()}`, // Unique key based on builder key and timestamp
    name: sheet.name || '',
    system: sheet.system,
    stats,
    features: selectedFeatures,
    meta: sheet.meta || {},
    statGroups: sheet.statGroups || [],
  };
}
