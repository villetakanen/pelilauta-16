import {
  CharacterSheetSchema,
  CharacterStatSchema,
} from '@schemas/CharacterSheetSchema';
import { describe, expect, it } from 'vitest';
import { elfFeature, humanFeature } from '../mocks/characterBuilderDummies';

describe('CharacterStatSchema', () => {
  it('should validate a complete stat', () => {
    const stat = {
      key: 'strength',
      value: 15,
    };

    expect(() => CharacterStatSchema.parse(stat)).not.toThrow();
  });

  it('should validate a stat with zero value', () => {
    const stat = {
      key: 'charisma',
      value: 0,
    };

    expect(() => CharacterStatSchema.parse(stat)).not.toThrow();
  });

  it('should validate a stat with negative value', () => {
    const stat = {
      key: 'modifier',
      value: -2,
    };

    expect(() => CharacterStatSchema.parse(stat)).not.toThrow();
  });

  it('should default key to empty string', () => {
    const stat = {
      value: 12,
    };

    const parsed = CharacterStatSchema.parse(stat);
    expect(parsed.key).toBe('');
    expect(parsed.value).toBe(12);
  });

  it('should default value to 0', () => {
    const stat = {
      key: 'intelligence',
    };

    const parsed = CharacterStatSchema.parse(stat);
    expect(parsed.key).toBe('intelligence');
    expect(parsed.value).toBe(0);
  });

  it('should handle minimal stat object', () => {
    const stat = {};

    const parsed = CharacterStatSchema.parse(stat);
    expect(parsed.key).toBe('');
    expect(parsed.value).toBe(0);
  });

  it('should reject non-numeric values', () => {
    const stat = {
      key: 'strength',
      value: 'fifteen',
    };

    expect(() => CharacterStatSchema.parse(stat)).toThrow();
  });

  it('should reject non-string keys', () => {
    const stat = {
      key: 123,
      value: 15,
    };

    expect(() => CharacterStatSchema.parse(stat)).toThrow();
  });
});

describe('CharacterSheetSchema', () => {
  it('should validate a complete character sheet', () => {
    const characterSheet = {
      name: 'Thorin Oakenshield',
      system: 'basic-fantasy',
      stats: [
        { key: 'strength', value: 16 },
        { key: 'dexterity', value: 12 },
        { key: 'constitution', value: 18 },
        { key: 'intelligence', value: 13 },
        { key: 'wisdom', value: 14 },
        { key: 'charisma', value: 15 },
        { key: 'hit_points', value: 25 },
        { key: 'armor_class', value: 16 },
      ],
      extras: [humanFeature, elfFeature],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).not.toThrow();
  });

  it('should validate a minimal character sheet', () => {
    const characterSheet = {};

    const parsed = CharacterSheetSchema.parse(characterSheet);
    expect(parsed.name).toBe('');
    expect(parsed.system).toBe('');
    expect(parsed.stats).toEqual([]);
    expect(parsed.extras).toEqual([]);
  });

  it('should validate a character with only basic info', () => {
    const characterSheet = {
      name: 'Gandalf the Grey',
      system: 'dnd5e',
    };

    const parsed = CharacterSheetSchema.parse(characterSheet);
    expect(parsed.name).toBe('Gandalf the Grey');
    expect(parsed.system).toBe('dnd5e');
    expect(parsed.stats).toEqual([]);
    expect(parsed.extras).toEqual([]);
  });

  it('should validate a character with stats only', () => {
    const characterSheet = {
      name: 'Legolas',
      system: 'basic-fantasy',
      stats: [
        { key: 'strength', value: 13 },
        { key: 'dexterity', value: 19 },
        { key: 'constitution', value: 14 },
        { key: 'intelligence', value: 15 },
        { key: 'wisdom', value: 17 },
        { key: 'charisma', value: 16 },
      ],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).not.toThrow();
  });

  it('should validate a character with extras only', () => {
    const characterSheet = {
      name: 'Gimli',
      system: 'basic-fantasy',
      extras: [
        {
          key: 'dwarf-heritage',
          name: 'Dwarf',
          modifiers: [
            {
              type: 'STAT_BONUS',
              target: 'constitution',
              value: 2,
              title: 'Dwarven Toughness',
            },
          ],
        },
      ],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).not.toThrow();
  });

  it('should validate a character with complex stats', () => {
    const characterSheet = {
      name: 'Aragorn',
      system: 'dnd5e',
      stats: [
        { key: 'strength', value: 16 },
        { key: 'dexterity', value: 14 },
        { key: 'constitution', value: 15 },
        { key: 'intelligence', value: 12 },
        { key: 'wisdom', value: 13 },
        { key: 'charisma', value: 15 },
        { key: 'proficiency_bonus', value: 3 },
        { key: 'armor_class', value: 18 },
        { key: 'hit_points', value: 58 },
        { key: 'hit_die', value: 10 },
        { key: 'speed', value: 30 },
        { key: 'level', value: 5 },
      ],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).not.toThrow();
  });

  it('should validate a homebrew system character', () => {
    const characterSheet = {
      name: 'Zephyr Windrunner',
      system: 'homebrew-elemental',
      stats: [
        { key: 'fire_affinity', value: 8 },
        { key: 'water_affinity', value: 3 },
        { key: 'earth_affinity', value: 5 },
        { key: 'air_affinity', value: 9 },
        { key: 'spirit_points', value: 45 },
        { key: 'corruption_level', value: 2 },
      ],
      extras: [
        {
          key: 'elemental-bond',
          name: 'Air Elemental Bond',
          modifiers: [
            {
              type: 'FEATURE',
              target: '',
              title: 'Flight',
              description: 'Can hover and fly for short periods',
            },
            {
              type: 'STAT_BONUS',
              target: 'air_affinity',
              value: 2,
              title: 'Enhanced Air Magic',
            },
          ],
        },
      ],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).not.toThrow();
  });

  it('should handle empty arrays properly', () => {
    const characterSheet = {
      name: 'Empty Character',
      system: 'test-system',
      stats: [],
      extras: [],
    };

    const parsed = CharacterSheetSchema.parse(characterSheet);
    expect(parsed.stats).toEqual([]);
    expect(parsed.extras).toEqual([]);
  });

  it('should reject invalid stat objects in stats array', () => {
    const characterSheet = {
      name: 'Invalid Character',
      system: 'test-system',
      stats: [
        { key: 'strength', value: 15 },
        { key: 'dexterity', value: 'invalid' }, // Invalid value type
      ],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).toThrow();
  });

  it('should reject invalid feature objects in extras array', () => {
    const characterSheet = {
      name: 'Invalid Character',
      system: 'test-system',
      extras: [
        {
          key: 'valid-feature',
          name: 'Valid Feature',
        },
        {
          // Missing required fields for feature
          modifiers: [
            {
              type: 'INVALID_TYPE', // Invalid modifier type
              target: 'strength',
            },
          ],
        },
      ],
    };

    expect(() => CharacterSheetSchema.parse(characterSheet)).toThrow();
  });

  it('should handle character sheets from different systems', () => {
    const systems = [
      'dnd5e',
      'pathfinder',
      'basic-fantasy',
      'homebrew',
      'call-of-cthulhu',
    ];

    for (const system of systems) {
      const characterSheet = {
        name: `Test Character for ${system}`,
        system: system,
        stats: [
          { key: 'primary_stat', value: 15 },
          { key: 'secondary_stat', value: 12 },
        ],
      };

      expect(() => CharacterSheetSchema.parse(characterSheet)).not.toThrow();
    }
  });

  it('should preserve all data when parsing', () => {
    const originalSheet = {
      name: 'Test Character',
      system: 'test-system',
      stats: [
        { key: 'strength', value: 16 },
        { key: 'dexterity', value: 14 },
      ],
      extras: [humanFeature],
    };

    const parsed = CharacterSheetSchema.parse(originalSheet);

    expect(parsed.name).toBe(originalSheet.name);
    expect(parsed.system).toBe(originalSheet.system);
    expect(parsed.stats).toHaveLength(2);
    expect(parsed.stats[0].key).toBe('strength');
    expect(parsed.stats[0].value).toBe(16);
    expect(parsed.extras).toHaveLength(1);
    expect(parsed.extras[0].name).toBe('Human');
  });
});
