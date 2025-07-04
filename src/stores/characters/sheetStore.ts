import type { CharacterFeature } from '@schemas/CharacterBuilderSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { composeCharacterFeatures } from '@utils/shared/characters/builder/composeCharacterFeatures';
import { type WritableAtom, atom, computed } from 'nanostores';

// This is the shared atom for a character sheet - its initiated by
// the root view and used by the character builder, and the character sheet view
// to share the same character sheet data.
export const characterSheet: WritableAtom<CharacterSheet | null> = atom(null);

// These features are added in order of the builder steps
// Note, we do not expose the features directly, but rather use a computed value
// to keep the logic centralized and avoid direct manipulation of the map
const featuresMap: WritableAtom<Map<string, Array<CharacterFeature>>> = atom(
  new Map(),
);

// Features list is a computed value that combines all features from the map, in order
export const featuresList = computed(featuresMap, (map) => {
  const list: CharacterFeature[] = [];
  for (const features of map.values()) {
    list.push(...features);
  }
  return list;
});

// Compiled character sheet is a computed value that combines the character sheet
// with the features list, processing all modifiers and creating a complete character sheet
// This is used in the character sheet view to display the final character data
export const compiledCharacterSheet = computed(
  [characterSheet, featuresList],
  (sheet, features) => {
    if (!sheet) return null;
    return composeCharacterFeatures(sheet, features);
  },
);

// Helpers to manage selected features
// ----------------------------------------------------------------------------
//
// Please note: there is no way to remove a single step from the features map,
// Nor a way to manipulate the features directly.
//
// This is intentional, to avoid complex and unnecessary logic.

export function addStep(stepKey: string, features: CharacterFeature[]) {
  const currentFeatures = featuresMap.get();
  const existingFeatures = currentFeatures.get(stepKey) || [];
  currentFeatures.set(stepKey, [...existingFeatures, ...features]);
  featuresMap.set(currentFeatures);
}

export function updateStep(stepKey: string, features: CharacterFeature[]) {
  const currentFeatures = featuresMap.get();
  currentFeatures.set(stepKey, features);
  featuresMap.set(currentFeatures);
}

export function resetFeatures() {
  featuresMap.set(new Map());
}

export function setName(name: string) {
  const currentSheet = characterSheet.get();
  if (currentSheet) {
    characterSheet.set({ ...currentSheet, name });
  }
}
