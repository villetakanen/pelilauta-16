import { CharacterSheetSchema } from '@schemas/CharacterSheetSchema';
import { composeCharacterFeatures } from '@utils/shared/characters/builder/composeCharacterFeatures';
import { expect, test } from 'vitest';

test('Character sheet composer passes on the sheet name attribute from the composed sheet', () => {
  const characterSheet = CharacterSheetSchema.parse({
    name: 'Test Character Sheet',
  });
  const composed = composeCharacterFeatures(characterSheet, []);
  expect(composed.name).toBe('Test Character Sheet');
});

test('Character sheet composer suports having character metadata, such as character name', () => {
  const characterSheet = CharacterSheetSchema.parse({
    name: 'Test Character Sheet',
    meta: {
      characterName: 'Test Character',
    },
  });
  const composed = composeCharacterFeatures(characterSheet, []);
  expect(composed.meta?.characterName).toBe('Test Character');
});
