import type {
  CharacterFeature,
  CharacterMofdifier,
} from '@schemas/CharacterBuilderSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { logDebug } from '@utils/logHelpers';
import { composeCharacterFeatures } from '@utils/shared/characters/builder/composeCharacterFeatures';
import { type WritableAtom, atom, computed } from 'nanostores';

// This is the shared atom for a character sheet - its initiated by
// the root view and used by the character builder, and the character sheet view
// to share the same character sheet data.
export const characterSheet: WritableAtom<CharacterSheet | null> = atom(null);

// These features are added in order of the builder steps
// Note, we do not expose the features directly, but rather use a computed value
// to keep the logic centralized and avoid direct manipulation of the map
export const stepsArray: WritableAtom<Array<Array<CharacterFeature>>> = atom(
  [],
);

// Features list is a computed value that combines all features from the map, in order
export const featuresArray = computed(stepsArray, (steps) => {
  logDebug('featuresArray', 'Computing features array from steps', steps);
  const features: CharacterFeature[] = [];
  for (const step of steps) {
    if (step && Array.isArray(step)) {
      features.push(...step);
    }
  }
  return features;
});

export const modifiersArray = computed(stepsArray, (steps) => {
  logDebug('modifiersArray', 'Computing modifiers array from steps', steps);
  const modifiers: CharacterMofdifier[] = [];
  for (const step of steps) {
    if (step && Array.isArray(step)) {
      for (const feature of step) {
        if (feature.modifiers && Array.isArray(feature.modifiers)) {
          modifiers.push(...feature.modifiers);
        }
      }
    }
  }
  return modifiers;
});

// Compiled character sheet is a computed value that combines the character sheet
// with the features list, processing all modifiers and creating a complete character sheet
// This is used in the character sheet view to display the final character data
export const compiledCharacterSheet = computed(
  [characterSheet, featuresArray],
  (sheet, features) => {
    logDebug(
      'compiledCharacterSheet',
      'Computing compiled character sheet with features',
      { sheet, features },
    );
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

export function updateStep(stepKey: number, features: CharacterFeature[]) {
  logDebug('updateStep', `Updating step ${stepKey} with features`, features[0]);
  const currentSteps = stepsArray.get() || [];
  const newSteps = [...currentSteps]; // Create a shallow copy to ensure change detection

  // Ensure the array is long enough
  while (newSteps.length <= stepKey) {
    newSteps.push([]);
  }

  newSteps[stepKey] = features;
  stepsArray.set(newSteps);
}

export function resetFeatures() {
  stepsArray.set([]);
}

export function setMeta(key: string, value: string) {
  const currentSheet = characterSheet.get();
  const meta = currentSheet?.meta || {};
  meta[key] = value;
  if (currentSheet) {
    characterSheet.set({ ...currentSheet, meta });
  }
}
